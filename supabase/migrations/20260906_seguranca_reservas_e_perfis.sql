-- Proteções de produção para reservas e privilégios de usuário.

create extension if not exists btree_gist with schema extensions;

-- Impede conflitos de datas inclusive quando duas pessoas reservam ao mesmo tempo.
-- Reservas canceladas não bloqueiam novas reservas.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'reservas_sem_sobreposicao_ativa'
  ) then
    alter table public.reservas
      add constraint reservas_sem_sobreposicao_ativa
      exclude using gist (
        espaco_id with =,
        daterange(data_inicio::date, data_fim::date, '[]') with &&
      )
      where (status in ('pendente', 'confirmada'));
  end if;
end $$;

-- Um usuário autenticado não pode promover a própria função nem obter acesso admin
-- por uma chamada direta à API REST. Alterações feitas pelo servidor (service_role)
-- continuam permitidas.
create or replace function public.bloquear_escalacao_privilegios_usuario()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() = 'authenticated' then
    if tg_op = 'INSERT' and (
      new.id is distinct from auth.uid()
      or coalesce(new.is_admin, false)
      or coalesce(new.is_anfitriao, false)
      or coalesce(new.roles::text, '') ~* '(ADMIN|ANFITRIAO)'
    ) then
      raise exception 'Criação de perfil com privilégios não permitida';
    end if;

    if tg_op = 'UPDATE' and auth.uid() = old.id and (
      new.roles is distinct from old.roles
      or new.is_admin is distinct from old.is_admin
      or new.is_anfitriao is distinct from old.is_anfitriao
    ) then
      raise exception 'Alteração de privilégios permitida somente pelo servidor';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists impedir_escalacao_privilegios_usuario on public.users;
create trigger impedir_escalacao_privilegios_usuario
before insert or update on public.users
for each row execute function public.bloquear_escalacao_privilegios_usuario();

revoke all on function public.bloquear_escalacao_privilegios_usuario() from public;
revoke all on function public.bloquear_escalacao_privilegios_usuario() from anon;
revoke all on function public.bloquear_escalacao_privilegios_usuario() from authenticated;

-- Limitação distribuída de requisições para rotas sensíveis (compatível com
-- múltiplas instâncias serverless).
create table if not exists public.api_rate_limits (
  chave text primary key,
  janela_iniciada_em timestamptz not null default now(),
  quantidade integer not null default 0
);

alter table public.api_rate_limits enable row level security;
revoke all on public.api_rate_limits from anon, authenticated;

create or replace function public.verificar_limite_api(
  p_chave text,
  p_janela_segundos integer,
  p_maximo integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  total integer;
begin
  if p_chave is null or length(p_chave) > 200
     or p_janela_segundos < 1 or p_maximo < 1 then
    return false;
  end if;

  insert into public.api_rate_limits (chave, janela_iniciada_em, quantidade)
  values (p_chave, now(), 1)
  on conflict (chave) do update set
    janela_iniciada_em = case
      when api_rate_limits.janela_iniciada_em <= now() - make_interval(secs => p_janela_segundos)
      then now() else api_rate_limits.janela_iniciada_em end,
    quantidade = case
      when api_rate_limits.janela_iniciada_em <= now() - make_interval(secs => p_janela_segundos)
      then 1 else api_rate_limits.quantidade + 1 end
  returning quantidade into total;

  return total <= p_maximo;
end;
$$;

revoke all on function public.verificar_limite_api(text, integer, integer) from public, anon, authenticated;
grant execute on function public.verificar_limite_api(text, integer, integer) to service_role;

-- Reserva e valores financeiros são criados exclusivamente pela API do servidor.
-- Atualizações de fluxo permanecem disponíveis conforme o RLS existente, mas um
-- cliente não pode alterar preço, pagamento nem confirmar reserva não paga.
create or replace function public.proteger_campos_financeiros_reserva()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() = 'authenticated' then
    if tg_op = 'INSERT' then
      raise exception 'Reservas devem ser criadas pela API segura';
    end if;

    if new.valor_base is distinct from old.valor_base
       or new.taxa_limpeza is distinct from old.taxa_limpeza
       or new.taxa_placyhub is distinct from old.taxa_placyhub
       or new.comissao_placyhub is distinct from old.comissao_placyhub
       or new.repasse_anfitriao is distinct from old.repasse_anfitriao
       or new.valor_total is distinct from old.valor_total
       or new.pagamento_id is distinct from old.pagamento_id
       or new.pagamento_status is distinct from old.pagamento_status
       or new.pagamento_atualizado_em is distinct from old.pagamento_atualizado_em
    then
      raise exception 'Campos financeiros são alterados somente pelo servidor';
    end if;

    if new.status = 'confirmada'
       and coalesce(new.pagamento_status, '') <> 'approved' then
      raise exception 'Reserva sem pagamento aprovado não pode ser confirmada';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists proteger_campos_financeiros_reserva on public.reservas;
create trigger proteger_campos_financeiros_reserva
before insert or update on public.reservas
for each row execute function public.proteger_campos_financeiros_reserva();

revoke all on function public.proteger_campos_financeiros_reserva() from public, anon, authenticated;
