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

Crie uma [chave da API no Brevo](https://app.brevo.com/settings/keys/api) e configure um [remetente verificado](https://developers.brevo.com/docs/getting-started-with-senders-and-domains). Preencha as três variáveis em `backend/.env` para testar localmente ou em **Environment** no serviço do Render.

| Variável | Valor |
| --- | --- |
| `BREVO_API_KEY` | Chave da API do Brevo |
| `BREVO_SENDER_EMAIL` | Endereço do remetente verificado no Brevo |
| `HARDFIT_CONTACT_EMAIL` | Caixa da equipe que recebe os avisos |

Após gravar o pedido, a API envia um aviso à equipe pelo Brevo via HTTPS. O endereço informado no formulário vai no `Reply-To`. O pedido permanece no banco se o envio falhar. A falha é registrada nos logs e o envio seguinte acontece quando chega um novo pedido.

Com as variáveis vazias, o formulário continua salvando os pedidos e os avisos ficam desativados.

## Consultar pedidos

Conecte-se ao banco pelo cliente SQL de sua preferência. Para usar o PostgreSQL local pelo Compose, rode este comando na raiz:

```bash
docker compose exec postgres psql -U hardfit -d hardfit \
  -c 'SELECT name, email, message, created_at FROM contact_requests ORDER BY created_at DESC;'
```

Para rodar os testes da API, execute `mvn test` na pasta `backend`.
