// src/data/espacos.ts

export interface BuffetPacoteValor {
  convidados: number;
  preco: number;
}

export interface BuffetPacote {
  nome: string;
  descricao: string;
  duracao: string;
  itensInclusos: string[];
  valores: BuffetPacoteValor[];
}

export interface BuffetTipoFesta {
  nome: string;
  pacotes: BuffetPacote[];
}

export interface Buffet {
  descricao: string;
  tiposFesta: BuffetTipoFesta[];
}

export interface PrecoDiaSemana {
  dia: string; // "segunda", "terca", etc
  valor: number;
}

export interface DataEspecial {
  dia: number;
  mes: number;
  valor: number;
}

export interface PeriodoEspecifico {
  dataInicio: string; // yyyy-mm-dd
  dataFim: string;
  valor: number;
}

export interface Disponibilidade {
  tipo: "sempre" | "dias_especificos";
  dias?: string[];
}
export interface Espaco {
  id: string;
  imagem: string; // imagem principal (string, caminho)
  imagens?: string[]; // galeria de imagens
  nome: string;
 descricao?: string;
  preco: number;
  cidade: string;
  bairro: string;
  avaliacao: number;
  popularidade: number;
  tipo: string;

  capacidade: number; // número de pessoas
  area: number; // m²
  horasInclusas: number; // horas inclusas
  duracao?: string; // string legível, ex: "5 horas"

  facilidades: string[]; // Wi-Fi, churrasqueira, piscina...
  regras: string[];
  servicosAdicionais?: string[];

  latitude: number;
  longitude: number;

   buffet?: Buffet;


  usaPrecoDiaSemana?: boolean;
  precosDiaSemana?: PrecoDiaSemana[];

  usaDatasEspeciais?: boolean;
  datasEspeciais?: DataEspecial[];

  usaPeriodos?: boolean;
  periodos?: PeriodoEspecifico[];

  tipoReserva?: "automatica" | "manual";

  disponibilidade?: Disponibilidade;

}

// Observação: as coordenadas abaixo são aproximações por bairro e cidade,
// suficientes para exibir marcadores em mapas durante desenvolvimento.

