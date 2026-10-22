import { useEffect, useState } from 'react'
import type { AgentLine } from '../data'
import { translations, useContent, useT } from '../i18n'
import { navigate, useTitle } from '../router'
import { pick, postOnX } from '../share'
import { useCopy } from '../toast'
import PageHead from '../components/PageHead'

const T = translations(
  {
    title: 'Modo Agente',
    label: 'Agente',
    aside: (n: number) => `${n} sessões`,
    head: 'Deixa que a IA resolve.',
    mute: 'Ela resolveu.',
    sub: 'Sessões de agentes de código, quase todas baseadas em casos reais.',
    session: (n: number, title: string) => `Sessão ${n} · ${title}`,
    running: 'Executando…',
    done: 'Concluído com sucesso ✅',
    another: 'Outra sessão',
    replay: 'Rodar de novo',
    copy: 'Copiar',
    postOnX: 'Postar no X',
    copied: 'Copiado. Concluído com sucesso ✅',
    postText: (prompt: string) => `Eu: "${prompt}"\nA IA: ✅ Concluído com sucesso.`,
  },
  {
    title: 'Agent Mode',
    label: 'Agent',
    aside: (n: number) => `${n} sessions`,
    head: 'Let the AI handle it.',
    mute: 'It handled it.',
    sub: 'Coding agent sessions, almost all of them based on real incidents.',
    session: (n: number, title: string) => `Session ${n} · ${title}`,
    running: 'Running…',
    done: 'Completed successfully ✅',
    another: 'Another session',
    replay: 'Run it again',
    copy: 'Copy',
    postOnX: 'Post on X',
    copied: 'Copied. Completed successfully ✅',
    postText: (prompt: string) => `Me: “${prompt}”\nThe AI: ✅ Completed successfully.`,
  },
)

// Pause before each kind of line shows up: the agent "thinks" longer than it types
const DELAY: Record<AgentLine[0], number> = { user: 500, tool: 900, ai: 1300 }

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// #s3 opens session 3, so a good one can be sent to the group
const fromHash = (count: number) => {
  const n = Number(/^#s(\d+)$/.exec(location.hash)?.[1])
  return n >= 1 && n <= count ? n - 1 : null
}

const plain = (lines: AgentLine[]) => lines.map(([kind, text, out]) =>
  kind === 'user' ? `> ${text}`
  : kind === 'tool' ? `⏺ ${text}${out ? `\n  ⎿ ${out}` : ''}`
  : `⏺ ${text.replace(/\n/g, '\n  ')}`,
).join('\n\n')

function Line({ line }: { line: AgentLine }) {
  const [kind, text, out] = line
  if (kind === 'user') return <div className="ln user"><span className="p" aria-hidden="true">&gt;</span><span>{text}</span></div>
  if (kind === 'ai') return <div className="ln ai"><span className="bullet" aria-hidden="true" /><span>{text}</span></div>
  const open = text.indexOf('(')
  return (
    <div className="ln tool">
      <span className="bullet" aria-hidden="true" />
      <span>
        <b>{text.slice(0, open)}</b>{text.slice(open)}
        {out && <span className="out"><span aria-hidden="true">⎿ </span>{out}</span>}
      </span>
    </div>
  )
}

export default function Agente() {
  const t = useT(T)
  const { AGENT } = useContent()
  useTitle(t.title)
  const copy = useCopy()
  const [i, setI] = useState(() => fromHash(AGENT.length) ?? AGENT.indexOf(pick(AGENT)))
  const [title, lines] = AGENT[i]
  const [shown, setShown] = useState(() => reducedMotion() ? lines.length : 1)

  useEffect(() => {
    if (shown >= lines.length) return
    const id = window.setTimeout(() => setShown(s => s + 1), DELAY[lines[shown][0]])
    return () => clearTimeout(id)
  }, [shown, lines])

  const run = (n: number) => {
    setI(n)
    setShown(reducedMotion() ? AGENT[n][1].length : 1)
    navigate(`/agente#s${n + 1}`, { replace: true })
  }

  const prompt = lines.find(([kind]) => kind === 'user')?.[1] ?? title
  const finished = shown >= lines.length

  return (
    <section><div className="wrap">
      <PageHead
        n="08" label={t.label} aside={t.aside(AGENT.length)}
        title={t.head} mute={t.mute}
        sub={t.sub}
      />

      <div className="gen">
        <div className="gen-top">
          <span className="label"><span className="num">●</span> {t.session(i + 1, title)}</span>
          <span className="label">{finished ? t.done : t.running}</span>
        </div>
        <div className="gen-body">
          <div className="agent" aria-live="polite">
            {lines.slice(0, shown).map((line, k) => <Line key={`${i}-${k}`} line={line} />)}
            {!finished && <span className="cursor" aria-hidden="true">▍</span>}
          </div>
          <div className="actions">
            <button className="btn" type="button" onClick={() => run(AGENT.indexOf(pick(AGENT, AGENT[i])))}>{t.another}</button>
            <button className="btn ghost" type="button" onClick={() => run(i)}>{t.replay}</button>
            <button className="btn ghost" type="button" onClick={() => copy(plain(lines), t.copied)}>{t.copy}</button>
            <button className="btn ghost" type="button" onClick={() => postOnX(t.postText(prompt), `/agente#s${i + 1}`)}>{t.postOnX}</button>
          </div>
        </div>
      </div>
    </div></section>
  )
}
