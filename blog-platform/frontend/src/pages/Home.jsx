import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axios'
import '../styles/Home.css'

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    try {
      await axiosInstance.delete(`/posts/${id}`)
      setPosts(posts.filter(post => post._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post')
    }
  }

  if (loading && posts.length === 0) {
    return <div className="loading">Loading posts...</div>
  }

  return (
    <div className="home container">
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

      {error && <div className="error">{error}</div>}

      {posts.length === 0 ? (
        <div className="no-posts">No posts found. Create one!</div>
      ) : (
        <div className="grid">
          {posts.map(post => (
            <article key={post._id} className="card">
              <div style={{height:140,background:'#0b1220',borderRadius:10,marginBottom:12,display:'flex',alignItems:'center',justifyContent:'center',color:'#7b8794'}}>Image</div>
              <div className="title">{post.title}</div>
              <div className="meta">By {post.author?.username || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}</div>
              <div className="excerpt">{post.content.substring(0, 160)}...</div>
              <div style={{display:'flex',justifyContent:'space-between',marginTop:12,alignItems:'center'}}>
                <Link to={`/posts/${post._id}`} className="btn btn-primary">Read</Link>
                <div style={{color:'var(--muted)',fontSize:13}}>{post.views} views • {post.comments.length} comments</div>
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
