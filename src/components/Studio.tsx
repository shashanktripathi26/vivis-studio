'use client'
import { useState, useCallback, useEffect } from 'react'
import styles from './Studio.module.css'
import WelcomeScreen from './WelcomeScreen'
import IdeaScreen from './IdeaScreen'
import StyleScreen from './StyleScreen'
import GeneratingScreen from './GeneratingScreen'
import ResultsScreen from './ResultsScreen'

export type Format = 'square' | 'story' | 'carousel'
export type PaletteKey = 'neon' | 'pastel' | 'sunset' | 'ocean' | 'berry' | 'rose' | 'forest'

export interface Slide {
  headline: string
  subtext: string
  body?: string
  type: string
  emoji: string
}

export interface GeneratedContent {
  title: string
  slides: Slide[]
  caption: string
  hashtags: string[]
}

export interface UserInfo {
  name: string
  email: string
  phone: string
}

type Screen = 'welcome' | 'idea' | 'style' | 'generating' | 'results'

const STEP_MAP: Record<Screen, number> = {
  welcome: 0, idea: 1, style: 2, generating: 3, results: 4
}

export default function Studio() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [user, setUser] = useState<UserInfo>({ name: '', email: '', phone: '' })
  const [idea, setIdea] = useState('')
  const [format, setFormat] = useState<Format>('square')
  const [slideCount, setSlideCount] = useState(5)
  const [tone, setTone] = useState('Friendly & Warm')
  const [vstyle, setVstyle] = useState('Minimalist')
  const [palette, setPalette] = useState<PaletteKey>('neon')
  const [generated, setGenerated] = useState<GeneratedContent | null>(null)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2800)
  }, [])

  const go = (s: Screen) => setScreen(s)

  const handleGenerate = useCallback(async () => {
    go('generating')
    setError('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, format, tone, vstyle, palette, slideCount }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setGenerated(data)
      go('results')
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
      go('style')
    }
  }, [idea, format, tone, vstyle, palette, slideCount])

  const handleEditSlide = useCallback(async (
    slideIdx: number,
    action: string,
    currentSlides: Slide[],
    onDone: (updated: Slide) => void
  ) => {
    try {
      const res = await fetch('/api/edit-slide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slide: currentSlides[slideIdx],
          slideIndex: slideIdx,
          totalSlides: currentSlides.length,
          action, tone, idea,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onDone(data)
      showToast('Slide updated ✨')
    } catch {
      showToast('Could not edit — try again')
    }
  }, [tone, idea, showToast])

  const handleRegenSlide = useCallback(async (
    slideIdx: number,
    currentSlides: Slide[],
    onDone: (updated: Slide) => void
  ) => {
    try {
      const res = await fetch('/api/edit-slide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slideIndex: slideIdx,
          totalSlides: currentSlides.length,
          slideType: currentSlides[slideIdx]?.type || 'hook',
          idea, tone,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onDone(data)
      showToast('Slide regenerated 🎲')
    } catch {
      showToast('Could not regenerate — try again')
    }
  }, [idea, tone, showToast])

  const step = STEP_MAP[screen]

  return (
    <div className={styles.root}>
      {/* Progress bar */}
      {screen !== 'welcome' && (
        <div className={styles.progressWrap}>
          <div className={styles.progressTrack}>
            {['Your info', 'Your idea', 'Your style', 'Results'].map((label, i) => (
              <div key={label} className={styles.progressStep}>
                <div className={`${styles.pDot} ${i < step ? styles.pDone : ''} ${i === step - 1 ? styles.pActive : ''}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={styles.pLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Screens */}
      {screen === 'welcome' && (
        <WelcomeScreen onNext={(u) => { setUser(u); go('idea') }} />
      )}
      {screen === 'idea' && (
        <IdeaScreen
          name={user.name} idea={idea} setIdea={setIdea}
          onNext={() => go('style')} onBack={() => go('welcome')}
        />
      )}
      {screen === 'style' && (
        <StyleScreen
          format={format} setFormat={setFormat}
          slideCount={slideCount} setSlideCount={setSlideCount}
          tone={tone} setTone={setTone}
          vstyle={vstyle} setVstyle={setVstyle}
          palette={palette} setPalette={setPalette}
          onGenerate={handleGenerate} onBack={() => go('idea')}
          error={error}
        />
      )}
      {screen === 'generating' && <GeneratingScreen />}
      {screen === 'results' && generated && (
        <ResultsScreen
          generated={generated} setGenerated={setGenerated}
          palette={palette} setPalette={setPalette}
          format={format}
          onEditSlide={handleEditSlide}
          onRegenSlide={handleRegenSlide}
          onBack={() => go('style')}
          showToast={showToast}
        />
      )}

      {/* Toast */}
      <div className={`${styles.toast} ${toast ? styles.toastShow : ''}`}>{toast}</div>
    </div>
  )
}
