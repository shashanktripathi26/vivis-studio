'use client'
import { useEffect, useState } from 'react'
import styles from './GeneratingScreen.module.css'

const MESSAGES = [
  '🧠 Understanding your idea...',
  '✍️ Writing punchy headlines...',
  '🎨 Crafting slide layouts...',
  '💬 Generating your caption...',
  '#️⃣ Picking perfect hashtags...',
  '✨ Polishing the final touches...',
]

export default function GeneratingScreen() {
  const [msgIdx, setMsgIdx] = useState(0)
  const [visible, setVisible] = useState<boolean[]>([])

  useEffect(() => {
    MESSAGES.forEach((_, i) => {
      setTimeout(() => {
        setVisible(prev => {
          const next = [...prev]
          next[i] = true
          return next
        })
        setMsgIdx(i)
      }, i * 700)
    })
  }, [])

  return (
    <div className={styles.screen}>
      <div className={styles.blob1} /><div className={styles.blob2} /><div className={styles.blob3} />

      <div className={styles.center}>
        <div className={styles.loaderWrap}>
          <div className={styles.loaderRing} />
          <div className={styles.loaderEmoji}>🎨</div>
        </div>

        <h2 className={styles.title}>Creating your magic...</h2>
        <p className={styles.sub}>Hang tight — great things take a second ✨</p>

        <div className={styles.msgs}>
          {MESSAGES.map((msg, i) => (
            <div
              key={msg}
              className={`${styles.msg} ${visible[i] ? styles.msgVisible : ''} ${i === msgIdx ? styles.msgActive : ''}`}
            >
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
