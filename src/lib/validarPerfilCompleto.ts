export interface DadosPerfilCompleto {
  name?: string | null;
  email?: string | null;
  telefone?: string | null;
  cpf?: string | null;
  cep?: string | null;
  rua?: string | null;
  numero?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  data_nascimento?: string | null;
}

const somenteNumeros = (valor?: string | null) => (valor ?? "").replace(/\D/g, "");

function cpfValido(valor?: string | null) {
  const cpf = somenteNumeros(valor);
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;

  const calcularDigito = (base: string, pesoInicial: number) => {
    const soma = base.split("").reduce(
      (total, digito, indice) => total + Number(digito) * (pesoInicial - indice),
      0
    );
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return (
    calcularDigito(cpf.slice(0, 9), 10) === Number(cpf[9]) &&
    calcularDigito(cpf.slice(0, 10), 11) === Number(cpf[10])
  );
}

function nascimentoValido(valor?: string | null) {
  if (!valor) return false;
  const nascimento = new Date(`${valor}T12:00:00`);
  if (Number.isNaN(nascimento.getTime())) return false;

  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  if (
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate())
  ) {
    idade--;
  }

  return idade >= 18 && idade <= 120;
}

export function obterPendenciasPerfil(perfil: DadosPerfilCompleto) {
  const pendencias: string[] = [];

  if ((perfil.name?.trim().split(/\s+/).length ?? 0) < 2) pendencias.push("nome completo");
  if (!/^\S+@\S+\.\S+$/.test(perfil.email?.trim() ?? "")) pendencias.push("e-mail");
  if (!cpfValido(perfil.cpf)) pendencias.push("CPF válido");
  if (![10, 11].includes(somenteNumeros(perfil.telefone).length)) pendencias.push("telefone com DDD");
  if (!nascimentoValido(perfil.data_nascimento)) pendencias.push("data de nascimento válida");
  if (somenteNumeros(perfil.cep).length !== 8) pendencias.push("CEP");
  if (!perfil.rua?.trim()) pendencias.push("rua");
  if (!perfil.numero?.trim()) pendencias.push("número");
  if (!perfil.bairro?.trim()) pendencias.push("bairro");
  if (!perfil.cidade?.trim()) pendencias.push("cidade");
  if (!/^[A-Z]{2}$/i.test(perfil.estado?.trim() ?? "")) pendencias.push("estado");

  return pendencias;
}
