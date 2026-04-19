import type { PaletteKey } from './Studio'

export interface Palette {
  bg: string
  bgSolid: string
  accent: string
  text: string
  sub: string
  headlineFont: string
}

export const PALETTES: Record<PaletteKey, Palette> = {
  neon: {
    bg: 'linear-gradient(135deg,#1A0533 0%,#0D0D2E 100%)',
    bgSolid: '#1A0533',
    accent: '#FF6B9D',
    text: '#FFFFFF',
    sub: 'rgba(255,255,255,0.72)',
    headlineFont: '#FFFFFF',
  },
  pastel: {
    bg: 'linear-gradient(135deg,#FFF4F0 0%,#F0FFF8 100%)',
    bgSolid: '#FFF4F0',
    accent: '#FF7A5C',
    text: '#1A1A3E',
    sub: 'rgba(26,26,62,0.62)',
    headlineFont: '#1A1A3E',
  },
  sunset: {
    bg: 'linear-gradient(135deg,#2D0A00 0%,#1A0800 100%)',
    bgSolid: '#2D0A00',
    accent: '#FFD93D',
    text: '#FFFFFF',
    sub: 'rgba(255,255,255,0.72)',
    headlineFont: '#FFFFFF',
  },
  ocean: {
    bg: 'linear-gradient(135deg,#001A2E 0%,#002E20 100%)',
    bgSolid: '#001A2E',
    accent: '#6DD5FA',
    text: '#FFFFFF',
    sub: 'rgba(255,255,255,0.72)',
    headlineFont: '#FFFFFF',
  },
  berry: {
    bg: 'linear-gradient(135deg,#F5F2FF 0%,#EDE8FF 100%)',
    bgSolid: '#F5F2FF',
    accent: '#6B4FBF',
    text: '#1A1A3E',
    sub: 'rgba(26,26,62,0.6)',
    headlineFont: '#1A1A3E',
  },
  rose: {
    bg: 'linear-gradient(135deg,#1A0010 0%,#2E0018 100%)',
    bgSolid: '#1A0010',
    accent: '#FFB8D4',
    text: '#FFFFFF',
    sub: 'rgba(255,255,255,0.72)',
    headlineFont: '#FFFFFF',
  },
  forest: {
    bg: 'linear-gradient(135deg,#001A0F 0%,#002214 100%)',
    bgSolid: '#001A0F',
    accent: '#B8F5D8',
    text: '#FFFFFF',
    sub: 'rgba(255,255,255,0.72)',
    headlineFont: '#FFFFFF',
  },
}

export const PALETTE_SWATCHES: { key: PaletteKey; label: string; bg: string }[] = [
  { key: 'neon',   label: 'Electric', bg: 'linear-gradient(135deg,#FF6B9D,#C44DFF)' },
  { key: 'pastel', label: 'Pastel',   bg: 'linear-gradient(135deg,#FFD4B8,#B8F5D8)' },
  { key: 'sunset', label: 'Sunset',   bg: 'linear-gradient(135deg,#FF8B6B,#FFD93D)' },
  { key: 'ocean',  label: 'Ocean',    bg: 'linear-gradient(135deg,#B8E8FF,#2D9E75)' },
  { key: 'berry',  label: 'Berry',    bg: 'linear-gradient(135deg,#DDD4FF,#6B4FBF)' },
  { key: 'rose',   label: 'Rose',     bg: 'linear-gradient(135deg,#FFB8D4,#FF6B9D)' },
  { key: 'forest', label: 'Forest',   bg: 'linear-gradient(135deg,#B8F5D8,#1A5C3A)' },
]
