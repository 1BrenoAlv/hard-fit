# HardFit Club

Landing page da mentoria de musculação HardFit Club.

## Tecnologias

React, Vite, Tailwind CSS 4 e Lucide React. Tipografia Roboto Slab, com serifa, títulos fortes e paleta verde-escura com verde-lima. A fonte é carregada pelo Google Fonts, com fallback local.

## Executar

```bash
npm install
npm run dev
```

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
- `VITE_HOTMART_CHECKOUT_URL`: link de compra da mentoria na Hotmart.

As opções aparecem quando os links correspondentes estão configurados. Reinicie o servidor local após editar o arquivo. Para hospedar a página, configure as mesmas variáveis no ambiente de build e gere um novo deploy. O acesso à comunidade precisa estar configurado no produto da Hotmart.

## Imagens

Para exibir a foto de evolução, adicione o arquivo em `public/images/transformation.png`. Enquanto a foto estiver indisponível, a seção mostra uma mensagem sobre progresso no treino. As fotos de academia são do Unsplash e carregam por URL.
