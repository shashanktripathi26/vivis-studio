'use client'
import styles from './SlideCanvas.module.css'
import { PALETTES } from './palettes'
import type { PaletteKey, Slide, Format } from './Studio'

const EMOJIS = ['🚀','💡','🧠','📊','✨','🎯','🔑','💪','🌟','📚','⚡','🏆','💎','🔥','🌈','💫','🎪','🦋','🌺','⭐']
const getEmoji = (i: number, t: number) => EMOJIS[(i * 3 + t) % EMOJIS.length]

export const FONT_OPTIONS = [
  { label: 'Display',  value: 'var(--font-playfair), Georgia, serif' },
  { label: 'Modern',   value: 'var(--font-jakarta), sans-serif' },
  { label: 'Serif',    value: 'Georgia, "Times New Roman", serif' },
  { label: 'Mono',     value: '"Courier New", Courier, monospace' },
]

interface Props {
  slide: Slide
  index: number
  total: number
  palette: PaletteKey
  format: Format
  font: string
  onEdit: (field: 'headline' | 'subtext' | 'body', val: string) => void
}

export default function SlideCanvas({ slide, index, total, palette, format, font, onEdit }: Props) {
  const pal = PALETTES[palette]
  const isFirst = index === 0
  const isLast  = index === total - 1
  const emoji   = slide.emoji || getEmoji(index, total)

  const aspectClass = format === 'story'
      ? styles.story
     : styles.square

  const badge = isFirst
    ? <span className={styles.badge} style={{ background: pal.accent, color: ['pastel','berry'].includes(palette) ? '#fff' : '#0D0D1A' }}>SWIPE →</span>
    : isLast
    ? <span className={styles.badgeOutline} style={{ borderColor: pal.accent, color: pal.accent }}>Save this 🔖</span>
    : null

  return (
    <div className={`${styles.canvas} ${aspectClass}`} style={{ background: pal.bg }}>
      {/* Decorative orbs */}
      <div className={styles.orb1} style={{ background: pal.accent }} />
      <div className={styles.orb2} style={{ background: pal.accent }} />

      {/* Slide counter */}
      {total > 1 && <div className={styles.counter}>{index + 1}/{total}</div>}

      <div className={styles.content}>
        {badge && <div className={styles.badgeWrap}>{badge}</div>}

        <div className={styles.emoji}>{emoji}</div>

        <div
          className={styles.headline}
          style={{ color: pal.text, fontFamily: font }}
          contentEditable
          suppressContentEditableWarning
          onBlur={e => onEdit('headline', e.currentTarget.textContent || '')}
        >
          {slide.headline}
        </div>

        <div
          className={styles.subtext}
          style={{ color: pal.sub }}
          contentEditable
          suppressContentEditableWarning
          onBlur={e => onEdit('subtext', e.currentTarget.textContent || '')}
        >
          {slide.subtext}
        </div>

        {slide.body && (
          <div
            className={styles.body}
            style={{ color: pal.sub, borderColor: `${pal.accent}40`, background: 'rgba(255,255,255,0.08)' }}
            contentEditable
            suppressContentEditableWarning
            onBlur={e => onEdit('body', e.currentTarget.textContent || '')}
          >
            {slide.body}
          </div>
        )}

        <div className={styles.accentLine} style={{ background: pal.accent }} />
      </div>
    </div>
  )
}
