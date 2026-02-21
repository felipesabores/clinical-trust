# 🚀 Clinical Trust - Guia de Deploy (Dokploy)

Para garantir o sucesso sem erros, siga esta ordem exata no seu painel Dokploy.

---

## 1. Banco de Dados (PostgreSQL)
*   No Dokploy, crie um **Database** -> **PostgreSQL**.
*   **Nome**: `ct-db`
*   **Ação**: Após criado, vá na aba **Connection** e copie a **Internal Connection String**.
    *   Exemplo: `postgres://user:password@ct-db:5432/db`

---

## 2. Backend (Build & API)
*   Crie uma **Application**.
*   **Nome**: `ct-backend`
*   **Source**: Seu repositório Git.
*   **Root Directory**: `backend` (Importante!)
*   **Environment Variables**:
    *   `DATABASE_URL`: (Cole a string que você copiou no passo 1)
    *   `PORT`: `3001`
    *   `NEXT_PUBLIC_TENANT_ID`: `test-tenant-123`
*   **Build Settings**:
    *   **Build Type**: `Docker` (O Dokploy usará o `backend/Dockerfile` que eu preparei)
*   **Deploy**: Clique em Deploy.
*   **Ação**: Copie a URL provisória gerada (ex: `http://api.clinical-trust.dokploy.com`).

---

## 3. Frontend (Next.js)
*   Crie outra **Application**.
*   **Nome**: `ct-frontend`
*   **Source**: Mesmo repositório Git.
*   **Root Directory**: `frontend`
*   **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: (Cole a URL do Backend do passo anterior)
    *   `NEXT_PUBLIC_TENANT_ID`: `test-tenant-123`
*   **Build Settings**:
    *   **Build Type**: `Docker` (O Dokploy usará o `frontend/Dockerfile` que eu preparei)
*   **Deploy**: Clique em Deploy.

---

## 💡 Alternativa "Tudo em Um" (Docker Compose)
Se você preferir rodar tudo em um único serviço (mais simples ainda):
1.  No Dokploy, crie um serviço do tipo **Compose**.
2.  Aponte para o repositório Git.
3.  O Dokploy lerá o arquivo `docker-compose.yml` que eu atualizei.
4.  **Atenção**: Você precisará definir as variáveis de ambiente no painel do Compose no Dokploy:
    *   `NEXT_PUBLIC_API_URL`: A URL final que o Dokploy dará ao seu serviço frontend.

---

## ✅ Verificação Final
Acesse a URL do frontend. O sistema deve carregar os dados do backend automaticamente.
Se o PetModal falhar ao abrir, recarregue a página (o Next.js às vezes precisa de um refresh no primeiro deploy).