export const ESPACOS: Espaco[] = [
  // ---------- CAMPO GRANDE - MS (8)
{
  id: "cg-teste-01",
imagem: "/espacos/1.jpg",
imagens: [
  "/espacos/1.jpg",
  "/espacos/2.jpg",
  "/espacos/3.jpg",
  "/espacos/4.jpeg",
  "/espacos/5.jpeg"
],

  nome: "Chácara Paraíso Eventos",
  descricao:
    "A Chácara Paraíso Eventos é um espaço amplo e arborizado ideal para aniversários, confraternizações, casamentos e eventos corporativos. O local conta com piscina, área gourmet completa, palco para apresentações e amplo estacionamento. Perfeito para quem busca privacidade e contato com a natureza sem sair da cidade.",

  preco: 600,

  cidade: "Campo Grande, MS",
  bairro: "Chácara dos Poderes",

  avaliacao: 4.8,
  popularidade: 640,

  tipo: "Chácara",

  capacidade: 180,
  area: 2200,

  horasInclusas: 8,
  duracao: "8 horas",

  facilidades: [
    "Piscina",
    "Churrasqueira",
    "Área gourmet completa",
    "Palco para música ao vivo",
    "Estacionamento para 40 carros",
    "Wi-Fi",
    "Área verde",
    "Iluminação decorativa"
  ],

  servicosAdicionais: [
    "Decoração de festas",
    "DJ profissional",
    "Sistema de som",
    "Segurança",
    "Equipe de limpeza",
    "Mesas e cadeiras extras",
    "Gerador de energia"
  ],

  regras: [
    "Som permitido até 00h",
    "Proibido som automotivo",
    "Animais apenas na área externa",
    "Obrigatório recolher lixo ao final do evento",
    "Caução de R$500 para possíveis danos",
    "Fogos de artifício apenas com autorização"
  ],

  latitude: -20.481200,
  longitude: -54.650000,

  // -------- PREÇO DIFERENTE POR DIA DA SEMANA
  precosDiaSemana: [
    { dia: "segunda", valor: 450 },
    { dia: "terca", valor: 450 },
    { dia: "quarta", valor: 450 },
    { dia: "quinta", valor: 500 },
    { dia: "sexta", valor: 700 },
    { dia: "sabado", valor: 1200 },
    { dia: "domingo", valor: 900 }
  ],

  // -------- DATAS ESPECIAIS
  datasEspeciais: [
    {
      dia: 25,
      mes: 12,
      
      valor: 1500
    },
    {
      dia: 31,
      mes: 12,
    
      valor: 2000
    },
    {
      dia: 12,
      mes: 10,
    
      valor: 1100
    }
  ],

  // -------- PERÍODOS ESPECÍFICOS
periodos: [
  {
    dataInicio: "2026-11-15",
    dataFim: "2026-12-20",
    valor: 1300
  },
  {
    dataInicio: "2026-07-01",
    dataFim: "2026-07-31",
    valor: 900
  }
],

  // -------- TIPO DE RESERVA
 tipoReserva: "automatica",

},

{
  id: "cg-buffet-01",
 imagem: "/espacos/5.jpeg",
imagens: [
  "/espacos/1.jpg",
  "/espacos/2.jpg",
  "/espacos/3.jpg",
  "/espacos/4.jpeg",
  "/espacos/5.jpeg",
  "/espacos/6.jpg"
],
  nome: "Chácara do Sol",
  preco: 4250,
  cidade: "Campo Grande, MS",
  bairro: "Rua Perciliana Barbosa Ferreira",
  avaliacao: 4.9,
  popularidade: 1500,
  tipo: "Casa de festas",

  capacidade: 150,
  area: 2000,
  horasInclusas: 4,
  duracao: "4 horas",

  facilidades: [
    "Ar-condicionado",
    "Brinquedos diversos",
    "Som e iluminação profissional",
  ],

  regras: [
    "Proibido som externo após 22h",
    "Não é permitido levar bebidas externas",
    "Horário máximo de encerramento às 02h",
    "Contrato e sinal obrigatórios para reserva"
  ],

  latitude: -20.469800,
  longitude: -54.615000,

buffet: {
  descricao: "Buffet completo com cardápio personalizado, decoração temática e equipe especializada para eventos infantis e adultos.",
  tiposFesta: [
    {
      nome: "Festa Infantil",
      pacotes: [
        {
          nome: "Pacote 1",
          descricao: "Opção 1 - Buffet completo com decoração temática.",
          duracao: "4 horas",
          itensInclusos: [
            "Decoração completa",
            "Cachorro quente",
            "Batata frita",
            "Macarrão à bolonhesa",
            "Salgados fritos e assados",
            "Bolo",
            "Mini churros",
            "Sucos",
            "Refrigerantes",
            "Água"
          ],
          valores: [
            { convidados: 50, preco: 4250 },
            { convidados: 60, preco: 4800 },
            { convidados: 80, preco: 6400 },
            { convidados: 100, preco: 7450 },
            { convidados: 120, preco: 8800 },
            { convidados: 150, preco: 10450 }
          ]
        },
        {
          nome: "Pacote 2",
          descricao: "Opção 2 - Buffet completo com complementos especiais.",
          duracao: "4 horas",
          itensInclusos: [
            "Decoração completa",
            "Cachorro quente",
            "Batata frita",
            "Macarrão à bolonhesa",
            "Salgados fritos e assados",
            "Bolo",
            "Mini churros",
            "Sucos",
            "Refrigerantes",
            "Água",
            "Sorvete",
            "Algodão doce",
            "Gelinho",
            "Crepes",
            "Amendoim"
          ],
          valores: [
            { convidados: 50, preco: 4500 },
            { convidados: 60, preco: 5100 },
            { convidados: 80, preco: 6800 },
            { convidados: 100, preco: 7950 },
            { convidados: 120, preco: 9400 },
            { convidados: 150, preco: 10950 }
          ]
        }
      ]
    },
    {
      nome: "15 anos e aniversários",
      pacotes: [
        {
          nome: "Ouro 1 - Coquetel",
          descricao: "Pacote completo para festas de 15 anos.",
          duracao: "4 horas",
          itensInclusos: [
            "Decoração completa",
            "Coquetel",
            "Salgados variados",
            "Doces",
            "Bebidas",
            "Equipe profissional"
          ],
          valores: [
            { convidados: 60, preco: 11900 },
            { convidados: 70, preco: 13100 },
            { convidados: 80, preco: 14150 },
            { convidados: 90, preco: 15350 },
            { convidados: 100, preco: 16100 },
            { convidados: 120, preco: 18200 }
          ]
        },
        {
          nome: "Ouro 2 - Massas",
          descricao: "Pacote com jantar completo de massas.",
          duracao: "4 horas",
          itensInclusos: [
            "Decoração completa",
            "Jantar de massas",
            "Salgados",
            "Doces",
            "Bebidas",
            "Equipe profissional"
          ],
          valores: [
            { convidados: 60, preco: 12200 },
            { convidados: 70, preco: 13450 },
            { convidados: 80, preco: 14550 },
            { convidados: 90, preco: 15800 },
            { convidados: 100, preco: 16600 },
            { convidados: 120, preco: 18800 }
          ]
        }
      ]
    }
  ]
}
},

  {
    id: "cg-01",
  imagem: "/espacos/1.jpg",
imagens: [
  "/espacos/3.jpg",
  "/espacos/1.jpg",
  "/espacos/2.jpg",
  "/espacos/4.jpeg",
  "/espacos/5.jpeg",
  "/espacos/6.jpg"
],
    nome: "Chácara Recanto do Lago",
    preco: 650,
    cidade: "Campo Grande, MS",
    bairro: "Itanhangá Park",
    avaliacao: 4.9,
    popularidade: 980,
    tipo: "Chácara",
    capacidade: 120,
    area: 1500,
    horasInclusas: 8,
    duracao: "8 horas",
    facilidades: ["Piscina", "Churrasqueira", "Wi-Fi", "Estacionamento", "Área verde"],
    regras: ["Proibido som alto após 22h", "Sem fogos de artifício", "Animais permitidos apenas na área externa"],
    servicosAdicionais: ["Buffet", "Decoração", "Segurança"],
    latitude: -20.469800,
    longitude: -54.615000,
  },
  {
    id: "cg-02",
imagem: "/espacos/2.jpg",
imagens: [
  "/espacos/3.jpg",
  "/espacos/1.jpg",
  "/espacos/2.jpg",
  "/espacos/4.jpeg",
  "/espacos/5.jpeg",
  "/espacos/6.jpg"
],
    nome: "Espaço Premium Monte Castelo",
    preco: 450,
    cidade: "Campo Grande, MS",
    bairro: "Monte Castelo",
    avaliacao: 4.7,
    popularidade: 820,
    tipo: "Salão",
    capacidade: 80,
    area: 520,
    horasInclusas: 6,
    duracao: "6 horas",
    facilidades: ["Ar-condicionado", "Cozinha equipada", "Wi-Fi", "Som básico"],
    regras: ["Proibido fumar no interior", "Caução para limpeza"],
    servicosAdicionais: ["Cozinheiro", "Limpeza"],
    latitude: -20.462500,
    longitude: -54.613200,
  },
  {
    id: "cg-03",
    imagem: "/3.jpg",
    imagens: [
  "espacos/3.jpg",
  "espacos/1.jpg",
  "espacos/2.jpg",
  "espacos/4.jpeg",
  "espacos/5.jpeg",
  "espacos/6.jpg",
],
    nome: "Salão Família Fest",
    preco: 280,
    cidade: "Campo Grande, MS",
    bairro: "Coronel Antonino",
    avaliacao: 4.2,
    popularidade: 500,
    tipo: "Salão",
    capacidade: 50,
    area: 300,
    horasInclusas: 5,
    duracao: "5 horas",
    facilidades: ["Wi-Fi", "Estacionamento"],
    regras: ["Som moderado", "Proibido bebidas de vidro na área de crianças"],
    servicosAdicionais: ["Decoração infantil"],
    latitude: -20.488000,
    longitude: -54.610000,
  },
  {
    id: "cg-04",
    imagem: "/4.jpeg",
   imagens: [
  "espacos/3.jpg",
  "espacos/1.jpg",
  "espacos/2.jpg",
  "espacos/4.jpeg",
  "espacos/5.jpeg",
  "espacos/6.jpg",
],
    nome: "Espaço Jardim dos Estados",
    preco: 520,
    cidade: "Campo Grande, MS",
    bairro: "Jardim dos Estados",
    avaliacao: 4.8,
    popularidade: 900,
    tipo: "Outro",
    capacidade: 140,
    area: 600,
    horasInclusas: 6,
    duracao: "6 horas",
    facilidades: ["Wi-Fi", "Palco", "Iluminação", "Ar-condicionado"],
    regras: ["Proibido fumar no interior", "Horário máximo até 01h"],
    servicosAdicionais: ["DJ", "Buffet"],
    latitude: -20.478000,
    longitude: -54.635000,
  },
  {
    id: "cg-05",
    imagem: "/5.jpeg",
    imagens: [
  "espacos/3.jpg",
  "espacos/1.jpg",
  "espacos/2.jpg",
  "espacos/4.jpeg",
  "espacos/5.jpeg",
  "espacos/6.jpg",
],
    nome: "Chácara Vale Encantado",
    preco: 700,
    cidade: "Campo Grande, MS",
    bairro: "Aero Rancho",
    avaliacao: 4.6,
    popularidade: 610,
    tipo: "Chácara",
    capacidade: 180,
    area: 2000,
    horasInclusas: 8,
    duracao: "8 horas",
    facilidades: ["Piscina", "Churrasqueira", "Estacionamento amplo", "Playground"],
    regras: ["Reservas mínimas 6h", "Proibido som automotivo"],
    servicosAdicionais: ["Buffet", "Monitores infantis"],
    latitude: -20.493500,
    longitude: -54.640200,
  },
  {
    id: "cg-06",
    imagem: "/6.jpg",
    imagens: [
  "espacos/3.jpg",
  "espacos/1.jpg",
  "espacos/2.jpg",
  "espacos/4.jpeg",
  "espacos/5.jpeg",
  "espacos/6.jpg",
],
    nome: "Salão Imperial Festas",
    preco: 390,
    cidade: "Campo Grande, MS",
    bairro: "Centro",
    avaliacao: 4.5,
    popularidade: 720,
    tipo: "Salão",
    capacidade: 130,
    area: 420,
    horasInclusas: 6,
    duracao: "6 horas",
    facilidades: ["Cozinha", "Wi-Fi", "Banheiros amplos"],
    regras: ["Horário encerramento 00h", "Proibido fogos"],
    servicosAdicionais: ["Segurança", "Limpeza"],
    latitude: -20.469200,
    longitude: -54.620800,
  },
  {
    id: "cg-07",
    imagem: "espacos/1.jpg",
    imagens: [
  "espacos/3.jpg",
  "espacos/1.jpg",
  "espacos/2.jpg",
  "espacos/4.jpeg",
  "espacos/5.jpeg",
  "espacos/6.jpg",
],
    nome: "Espaço Crystal Garden",
    preco: 310,
    cidade: "Campo Grande, MS",
    bairro: "Monte Castelo",
    avaliacao: 4.3,
    popularidade: 430,
    tipo: "Outro",
    capacidade: 70,
    area: 350,
    horasInclusas: 5,
    duracao: "5 horas",
    facilidades: ["Estacionamento", "Wi-Fi", "Iluminação cênica"],
    regras: ["Não permitido fogos de artifício", "Caução para danos"],
    servicosAdicionais: ["Decoração", "Fotografia"],
    latitude: -20.461900,
    longitude: -54.612500,
  },
  {
    id: "cg-08",
    imagem: "/espacos/2.jpg",
    imagens: [
  "espacos/3.jpg",
  "espacos/1.jpg",
  "espacos/2.jpg",
  "espacos/4.jpeg",
  "espacos/5.jpeg",
  "espacos/6.jpg",
],
    nome: "Chácara Primavera Azul",
    preco: 800,
    cidade: "Campo Grande, MS",
    bairro: "Chácara dos Poderes",
    avaliacao: 5.0,
    popularidade: 1000,
    tipo: "Chácara",
    capacidade: 200,
    area: 2500,
    horasInclusas: 10,
    duracao: "10 horas",
    facilidades: ["Piscina", "Churrasqueira", "Campo de futebol", "Estacionamento"],
    regras: ["Horário máximo até 02h", "Brindes apenas em área externa"],
    servicosAdicionais: ["Buffet completo", "Equipe de limpeza"],
    latitude: -20.481200,
    longitude: -54.650000,
  },

  // ---------- SÃO PAULO - SP (8)
  {
    id: "sp-01",
imagem: "/espacos/3.jpg",
imagens: [
  "/espacos/3.jpg",
  "/espacos/1.jpg",
  "/espacos/2.jpg",
  "/espacos/4.jpeg",
  "/espacos/5.jpeg",
  "/espacos/6.jpg"
],
    nome: "Espaço Alto da Lapa",
    preco: 1500,
    cidade: "São Paulo, SP",
    bairro: "Lapa",
    avaliacao: 4.9,
    popularidade: 1200,
    tipo: "Outro",
    capacidade: 180,
    area: 900,
    horasInclusas: 8,
    duracao: "8 horas",
    facilidades: ["Rooftop", "Wi-Fi", "Som profissional", "Camarim"],
    regras: ["Contrato mínimo 6h", "Proibido fogos"],
    servicosAdicionais: ["Buffet", "Bar móvel"],
    latitude: -23.528900,
    longitude: -46.694700,
  },
  {
    id: "sp-02",
imagem: "/espacos/4.jpeg",
imagens: [
  "/espacos/3.jpg",
  "/espacos/1.jpg",
  "/espacos/2.jpg",
  "/espacos/4.jpeg",
  "/espacos/5.jpeg",
  "/espacos/6.jpg"
],
    nome: "Salão Jardins Palace",
    preco: 900,
    cidade: "São Paulo, SP",
    bairro: "Jardins",
    avaliacao: 4.8,
    popularidade: 1100,
    tipo: "Salão",
    capacidade: 100,
    area: 400,
    horasInclusas: 6,
    duracao: "6 horas",
    facilidades: ["Ar-condicionado", "Cozinha equipada", "Wi-Fi"],
    regras: ["Som até 1h", "Proibido fumaça indoor"],
    servicosAdicionais: ["Decorator", "Bartender"],
    latitude: -23.570200,
    longitude: -46.678500,
  },
  {
    id: "sp-03",
imagem: "/espacos/5.jpeg",
imagens: [
  "/espacos/3.jpg",
  "/espacos/1.jpg",
  "/espacos/2.jpg",
  "/espacos/4.jpeg",
  "/espacos/5.jpeg",
  "/espacos/6.jpg"
],
    nome: "Espaço Paulista Hall",
    preco: 750,
    cidade: "São Paulo, SP",
    bairro: "Bela Vista",
    avaliacao: 4.6,
    popularidade: 900,
    tipo: "Outro",
    capacidade: 120,
    area: 350,
    horasInclusas: 6,
    duracao: "6 horas",
    facilidades: ["Wi-Fi", "Elevador", "Acessibilidade"],
    regras: ["Caução obrigatória", "Sem churrasco"],
    servicosAdicionais: ["Segurança", "Limpeza"],
    latitude: -23.555000,
    longitude: -46.645000,
  },
  {
    id: "sp-04",
  imagem: "/espacos/6.jpg",
imagens: [
  "/espacos/3.jpg",
  "/espacos/1.jpg",
  "/espacos/2.jpg",
  "/espacos/4.jpeg",
  "/espacos/5.jpeg",
  "/espacos/6.jpg"
],
    nome: "Rooftop Sky SP",
    preco: 1800,
    cidade: "São Paulo, SP",
    bairro: "Pinheiros",
    avaliacao: 5.0,
    popularidade: 1400,
    tipo: "Outro",
    capacidade: 200,
    area: 700,
    horasInclusas: 8,
    duracao: "8 horas",
    facilidades: ["Rooftop", "Bar", "Wi-Fi", "Vista panorâmica"],
    regras: ["Proibido fogos", "Reservas com antecedência"],
    servicosAdicionais: ["Bar", "DJ"],
    latitude: -23.569200,
    longitude: -46.689500,
  },
  {
    id: "sp-05",
imagem: "/espacos/1.jpg",
imagens: [
  "/espacos/3.jpg",
  "/espacos/1.jpg",
  "/espacos/2.jpg",
  "/espacos/4.jpeg",
  "/espacos/5.jpeg",
  "/espacos/6.jpg"
],
    nome: "Chácara Morumbi Premium",
    preco: 2000,
    cidade: "São Paulo, SP",
    bairro: "Morumbi",
    avaliacao: 5.0,
    popularidade: 1500,
    tipo: "Chácara",
    capacidade: 250,
    area: 3000,
    horasInclusas: 10,
    duracao: "10 horas",
    facilidades: ["Piscina", "Churrasqueira", "Estacionamento", "Segurança"],
    regras: ["Som até 02h", "Contrato de limpeza"],
    servicosAdicionais: ["Buffet completo", "Segurança privada"],
    latitude: -23.616000,
    longitude: -46.719000,
  },
  {
    id: "sp-06",
imagem: "/espacos/2.jpg",
imagens: [
  "/espacos/3.jpg",
  "/espacos/1.jpg",
  "/espacos/2.jpg",
  "/espacos/4.jpeg",
  "/espacos/5.jpeg",
  "/espacos/6.jpg"
],
    nome: "Espaço Vila Olímpia",
    preco: 1100,
    cidade: "São Paulo, SP",
    bairro: "Vila Olímpia",
    avaliacao: 4.7,
    popularidade: 980,
    tipo: "Outro",
    capacidade: 140,
    area: 480,
    horasInclusas: 6,
    duracao: "6 horas",
    facilidades: ["Wi-Fi", "Cozinha", "Ar-condicionado"],
    regras: ["Sem fogos", "Caução para danos"],
    servicosAdicionais: ["Segurança", "Limpeza"],
    latitude: -23.590800,
    longitude: -46.685200,
  },
  {
    id: "sp-07",
imagem: "/espacos/4.jpeg",
imagens: [
  "/espacos/3.jpg",
  "/espacos/1.jpg",
  "/espacos/2.jpg",
  "/espacos/4.jpeg",
  "/espacos/5.jpeg",
  "/espacos/6.jpg"
],
    nome: "Salão Zona Norte Fest",
    preco: 450,
    cidade: "São Paulo, SP",
    bairro: "Santana",
    avaliacao: 4.4,
    popularidade: 650,
    tipo: "Salão",
    capacidade: 90,
    area: 320,
    horasInclusas: 5,
    duracao: "5 horas",
    facilidades: ["Wi-Fi", "Som básico", "Estacionamento"],
    regras: ["Horário até 23h", "Proibido bebidas de vidro na área externa"],
    servicosAdicionais: ["Buffet simples"],
    latitude: -23.505500,
    longitude: -46.620000,
  },
  {
    id: "sp-08",
    imagem: "/4.jpeg",
    imagens: [
  "/3.jpg",
  "/1.jpg",
  "/2.jpg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpg",
],
    nome: "Espaço Brooklin Hall",
    preco: 1000,
    cidade: "São Paulo, SP",
    bairro: "Brooklin",
    avaliacao: 4.8,
    popularidade: 990,
    tipo: "Outro",
    capacidade: 130,
    area: 500,
    horasInclusas: 6,
    duracao: "6 horas",
    facilidades: ["Wi-Fi", "Iluminação", "Ar-condicionado"],
    regras: ["Caução", "Proibido som automotivo"],
    servicosAdicionais: ["DJ", "Decoração"],
    latitude: -23.607000,
    longitude: -46.683000,
  },

  // ---------- RIO DE JANEIRO - RJ (8)
  {
    id: "rj-01",
     imagem: "/4.jpeg",
    imagens: [
  "/3.jpg",
  "/1.jpg",
  "/2.jpg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpg",
],
    nome: "Espaço Copacabana View",
    preco: 1400,
    cidade: "Rio de Janeiro, RJ",
    bairro: "Copacabana",
    avaliacao: 4.8,
    popularidade: 1100,
    tipo: "Outro",
    capacidade: 160,
    area: 650,
    horasInclusas: 8,
    duracao: "8 horas",
    facilidades: ["Vista para o mar", "Wi-Fi", "Bar"],
    regras: ["Som controlado", "Sem fogos de artifício"],
    servicosAdicionais: ["Buffet", "Fotografia"],
    latitude: -22.971177,
    longitude: -43.182543,
  },
  {
    id: "rj-02",
    imagem: "/4.jpeg",
    imagens: [
  "/3.jpg",
  "/1.jpg",
  "/2.jpg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpg",
],
    nome: "Quinta do Leme",
    preco: 1200,
    cidade: "Rio de Janeiro, RJ",
    bairro: "Leme",
    avaliacao: 4.7,
    popularidade: 900,
    tipo: "Chácara",
    capacidade: 140,
    area: 1200,
    horasInclusas: 8,
    duracao: "8 horas",
    facilidades: ["Piscina", "Churrasqueira", "Estacionamento"],
    regras: ["Reservas com antecedência", "Proibido som após 1h"],
    servicosAdicionais: ["Buffet", "Decoração"],
    latitude: -22.971900,
    longitude: -43.173000,
  },
  {
    id: "rj-03",
    imagem: "/4.jpeg",
    imagens: [
  "/3.jpg",
  "/1.jpg",
  "/2.jpg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpg",
],
    nome: "Casa do Botafogo",
    preco: 800,
    cidade: "Rio de Janeiro, RJ",
    bairro: "Botafogo",
    avaliacao: 4.5,
    popularidade: 750,
    tipo: "Salão",
    capacidade: 100,
    area: 420,
    horasInclusas: 6,
    duracao: "6 horas",
    facilidades: ["Wi-Fi", "Som", "Cozinha"],
    regras: ["Proibido fumaça indoor", "Caução para danos"],
    servicosAdicionais: ["Buffet", "Bar"],
    latitude: -22.948400,
    longitude: -43.180900,
  },
  {
    id: "rj-04",
    imagem: "/2.jpg",
    imagens: [
  "/3.jpg",
  "/1.jpg",
  "/2.jpg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpg",
],
    nome: "Rooftop Lapa",
    preco: 950,
    cidade: "Rio de Janeiro, RJ",
    bairro: "Lapa",
    avaliacao: 4.6,
    popularidade: 820,
    tipo: "Outro",
    capacidade: 120,
    area: 380,
    horasInclusas: 6,
    duracao: "6 horas",
    facilidades: ["Rooftop", "Bar", "Wi-Fi"],
    regras: ["Som controlado", "Idade mínima para consumo de bebida alcoólica"],
    servicosAdicionais: ["DJ", "Iluminação"],
    latitude: -22.913400,
    longitude: -43.182900,
  },
  {
    id: "rj-05",
    imagem: "/3.jpg",
    imagens: [
  "/3.jpg",
  "/1.jpg",
  "/2.jpg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpg",
],
    nome: "Quinta do Flamengo",
    preco: 1100,
    cidade: "Rio de Janeiro, RJ",
    bairro: "Flamengo",
    avaliacao: 4.7,
    popularidade: 880,
    tipo: "Chácara",
    capacidade: 160,
    area: 1300,
    horasInclusas: 8,
    duracao: "8 horas",
    facilidades: ["Área verde", "Estacionamento", "Churrasqueira"],
    regras: ["Proibido fogos", "Reservas mínimas 6h"],
    servicosAdicionais: ["Buffet", "Segurança"],
    latitude: -22.931000,
    longitude: -43.173100,
  },
  {
    id: "rj-06",
    imagem: "/4.jpeg",
    imagens: [
  "/3.jpg",
  "/1.jpg",
  "/2.jpg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpg",
],
    nome: "Espaço Barra Sunset",
    preco: 1000,
    cidade: "Rio de Janeiro, RJ",
    bairro: "Barra da Tijuca",
    avaliacao: 4.6,
    popularidade: 860,
    tipo: "Outro",
    capacidade: 180,
    area: 800,
    horasInclusas: 8,
    duracao: "8 horas",
    facilidades: ["Piscina", "Wi-Fi", "Estacionamento"],
    regras: ["Proibido som automotivo", "Caução para eventos com estrutura grande"],
    servicosAdicionais: ["Buffet", "Bar"],
    latitude: -23.000000,
    longitude: -43.365000,
  },
  {
    id: "rj-07",
    imagem: "/4.jpeg",
    imagens: [
  "/3.jpg",
  "/1.jpg",
  "/2.jpg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpg",
],
    nome: "Casa das Urcas",
    preco: 780,
    cidade: "Rio de Janeiro, RJ",
    bairro: "Urca",
    avaliacao: 4.5,
    popularidade: 700,
    tipo: "Outro",
    capacidade: 90,
    area: 360,
    horasInclusas: 6,
    duracao: "6 horas",
    facilidades: ["Wi-Fi", "Vista", "Estacionamento"],
    regras: ["Reservas com antecedência", "Limpeza adicional cobrada"],
    servicosAdicionais: ["Decoração", "Fotografia"],
    latitude: -22.971100,
    longitude: -43.163000,
  },

  // ---------- CURITIBA - PR (6)
  {
    id: "ct-01",
    imagem: "/4.jpeg",
    imagens: [
  "/3.jpg",
  "/1.jpg",
  "/2.jpg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpg",
],
    nome: "Bosque Fest Curitiba",
    preco: 720,
    cidade: "Curitiba, PR",
    bairro: "Batel",
    avaliacao: 4.7,
    popularidade: 760,
    tipo: "Salão",
    capacidade: 120,
    area: 480,
    horasInclusas: 6,
    duracao: "6 horas",
    facilidades: ["Wi-Fi", "Cozinha", "Estacionamento pago"],
    regras: ["Sem som após 00h", "Caução para grandes eventos"],
    servicosAdicionais: ["Buffet", "Decoração"],
    latitude: -25.427800,
    longitude: -49.269200,
  },
  {
    id: "ct-02",
    imagem: "/4.jpeg",
    imagens: [
  "/3.jpg",
  "/1.jpg",
  "/2.jpg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpg",
],
    nome: "Espaço Jardim Botânico",
    preco: 680,
    cidade: "Curitiba, PR",
    bairro: "Jardim Botânico",
    avaliacao: 4.6,
    popularidade: 700,
    tipo: "Chácara",
    capacidade: 140,
    area: 1100,
    horasInclusas: 8,
    duracao: "8 horas",
    facilidades: ["Área verde", "Estacionamento", "Churrasqueira"],
    regras: ["Proibido fogos", "Não permitido som após 01h"],
    servicosAdicionais: ["Buffet", "Monitores"],
    latitude: -25.423000,
    longitude: -49.260000,
  },
  {
    id: "ct-03",
  imagem: "/4.jpeg",
    imagens: [
  "/3.jpg",
  "/1.jpg",
  "/2.jpg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpg",
],
    nome: "Centro de Eventos Água Verde",
    preco: 560,
    cidade: "Curitiba, PR",
    bairro: "Água Verde",
    avaliacao: 4.4,
    popularidade: 620,
    tipo: "Salão",
    capacidade: 100,
    area: 360,
    horasInclusas: 6,
    duracao: "6 horas",
    facilidades: ["Wi-Fi", "Cozinha", "Iluminação"],
    regras: ["Proibido som após 00h"],
    servicosAdicionais: ["Limpeza", "Segurança"],
    latitude: -25.467000,
    longitude: -49.276000,
  },
  {
    id: "ct-04",
    imagem: "/4.jpeg",
    imagens: [
  "/3.jpg",
  "/1.jpg",
  "/2.jpg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpg",
],
    nome: "Quinta Curitiba Verde",
    preco: 820,
    cidade: "Curitiba, PR",
    bairro: "Santa Felicidade",
    avaliacao: 4.6,
    popularidade: 680,
    tipo: "Chácara",
    capacidade: 160,
    area: 1400,
    horasInclusas: 8,
    duracao: "8 horas",
    facilidades: ["Estacionamento", "Churrasqueira", "Piscina"],
    regras: ["Reservas mínimas 6h"],
    servicosAdicionais: ["Buffet", "Decoração"],
    latitude: -25.430000,
    longitude: -49.268000,
  },
  {
    id: "ct-05",
   imagem: "/4.jpeg",
    imagens: [
  "/3.jpg",
  "/1.jpg",
  "/2.jpg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpg",
],
    nome: "Salão Praça da Espanha",
    preco: 480,
    cidade: "Curitiba, PR",
    bairro: "Centro",
    avaliacao: 4.2,
    popularidade: 520,
    tipo: "Salão",
    capacidade: 80,
    area: 280,
    horasInclusas: 5,
    duracao: "5 horas",
    facilidades: ["Wi-Fi", "Cozinha"],
    regras: ["Horário até 23h"],
    servicosAdicionais: ["Limpeza"],
    latitude: -25.428400,
    longitude: -49.273300,
  },
  {
    id: "ct-06",
    imagem: "/4.jpeg",
    imagens: [
  "/3.jpg",
  "/1.jpg",
  "/2.jpg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpg",
],
    nome: "Espaço Vista Alegre",
    preco: 540,
    cidade: "Curitiba, PR",
    bairro: "Vista Alegre",
    avaliacao: 4.3,
    popularidade: 560,
    tipo: "Outro",
    capacidade: 90,
    area: 320,
    horasInclusas: 6,
    duracao: "6 horas",
    facilidades: ["Wi-Fi", "Estacionamento"],
    regras: ["Proibido fogos", "Limpeza adicional cobrada"],
    servicosAdicionais: ["Decoração"],
    latitude: -25.431000,
    longitude: -49.260500,
  },

  // ---------- BELO HORIZONTE - MG (5)
  {
    id: "bh-01",
    imagem: "/4.jpeg",
    imagens: [
  "/3.jpg",
  "/1.jpg",
  "/2.jpg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpg",
],
    nome: "Espaço Savassi Hall",
    preco: 820,
    cidade: "Belo Horizonte, MG",
    bairro: "Savassi",
    avaliacao: 4.6,
    popularidade: 780,
    tipo: "Salão",
    capacidade: 130,
    area: 420,
    horasInclusas: 6,
    duracao: "6 horas",
    facilidades: ["Wi-Fi", "Cozinha", "Ar-condicionado"],
    regras: ["Proibido som após 00h"],
    servicosAdicionais: ["Buffet", "Decoração"],
    latitude: -19.931000,
    longitude: -43.937800,
  },
  {
    id: "bh-02",
   imagem: "/4.jpeg",
    imagens: [
  "/3.jpg",
  "/1.jpg",
  "/2.jpg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpg",
],
    nome: "Quinta Pampulha",
    preco: 950,
    cidade: "Belo Horizonte, MG",
    bairro: "Pampulha",
    avaliacao: 4.7,
    popularidade: 820,
    tipo: "Chácara",
    capacidade: 160,
    area: 1200,
    horasInclusas: 8,
    duracao: "8 horas",
    facilidades: ["Piscina", "Estacionamento", "Churrasqueira"],
    regras: ["Reservas mínimas 6h", "Proibido fogos"],
    servicosAdicionais: ["Buffet", "Segurança"],
    latitude: -19.827000,
    longitude: -43.968000,
  },
  {
    id: "bh-03",
    imagem: "/4.jpeg",
    imagens: [
  "/3.jpg",
  "/1.jpg",
  "/2.jpg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpg",
],
    nome: "Espaço Lourdes",
    preco: 620,
    cidade: "Belo Horizonte, MG",
    bairro: "Lourdes",
    avaliacao: 4.5,
    popularidade: 640,
    tipo: "Salão",
    capacidade: 100,
    area: 350,
    horasInclusas: 6,
    duracao: "6 horas",
    facilidades: ["Wi-Fi", "Cozinha"],
    regras: ["Horário até 00h"],
    servicosAdicionais: ["Decoração"],
    latitude: -19.925000,
    longitude: -43.938900,
  },
  {
    id: "bh-04",
    imagem: "/4.jpeg",
    imagens: [
  "/3.jpg",
  "/1.jpg",
  "/2.jpg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpg",
],
    nome: "Casa do Mangabeiras",
    preco: 780,
    cidade: "Belo Horizonte, MG",
    bairro: "Mangabeiras",
    avaliacao: 4.6,
    popularidade: 700,
    tipo: "Outro",
    capacidade: 120,
    area: 480,
    horasInclusas: 6,
    duracao: "6 horas",
    facilidades: ["Estacionamento", "Wi-Fi"],
    regras: ["Reservas antecipadas"],
    servicosAdicionais: ["Buffet"],
    latitude: -19.951000,
    longitude: -43.939000,
  },
  {
    id: "bh-05",
    imagem: "/4.jpeg",
    imagens: [
  "/3.jpg",
  "/1.jpg",
  "/2.jpg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpg",
],
    nome: "Espaço Horizonte",
    preco: 700,
    cidade: "Belo Horizonte, MG",
    bairro: "Cidade Jardim",
    avaliacao: 4.4,
    popularidade: 620,
    tipo: "Salão",
    capacidade: 90,
    area: 320,
    horasInclusas: 5,
    duracao: "5 horas",
    facilidades: ["Wi-Fi", "Cozinha"],
    regras: ["Horário até 23h"],
    servicosAdicionais: ["Limpeza"],
    latitude: -19.941000,
    longitude: -43.940000,
  },
];
