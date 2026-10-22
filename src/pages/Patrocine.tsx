import { useState } from 'react'
import { DONATE, PIX_TIERS } from '../data'
import { translations, useLang, useT } from '../i18n'
import { pixPayload } from '../pix'
import { useTitle } from '../router'
import { useCopy } from '../toast'
import PageHead from '../components/PageHead'
import QR from '../components/QR'

type Method = 'pix' | 'lightning' | 'onchain' | 'kofi'

// Methods without config in DONATE don't show up
const METHODS = (['pix', 'lightning', 'onchain', 'kofi'] as const).filter(m =>
  m === 'pix' ? DONATE.pixKey && DONATE.pixName && DONATE.pixCity : DONATE[m])

const T = translations(
  {
    title: 'Patrocine o Deploy',
    label: 'Patrocínio',
    aside: 'Sem nota fiscal',
    head: 'Financie o próximo deploy de sexta,',
    mute: 'sem nota fiscal, igual o resto.',
    sub: 'O site é de graça, o domínio não. Se alguma piada daqui já salvou sua daily, paga um café pro plantão.',
    methodsLabel: 'Forma de pagamento',
    methods: { pix: 'Pix', lightning: 'Lightning', onchain: 'Bitcoin on-chain', kofi: 'Ko-fi' } as Record<Method, string>,
    tiers: ['Um café pro plantão', 'Patrocina um deploy de sexta', 'Paga o rollback', 'Hotfix permanente'],
    anyAmount: 'Quanto o coração mandar',
    free: 'Valor livre',
    pixHint: 'Escaneia no app do banco ou copia o código abaixo. O nome que aparece é o do dono da obra.',
    lightningHint: 'Oferta BOLT12: precisa de carteira que suporte, como a Phoenix. O valor fica por sua conta.',
    onchainHint: 'Endereço on-chain. Pra valor pequeno, a taxa da rede pode sair mais cara que o café: prefira Lightning.',
    kofiHint: 'Pra quem tá fora do Brasil: cartão ou PayPal, sem precisar criar conta.',
    copy: 'Copiar código',
    copyAddress: 'Copiar endereço',
    openKofi: 'Abrir o Ko-fi',
    copied: 'Copiado. O plantão agradece.',
    qr: (m: string) => `QR code pra pagar com ${m}`,
    empty: 'A obra ainda não abriu o caixa. Volte na sexta, às 17:59.',
  },
  {
    title: 'Sponsor the Deploy',
    label: 'Sponsor',
    aside: 'No invoice',
    head: 'Fund the next Friday deploy,',
    mute: 'no invoice, just like everything else.',
    sub: 'The site is free. The domain isn’t. If a joke here ever saved your standup, buy the on-call dev a coffee.',
    methodsLabel: 'Payment method',
    methods: { pix: 'Pix (Brazil)', lightning: 'Lightning', onchain: 'Bitcoin on-chain', kofi: 'Ko-fi' } as Record<Method, string>,
    tiers: ['A coffee for on-call', 'Sponsors a Friday deploy', 'Pays for the rollback', 'Permanent hotfix'],
    anyAmount: 'Whatever feels right',
    free: 'Any amount',
    pixHint: 'Pix is Brazil’s instant payment system. Scan it in your banking app or copy the code below.',
    lightningHint: 'BOLT12 offer: needs a wallet that supports it, like Phoenix. You pick the amount.',
    onchainHint: 'On-chain address. For small amounts the network fee may cost more than the coffee: Lightning is better.',
    kofiHint: 'Card or PayPal, no account needed.',
    copy: 'Copy code',
    copyAddress: 'Copy address',
    openKofi: 'Open Ko-fi',
    copied: 'Copied. On-call thanks you.',
    qr: (m: string) => `QR code to pay with ${m}`,
    empty: 'The tip jar isn’t open yet. Come back Friday at 5:59 PM.',
  },
)

const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Patrocine() {
  const t = useT(T)
  const lang = useLang()
  useTitle(t.title)
  const copy = useCopy()
  // Gringos get Ko-fi first, Brazilians get Pix
  const [method, setMethod] = useState<Method | undefined>(() => (lang === 'en' && METHODS.find(m => m === 'kofi')) || METHODS[0])
  const [amount, setAmount] = useState<number | undefined>(17.59)

  const head = <PageHead n="09" label={t.label} aside={t.aside} title={t.head} mute={t.mute} sub={t.sub} />

  if (!method) return <section><div className="wrap">{head}<p className="sub">{t.empty}</p></div></section>

  const code =
    method === 'pix' ? pixPayload({ key: DONATE.pixKey, name: DONATE.pixName, city: DONATE.pixCity, amount })
    : method === 'lightning' ? DONATE.lightning
    : method === 'onchain' ? DONATE.onchain
    : `https://ko-fi.com/${DONATE.kofi}`
  // URI schemes so wallets open straight from the QR
  const qrValue = method === 'lightning' ? `lightning:${code}` : method === 'onchain' ? `bitcoin:${code}` : code

  return (
    <section><div className="wrap">
      {head}

      {METHODS.length > 1 && (
        <div className="chips" role="group" aria-label={t.methodsLabel}>
          {METHODS.map(m => (
            <button key={m} className="chip" type="button" aria-pressed={method === m} onClick={() => setMethod(m)}>{t.methods[m]}</button>
          ))}
        </div>
      )}

      <div className="gen">
        <div className="gen-top">
          <span className="label"><span className="num">●</span> {t.methods[method]}</span>
          <span className="label">{method === 'pix' ? (amount ? brl(amount) : t.free) : t.free}</span>
        </div>
        <div className="gen-body donate">
          {method === 'kofi' ? null : <QR value={qrValue} label={t.qr(t.methods[method])} />}
          <div className="donate-info" style={method === 'kofi' ? { gridColumn: '1 / -1' } : undefined}>
            {method === 'pix' && (
              <div className="tiers" role="group" aria-label={t.methods.pix}>
                {PIX_TIERS.map((v, i) => (
                  <button key={v} className="tier" type="button" aria-pressed={amount === v} onClick={() => setAmount(v)}>
                    <b>{brl(v)}</b><span>{t.tiers[i]}</span>
                  </button>
                ))}
                <button className="tier" type="button" aria-pressed={amount === undefined} onClick={() => setAmount(undefined)}>
                  <b>{t.free}</b><span>{t.anyAmount}</span>
                </button>
              </div>
            )}
            <p>{t[`${method}Hint`]}</p>
            {method !== 'kofi' && <pre className="term">{code}</pre>}
            <div className="actions">
              {method === 'kofi'
                ? <a className="btn" href={code} target="_blank" rel="noopener">{t.openKofi}</a>
                : <button className="btn" type="button" onClick={() => copy(code, t.copied)}>{method === 'pix' ? t.copy : t.copyAddress}</button>}
            </div>
          </div>
        </div>
      </div>
    </div></section>
  )
}
