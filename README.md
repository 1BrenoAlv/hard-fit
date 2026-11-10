# HardFit Club

Landing page da mentoria de musculação HardFit Club.

## Tecnologias

React, Vite, Tailwind CSS 4 e Lucide React. Tipografia Roboto Slab, com serifa, títulos fortes e paleta verde-escura com verde-lima. A fonte é carregada pelo Google Fonts, com fallback local.

## Executar

```bash
npm install
npm run dev
```

A API Java e o banco PostgreSQL têm instruções em [backend/README.md](backend/README.md).

Com a API em execução na porta 8080, abra [`/admin`](http://localhost:5173/admin) no endereço do Vite. Entre com as credenciais definidas em `backend/.env`. O painel publica o link da Hotmart e recebe arquivos de imagem do seu dispositivo para o banner, o carrossel e os comparativos de antes e depois.

Durante o desenvolvimento, o Vite encaminha `/api` para `http://localhost:8080`. Use `HARDFIT_API_URL` ao iniciar o Vite se a API estiver em outra porta. No deploy, o Spring serve o React e a API no mesmo endereço.

## Gerar a versão de produção

```bash
npm run build
npm run preview
```

## Fluxo da mentoria

O visitante pode iniciar a conversa no Instagram, no WhatsApp ou pelo botão de contato do site. A página de compra, as aulas e a comunidade ficam na Hotmart. Os profissionais da HardFit participam do fórum para responder às dúvidas dos alunos.

Copie `.env.example` para `.env.local` e preencha com os endereços oficiais:

- `VITE_INSTAGRAM_URL`: perfil ou link de contato do Instagram da HardFit.
- `VITE_WHATSAPP_URL`: link de conversa do WhatsApp da HardFit.
- `VITE_HOTMART_CHECKOUT_URL`: link padrão para compra na Hotmart. O link publicado no painel tem prioridade.

As opções aparecem quando os links correspondentes estão configurados. Reinicie o servidor local após editar o arquivo. Para hospedar a página, configure as mesmas variáveis no ambiente de build e gere um novo deploy. O acesso à comunidade precisa estar configurado no produto da Hotmart.

## Imagens

Use o painel para publicar imagens JPG, PNG ou WebP de até 5 MB por arquivo. Localmente, a API guarda os arquivos em `uploads`. No deploy pelo Blueprint, as novas imagens ficam no Supabase Storage.

## Deploy no Render

1. Crie ou selecione um projeto no Supabase. Em **Storage**, crie um bucket público chamado `hardfit-images` para as imagens publicadas no site.
2. Em **Connect**, copie os dados do **Session pooler**. Use o host e a porta exibidos para montar `jdbc:postgresql://HOST:PORTA/postgres?sslmode=require`. Copie o usuário do pooler exatamente como aparece.
3. No Render, conecte este repositório em **New → Blueprint**. O `render.yaml` configura um único serviço Docker para a landing page, o painel e a API.
4. Preencha as variáveis solicitadas diretamente no Render.

| Variável | Valor |
| --- | --- |
| `SPRING_DATASOURCE_URL` | URL JDBC do Session pooler |
| `SPRING_DATASOURCE_USERNAME` | Usuário do Session pooler |
| `SPRING_DATASOURCE_PASSWORD` | Senha do banco do Supabase |
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave legada `service_role`, exclusiva do servidor |
| `HARDFIT_ADMIN_PASSWORD` | Senha escolhida para o painel publicado |

O usuário padrão no Render é `admin`. Após o deploy, use `/` para a landing page, `/admin` para o painel e `/api/site-content` para verificar a API. Se quiser configurar contatos no build, adicione `VITE_INSTAGRAM_URL` e `VITE_WHATSAPP_URL` ao serviço. O link da Hotmart pode ser publicado pelo painel.

O deploy usa um banco remoto. Para levar fotos locais ao ambiente publicado, envie os arquivos novamente pelo painel desse ambiente.
