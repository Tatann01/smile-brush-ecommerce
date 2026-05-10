import { useState, useEffect } from 'react'

export default function AdminDashboard() {
  const [clients, setClients] = useState([])
  const [message, setMessage] = useState('')
  const [subject, setSubject] = useState('SmileBrush - Special Update')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // RESEVWA LIST CLIENTS
    fetch('/api/get-clients')
      .then(res => res.json())
      .then(data => {
        setClients(data.clients || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching clients:', err)
        setLoading(false)
      })
  }, [])

  const sendMessageToAllClients = async (e) => {
    e.preventDefault()
    
    if (!message.trim()) {
      alert('Please enter a message!')
      return
    }
    
    setSending(true)
    try {
      const response = await fetch('/api/contact-clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, subject })
      })
      
      const data = await response.json()
      setResult(data)
      alert(`✅ Campaign completed!`)
      setMessage('')
      
    } catch (error) {
      alert(`❌ Error: ${error.message}`)
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '30px',
      maxWidth: '1000px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      background: '#f5f5f5'
    }}>
      <h1 style={{ color: '#667eea', marginBottom: '30px' }}>📧 Admin Dashboard - Contact Clients</h1>
      
      {/* CLIENT COUNT */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          padding: '20px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          border: '2px solid #2196F3'
        }}>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#1976D2' }}>
            {clients.length}
          </p>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>Total Clients</p>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#e8f5e9',
          borderRadius: '8px',
          border: '2px solid #4caf50'
        }}>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#2e7d32' }}>
            {clients.filter(c => c.tokenStatus === 'active').length}
          </p>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>Active Tokens</p>
        </div>
      </div>

      {/* SEND MESSAGE FORM */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#667eea', marginTop: '0' }}>📨 Send Message to All Clients</h2>
        
        <form onSubmit={sendMessageToAllClients}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              Subject:
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              Message:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="8"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '16px',
                fontFamily: 'Arial',
                boxSizing: 'border-box'
              }}
              placeholder="Write your message to clients..."
            />
          </div>

          <button
            type="submit"
            disabled={sending || clients.length === 0}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: sending || clients.length === 0 ? '#ccc' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: sending || clients.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            {sending ? '⏳ Sending...' : `📧 Send to ${clients.length} Clients`}
          </button>
        </form>
      </div>

      {/* RESULT */}
      {result && (
        <div style={{
          padding: '20px',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
          marginBottom: '30px',
          border: '2px solid #999'
        }}>
          <h3 style={{ marginTop: '0', color: '#333' }}>📊 Campaign Result:</h3>
          <p><strong>Success:</strong> {result.message}</p>
        </div>
      )}

      {/* CLIENT LIST */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#667eea', marginTop: '0' }}>📋 Registered Clients</h2>
        
        {loading ? (
          <p>⏳ Loading clients...</p>
        ) : clients.length === 0 ? (
          <p style={{ color: '#666' }}>No clients yet. Start with OAuth login!</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ccc' }}>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Email</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Name</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Status</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{client.email}</td>
                    <td style={{ padding: '12px' }}>{client.userName || 'N/A'}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '5px 10px',
                        borderRadius: '20px',
                        backgroundColor: client.tokenStatus === 'active' ? '#e8f5e9' : '#ffebee',
                        color: client.tokenStatus === 'active' ? '#2e7d32' : '#c62828',
                        fontWeight: 'bold'
                      }}>
                        {client.tokenStatus === 'active' ? '✅ Active' : '❌ Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '12px', color: '#666' }}>
                      {client.tokenSavedAt ? new Date(client.tokenSavedAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
