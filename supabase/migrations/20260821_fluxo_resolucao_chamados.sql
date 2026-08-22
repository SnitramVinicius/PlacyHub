-- Registra a resposta administrativa e notifica o usuário durante o ciclo do chamado.
alter table public.reportes
  add column if not exists resposta_admin text,
  add column if not exists respondido_em timestamptz,
  add column if not exists respondido_por uuid references auth.users(id) on delete set null;

create or replace function public.notificar_atualizacao_chamado()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Propostas de reagendamento compartilham a tabela, mas não são chamados de suporte.
  if new.tipo = 'Proposta de reagendamento' then
    return new;
  end if;

  if tg_op = 'INSERT' then
    insert into public.notificacoes
      (usuario_id, tipo, titulo, mensagem, lida, created_at)
    values
      (
        new.user_id,
        'sistema',
        'Chamado recebido',
        'Recebemos seu chamado sobre "' || coalesce(new.tipo, 'Suporte') || '". Protocolo #' || left(new.id::text, 8) || '. Nossa equipe irá analisá-lo.',
        false,
        now()
      );
  elsif new.status in ('resolvido', 'fechado')
    and nullif(trim(new.resposta_admin), '') is not null
    and (
      old.status is distinct from new.status
      or old.resposta_admin is distinct from new.resposta_admin
    ) then
    insert into public.notificacoes
      (usuario_id, tipo, titulo, mensagem, lida, created_at)
    values
      (
        new.user_id,
        'sistema',
        case when new.status = 'resolvido' then 'Chamado resolvido' else 'Chamado fechado' end,
        'Resposta do suporte para o protocolo #' || left(new.id::text, 8) || ': ' || new.resposta_admin,
        false,
        now()
      );
  end if;

  return new;
end;
$$;

drop trigger if exists trigger_notificar_atualizacao_chamado on public.reportes;
create trigger trigger_notificar_atualizacao_chamado
after insert or update of status, resposta_admin on public.reportes
for each row execute function public.notificar_atualizacao_chamado();
