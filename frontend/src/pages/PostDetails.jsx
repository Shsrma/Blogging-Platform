import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axios'
import ConfirmationDialog from '../components/ConfirmationDialog'
import '../styles/PostDetails.css'

function PostDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [commentContent, setCommentContent] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)
  const [commentError, setCommentError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deletePostConfirm, setDeletePostConfirm] = useState(false)
  const [deleteCommentConfirm, setDeleteCommentConfirm] = useState({ isOpen: false, commentId: null })

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [id, currentPage])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/posts/${id}`)
      setPost(response.data.post)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch post')
      setPost(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(`/comments/post/${id}`, {
        params: { page: currentPage, limit: 5 }
      })
      setComments(response.data.comments)
      setTotalPages(response.data.pages)
    } catch (err) {
      console.error('Failed to fetch comments:', err)
      setError(err.response?.data?.message || 'Failed to load comments')
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    setCommentError('')

    if (!token) {
      setCommentError('Please login to add a comment')
      setTimeout(() => navigate('/login'), 1500)
      return
    }

    if (!commentContent.trim()) {
      setCommentError('Comment cannot be empty')
      return
    }

    if (commentContent.trim().length < 3) {
      setCommentError('Comment must be at least 3 characters long')
      return
    }

    setCommentLoading(true)

    try {
      const response = await axiosInstance.post(
        `/comments/post/${id}`,
        { content: commentContent.trim() }
      )

      setComments([response.data.comment, ...comments])
      setCommentContent('')
      setCommentError('')
    } catch (err) {
      setCommentError(err.response?.data?.message || 'Failed to add comment')
    } finally {
      setCommentLoading(false)
    }
  }

  const handleDeleteCommentClick = (commentId) => {
    setDeleteCommentConfirm({ isOpen: true, commentId })
  }

  const handleDeleteCommentConfirm = async () => {
    if (!deleteCommentConfirm.commentId) return

    try {
      await axiosInstance.delete(`/comments/${deleteCommentConfirm.commentId}`)
      setComments(comments.filter(c => c._id !== deleteCommentConfirm.commentId))
      setDeleteCommentConfirm({ isOpen: false, commentId: null })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete comment')
      setDeleteCommentConfirm({ isOpen: false, commentId: null })
    }
  }

  const handleLikePost = async () => {
    if (!token) {
      setError('Please login to like posts')
      setTimeout(() => navigate('/login'), 1500)
      return
    }

    try {
      const response = await axiosInstance.post(`/posts/${id}/like`)
      setPost(response.data.post)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to like post')
    }
  }

  const handleDeletePostClick = () => {
    setDeletePostConfirm(true)
  }

  const handleDeletePostConfirm = async () => {
    try {
      await axiosInstance.delete(`/posts/${id}`)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post')
      setDeletePostConfirm(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading post...</p>
      </div>
    )
  }

  if (error && !post) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Post</h3>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">Go Home</button>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="error-container">
        <div className="error-icon">📄</div>
        <h3>Post Not Found</h3>
        <p>The post you're looking for doesn't exist or has been deleted.</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">Go Home</button>
      </div>
    )
  }

  const authorId = post.author?._id || post.author || ''
  const isAuthor = user?.id === String(authorId)
  const hasLiked = post.likes.includes(user?.id)

  return (
    <div className="post-details">
      <ConfirmationDialog
        isOpen={deletePostConfirm}
        onClose={() => setDeletePostConfirm(false)}
        onConfirm={handleDeletePostConfirm}
        title="Delete Post"
        message="Are you sure you want to delete this post? All comments will also be deleted. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
      <ConfirmationDialog
        isOpen={deleteCommentConfirm.isOpen}
        onClose={() => setDeleteCommentConfirm({ isOpen: false, commentId: null })}
        onConfirm={handleDeleteCommentConfirm}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
      {error && <div className="error-message">{error}</div>}
      <div className="post-details-container">
        <article className="post-content">
          <header className="post-header">
            <h1 className="post-title">{post.title}</h1>

            <div className="post-meta-info">
              <span className="author">By {post.author?.username || (post.author && String(post.author).slice(0,6)) || 'Unknown'}</span>
              <span className="date">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
              <span className="category">{post.category}</span>
            </div>
          </header>

          <div className="post-body">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>
          )}

          <div className="post-actions">
            <button
              onClick={handleLikePost}
              className={`btn ${hasLiked ? 'btn-liked' : 'btn-like'}`}
            >
              ❤️ {post.likes.length} Likes
            </button>

            {isAuthor && (
              <button
                onClick={handleDeletePostClick}
                className="btn btn-danger"
              >
                Delete Post
              </button>
            )}
          </div>

          <div className="post-stats">
            <span>👁️ {post.views} views</span>
            <span>💬 {post.comments.length} comments</span>
          </div>
        </article>

        <section className="comments-section">
          <h2>Comments ({comments.length})</h2>

          {token ? (
            <form onSubmit={handleAddComment} className="comment-form">
              {commentError && <div className="error-message">{commentError}</div>}
              <textarea
                value={commentContent}
                onChange={(e) => {
                  setCommentContent(e.target.value)
                  setCommentError('')
                }}
                placeholder="Add a comment..."
                rows="3"
                maxLength={500}
              ></textarea>
              <div className="comment-form-footer">
                <span className="char-count">{commentContent.length}/500</span>
                <button type="submit" disabled={commentLoading || !commentContent.trim()} className="btn btn-primary">
                  {commentLoading ? (
                    <>
                      <span className="spinner-small"></span> Posting...
                    </>
                  ) : (
                    'Post Comment'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <p className="login-prompt">
              <a href="/login">Login</a> to add a comment
            </p>
          )}

          <div className="comments-list">
            {comments.length === 0 && !loading ? (
              <div className="empty-comments">
                <div className="empty-icon">💬</div>
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment._id} className="comment">
                      <div className="comment-header">
                        <span className="comment-author">{comment.author?.username || String(comment.author).slice(0,6)}</span>
                        <span className="comment-date">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="comment-content">{comment.content}</p>

                      {user?.id === String(comment.author?._id || comment.author) && (
                        <button
                          onClick={() => handleDeleteCommentClick(comment._id)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      )}
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span>Page {currentPage} of {totalPages}</span>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default PostDetails
