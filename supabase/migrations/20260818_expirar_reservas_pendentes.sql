-- Libera automaticamente reservas cujo checkout não foi concluído em 15 minutos.
create extension if not exists pg_cron with schema extensions;

create or replace function public.expirar_reservas_pendentes()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  quantidade integer;
begin
  update public.reservas
  set
    status = 'cancelada',
    pagamento_status = 'expired',
    pagamento_atualizado_em = now(),
    motivo_cancelamento = 'Prazo de pagamento expirado',
    cancelado_em = now()
  where status = 'pendente'
    and created_at < now() - interval '15 minutes'
    and pagamento_status is distinct from 'approved';

  get diagnostics quantidade = row_count;
  return quantidade;
end;
$$;

revoke all on function public.expirar_reservas_pendentes() from public;
revoke all on function public.expirar_reservas_pendentes() from anon;
revoke all on function public.expirar_reservas_pendentes() from authenticated;

do $$
declare
  job_id bigint;
begin
  select jobid into job_id
  from cron.job
  where jobname = 'expirar-reservas-pendentes';

  if job_id is not null then
    perform cron.unschedule(job_id);
  end if;
end;
$$;

select cron.schedule(
  'expirar-reservas-pendentes',
  '*/5 * * * *',
  'select public.expirar_reservas_pendentes();'
);
