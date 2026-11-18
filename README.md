# HardFit Club

Landing page da mentoria de musculação HardFit Club. O site em React apresenta a mentoria e recebe pedidos de contato pelo botão **Falar com a HardFit**.

## Rodar localmente

Na raiz do projeto, com o Docker em execução:

```bash
docker compose up -d --wait postgres
```

Em um terminal, inicie a API:

```bash
cd backend
mvn spring-boot:run
```

Em outro terminal, na raiz, inicie o site:

```bash
npm ci
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173). O Vite encaminha `/api` para `http://localhost:8080`. Para usar outra porta na API, defina `HARDFIT_API_URL` ao iniciar o Vite.

O perfil [@hardfit.club](https://www.instagram.com/hardfit.club/) aparece no formulário e no rodapé. Para adicionar o WhatsApp ao formulário, crie um `.env.local` na raiz e defina `VITE_WHATSAPP_URL`.

## Consultar pedidos

O formulário coleta nome, e-mail e uma mensagem opcional. Os pedidos ficam na tabela `contact_requests`. Veja como testar a API e consultar os registros no [README do backend](backend/README.md).

## Deploy no Render

O `render.yaml` configura um serviço Docker que hospeda o site e a API no mesmo endereço.

1. Crie ou reutilize um PostgreSQL na mesma região do serviço.
2. Conecte o repositório ao Render em **New → Blueprint** ou atualize o Blueprint existente.
3. Configure as variáveis abaixo no serviço. O Spring cria a tabela de pedidos na inicialização.

| Variável | Valor |
| --- | --- |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://HOST:PORTA/BANCO` |
| `SPRING_DATASOURCE_USERNAME` | Usuário do PostgreSQL |
| `SPRING_DATASOURCE_PASSWORD` | Senha do PostgreSQL |

Os pedidos ficam disponíveis na tabela `contact_requests`. Para ativar a confirmação de cadastro por e-mail, siga a [configuração do EmailJS](backend/README.md#aviso-por-e-mail) e adicione as variáveis em **Environment** no serviço.

## Frontend na Vercel

Se a página for publicada separadamente na Vercel, adicione `HARDFIT_API_URL` nas variáveis de ambiente de **Production** do projeto da Vercel antes de publicar. Use a URL pública HTTPS do serviço web do Render, como `https://seu-servico.onrender.com`, sem `/api` no final. Faça um novo deploy na Vercel para aplicar a regra que encaminha `/api/contact-requests` ao backend.
