'use client'
import { useState, useRef, useCallback } from 'react'
import styles from './ResultsScreen.module.css'
import SlideCanvas, { FONT_OPTIONS } from './SlideCanvas'
import { PALETTE_SWATCHES } from './palettes'
import type { GeneratedContent, PaletteKey, Slide, Format } from './Studio'

interface Props {
  generated: GeneratedContent
  setGenerated: (g: GeneratedContent) => void
  palette: PaletteKey
  setPalette: (p: PaletteKey) => void
  format: Format
  onEditSlide: (idx: number, action: string, slides: Slide[], cb: (s: Slide) => void) => void
  onRegenSlide: (idx: number, slides: Slide[], cb: (s: Slide) => void) => void
  onBack: () => void
  showToast: (msg: string) => void
}

export default function ResultsScreen({
  generated, setGenerated, palette, setPalette,
  format, onEditSlide, onRegenSlide, onBack, showToast
}: Props) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [font, setFont] = useState(FONT_OPTIONS[0].value)
  const [editingSlide, setEditingSlide] = useState(false)
  const slideRef = useRef<HTMLDivElement>(null)

  const slides = generated.slides

  const updateSlide = useCallback((idx: number, updated: Slide) => {
    const newSlides = [...slides]
    newSlides[idx] = { ...newSlides[idx], ...updated }
    setGenerated({ ...generated, slides: newSlides })
    setEditingSlide(false)
  }, [generated, slides, setGenerated])

  const handleInlineEdit = useCallback((field: 'headline' | 'subtext' | 'body', val: string) => {
    const newSlides = [...slides]
    newSlides[currentSlide] = { ...newSlides[currentSlide], [field]: val }
    setGenerated({ ...generated, slides: newSlides })
  }, [generated, slides, currentSlide, setGenerated])

  const handleEdit = async (action: string) => {
    setEditingSlide(true)
    showToast('Editing slide...')
    onEditSlide(currentSlide, action, slides, (updated) => updateSlide(currentSlide, updated))
  }

  const handleRegen = async () => {
    setEditingSlide(true)
    showToast('Regenerating...')
    onRegenSlide(currentSlide, slides, (updated) => updateSlide(currentSlide, updated))
  }

  const navSlide = (d: number) => {
    const next = Math.max(0, Math.min(slides.length - 1, currentSlide + d))
    setCurrentSlide(next)
  }

  const copyCaption = () => {
    const text = generated.caption + '\n\n' + (generated.hashtags || []).join(' ')
    navigator.clipboard.writeText(text).then(() => showToast('Caption copied! 📋')).catch(() => {})
  }

  const copyTag = (tag: string) => {
    navigator.clipboard.writeText(tag).then(() => showToast(`Copied ${tag}`)).catch(() => {})
  }

  const downloadSlide = () => {
    const el = slideRef.current
    if (!el) return
    try {
      import('html2canvas').then(({ default: html2canvas }) => {
        html2canvas(el, { scale: 2, useCORS: true, backgroundColor: null }).then(canvas => {
          const link = document.createElement('a')
          link.download = `vivid-studio-slide-${currentSlide + 1}.png`
          link.href = canvas.toDataURL('image/png')
          link.click()
          showToast('Downloaded! 📥')
        })
      }).catch(() => showToast('Install html2canvas to enable downloads'))
    } catch {
      showToast('Add html2canvas package to enable PNG export')
    }
  }

  const shareCaption = generated.caption + '\n\n' + (generated.hashtags || []).slice(0, 5).join(' ')

  const shareIG = () => {
    copyCaption()
    showToast('Caption copied! Opening Instagram... 📷')
    setTimeout(() => window.open('https://www.instagram.com', '_blank'), 1000)
  }

  const shareFB = () => {
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')
    const text = encodeURIComponent(generated.slides[0]?.headline || '')
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank')
    showToast('Opening Facebook... 👍')
  }

  const sharePin = () => {
    const desc = encodeURIComponent(generated.slides[0]?.headline + ' — ' + generated.slides[0]?.subtext)
    window.open(`https://pinterest.com/pin/create/button/?description=${desc}`, '_blank')
    showToast('Opening Pinterest... 📌')
  }

  const shareTW = () => {
    const text = encodeURIComponent(
      (generated.slides[0]?.headline || '') + '\n\n' +
      (generated.hashtags || []).slice(0, 4).join(' ')
    )
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
    showToast('Opening X / Twitter... 🐦')
  }

  const shareLinkedIn = () => {
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
    showToast('Opening LinkedIn... 💼')
  }

  return (
    <div className={styles.screen}>
      <div className={styles.inner}>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{generated.title}</h2>
            <p className={styles.sub}>{slides.length} slide{slides.length > 1 ? 's' : ''} · Click any text to edit inline</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.actBtn} onClick={onBack}>← Redo</button>
            <button className={`${styles.actBtn} ${styles.actBtnPrimary}`} onClick={downloadSlide}>⬇ Download PNG</button>
          </div>
        </div>

        {/* Edit panel */}
        <div className={styles.editPanel}>
          <div className={styles.editPanelInner}>
            <div className={styles.editGroup}>
              <span className={styles.editGroupLabel}>Colour</span>
              <div className={styles.palRow}>
                {PALETTE_SWATCHES.map(p => (
                  <button
                    key={p.key}
                    title={p.label}
                    className={`${styles.palSwatch} ${palette === p.key ? styles.palSwatchSel : ''}`}
                    style={{ background: p.bg }}
                    onClick={() => setPalette(p.key)}
                  />
                ))}
              </div>
            </div>
            <div className={styles.editGroup}>
              <span className={styles.editGroupLabel}>Font</span>
              <div className={styles.fontRow}>
                {FONT_OPTIONS.map(f => (
                  <button
                    key={f.label}
                    className={`${styles.fontBtn} ${font === f.value ? styles.fontBtnSel : ''}`}
                    style={{ fontFamily: f.value }}
                    onClick={() => setFont(f.value)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        {slides.length > 1 && (
          <div className={styles.thumbsRow}>
            {slides.map((s, i) => (
              <button
                key={i}
                className={`${styles.thumb} ${i === currentSlide ? styles.thumbActive : ''}`}
                onClick={() => setCurrentSlide(i)}
                title={`Slide ${i + 1}`}
              >
                {s.emoji || '✨'}
              </button>
            ))}
          </div>
        )}

        {/* Slide viewer */}
        <div className={styles.slideViewer}>
          <div ref={slideRef}>
            <SlideCanvas
              slide={slides[currentSlide]}
              index={currentSlide}
              total={slides.length}
              palette={palette}
              format={format}
              font={font}
              onEdit={handleInlineEdit}
            />
          </div>
          {slides.length > 1 && (
            <div className={styles.slideNav}>
              <button className={styles.navBtn} onClick={() => navSlide(-1)}>←</button>
              <span className={styles.slideInd}>{currentSlide + 1} / {slides.length}</span>
              <button className={styles.navBtn} onClick={() => navSlide(1)}>→</button>
            </div>
          )}
        </div>

        {/* Quick edit chips */}
        <div className={styles.editChips}>
          <span className={styles.editChipsLabel}>Quick edits:</span>
          {[
            { key: 'shorter', label: '✂️ Shorter' },
            { key: 'punchier', label: '⚡ Punchier' },
            { key: 'stat', label: '📊 Add stat' },
            { key: 'fun', label: '😄 More fun' },
          ].map(a => (
            <button
              key={a.key}
              className={styles.echip}
              onClick={() => handleEdit(a.key)}
              disabled={editingSlide}
            >
              {a.label}
            </button>
          ))}
          <button className={`${styles.echip} ${styles.echipRegen}`} onClick={handleRegen} disabled={editingSlide}>
            🔁 Redo slide
          </button>
        </div>

        {/* Caption */}
        <div className={styles.section}>
          <span className={styles.sectionLabel}>Caption</span>
          <div className={styles.captionBox}>
            <p className={styles.captionText}>{generated.caption}</p>
            <button className={styles.copyBtn} onClick={copyCaption}>📋 Copy caption + hashtags</button>
          </div>
        </div>

        {/* Hashtags */}
        {generated.hashtags?.length > 0 && (
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Hashtags — tap to copy</span>
            <div className={styles.hashRow}>
              {generated.hashtags.map(tag => (
                <button key={tag} className={styles.hash} onClick={() => copyTag(tag)}>{tag}</button>
              ))}
            </div>
          </div>
        )}

        {/* Share */}
        <div className={styles.section}>
          <span className={styles.sectionLabel}>Share directly</span>
          <p className={styles.shareNote}>Caption is copied to clipboard before opening — just paste it in the app!</p>
          <div className={styles.shareRow}>
            <button className={`${styles.shareBtn} ${styles.ig}`} onClick={shareIG}>
              <span>📷</span> Instagram
            </button>
            <button className={`${styles.shareBtn} ${styles.fb}`} onClick={shareFB}>
              <span>👍</span> Facebook
            </button>
            <button className={`${styles.shareBtn} ${styles.pin}`} onClick={sharePin}>
              <span>📌</span> Pinterest
            </button>
            <button className={`${styles.shareBtn} ${styles.tw}`} onClick={shareTW}>
              <span>🐦</span> X / Twitter
            </button>
            <button className={`${styles.shareBtn} ${styles.li}`} onClick={shareLinkedIn}>
              <span>💼</span> LinkedIn
            </button>
          </div>
        </div>

        <button className={styles.backBtn} onClick={onBack}>← Change style & regenerate</button>

      </div>
    </div>
  )
}
