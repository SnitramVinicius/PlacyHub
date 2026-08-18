-- Alinha o bloqueio da reserva ao vencimento do Pix configurado no Checkout Pro.
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
    and coalesce(pagamento_atualizado_em, created_at) < now() - interval '30 minutes'
    and pagamento_status is distinct from 'approved';

  get diagnostics quantidade = row_count;
  return quantidade;
end;
$$;

revoke all on function public.expirar_reservas_pendentes() from public;
revoke all on function public.expirar_reservas_pendentes() from anon;
revoke all on function public.expirar_reservas_pendentes() from authenticated;
