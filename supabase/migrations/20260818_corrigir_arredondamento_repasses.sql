-- Corrige reservas e repasses ainda não liberados para que bruto = taxa + líquido.
update public.reservas
set
  valor_base = round(valor_base::numeric, 2),
  comissao_placyhub = round((valor_base::numeric * 0.05), 2),
  repasse_anfitriao = round(valor_base::numeric, 2) - round((valor_base::numeric * 0.05), 2)
where pagamento_status = 'approved'
  and coalesce(repasse_realizado, false) = false;

update public.repasse r
set
  valor_bruto = round(res.valor_base::numeric, 2),
  taxa_plataforma = round((res.valor_base::numeric * 0.05), 2),
  valor_liquido = round(res.valor_base::numeric, 2) - round((res.valor_base::numeric * 0.05), 2),
  updated_at = now()
from public.reservas res
where r.reserva_id = res.id
  and r.status = 'pendente';
