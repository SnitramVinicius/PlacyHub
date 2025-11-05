export interface Espaco {
  id: string; // gerado automaticamente (ex: Date.now() ou UUID)
  nome: string; // "Campo do Sorriso"
  tipo: string; // "Campo", "Salão de Festa", etc.
  descricao: string; // descrição detalhada
  capacidade: number; // 100
  tipoCobranca: string; // "Por hora" | "Por diária" | "Por evento"
  valor: number; // 500.00
  endereco: string; // "Rua X, nº 123, Bairro Y"
  cidade: string; // "Campo Grande"
  estado: string; // "MS"
  fotos: string[]; // lista de URLs das imagens enviadas
  disponivel: boolean; // true se estiver disponível para locação
  criadoEm: string; // data do cadastro
}
