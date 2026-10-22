import { useSyncExternalStore } from 'react'
import * as pt from './data'
import * as en from './data.en'

export type Lang = 'pt' | 'en'

export const LANGS: { id: Lang; label: string; name: string }[] = [
  { id: 'pt', label: 'PT', name: 'Português' },
  { id: 'en', label: 'EN', name: 'English' },
]

const STORAGE_KEY = 'mnc-lang'
const isLang = (v: unknown): v is Lang => v === 'pt' || v === 'en'

// ?lang=en wins (shared links), then the last choice, then Portuguese: the site is Brazilian first
function initial(): Lang {
  const q = new URLSearchParams(location.search).get('lang')
  if (isLang(q)) {
    try { localStorage.setItem(STORAGE_KEY, q) } catch { /* storage blocked */ }
    return q
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isLang(saved)) return saved
  } catch { /* storage blocked */ }
  return 'pt'
}

let current = initial()
const listeners = new Set<() => void>()
const syncHtml = () => { document.documentElement.lang = current === 'en' ? 'en' : 'pt-BR' }
syncHtml()

export const getLang = () => current

export function setLang(lang: Lang) {
  if (lang === current) return
  current = lang
  try { localStorage.setItem(STORAGE_KEY, lang) } catch { /* storage blocked */ }
  syncHtml()
  listeners.forEach(l => l())
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => { listeners.delete(cb) }
}

export const useLang = () => useSyncExternalStore(subscribe, getLang)

// data.en.ts mirrors data.ts item by item, so axiom anchors (#a5) and saved bingo boards work in both languages
type Content = Pick<typeof pt, 'AXIOMS' | 'DICT' | 'EXCUSE_TAGS' | 'EXCUSES' | 'COMPLIMENT_TAGS' | 'COMPLIMENTS' | 'COMMITS' | 'BINGO' | 'AGENT'> & { BINGO_FREE: string }
const CONTENT: Record<Lang, Content> = { pt, en }

export const useContent = () => CONTENT[useLang()]

// UI copy that lives next to its page: the English object must have the same shape as the Portuguese one
export const translations = <T,>(pt: T, en: NoInfer<T>): Record<Lang, T> => ({ pt, en })

export const useT = <T,>(dict: Record<Lang, T>) => dict[useLang()]
