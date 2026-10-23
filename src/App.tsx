import { useEffect, useLayoutEffect, useState, type ComponentType } from 'react'
import { ToastProvider } from './toast'
import { REPO_URL } from './data'
import { Link, navigate, useLocation } from './router'
import { useDeployMinute } from './time'
import { LANGS, setLang, translations, useLang, useT } from './i18n'
import Logo from './components/Logo'
import Home from './pages/Home'
import Manifesto from './pages/Manifesto'
import Tradutor from './pages/Tradutor'
import Desculpas from './pages/Desculpas'
import Elogios from './pages/Elogios'
import Commit from './pages/Commit'
import Bingo from './pages/Bingo'
import Certificado from './pages/Certificado'
import Patrocine from './pages/Patrocine'
import NotFound from './pages/NotFound'

const ROUTES: Record<string, ComponentType> = {
  '/': Home,
  '/manifesto': Manifesto,
  '/tradutor': Tradutor,
  '/desculpas': Desculpas,
  '/elogios': Elogios,
  '/commit': Commit,
  '/bingo': Bingo,
  '/certificado': Certificado,
  '/patrocine': Patrocine,
}

const NAV = ['/manifesto', '/tradutor', '/desculpas', '/elogios', '/commit', '/bingo', '/certificado']

const T = translations(
  {
    nav: ['Manifesto', 'Tradutor', 'Desculpas', 'Elogios', 'Commit', 'Bingo', 'Certificado'],
    navLabel: 'Principal',
    langLabel: 'Idioma',
    themeLabel: 'Tema',
    lightTheme: 'Errado',
    darkTheme: 'Certo',
    panic: 'Deployando, não mexe',
    status: 'Em obra',
    footer: 'cuzinho.dev · obra iniciada numa sexta às 17:59',
    contribute: 'Contribua via pull request (sem review, claro) ↗',
    sponsor: 'Financie o próximo deploy de sexta',
  },
  {
    nav: ['Manifesto', 'Translator', 'Excuses', 'Compliments', 'Commit', 'Bingo', 'Certificate'],
    navLabel: 'Main',
    langLabel: 'Language',
    themeLabel: 'Theme',
    lightTheme: 'Wrong',
    darkTheme: 'Right',
    panic: 'Deploying, don’t touch',
    status: 'WIP',
    footer: 'cuzinho.dev · construction started on a Friday at 5:59 PM',
    contribute: 'Contribute via pull request (no review, obviously) ↗',
    sponsor: 'Fund the next Friday deploy',
  },
)

function LangSwitch({ label }: { label: string }) {
  const lang = useLang()
  return (
    <div className="lang" role="group" aria-label={label}>
      {LANGS.map(l => (
        <button key={l.id} type="button" lang={l.id === 'en' ? 'en' : 'pt-BR'} title={l.name} aria-pressed={lang === l.id} onClick={() => setLang(l.id)}>{l.label}</button>
      ))}
    </div>
  )
}

type Theme = 'light' | 'dark'

function readTheme(): Theme {
  try {
    return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

function ThemeSwitch({ label, lightLabel, darkLabel }: { label: string; lightLabel: string; darkLabel: string }) {
  const [theme, setTheme] = useState<Theme>(readTheme)

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // Theme still applies for this page view when storage is unavailable.
    }
  }, [theme])

  return (
    <div className="lang" role="group" aria-label={label}>
      <button type="button" aria-pressed={theme === 'light'} onClick={() => setTheme('light')}>{lightLabel}</button>
      <button type="button" aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')}>{darkLabel}</button>
    </div>
  )
}

export default function App() {
  const { path, hash } = useLocation()
  const panic = useDeployMinute()
  const lang = useLang()
  const t = useT(T)

  // Axiom links used to live on the home page (cuzinho.dev/#a5)
  useEffect(() => {
    if (path === '/' && /^#a\d+$/.test(hash)) navigate('/manifesto' + hash, { replace: true })
  }, [path, hash])

  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0)
  }, [path])

  useEffect(() => {
    document.body.classList.toggle('panic', panic)
  }, [panic])

  const Page = ROUTES[path] ?? NotFound

  return (
    <ToastProvider>
      <nav className="site" aria-label={t.navLabel}><div className="wrap">
        <Link className="brand" to="/"><Logo />cuzinho.dev</Link>
        <div className="links">
          {NAV.map((to, i) => <Link key={to} to={to}>{t.nav[i]}</Link>)}
        </div>
        <div className="site-end">
          <span className="status"><span className="dot"></span>{panic ? t.panic : t.status}</span>
          <LangSwitch label={t.langLabel} />
          <ThemeSwitch label={t.themeLabel} lightLabel={t.lightTheme} darkLabel={t.darkTheme} />
        </div>
      </div></nav>

      {/* Remount on language change so pages re-pick their initial excuse, commit and certificate text */}
      <main><Page key={lang} /></main>

      <footer><div className="wrap">
        <span>{t.footer}</span>
        <Link to="/patrocine">{t.sponsor}</Link>
        <a href={REPO_URL} target="_blank" rel="noopener">{t.contribute}</a>
      </div></footer>
    </ToastProvider>
  )
}
