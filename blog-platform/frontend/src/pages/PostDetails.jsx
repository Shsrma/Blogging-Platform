import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axios'
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
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

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
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()

    if (!token) {
      alert('Please login to comment')
      navigate('/login')
      return
    }

    if (!commentContent.trim()) return

    setCommentLoading(true)

    try {
      const response = await axiosInstance.post(
        `/comments/post/${id}`,
        { content: commentContent }
      )

      setComments([response.data.comment, ...comments])
      setCommentContent('')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add comment')
    } finally {
      setCommentLoading(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return

    try {
      await axiosInstance.delete(`/comments/${commentId}`)
      setComments(comments.filter(c => c._id !== commentId))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete comment')
    }
  }

  const handleLikePost = async () => {
    if (!token) {
      alert('Please login to like')
      navigate('/login')
      return
    }

    try {
      const response = await axiosInstance.post(`/posts/${id}/like`)
      setPost(response.data.post)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to like post')
    }
  }

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    try {
      await axiosInstance.delete(`/posts/${id}`)
      navigate('/')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post')
    }
  }

  if (loading) {
    return <div className="loading">Loading post...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!post) {
    return <div className="error">Post not found</div>
  }

  const isAuthor = user?.id === post.author._id
  const hasLiked = post.likes.includes(user?.id)

  return (
    <div className="post-details">
      <div className="post-details-container">
        <article className="post-content">
          <header className="post-header">
            <h1 className="post-title">{post.title}</h1>

            <div className="post-meta-info">
              <span className="author">By {post.author.username}</span>
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

          {post.tags.length > 0 && (
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
                onClick={handleDeletePost}
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
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Add a comment..."
                rows="3"
              ></textarea>
              <button type="submit" disabled={commentLoading} className="btn btn-primary">
                {commentLoading ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <p className="login-prompt">
              <a href="/login">Login</a> to add a comment
            </p>
          )}

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first!</p>
            ) : (
              comments.map(comment => (
                <div key={comment._id} className="comment">
                  <div className="comment-header">
                    <span className="comment-author">{comment.author.username}</span>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="comment-content">{comment.content}</p>

                  {user?.id === comment.author._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
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
