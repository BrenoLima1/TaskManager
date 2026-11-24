import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { Dashboard as DashboardModel } from './dashboard.model';

@Component({
  imports: [],
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {

  dados: DashboardModel | null = null;

  get percentualAlta(): number {
  if (!this.dados || this.dados.totalTarefas === 0) return 0;

  return (this.dados.tarefasPrioridadeAlta / this.dados.totalTarefas) * 100;
}

get percentualMedia(): number {
  if (!this.dados || this.dados.totalTarefas === 0) return 0;

  return (this.dados.tarefasPrioridadeMedia / this.dados.totalTarefas) * 100;
}

get percentualBaixa(): number {
  if (!this.dados || this.dados.totalTarefas === 0) return 0;

  return (this.dados.tarefasPrioridadeBaixa / this.dados.totalTarefas) * 100;
}

get percentualConcluidas(): number {
  if (!this.dados || this.dados.totalTarefas === 0) return 0;

  return (this.dados.tarefasConcluidas / this.dados.totalTarefas) * 100;
}

get percentualPendentes(): number {
  if (!this.dados || this.dados.totalTarefas === 0) return 0;

  return (this.dados.tarefasPendentes / this.dados.totalTarefas) * 100;
}

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dashboardService.buscarDados().subscribe({
      next: (resposta) => {
        this.dados = resposta;

        this.cdr.detectChanges();

        console.log('Dados do dashboard:', resposta);
      },
      error: (erro) => {
        console.error('Erro ao carregar dashboard:', erro);
      }
    });
  }
}