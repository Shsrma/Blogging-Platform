import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axios'
import ConfirmationDialog from '../components/ConfirmationDialog'
import '../styles/Home.css'

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, postId: null })
  const navigate = useNavigate()

  useEffect(() => {
    fetchPosts()
  }, [page, search, category])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/posts', {
        params: {
          page,
          limit: 10,
          search,
          category
        }
      })

      setPosts(response.data.posts)
      setTotalPages(response.data.pages)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posts')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchPosts()
  }

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ isOpen: true, postId: id })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.postId) return

    try {
      await axiosInstance.delete(`/posts/${deleteConfirm.postId}`)
      setPosts(posts.filter(post => post._id !== deleteConfirm.postId))
      setDeleteConfirm({ isOpen: false, postId: null })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post')
      setDeleteConfirm({ isOpen: false, postId: null })
    }
  }

  return (
    <div className="home container">
      <ConfirmationDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, postId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
      <div className="filters" style={{marginBottom:18}}>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="General">General</option>
            <option value="Technology">Technology</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Business">Business</option>
          </select>
          <button type="submit">Search</button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && posts.length === 0 ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No posts found</h3>
          <p>{search || category ? 'Try adjusting your search or filters.' : 'Be the first to create a post!'}</p>
          {localStorage.getItem('token') && (
            <Link to="/create" className="btn btn-primary">Create Post</Link>
          )}
        </div>
      ) : (
        <div className="grid">
          {posts.map(post => (
            <article key={post._id} className="card">
              <div style={{height:140,background:'#0b1220',borderRadius:10,marginBottom:12,display:'flex',alignItems:'center',justifyContent:'center',color:'#7b8794'}}>Image</div>
              <div className="title">{post.title}</div>
              <div className="meta">By {post.author?.username || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}</div>
              <div className="excerpt">{post.content.substring(0, 160)}...</div>
              <div className="card-footer">
                <Link to={`/posts/${post._id}`} className="btn btn-primary">Read More</Link>
                <div className="card-stats">
                  <span>👁️ {post.views || 0}</span>
                  <span>💬 {post.comments?.length || 0}</span>
                  {post.likes?.length > 0 && <span>❤️ {post.likes.length}</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Previous
          </button>

          <span>Page {page} of {totalPages}</span>

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
      <div className="fab">
        {localStorage.getItem('token') && (
          <Link to="/create" className="btn btn-primary">✍️ Create</Link>
        )}
      </div>
    </div>
  )
}

export default Home
