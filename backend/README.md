# API HardFit

API em Java 21 com Spring Boot, Spring JDBC e PostgreSQL. O controller recebe os pedidos, o service organiza as operações e o repository executa o SQL. A API cria as tabelas ao iniciar.

## Rodar localmente

Na raiz do repositório, com o Docker em execução:

```bash
docker compose up -d --wait postgres
cd backend
mvn spring-boot:run
```

Você também pode abrir o `pom.xml` no IntelliJ e executar `HardFitApplication`. O Compose publica o PostgreSQL em `localhost:5433` e guarda os dados em um volume. A API fica em `http://localhost:8080`.

Preencha o arquivo `backend/.env` com `HARDFIT_ADMIN_USERNAME` e `HARDFIT_ADMIN_PASSWORD` e reinicie a API. Se o arquivo estiver ausente, copie `backend/.env.example`. Use valores sem aspas. O arquivo local fica fora do Git.

O usuário padrão é `admin`. Se a senha estiver em branco, o Spring gera uma senha temporária no console. Se você definiu `SPRING_SECURITY_USER_NAME` ou `SPRING_SECURITY_USER_PASSWORD` na configuração do IntelliJ, remova essas variáveis para usar os valores do arquivo.

## Rotas

| Método | Rota | Operação |
| --- | --- | --- |
| GET | `/api/site-content` | Consultar as configurações e a lista pública de evoluções |
| GET | `/api/admin/csrf` | Obter o token para operações administrativas |
| POST | `/api/admin/images` | Enviar um arquivo de imagem |
| GET | `/api/images/{filename}` | Exibir uma imagem enviada |
| PUT | `/api/admin/settings` | Substituir as configurações de links e imagens |
| POST | `/api/admin/evolutions` | Cadastrar uma evolução |
| PUT | `/api/admin/evolutions/{id}` | Editar uma evolução |
| DELETE | `/api/admin/evolutions/{id}` | Remover uma evolução |

O painel React em `/admin` envia a imagem por `multipart/form-data`, no campo `file`. A API aceita JPG, PNG e WebP de até 5 MB e devolve uma URL usada nas configurações ou no comparativo. Sem Supabase configurado, os arquivos ficam em `uploads`. Os cadastros existentes por URL HTTPS continuam válidos.

Cada envio gera um nome novo e as imagens têm cache de um dia. Com `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e `SUPABASE_STORAGE_BUCKET` configurados, os novos arquivos ficam no bucket público do Supabase. A chave de serviço fica no ambiente do Java.

## Swagger

Com a API em execução, abra [Swagger UI](http://localhost:8080/swagger-ui.html). A especificação OpenAPI está em [`/v3/api-docs`](http://localhost:8080/v3/api-docs).

As rotas públicas podem ser testadas pelo Swagger. Para executar operações administrativas com autenticação e CSRF, use o exemplo abaixo.

Para desativar a documentação em outro ambiente, defina `SPRINGDOC_SWAGGER_UI_ENABLED=false` e `SPRINGDOC_API_DOCS_ENABLED=false`.

## Exemplo

```bash
curl -fsS http://localhost:8080/api/site-content
```

Para alterar as configurações, obtenha um token CSRF e reutilize o cookie de sessão. O curl solicita a senha administrativa. O exemplo usa `jq` para ler o token da resposta.

```bash
hardfit_cookies=$(mktemp)
hardfit_csrf=$(curl -fsS -u admin -c "$hardfit_cookies" http://localhost:8080/api/admin/csrf)
hardfit_header=$(printf '%s' "$hardfit_csrf" | jq -r '.headerName + ": " + .token')

curl -fsS -u admin -b "$hardfit_cookies" \
  -H "$hardfit_header" -H 'Content-Type: application/json' \
  -X PUT http://localhost:8080/api/admin/settings \
  -d '{"hotmartUrl":"https://pay.hotmart.com/EXEMPLO","heroImageUrl":null,"fatLossImageUrl":null,"strengthImageUrl":null,"consistencyImageUrl":null}'

rm "$hardfit_cookies"
```

O `PUT` de configurações substitui todos os campos. Use `null` quando quiser deixar uma imagem ou o link sem configuração. Para cadastrar uma evolução, envie `title`, `beforeImageUrl` e `afterImageUrl` em JSON.

Para outro ambiente, configure `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `HARDFIT_ADMIN_USERNAME` e `HARDFIT_ADMIN_PASSWORD`.

## Testes de segurança

Na pasta `backend`, rode `mvn test`. O MockMvc exercita as rotas e os filtros reais de segurança com um serviço simulado, então esses testes dispensam o PostgreSQL.
