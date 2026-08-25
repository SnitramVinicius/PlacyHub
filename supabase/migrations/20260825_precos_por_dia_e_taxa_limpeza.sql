alter table public.spaces
  add column if not exists grupos_dias_semana jsonb not null default '[]'::jsonb,
  add column if not exists taxa_limpeza_valor bigint not null default 0,
  add column if not exists taxa_limpeza_opcional boolean not null default true;

comment on column public.spaces.grupos_dias_semana is
  'Grupos recorrentes de dias e valores em centavos. Ex.: [{"id":"...","dias":[1,2,3,4],"valor":30000}]';
comment on column public.spaces.taxa_limpeza_valor is
  'Valor da taxa de limpeza em centavos.';
comment on column public.spaces.taxa_limpeza_opcional is
  'Quando true, o cliente pode optar por contratar a limpeza.';

alter table public.reservas
  add column if not exists taxa_limpeza numeric(12,2) not null default 0,
  add column if not exists limpeza_selecionada boolean not null default false;

-- O valor de espaços sem pacotes é sempre recalculado no banco. Assim, uma
-- alteração feita pelo navegador não consegue reduzir o valor da reserva.
create or replace function public.calcular_reserva_espaco_valor_fixo()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_espaco public.spaces%rowtype;
  v_data date;
  v_fim date;
  v_dia integer;
  v_grupo jsonb;
  v_valor_centavos bigint;
  v_locacao numeric(12,2) := 0;
  v_limpeza numeric(12,2) := 0;
begin
  select * into v_espaco from public.spaces where id = new.espaco_id;
  if not found or coalesce(v_espaco."temPlanos", false) then
    return new;
  end if;

  v_data := new.data_inicio::date;
  v_fim := coalesce(new.data_fim::date, v_data);
  if v_fim < v_data then
    raise exception 'Período de reserva inválido';
  end if;

  while v_data <= v_fim loop
    v_dia := extract(dow from v_data)::integer;
    v_valor_centavos := coalesce(v_espaco.preco, 0);
    for v_grupo in select value from jsonb_array_elements(v_espaco.grupos_dias_semana)
    loop
      if (v_grupo -> 'dias') @> to_jsonb(array[v_dia]) then
        v_valor_centavos := coalesce((v_grupo ->> 'valor')::bigint, v_valor_centavos);
        exit;
      end if;
    end loop;
    v_locacao := v_locacao + round(v_valor_centavos::numeric / 100, 2);
    v_data := v_data + 1;
  end loop;

  if v_espaco.taxa_limpeza_valor > 0 then
    if not v_espaco.taxa_limpeza_opcional then
      new.limpeza_selecionada := true;
    end if;
    if new.limpeza_selecionada then
      v_limpeza := round(v_espaco.taxa_limpeza_valor::numeric / 100, 2);
    end if;
  else
    new.limpeza_selecionada := false;
  end if;

  new.taxa_limpeza := v_limpeza;
  new.valor_base := round(v_locacao + v_limpeza, 2);
  new.taxa_placyhub := round(new.valor_base * 0.05, 2);
  new.comissao_placyhub := round(new.valor_base * 0.05, 2);
  new.repasse_anfitriao := new.valor_base - new.comissao_placyhub;
  new.valor_total := new.valor_base + new.taxa_placyhub;
  return new;
end;
$$;

drop trigger if exists trg_calcular_reserva_espaco_valor_fixo on public.reservas;
create trigger trg_calcular_reserva_espaco_valor_fixo
before insert or update of data_inicio, data_fim, limpeza_selecionada, espaco_id
on public.reservas
for each row execute function public.calcular_reserva_espaco_valor_fixo();

notify pgrst, 'reload schema';
