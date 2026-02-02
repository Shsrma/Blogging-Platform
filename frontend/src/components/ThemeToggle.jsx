import React, { useEffect, useState } from 'react'

function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'dark'
    } catch (e) {
      return 'dark'
    }
  })

  useEffect(() => {
    document.body.classList.toggle('theme-light', theme === 'light')
    try { localStorage.setItem('theme', theme) } catch (e) {}
  }, [theme])

  return (
    <button
      aria-label="Toggle theme"
      className="btn-ghost"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      title="Toggle theme"
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}

export default ThemeToggle
