# Story 1.2: Módulo de Clientes Integrado

## Status: Ready for Dev

## Story

**Como** administrador do petshop,
**Quero** que a página `/admin/clientes` consuma a API real com CRUD completo (clientes e pets),
**Para que** eu possa gerenciar tutores e seus pets em produção com dados reais.

## Acceptance Criteria

- [ ] Axios envia `x-tenant-id` automaticamente em todos os requests protegidos
- [ ] `GET /api/customers` lista clientes do tenant corretamente
- [ ] `POST /api/customers` cria novo cliente (CustomerModal)
- [ ] `PATCH /api/customers/:id` edita cliente (CustomerModal)
- [ ] `DELETE /api/customers/:id` exclui cliente + cascade pets/agendamentos
- [ ] `POST /api/customers/:id/pets` adiciona pet (PetModal)
- [ ] `PATCH /api/pets/:petId` edita pet (PetModal)
- [ ] `DELETE /api/pets/:petId` exclui pet + cascade agendamentos
- [ ] Busca por nome/telefone funciona em tempo real (`q` query param)
- [ ] Estado de loading e erro tratados visualmente em todos os casos

## Dev Notes

- **Problema central**: o frontend usa `axios` sem o header `x-tenant-id`. Criar um `apiClient` centralizado (`frontend/src/lib/apiClient.ts`) com interceptor que injeta o header automaticamente via `TenantContext`.
- `TenantContext` carrega `/api/config` (rota pública — sem header necessário) e expõe `config.id` como `tenantId`
- A página `clientes/page.tsx` usa `tenantId` via `useTenant()` — o interceptor deve pegá-lo do mesmo lugar
- `CustomerModal` envia `tenant_id` no body ao criar — após o middleware isso é redundante mas não causa erro; o header é o que importa
- Rotas de pets: `POST /api/customers/:id/pets`, `PATCH /api/pets/:petId`, `DELETE /api/pets/:petId`

## Tasks

- [ ] 1. Criar `frontend/src/lib/apiClient.ts` com axios + interceptor de `x-tenant-id`
- [ ] 2. Refatorar `TenantContext.tsx` para exportar `tenantId` e configurar o interceptor
- [ ] 3. Atualizar `clientes/page.tsx` para usar `apiClient` em vez de `axios` direto
- [ ] 4. Atualizar `CustomerModal.tsx` para usar `apiClient`
- [ ] 5. Atualizar `PetModal.tsx` para usar `apiClient`
- [ ] 6. Verificar `AppointmentModal.tsx` — atualizar se necessário
- [ ] 7. Teste manual em produção: todos os CRUDs de clientes e pets

## Dev Agent Record

### Agent Model Used: N/A

### Completion Notes: N/A

### File List

- frontend/src/lib/apiClient.ts [NEW]
- frontend/src/context/TenantContext.tsx [MODIFY]
- frontend/src/app/admin/clientes/page.tsx [MODIFY]
- frontend/src/components/CustomerModal.tsx [MODIFY]
- frontend/src/components/PetModal.tsx [MODIFY]
- frontend/src/components/AppointmentModal.tsx [MODIFY if needed]
