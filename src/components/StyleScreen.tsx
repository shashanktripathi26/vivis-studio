'use client'
import styles from './StyleScreen.module.css'
import type { Format, PaletteKey } from './Studio'

const PALETTES: { key: PaletteKey; label: string; bg: string }[] = [
  { key: 'neon',   label: 'Electric',  bg: 'linear-gradient(135deg,#FF6B9D,#C44DFF)' },
  { key: 'pastel', label: 'Pastel',    bg: 'linear-gradient(135deg,#FFD4B8,#B8F5D8)' },
  { key: 'sunset', label: 'Sunset',    bg: 'linear-gradient(135deg,#FF8B6B,#FFD93D)' },
  { key: 'ocean',  label: 'Ocean',     bg: 'linear-gradient(135deg,#B8E8FF,#2D9E75)' },
  { key: 'berry',  label: 'Berry',     bg: 'linear-gradient(135deg,#DDD4FF,#6B4FBF)' },
  { key: 'rose',   label: 'Rose',      bg: 'linear-gradient(135deg,#FFB8D4,#FF6B9D)' },
  { key: 'forest', label: 'Forest',    bg: 'linear-gradient(135deg,#B8F5D8,#1A5C3A)' },
]

const TONES = ['😊 Friendly & Warm', '⚡ Bold & Punchy', '📚 Educational', '✨ Inspiring', '💬 Conversational']
const VSTYLES = ['✦ Minimalist', '🎨 Bold & Colourful', '🖼 Illustrated', '📊 Data-Driven', '📖 Storytelling', '💎 Luxury']

interface Props {
  format: Format; setFormat: (f: Format) => void
  slideCount: number; setSlideCount: (n: number) => void
  tone: string; setTone: (t: string) => void
  vstyle: string; setVstyle: (v: string) => void
  palette: PaletteKey; setPalette: (p: PaletteKey) => void
  onGenerate: () => void; onBack: () => void
  error: string
}

export default function StyleScreen(props: Props) {
  const { format, setFormat, slideCount, setSlideCount, tone, setTone,
    vstyle, setVstyle, palette, setPalette, onGenerate, onBack, error } = props

  return (
    <div className={styles.screen}>
      <div className={styles.blob1} /><div className={styles.blob2} />
      <div className={styles.inner}>
        <h2 className={styles.title}>Style your creative</h2>
        <p className={styles.sub}>Pick your format, tone, palette and visual vibe ✨</p>

        {error && <div className={styles.errBanner}>⚠️ {error} — please try again</div>}

        {/* FORMAT */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Format</div>
          <div className={styles.formatRow}>
            {([
              { key: 'square', icon: '⬛', name: 'Post', size: '1:1' },
              { key: 'story',  icon: '📱', name: 'Story', size: '9:16' },
              { key: 'carousel', icon: '🎠', name: 'Carousel', size: 'Multi-slide' },
            ] as { key: Format; icon: string; name: string; size: string }[]).map(f => (
              <button
                key={f.key}
                className={`${styles.fmtCard} ${format === f.key ? styles.fmtSel : ''}`}
                onClick={() => setFormat(f.key)}
              >
                <span className={styles.fmtIcon}>{f.icon}</span>
                <span className={styles.fmtName}>{f.name}</span>
                <span className={styles.fmtSize}>{f.size}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SLIDE COUNT */}
        {format === 'carousel' && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Number of Slides</div>
            <div className={styles.countRow}>
              <button className={styles.countBtn} onClick={() => setSlideCount(Math.max(2, slideCount - 1))}>−</button>
              <span className={styles.countVal}>{slideCount}</span>
              <button className={styles.countBtn} onClick={() => setSlideCount(Math.min(10, slideCount + 1))}>+</button>
              <span className={styles.countLbl}>slides</span>
            </div>
          </div>
        )}

        {/* TONE */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Tone</div>
          <div className={styles.chipsRow}>
            {TONES.map(t => (
              <button
                key={t}
                className={`${styles.chip} ${tone === t ? styles.chipSel : ''}`}
                onClick={() => setTone(t)}
              >{t}</button>
            ))}
          </div>
        </div>

        {/* VISUAL STYLE */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Visual Style</div>
          <div className={styles.chipsRow}>
            {VSTYLES.map(v => (
              <button
                key={v}
                className={`${styles.chip} ${vstyle === v ? styles.chipSel : ''}`}
                onClick={() => setVstyle(v)}
              >{v}</button>
            ))}
          </div>
        </div>

        {/* PALETTE */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Colour Palette</div>
          <div className={styles.paletteRow}>
            {PALETTES.map(p => (
              <div key={p.key} className={styles.palWrap} onClick={() => setPalette(p.key)}>
                <div
                  className={`${styles.pal} ${palette === p.key ? styles.palSel : ''}`}
                  style={{ background: p.bg }}
                />
                <span className={styles.palLabel}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.btnRow}>
          <button className={styles.backBtn} onClick={onBack}>← Back</button>
          <button className={styles.genBtn} onClick={onGenerate}>
            ✦ Generate my creative
          </button>
        </div>
      </div>
    </div>
  )
}
