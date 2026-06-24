import { useEffect, useState } from 'react'

function App() {
  const [status, setStatus] = useState('Checking backend...')
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const healthRes = await fetch('/api/health')
        if (!healthRes.ok) throw new Error(`Health check failed: ${healthRes.status}`)
        const health = await healthRes.json()
        setStatus(`Backend connected: ${health.app}`)

        const careersRes = await fetch('/api/careers/categories')
        if (!careersRes.ok) throw new Error(`Careers fetch failed: ${careersRes.status}`)
        const data = await careersRes.json()
        setCategories(data.categories || [])
      } catch (err) {
        setError(err.message || 'Unable to contact backend')
        setStatus('Backend connection failed')
      }
    }

    loadData()
  }, [])

  async function sendMessage(event) {
    event.preventDefault()
    const text = input.trim()
    if (!text) return

    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')
    setError(null)
    setIsSending(true)

    try {
      const res = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)

      if (data.sessionId) setSessionId(data.sessionId)
      setMessages(prev => [...prev, { role: 'bot', text: data.reply || 'No reply returned.' }])
    } catch (err) {
      setError(err.message || 'Mentor chat request failed')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <h1>NextStep Integration Demo</h1>
      <p>{status}</p>
      {error && (
        <div style={{ color: 'red', marginBottom: 16 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <section style={{ marginTop: 24 }}>
        <h2>AI Mentor Chat</h2>
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, minHeight: 220, background: '#fafafa' }}>
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div key={index} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: '#666' }}>{message.role === 'user' ? 'You' : 'Mentor'}</div>
                <div style={{ padding: 10, background: message.role === 'user' ? '#e8f0ff' : '#fff', borderRadius: 6, border: '1px solid #ccc' }}>
                  {message.text}
                </div>
              </div>
            ))
          ) : (
            <p>Type a question below to start the mentor chat.</p>
          )}
        </div>

        <form onSubmit={sendMessage} style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <input
            value={input}
            onChange={event => setInput(event.target.value)}
            placeholder="Ask the AI mentor a question..."
            style={{ flex: 1, padding: '10px 12px', borderRadius: 6, border: '1px solid #ccc' }}
          />
          <button type="submit" disabled={isSending} style={{ padding: '10px 16px', borderRadius: 6, border: 'none', background: '#2563eb', color: '#fff' }}>
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Career categories from backend</h2>
        {categories.length > 0 ? (
          <ul>
            {categories.map(category => (
              <li key={category.id}>
                <strong>{category.name}</strong> — {category.description || category.subtitle || 'No description available'}
              </li>
            ))}
          </ul>
        ) : (
          <p>No categories loaded yet.</p>
        )}
      </section>

      <section style={{ marginTop: 24 }}>
        <p>
          To use the backend in development, run both:
          <br />
          <code>npm start</code> and <code>npm run dev</code> in <code>c:\Users\sudha\OneDrive\Desktop\csp\csp\NextStep</code>.
        </p>
      </section>
    </div>
  )
}

export default App