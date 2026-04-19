'use client'
import { useState } from 'react'
import type { UserInfo } from './Studio'
import styles from './WelcomeScreen.module.css'

interface Props {
  onNext: (user: UserInfo) => void
}

export default function WelcomeScreen({ onNext }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [err, setErr] = useState('')

  const handleSubmit = () => {
    if (!name.trim()) { setErr('Please enter your name to continue'); return }
    if (!email.trim() || !email.includes('@')) { setErr('Please enter a valid email'); return }
    setErr('')
    onNext({ name: name.trim(), email: email.trim(), phone: phone.trim() })
  }

  return (
    <div className={styles.screen}>
      {/* Blobs */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.blob3} />
      <div className={styles.blob4} />

      {/* Floating icons */}
      <div className={styles.floater} style={{ top: '12%', left: '8%', animationDelay: '0s' }}>🎨</div>
      <div className={styles.floater} style={{ top: '20%', right: '10%', animationDelay: '0.8s' }}>✨</div>
      <div className={styles.floater} style={{ bottom: '25%', left: '6%', animationDelay: '1.4s' }}>📱</div>
      <div className={styles.floater} style={{ bottom: '18%', right: '8%', animationDelay: '0.4s' }}>🚀</div>

      <div className={styles.card}>
        <div className={styles.logoRow}>
          <span className={styles.logoIcon}>🎨</span>
          <span className={styles.logoText}>Vivid Studio</span>
        </div>

        <h1 className={styles.title}>
          Welcome to your own<br />
          <span className={styles.titleGrad}>creative universe</span>
        </h1>

        <p className={styles.tagline}>
          Turn messy ideas into stunning social media creatives — in seconds.<br />
          No design skills needed. Just pure vibes. ✨
        </p>

        <div className={styles.badges}>
          <span className={styles.badge} style={{ background: '#FFE8D6', color: '#C45A2A' }}>⚡ AI-Powered</span>
          <span className={styles.badge} style={{ background: '#E8F0FF', color: '#3A5CB8' }}>🎨 No design skills</span>
          <span className={styles.badge} style={{ background: '#E8FFE8', color: '#2A8A2A' }}>📲 Post-ready</span>
        </div>

        <div className={styles.form}>
          <div className={styles.fieldRow}>
            <div className={styles.fieldWrap}>
              <label className={styles.fieldLabel}>Your Name *</label>
              <input
                className={styles.input}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            <div className={styles.fieldWrap}>
              <label className={styles.fieldLabel}>Phone</label>
              <input
                className={styles.input}
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                type="tel"
              />
            </div>
          </div>
          <div className={styles.fieldWrap} style={{ marginTop: 12 }}>
            <label className={styles.fieldLabel}>Email *</label>
            <input
              className={styles.input}
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              type="email"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {err && <p className={styles.errMsg}>⚠️ {err}</p>}

          <button className={styles.ctaBtn} onClick={handleSubmit}>
            Let's create something epic ✦
          </button>
        </div>
      </div>
    </div>
  )
}
