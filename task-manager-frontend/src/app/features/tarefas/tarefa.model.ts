export interface Tarefa {
  id?: number;
  titulo: string;
  descricao: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA';
  concluida: boolean;
}
