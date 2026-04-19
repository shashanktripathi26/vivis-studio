'use client'
import { useState } from 'react'
import styles from './IdeaScreen.module.css'

const EXAMPLES = [
  {
    emoji: '🧠', color: '#FFF0E8', border: '#FFD4B8', textColor: '#8B4513',
    title: 'The forgetting curve',
    desc: 'Carousel: Why kids forget 70% of learning in 24hrs — and how spaced repetition fixes it',
    prompt: 'Carousel for parents explaining the forgetting curve — why kids forget 70% of what they learn within 24 hours — and how spaced repetition fixes this. End with a CTA about Cuemath.'
  },
  {
    emoji: '⭐', color: '#F0FFF4', border: '#B8F5D8', textColor: '#1A6B3A',
    title: 'Math confidence beats scores',
    desc: 'Post: Why confidence matters more than exam results for kids long-term success',
    prompt: 'Post about why math confidence matters more than exam scores for kids long-term success in life and career. Include a surprising stat. End on an uplifting note for parents.'
  },
  {
    emoji: '📱', color: '#F0F4FF', border: '#B8D4FF', textColor: '#1A3A8B',
    title: '5 signs for advanced math',
    desc: 'Story: 5 clear signs your child is ready for the next level in math',
    prompt: 'Instagram Story with 5 signs your child is ready for advanced math — make it feel like an exciting checklist for parents to go through. Upbeat and encouraging tone.'
  },
  {
    emoji: '❌', color: '#FFF0F0', border: '#FFD4D4', textColor: '#8B1A1A',
    title: 'Multiplication mistake',
    desc: 'Bold post: The #1 mistake parents make teaching multiplication — and the fix',
    prompt: 'Bold eye-catching post about the most common mistake parents make when helping kids with multiplication at home — and what to do instead. Use contrast and surprise.'
  },
]

interface Props {
  name: string
  idea: string
  setIdea: (v: string) => void
  onNext: () => void
  onBack: () => void
}

export default function IdeaScreen({ name, idea, setIdea, onNext, onBack }: Props) {
  const [modalIdx, setModalIdx] = useState<number | null>(null)

  const useExample = (idx: number) => {
    setIdea(EXAMPLES[idx].prompt)
    setModalIdx(null)
  }

  const handleNext = () => {
    if (!idea.trim()) return
    onNext()
  }

  return (
    <div className={styles.screen}>
      <div className={styles.blob1} /><div className={styles.blob2} />

      <div className={styles.inner}>
        <div className={styles.greetChip}>Hey {name}! 👋 Let's make something amazing</div>

        <h2 className={styles.title}>What's your content idea?</h2>
        <p className={styles.sub}>Type anything — messy, rough, half-baked. AI handles the rest ✨</p>

        <div className={styles.textareaWrap}>
          <textarea
            className={styles.textarea}
            value={idea}
            onChange={e => setIdea(e.target.value)}
            placeholder="e.g. A carousel explaining why kids forget what they learn — the forgetting curve — and how spaced repetition helps parents help their kids retain more..."
            rows={5}
          />
          <div className={styles.charCount}>{idea.length} characters</div>
        </div>

        <div className={styles.exLabel}>
          <span>🌟 Need inspiration? Tap an example</span>
        </div>

        <div className={styles.exGrid}>
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              className={styles.exCard}
              style={{ background: ex.color, borderColor: ex.border }}
              onClick={() => setModalIdx(i)}
            >
              <span className={styles.exEmoji}>{ex.emoji}</span>
              <div className={styles.exTitle} style={{ color: ex.textColor }}>{ex.title}</div>
              <div className={styles.exDesc}>{ex.desc}</div>
              <span className={styles.exUse}>Tap to use →</span>
            </button>
          ))}
        </div>

        <div className={styles.btnRow}>
          <button className={styles.backBtn} onClick={onBack}>← Back</button>
          <button
            className={`${styles.nextBtn} ${!idea.trim() ? styles.nextBtnDisabled : ''}`}
            onClick={handleNext}
            disabled={!idea.trim()}
          >
            Choose your style →
          </button>
        </div>
      </div>

      {/* Pop-up modal */}
      {modalIdx !== null && (
        <div className={styles.modalOverlay} onClick={() => setModalIdx(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}
            style={{ borderColor: EXAMPLES[modalIdx].border }}>
            <button className={styles.modalClose} onClick={() => setModalIdx(null)}>✕</button>
            <div className={styles.modalEmoji}>{EXAMPLES[modalIdx].emoji}</div>
            <h3 className={styles.modalTitle}>{EXAMPLES[modalIdx].title}</h3>
            <p className={styles.modalPrompt}>{EXAMPLES[modalIdx].prompt}</p>
            <div className={styles.modalActions}>
              <button className={styles.modalUseBtn} onClick={() => useExample(modalIdx)}>
                Use this idea ✦
              </button>
              <button className={styles.modalCancelBtn} onClick={() => setModalIdx(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
