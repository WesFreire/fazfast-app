// src/types/auth.ts

export interface Usuario {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  foto_perfil?: string | null;
  papel_ativo: "cliente" | "profissional";
  pode_prestar: boolean;
}

export interface ClientePerfil {
  id: number;
  usuario_id: number;
  cpf?: string;
  data_nascimento?: string;
}

export interface ProfissionalPerfil {
  id: number;
  usuario_id: number;
  cnpj?: string;
  biografia?: string;
  experiencia_anos: number;
  avaliacao_media: number;
  total_servicos: number;
}

// Estrutura unificada que o hook vai disponibilizar
export interface AuthData {
  user: Usuario | null;
  roleData: ClientePerfil | ProfissionalPerfil | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
// =====================
//  Categoria
// =====================
export interface Categoria {
  id: number;
  nome: string;
  slug: string;
}

// =====================
//  Serviço
// =====================
export interface Servico {
  id: number;
  prestador: Usuario;
  categoria?: Categoria | null;
  nome: string;
  descricao: string;
  preco: string; // Django DecimalField vira string no JSON
  tipo_preco: "fixo" | "por_hora";
  prazo_estimado_minutos?: number | null;
  area_atendimento?: string | null;
  is_ativo: boolean;
  media_avaliacoes: number;
  criado_em: string;
  atualizado_em: string;
  portfolio?: PortfolioItem[];
}

// =====================
//  Portfolio Item
// =====================
export interface PortfolioItem {
  id: number;
  servico: number | Servico;
  arquivo_midia: string;
  legenda?: string | null;
}

// =====================
//  Disponibilidade
// =====================
export interface Disponibilidade {
  id: number;
  prestador: Usuario;
  data: string; // formato ISO (YYYY-MM-DD)
  inicio: string; // HH:mm:ss
  fim: string;
  is_reservado: boolean;
}

// =====================
//  Contrato
// =====================
export interface Contrato {
  id: number;
  servico: Servico;
  cliente: Usuario;
  prestador: Usuario;
  data_agendada?: string | null;
  hora_inicio?: string | null;
  hora_fim?: string | null;
  local_atendimento: string;
  observacoes?: string | null;
  preco?: string | null;
  status: "pendente" | "confirmado" | "concluido" | "cancelado";
  criado_em: string;
  arquivo_pdf?: string | null;
  avaliacoes?: Avaliacao[];
}

// =====================
//  Avaliação
// =====================
export interface Avaliacao {
  id: number;
  contrato: number | Contrato;
  avaliador?: Usuario | null;
  avaliado?: Usuario | null;
  nota: number;
  comentario?: string | null;
  criado_em: string;
}

// =====================
//  Notificação
// =====================
export interface Notificacao {
  id: number;
  usuario: Usuario;
  tipo: string;
  mensagem: string;
  is_lida: boolean;
  criado_em: string;
}
