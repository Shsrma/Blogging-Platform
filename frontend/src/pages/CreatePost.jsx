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
  const [validationErrors, setValidationErrors] = useState({})
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.title.trim()) {
      errors.title = 'Title is required'
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters long'
    } else if (formData.title.length > 200) {
      errors.title = 'Title must be less than 200 characters'
    }

    if (!formData.content.trim()) {
      errors.content = 'Content is required'
    } else if (formData.content.trim().length < 10) {
      errors.content = 'Content must be at least 10 characters long'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setValidationErrors({})

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag)

      const postData = {
        ...formData,
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags: tagsArray
      }

      await axiosInstance.post('/posts', postData)
      navigate('/')
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create post. Please try again.'
      setError(errorMessage)
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
              onChange={(e) => {
                handleChange(e)
                if (validationErrors.title) {
                  setValidationErrors({ ...validationErrors, title: '' })
                }
              }}
              placeholder="Enter post title"
              className={validationErrors.title ? 'error-input' : ''}
              required
              maxLength="200"
            />
            {validationErrors.title && <span className="field-error">{validationErrors.title}</span>}
            <span className="char-count">{formData.title.length}/200</span>
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
              onChange={(e) => {
                handleChange(e)
                if (validationErrors.content) {
                  setValidationErrors({ ...validationErrors, content: '' })
                }
              }}
              placeholder="Write your post content here..."
              rows="15"
              className={validationErrors.content ? 'error-input' : ''}
              required
            ></textarea>
            {validationErrors.content && <span className="field-error">{validationErrors.content}</span>}
            <span className="char-count">{formData.content.length} characters</span>
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
