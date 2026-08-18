-- Impede o cadastro de espaços por usuários com perfil pessoal incompleto.
create or replace function public.validar_perfil_anfitriao_antes_do_espaco()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  perfil public.users%rowtype;
  cpf_limpo text;
  telefone_limpo text;
  cep_limpo text;
begin
  select * into perfil from public.users where id = new.user_id;

  if not found then
    raise exception 'Complete seus dados pessoais antes de cadastrar um espaço.';
  end if;

  cpf_limpo := regexp_replace(coalesce(perfil.cpf, ''), '\D', '', 'g');
  telefone_limpo := regexp_replace(coalesce(perfil.telefone, ''), '\D', '', 'g');
  cep_limpo := regexp_replace(coalesce(perfil.cep, ''), '\D', '', 'g');

  if array_length(regexp_split_to_array(trim(coalesce(perfil.name, '')), '\s+'), 1) < 2
    or coalesce(perfil.email, '') !~ '^\S+@\S+\.\S+$'
    or length(cpf_limpo) <> 11
    or length(telefone_limpo) not in (10, 11)
    or length(cep_limpo) <> 8
    or perfil.data_nascimento is null
    or perfil.data_nascimento > current_date - interval '18 years'
    or perfil.data_nascimento < current_date - interval '120 years'
    or trim(coalesce(perfil.rua, '')) = ''
    or trim(coalesce(perfil.numero, '')) = ''
    or trim(coalesce(perfil.bairro, '')) = ''
    or trim(coalesce(perfil.cidade, '')) = ''
    or coalesce(perfil.estado, '') !~ '^[A-Za-z]{2}$'
  then
    raise exception 'Complete seus dados pessoais antes de cadastrar um espaço.';
  end if;

  return new;
end;
$$;

drop trigger if exists exigir_perfil_completo_antes_de_cadastrar_espaco on public.spaces;

create trigger exigir_perfil_completo_antes_de_cadastrar_espaco
before insert on public.spaces
for each row
execute function public.validar_perfil_anfitriao_antes_do_espaco();
