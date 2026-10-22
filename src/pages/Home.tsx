import { BADGE_MD } from '../data'
import { translations, useContent, useT } from '../i18n'
import { Link, navigate, useTitle } from '../router'
import { isDeployMinute, nextFriday, useNow } from '../time'
import { useCopy } from '../toast'
import PageHead from '../components/PageHead'

const p = (n: number) => String(n).padStart(2, '0')

// Building heights (% of the hero) for the outlined skyline; the 5th one carries the crane
const SKYLINE = [34, 22, 52, 88, 40, 66, 28, 58, 36]

const PAGES = [
  { to: '/manifesto', art: [30, 55, 40, 80] },
  { to: '/tradutor', art: [70, 70, 35, 35] },
  { to: '/desculpas', art: [25, 45, 65, 85] },
  { to: '/elogios', art: [85, 60, 35, 15] },
  { to: '/commit', art: [90, 20, 60, 40] },
  { to: '/bingo', art: [50, 50, 50, 50] },
  { to: '/certificado', art: [40, 75, 40, 100] },
  { to: '/agente', art: [100, 70, 35, 5] },
]

const T = translations(
  {
    deployNow: 'DEPLOY AGORA',
    go: 'vai, vai, vai',
    relax: 'd : h : m : s · ainda dá pra procrastinar',
    sweat: 'd : h : m : s · começa a suar',
    deadline: 'Entrega oficial · sexta 17:59',
    pages: [
      { k: '{n} axiomas', title: 'O Manifesto', text: 'Os princípios de quem sobe na sexta às 17:59 e dorme tranquilo.' },
      { k: 'RH aprovado', title: 'Tradutor Corporativo', text: 'O que você pensa versus o que você manda no e-mail.' },
      { k: 'Gerador', title: 'Desculpas pra Daily', text: 'Sorteie a desculpa certa pra cada ocasião. Produção caiu? Tem.' },
      { k: 'Gerador', title: 'Elogios Corporativos', text: 'Feedback positivo com a sinceridade de sempre. Começa elogio, termina recado.' },
      { k: 'Gerador', title: 'Mensagem de Commit', text: 'fix: agora vai. Com modo sexta, que já vem com --force.' },
      { k: 'Jogo', title: 'Bingo da Daily', text: 'Marque cada "dá pra ver rapidinho?" e grite bingo no meio da reunião.' },
      { k: 'Oficial', title: 'Certificado', text: 'Comprove que você entrega. No cuzinho, mas entrega. E poste no X.' },
      { k: 'Terminal', title: 'Modo Agente', text: 'Deixa que a IA resolve. Ela resolveu, e ainda pediu desculpas.' },
    ],
    heroTag: 'Obra nº 001 · Metodologia No Cuzinho',
    version: 'v0.0.1-rc-final-agora-vai',
    gloss: '',
    lede: 'A metodologia ágil brasileira pra entregar software no último segundo.',
    cota: 'prazo · sexta 17:59',
    readManifesto: 'Ler o manifesto',
    randomAxiom: 'Axioma aleatório',
    axiomOfDay: 'Axioma do dia',
    seeInManifesto: 'ver no manifesto',
    toolsLabel: 'Ferramentas',
    toolsTitle: 'Tudo pra sobreviver',
    toolsMute: 'até sexta.',
    toolsSub: 'Oito ferramentas testadas em produção. Nenhuma em homologação.',
    badgeTitle: 'Placa da obra',
    badgeMute: 'pro seu README.',
    badgeSub: 'Avise a comunidade que o seu repositório segue a metodologia.',
    copyMarkdown: 'Copiar markdown',
    copied: 'Markdown copiado.',
  },
  {
    deployNow: 'DEPLOY NOW',
    go: 'go, go, go',
    relax: 'd : h : m : s · still time to procrastinate',
    sweat: 'd : h : m : s · start sweating',
    deadline: 'Official ship time · Friday 5:59 PM',
    pages: [
      { k: '{n} axioms', title: 'The Manifesto', text: 'The principles of those who deploy on Friday at 5:59 PM and sleep like a baby.' },
      { k: 'HR approved', title: 'Corporate Translator', text: 'What you think versus what you actually put in the email.' },
      { k: 'Generator', title: 'Standup Excuses', text: 'The right excuse for every occasion. Prod is down? There’s one for that.' },
      { k: 'Generator', title: 'Corporate Compliments', text: 'Positive feedback with our usual sincerity. Starts as praise, ends as a message.' },
      { k: 'Generator', title: 'Commit Message', text: 'fix: should work now. With Friday mode, --force included.' },
      { k: 'Game', title: 'Standup Bingo', text: 'Mark every “got a sec?” and yell bingo mid-meeting.' },
      { k: 'Official', title: 'Certificate', text: 'Prove that you ship. At the last second, but you ship. Then post it on X.' },
      { k: 'Terminal', title: 'Agent Mode', text: 'Let the AI handle it. It handled it, and it apologized too.' },
    ],
    heroTag: 'Build #001 · No Cuzinho Methodology',
    version: 'v0.0.1-rc-final-for-real-this-time',
    gloss: '“No cuzinho” (say it: koo-ZEE-nyo) is Brazilian dev slang for shipping at the very last possible second, by a hair. The literal translation is left as an exercise for the reader.',
    lede: 'The Brazilian agile methodology for shipping software at the very last second.',
    cota: 'deadline · Friday 5:59 PM',
    readManifesto: 'Read the manifesto',
    randomAxiom: 'Random axiom',
    axiomOfDay: 'Axiom of the day',
    seeInManifesto: 'see in the manifesto',
    toolsLabel: 'Tools',
    toolsTitle: 'Everything you need to survive',
    toolsMute: 'until Friday.',
    toolsSub: 'Eight tools tested in production. None in staging.',
    badgeTitle: 'README badge',
    badgeMute: 'for your repo.',
    badgeSub: 'Let the community know your repository follows the methodology.',
    copyMarkdown: 'Copy markdown',
    copied: 'Markdown copied.',
  },
)

