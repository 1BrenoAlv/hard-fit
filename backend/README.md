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

1. No [painel do EmailJS](https://dashboard.emailjs.com/), abra **Email Services**, clique em **Add New Service**, selecione **Gmail** e conecte a conta da HardFit. Copie o **Service ID**.
2. Em **Email Templates**, crie o modelo de confirmação. Use `{{clientEmail}}` em **To Email**, **HardFit Club** em **From Name** e **Cadastro confirmado na HardFit** em **Subject**. Use o remetente padrão, que é a conta Gmail conectada. No editor de código HTML, cole o conteúdo de [launch-confirmation.html](src/main/resources/email/launch-confirmation.html). Salve e copie o **Template ID**.
3. Em **Account**, copie a **Public Key** e a **Private Key**. Em **Account → Security**, permita requisições da API para aplicações fora do navegador. Se a opção de exigir a chave privada estiver disponível, ative-a.
4. Configure as variáveis em **Environment** no serviço do Render. Para rodar localmente, use `backend/.env`. Guarde a chave privada somente no backend.

| Variável | Valor |
| --- | --- |
| `EMAILJS_SERVICE_ID` | ID do serviço Gmail |
| `EMAILJS_TEMPLATE_ID` | ID do template de confirmação |
| `EMAILJS_PUBLIC_KEY` | Chave pública da conta |
| `EMAILJS_PRIVATE_KEY` | Chave privada da conta |

O modelo inclui o nome, a logo da HardFit e o aviso de lançamento da mentoria. A logo usa um endereço HTTPS público. Publique o site com a imagem ou, se usar outro endereço para o site, ajuste a URL da imagem no HTML do EmailJS.

Para receber também um aviso interno, crie um segundo template com o e-mail fixo da equipe em **To Email** e `{{clientEmail}}` em **Reply To**. No corpo, use `{{clientName}}`, `{{clientEmail}}` e `{{message}}`. Em **Auto-Reply** do template de confirmação, vincule o segundo modelo. Cada aviso interno consome um envio adicional no plano.

Depois do deploy, envie o formulário com um e-mail seu e confira a caixa de entrada e o histórico de envios do EmailJS. A API grava o pedido antes de tentar o envio. Se a configuração estiver incompleta ou o provedor recusar a mensagem, o pedido continua salvo. Os logs do backend registram falhas de envio.

## Consultar pedidos

Conecte-se ao banco pelo cliente SQL de sua preferência. Para usar o PostgreSQL local pelo Compose, rode este comando na raiz:

```bash
docker compose exec postgres psql -U hardfit -d hardfit \
  -c 'SELECT name, email, message, created_at FROM contact_requests ORDER BY created_at DESC;'
```

Para rodar os testes da API, execute `mvn test` na pasta `backend`.
