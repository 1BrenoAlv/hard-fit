# API HardFit

API em Java 21 com Spring Boot, Spring JDBC e PostgreSQL. Um controller valida os dados do formulário e registra o pedido de contato. O Spring executa `schema.sql` na inicialização para criar a tabela `contact_requests`.

## Rodar localmente

Na raiz do repositório, com o Docker em execução:

```bash
docker compose up -d --wait postgres
cd backend
mvn spring-boot:run
```

A API fica em `http://localhost:8080`. O PostgreSQL do Compose usa a porta local `5433`. Para personalizar a conexão, use `.env.example` como modelo para `backend/.env`.

## Enviar um pedido

`POST /api/contact-requests` recebe JSON com `name` e `email` obrigatórios e `message` opcional. A API retorna `201 Created` depois de salvar e `400 Bad Request` para campos inválidos.

```bash
curl -i http://localhost:8080/api/contact-requests \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ana","email":"ana@example.com","message":"Quero saber mais sobre a mentoria."}'
```

A documentação local está no [Swagger UI](http://localhost:8080/swagger-ui.html).

## Aviso por e-mail

Crie uma [chave da API no SendGrid](https://app.sendgrid.com/settings/api_keys) com permissão **Mail Send** e configure um [remetente verificado](https://www.twilio.com/docs/sendgrid/for-developers/sending-email/sender-identity). Preencha as variáveis em `backend/.env` para testar localmente ou em **Environment** no serviço do Render.

| Variável | Valor |
| --- | --- |
| `SENDGRID_API_KEY` | Chave da API do SendGrid |
| `SENDGRID_SENDER_EMAIL` | Endereço do remetente verificado no SendGrid |
| `HARDFIT_CONTACT_EMAIL` | Caixa da equipe que recebe os avisos internos. Opcional |

Após gravar o pedido, a API envia uma confirmação de cadastro ao visitante. O modelo em `src/main/resources/email/launch-confirmation.html` inclui o nome, a logo da HardFit e o aviso de lançamento da mentoria. Se a caixa da equipe estiver configurada, ela recebe um aviso separado com o endereço do visitante no `Reply-To`.

O formulário continua salvando os pedidos se faltar a chave ou o remetente ou se o envio falhar. As falhas de envio ficam registradas nos logs.

## Consultar pedidos

Conecte-se ao banco pelo cliente SQL de sua preferência. Para usar o PostgreSQL local pelo Compose, rode este comando na raiz:

```bash
docker compose exec postgres psql -U hardfit -d hardfit \
  -c 'SELECT name, email, message, created_at FROM contact_requests ORDER BY created_at DESC;'
```

Para rodar os testes da API, execute `mvn test` na pasta `backend`.