function Countdown() {
  const t = useT(T)
  const now = useNow()
  const deployNow = isDeployMinute(now)

  let clock = t.deployNow
  let note = t.go
  if (!deployNow) {
    let s = Math.max(0, Math.floor((nextFriday(now).getTime() - now.getTime()) / 1000))
    const d = Math.floor(s / 86400); s %= 86400
    const h = Math.floor(s / 3600); s %= 3600
    const m = Math.floor(s / 60); s %= 60
    clock = `${p(d)}:${p(h)}:${p(m)}:${p(s)}`
    note = d > 2 ? t.relax : t.sweat
  }

  return (
    <div className="countdown" aria-live="off">
      <span className="label">{t.deadline}</span>
      <span className={deployNow ? 'clock now' : 'clock'}>{clock}</span>
      <span className="label">{note}</span>
    </div>
  )
}

// Same axiom for everyone on the same day
const dayIndex = (count: number) => {
  const d = new Date()
  return (d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate()) % count
}

export default function Home() {
  useTitle()
  const t = useT(T)
  const { AXIOMS } = useContent()
  const copy = useCopy()
  const i = dayIndex(AXIOMS.length)
  const [title, note] = AXIOMS[i]

  const randomAxiom = () => navigate(`/manifesto#a${1 + Math.floor(Math.random() * AXIOMS.length)}`)

  return (
    <>
      <header className="hero">
        <div className="skyline" aria-hidden="true">
          {SKYLINE.map((h, j) => <i key={j} className={j === 4 ? 'crane' : undefined} style={{ height: `${h}%` }} />)}
        </div>
        <div className="wrap">
          <div className="hero-top">
            <span className="label">{t.heroTag}</span>
            <span className="label">{t.version}</span>
          </div>
          <div className="hero-center">
            <h1>cuzinho<span className="tld">.dev</span></h1>
            <p className="lede">{t.lede}</p>
            <div className="cota"><span>{t.cota}</span></div>
            {t.gloss && <p className="gloss">{t.gloss}</p>}
          </div>
          <div className="hero-bottom">
            <Countdown />
            <div className="actions">
              <Link className="btn" to="/manifesto">{t.readManifesto}</Link>
              <button className="btn ghost" type="button" onClick={randomAxiom}>{t.randomAxiom}</button>
            </div>
          </div>
        </div>
      </header>

      <section><div className="wrap">
        <div className="daily">
          <span className="label">{t.axiomOfDay} <span className="num">§{p(i + 1)}</span></span>
          <p>{title}<small>{note}</small></p>
          <Link className="share" to={`/manifesto#a${i + 1}`}>{t.seeInManifesto}</Link>
        </div>
      </div></section>

      <section className="dark"><div className="wrap">
        <PageHead n="01" label={t.toolsLabel} title={t.toolsTitle} mute={t.toolsMute} sub={t.toolsSub} />
        <div className="cards">
          {PAGES.map((pg, j) => (
            <Link key={pg.to} className="card" to={pg.to}>
              <div className="art" aria-hidden="true">{pg.art.map((h, k) => <i key={k} style={{ height: `${h}%` }} />)}</div>
              <div>
                <h3>{t.pages[j].title}</h3>
                <p>{t.pages[j].text}</p>
              </div>
              <div className="foot"><span>{t.pages[j].k.replace('{n}', String(AXIOMS.length))}</span><span>{p(j + 1)} <span className="x">→</span></span></div>
            </Link>
          ))}
        </div>
      </div></section>

      <section><div className="wrap">
        <PageHead n="02" label="Badge" title={t.badgeTitle} mute={t.badgeMute} sub={t.badgeSub} />
        <div className="badge-row">
          <div className="shield" aria-label="deploy: no cuzinho"><span>deploy</span><span>no cuzinho</span></div>
          <pre>{BADGE_MD}</pre>
          <button className="btn ghost" type="button" onClick={() => copy(BADGE_MD, t.copied)}>{t.copyMarkdown}</button>
        </div>
      </div></section>
    </>
  )
}