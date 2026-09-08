-- TEMP-ADMIN-EDICAO-ESPACOS-20260901
-- Rollback seguro: revoga apenas as permissões administrativas temporárias.
-- Não remove nem altera dados dos espaços.

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
      execute format(
        'drop policy if exists "Administradores podem corrigir espacos" on public.%I',
        tabela
      );
    end if;
  end loop;
end $$;

drop policy if exists "Administradores podem gerenciar imagens de espacos"
on storage.objects;

drop function if exists public.usuario_atual_e_admin();
