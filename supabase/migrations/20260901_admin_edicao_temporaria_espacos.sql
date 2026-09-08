-- TEMP-ADMIN-EDICAO-ESPACOS-20260901
-- Alteração temporária documentada em:
-- docs/ALTERACAO_TEMPORARIA_EDICAO_ADMIN_ESPACOS.md
-- Permite que administradores corrijam anúncios pelo painel sem assumir a conta
-- do anfitrião. A função security definer evita recursão nas políticas de users.
create or replace function public.usuario_atual_e_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and coalesce(is_admin, false)
  );
$$;

revoke all on function public.usuario_atual_e_admin() from public;
grant execute on function public.usuario_atual_e_admin() to authenticated;

do $$
declare
  tabela text;
begin
  foreach tabela in array array[
    'spaces',
    'espaco_regras',
    'espaco_facilidades',
    'espaco_buffet',
    'espaco_servicos',
    'espaco_categorias',
    'espaco_pacotes',
    'espaco_itens_pacote',
    'espaco_precos_pacote'
  ]
  loop
    if to_regclass('public.' || tabela) is not null then
      execute format('drop policy if exists "Administradores podem corrigir espacos" on public.%I', tabela);
      execute format(
        'create policy "Administradores podem corrigir espacos" on public.%I for all to authenticated using (public.usuario_atual_e_admin()) with check (public.usuario_atual_e_admin())',
        tabela
      );
    end if;
  end loop;
end $$;

drop policy if exists "Administradores podem gerenciar imagens de espacos" on storage.objects;
create policy "Administradores podem gerenciar imagens de espacos"
on storage.objects
for all
to authenticated
using (bucket_id = 'spaces' and public.usuario_atual_e_admin())
with check (bucket_id = 'spaces' and public.usuario_atual_e_admin());
