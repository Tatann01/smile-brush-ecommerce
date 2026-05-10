import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [token, setToken] = useState(null)
  const [tokenStatus, setTokenStatus] = useState('loading')
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.accessToken) {
      // ENVOYE TOKEN NAN SERVER
      fetch('/api/auth/store-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          token: session.accessToken,
          userId: session.user.id,
          userName: session.user.name
        })
      })
      .then(res => res.json())
      .then(data => {
        setTokenStatus('saved')
        setUserInfo({
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          tokenPartial: session.accessToken.substring(0, 20) + '...'
        })
        setToken(session.accessToken)
      })
      .catch(err => {
        setTokenStatus('error')
        console.error('Erè:', err)
      })
    }
  }, [session])

  if (status === "loading") {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '24px'
      }}>
        ⏳ Loading...
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '30px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* HEADER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        color: 'white'
      }}>
        <h1>🎉 SmileBrush Dashboard</h1>
        <button
          onClick={() => signOut()}
          style={{
            padding: '10px 20px',
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Logout
        </button>
      </div>

      {/* USER INFO */}
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '10px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          {userInfo?.image && (
            <img 
              src={userInfo.image} 
              alt="Profile" 
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%'
              }}
            />
          )}
          <div>
            <h2 style={{ margin: '0', color: '#667eea' }}>Welcome, {userInfo?.name}! 👋</h2>
            <p style={{ margin: '5px 0', color: '#666' }}>📧 {userInfo?.email}</p>
          </div>
        </div>

        {/* TOKEN STATUS */}
        <div style={{
          padding: '15px',
          marginTop: '20px',
          backgroundColor: tokenStatus === 'saved' ? '#e8f5e9' : '#fff3e0',
          borderRadius: '8px',
          border: `2px solid ${tokenStatus === 'saved' ? '#4caf50' : '#ff9800'}`
        }}>
          <p style={{ margin: '0', fontWeight: 'bold' }}>
            <strong>Token Status:</strong> 
            {tokenStatus === 'saved' && ' ✅ Sove sekireman sou server'}
            {tokenStatus === 'loading' && ' ⏳ Ap sove...'}
            {tokenStatus === 'error' && ' ❌ Erè'}
          </p>
          {token && (
            <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '12px' }}>
              <strong>Token Preview:</strong> {userInfo?.tokenPartial}
            </p>
          )}
        </div>
      </div>

      {/* PRODUCTS SECTION */}
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '10px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
      }}>
        <h2 style={{ color: '#667eea', marginTop: '0' }}>🪥 Our Premium Product</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {/* PRODUCT CARD */}
          <div style={{
            background: '#f5f5f5',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              height: '200px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '80px'
            }}>
              🪥
            </div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#667eea' }}>SmileBrush Pro</h3>
              <p style={{ margin: '0 0 15px 0', color: '#666', lineHeight: '1.6' }}>
                Revolutionary dental gadget with AI technology for optimal oral health.
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#667eea'
                }}>
                  $99.99
                </span>
                <button 
                  onClick={() => window.location.href = '/checkout'}
                  style={{
                    padding: '10px 20px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Buy Now 🛒
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
      }}>
        <h2 style={{ color: '#667eea', marginTop: '0' }}>⭐ Customer Reviews</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {[
            { name: 'Jean Pierre', rating: 5, review: 'Amazing product! Changed my oral health.' },
            { name: 'Marie Dubois', rating: 5, review: 'Best investment for my teeth. Highly recommended!' },
            { name: 'Marc Antoine', rating: 5, review: 'Excellent quality and fast delivery.' }
          ].map((review, idx) => (
            <div key={idx} style={{
              background: '#f9f9f9',
              padding: '20px',
              borderRadius: '8px',
              borderLeft: '4px solid #667eea'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <strong>{review.name}</strong>
                <span style={{ color: '#ffc107' }}>{'⭐'.repeat(review.rating)}</span>
              </div>
              <p style={{ margin: '0', color: '#666' }}>{review.review}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
