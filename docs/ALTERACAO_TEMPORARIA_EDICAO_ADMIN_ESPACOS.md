# Alteração temporária: edição administrativa de espaços

Criada em **01/09/2026** para permitir que administradores corrijam cadastros de
espaços preenchidos incorretamente pelos anfitriões.

## Identificação para busca

Use o texto abaixo para localizar esta alteração no projeto:

`TEMP-ADMIN-EDICAO-ESPACOS-20260901`

## Arquivos pertencentes à alteração

Arquivos criados exclusivamente para esta funcionalidade:

- `src/app/admin/espacos/[id]/editar/page.tsx`
- `src/app/api/admin/espacos/route.ts`
- `supabase/migrations/20260901_admin_edicao_temporaria_espacos.sql`
- `supabase/rollbacks/20260901_remover_admin_edicao_temporaria_espacos.sql`
- `docs/ALTERACAO_TEMPORARIA_EDICAO_ADMIN_ESPACOS.md`

Arquivos existentes que foram modificados:

- `src/app/admin/espacos/page.tsx`: lista, pesquisa e botão de edição.
- `src/app/anfitriao/espacos/[id]/editar/page.tsx`: exporta o formulário
  reutilizável e aceita um caminho de retorno personalizado.

## O que foi adicionado ao banco

A migração cria:

- a função `public.usuario_atual_e_admin()`;
- a política `Administradores podem corrigir espacos` nas tabelas do cadastro;
- a política `Administradores podem gerenciar imagens de espacos` em
  `storage.objects` para o bucket `spaces`.

Nenhuma coluna nem dado de espaço é criado ou removido pela migração.

## Como remover futuramente

1. Aplicar no Supabase o arquivo de rollback:
   `supabase/rollbacks/20260901_remover_admin_edicao_temporaria_espacos.sql`.
2. Remover os arquivos criados exclusivamente para a funcionalidade, exceto
   migrações que já tenham sido aplicadas e façam parte do histórico do projeto.
3. Restaurar `src/app/admin/espacos/page.tsx` para a tela desejada.
4. Em `src/app/anfitriao/espacos/[id]/editar/page.tsx`:
   - voltar `EditarEspacoForm` a ser o componente padrão `EditarEspaco`;
   - remover a propriedade `caminhoRetorno`;
   - trocar `router.replace(caminhoRetorno)` por
     `router.replace("/anfitriao/espacos")`;
   - remover o componente padrão adicional no final do arquivo.
5. Executar a compilação e publicar novamente.

O rollback do banco somente revoga o acesso administrativo temporário. Ele não
desfaz correções que já tenham sido feitas nos anúncios.
