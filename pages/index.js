import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/router"
import styles from '../styles/home.module.css'

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleLoginClick = () => {
    signIn('google')
  }

  const handleDashboardClick = () => {
    router.push('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      
      {/* HEADER */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        padding: '20px',
        color: 'white'
      }}>
        {session ? (
          <div style={{ textAlign: 'right' }}>
            <p>Welcome, {session.user.name}!</p>
            <button 
              onClick={() => signOut()}
              style={{
                padding: '10px 20px',
                background: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>

      {/* MAIN CONTENT */}
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        color: 'white'
      }}>
        <h1 style={{
          fontSize: '48px',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          🪥 SmileBrush
        </h1>

        <p style={{
          fontSize: '24px',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          Revolutionary Dental Gadget Platform
        </p>

        <p style={{
          fontSize: '16px',
          marginBottom: '40px',
          opacity: 0.9
        }}>
          Welcome to SmileBrush! Your premium destination for advanced dental care technology.
          Secure OAuth login, seamless checkout, and real-time notifications.
        </p>

        {/* BUTTONS */}
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {!session ? (
            <button 
              onClick={handleLoginClick}
              style={{
                padding: '15px 40px',
                fontSize: '18px',
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                transition: 'transform 0.3s',
                marginBottom: '20px'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              🔐 Sign in with Google
            </button>
          ) : (
            <button 
              onClick={handleDashboardClick}
              style={{
                padding: '15px 40px',
                fontSize: '18px',
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                transition: 'transform 0.3s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              📊 Go to Dashboard
            </button>
          )}
        </div>
      </div>

      {/* FEATURES */}
      <div style={{
        marginTop: '60px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        maxWidth: '1000px',
        width: '100%'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '20px',
          borderRadius: '10px',
          color: 'white',
          backdropFilter: 'blur(10px)'
        }}>
          <h3>🔐 Secure OAuth</h3>
          <p>Google authentication with token management</p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '20px',
          borderRadius: '10px',
          color: 'white',
          backdropFilter: 'blur(10px)'
        }}>
          <h3>💳 Stripe Payment</h3>
          <p>Secure payment processing</p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '20px',
          borderRadius: '10px',
          color: 'white',
          backdropFilter: 'blur(10px)'
        }}>
          <h3>📧 Discord Alerts</h3>
          <p>Real-time notifications</p>
        </div>
      </div>
    </div>
  )
}
