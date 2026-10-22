# cuzinho.dev

> A metodologia ágil brasileira pra entregar software no último segundo.

[![deploy: no cuzinho](https://img.shields.io/badge/deploy-no%20cuzinho-d6331f)](https://cuzinho.dev)

**[cuzinho.dev](https://cuzinho.dev)** é o site oficial da **Metodologia No Cuzinho**: um manifesto e um kit de sobrevivência pra quem sobe na sexta às 17:59 e dorme tranquilo.

Tem versão em inglês também (seletor **PT / EN** na navbar ou `?lang=en`), porque gringo também entrega no cuzinho. Ele só não sabe que tem nome.

## O que tem lá

| Página | Rota | O que faz |
|---|---|---|
| **Manifesto** | `/manifesto` | Os axiomas da metodologia. Cada um tem link próprio (`/manifesto#a5`) pra mandar no grupo certo. |
| **Tradutor Corporativo** | `/tradutor` | O que você pensa × o que você manda no e-mail. |
| **Desculpas pra Daily** | `/desculpas` | Gerador de desculpas com filtro: daily, produção caiu, estourou o prazo. |
| **Elogios Corporativos** | `/elogios` | Feedback positivo com a sinceridade de sempre. Começa elogio, termina recado. |
| **Mensagem de Commit** | `/commit` | `fix: agora vai`. Com modo sexta, que já vem com `--force`. |
| **Bingo da Daily** | `/bingo` | Cartela 5×5 pra marcar durante a reunião. Fica salva no navegador. |
| **Certificado** | `/certificado` | Certificado oficial de quem entrega no cuzinho, com imagem pra postar no X. |
| **Modo Agente** | `/agente` | Sessões de agente de IA apagando banco, dando `--force` na main e pedindo desculpas. Cada uma tem link próprio (`/agente#s4`). |

A home ainda tem o contador regressivo pra sexta 17:59 e o axioma do dia, que é o mesmo pra todo mundo.

## Coloque a placa no seu README

Se o seu repositório segue a metodologia, avise a comunidade:

```md
[![deploy: no cuzinho](https://img.shields.io/badge/deploy-no%20cuzinho-d6331f)](https://cuzinho.dev)
```

## Rodando localmente

Precisa de Node 22 (tem `.nvmrc`).

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # tsc + vite, gera o dist/
npm run preview   # serve o dist/ local
```

Não tem testes. Seguindo o axioma 3, o usuário final é a melhor suíte de testes já criada, e ainda é de graça. Mas rode o `npm run build` antes de abrir PR, porque o TypeScript pega muita coisa.

## Contribuindo

PRs são bem-vindos. Sem review, claro. O jeito mais fácil de contribuir é com piada nova.

### Adicionando conteúdo

Todo o conteúdo fica em dois arquivos:

- [`src/data.ts`](src/data.ts): português
- [`src/data.en.ts`](src/data.en.ts): inglês

**Regra de ouro:** os dois arquivos são espelhos. Cada lista tem que ter **a mesma quantidade de itens, na mesma ordem**. É isso que faz `/manifesto#a5` apontar pro mesmo axioma nas duas línguas e a cartela do bingo trocar de idioma sem perder as marcações.

Então, se adicionar um axioma no fim de `AXIOMS` em `data.ts`, adicione a versão em inglês no fim de `AXIOMS` em `data.en.ts`. Se não souber escrever em inglês, abra o PR mesmo assim e avise na descrição.

| Lista | O que é |
|---|---|
| `AXIOMS` | `[título, nota]` do manifesto |
| `DICT` | `[o que você pensa, o que você escreve]` do tradutor |
| `EXCUSES` | `[desculpa, tag]`, com tag `daily`, `prod` ou `prazo` |
| `COMPLIMENTS` | `[setup, punchline, tag]`, com tag `classico`, `review` ou `feedback` |
| `COMMITS` | mensagens de commit |
| `BINGO` | frases da cartela |
| `AGENT` | `[título, linhas]` das sessões do modo agente; cada linha é `user`, `ai` ou `tool` |

Algumas dicas:

- **Localize, não traduza.** A piada tem que funcionar pra quem nunca sentou numa daily brasileira. "Daily" vira "standup", "fix: pqp" vira "fix: ffs", futebol vira basquete.
- **Não reordene nem remova itens do meio das listas.** Isso quebra links de axiomas já compartilhados e cartelas de bingo salvas. Adicione no fim.
- Contagens como "33 axiomas" saem de `AXIOMS.length`. Não precisa atualizar texto nenhum.

### Adicionando uma página

1. Crie o componente em `src/pages/`, com os textos da interface num `translations(pt, en)` (veja [`Desculpas.tsx`](src/pages/Desculpas.tsx) como modelo).
2. Se a página tiver listas de conteúdo, coloque nos dois `data*.ts` e inclua no tipo `Content` em [`src/i18n.ts`](src/i18n.ts).
3. Registre a rota em `ROUTES` e no menu (`NAV` + `nav` nas duas línguas) em [`src/App.tsx`](src/App.tsx).
4. Adicione o card em `PAGES` e nas duas versões de `pages` em [`src/pages/Home.tsx`](src/pages/Home.tsx).

## Como é feito

React 19 + TypeScript + Vite, sem framework de roteamento nem de i18n: os dois foram feitos na mão, em poucas linhas, em cima de `useSyncExternalStore`.

```
src/
├── App.tsx         # layout, navbar, rotas
├── router.tsx      # roteador mínimo (history API)
├── i18n.ts         # idioma atual: ?lang= → localStorage → PT
├── data.ts         # conteúdo em português
├── data.en.ts      # conteúdo em inglês (espelho do data.ts)
├── share.ts        # links do site, postar no X, sorteio
├── toast.tsx       # copiar pro clipboard + aviso na tela
├── certImage.ts    # gera a imagem do certificado em canvas
├── time.ts         # contador pra sexta 17:59
├── components/     # Logo, PageHead
└── pages/          # uma página por rota
```

## Deploy

O site roda como um [Cloudflare Worker](https://developers.cloudflare.com/workers/static-assets/) servindo os arquivos estáticos do `dist/`. As rotas do cliente (`/manifesto`, `/bingo`…) caem no `index.html` (veja [`wrangler.jsonc`](wrangler.jsonc)).

```sh
npm run deploy
```

De preferência numa sexta, às 17:59.

## Licença

[WTFPL](LICENSE): faça o que você quiser. Ninguém solta o cuzinho de ninguém.
