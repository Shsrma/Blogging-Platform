import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axios'
import '../styles/CreatePost.css'

function CreatePost() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    tags: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag)

      const postData = {
        ...formData,
        tags: tagsArray
      }

      await axiosInstance.post('/posts', postData)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-post">
      <div className="create-post-container">
        <h1>Create New Post</h1>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              required
              maxLength="200"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="General">General</option>
                <option value="Technology">Technology</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Business">Business</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="comma, separated, tags"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Content *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content here..."
              rows="15"
              required
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost
