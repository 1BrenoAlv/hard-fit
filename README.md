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

Os links de WhatsApp e Instagram são opcionais. Para exibi-los no formulário, copie `.env.example` para `.env.local` e preencha `VITE_WHATSAPP_URL` e `VITE_INSTAGRAM_URL`.

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

Para receber um aviso por e-mail a cada pedido, configure as [variáveis do Brevo](backend/README.md#aviso-por-e-mail) em **Environment** no serviço.
