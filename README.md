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

Use o painel para publicar imagens JPG, PNG ou WebP de até 5 MB por arquivo. Para usar o Cloudflare R2, preencha as variáveis `R2_*` em `backend/.env`. O modelo está em `backend/.env.example`. Com as variáveis vazias, o ambiente local guarda os arquivos em `uploads`.

## Deploy no Render

1. Crie um bucket `hardfit-images` no Cloudflare R2. Crie uma chave da API S3 com leitura e gravação restritas a esse bucket. Configure a URL pública de leitura para as imagens do site.
2. Crie ou selecione um banco PostgreSQL. Use os dados da conexão para montar `jdbc:postgresql://HOST:PORTA/BANCO`. Para conexão externa, use as opções SSL indicadas pelo provedor.
3. No Render, conecte este repositório em **New → Blueprint**. O `render.yaml` configura um único serviço Docker para a landing page, o painel e a API.
4. Preencha as variáveis solicitadas diretamente no Render.

| Variável | Valor |
| --- | --- |
| `SPRING_DATASOURCE_URL` | URL JDBC do PostgreSQL |
| `SPRING_DATASOURCE_USERNAME` | Usuário do PostgreSQL |
| `SPRING_DATASOURCE_PASSWORD` | Senha do PostgreSQL |
| `R2_ENDPOINT` | Endpoint S3 exibido no Cloudflare R2 |
| `R2_ACCESS_KEY_ID` | Access Key ID da chave S3 |
| `R2_SECRET_ACCESS_KEY` | Secret Access Key da chave S3 |
| `R2_PUBLIC_BASE_URL` | URL pública de leitura do bucket |
| `HARDFIT_ADMIN_PASSWORD` | Senha escolhida para o painel publicado |

O usuário padrão no Render é `admin`. Após o deploy, use `/` para a landing page, `/admin` para o painel e `/api/site-content` para verificar a API. Se quiser configurar contatos no build, adicione `VITE_INSTAGRAM_URL` e `VITE_WHATSAPP_URL` ao serviço. O link da Hotmart pode ser publicado pelo painel.

O deploy usa um banco remoto. Para levar fotos locais ao ambiente publicado, envie os arquivos novamente pelo painel desse ambiente.
