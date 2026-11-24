
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Tarefa } from './tarefa.model';
import { TarefaService } from './tarefa.service';
import { Subscription } from 'rxjs';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-tarefas',
  styleUrl: './tarefas.scss',
  templateUrl: './tarefas.html',
})
export class Tarefas implements OnInit {

  tarefaForm;

  mostrarFormulario = false;

  tarefas: Tarefa[] = [];

  tarefaEditandoId: number | null = null;

  filtroPrioridade = '';
  filtroStatus = '';

  private requisicaoAtual?: Subscription;

  constructor(
    private fb: FormBuilder,
    private tarefaService: TarefaService,
    private cdr: ChangeDetectorRef
  ) {
    this.tarefaForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: [''],
      prioridade: ['MEDIA', Validators.required],
      concluida: [false],
    });
  }

  ngOnInit(): void {
    this.carregarTarefas();
  }

  carregarTarefas(): void {
    this.requisicaoAtual?.unsubscribe();

    this.requisicaoAtual = this.tarefaService.listarTarefas().subscribe({
      next: (resposta) => {
        this.tarefas = resposta;
        this.cdr.detectChanges();

        console.log('Tarefas carregadas:', resposta);
      },
      error: (erro) => {
        console.error('Erro ao buscar tarefas:', erro);
      }
    });
  }

  salvarTarefa(): void {

    if (this.tarefaForm.invalid) {
      this.tarefaForm.markAllAsTouched();
      return;
    }

    const tarefa: Tarefa = {
      titulo: this.tarefaForm.value.titulo ?? '',
      descricao: this.tarefaForm.value.descricao ?? '',
      prioridade: this.tarefaForm.value.prioridade as Tarefa['prioridade'],
      concluida: this.tarefaForm.value.concluida ?? false,
    };

    if (this.tarefaEditandoId !== null) {

      this.tarefaService.atualizarTarefa(this.tarefaEditandoId, tarefa).subscribe({
        next: (resposta) => {

          this.tarefas = this.tarefas.map(t =>
            t.id === resposta.id ? resposta : t
          );

          this.cdr.detectChanges();

          console.log('Tarefa atualizada:', resposta);

          this.cancelarFormulario();
          this.carregarTarefas();
        },
        error: (erro) => {
          console.error('Erro ao atualizar tarefa:', erro);
        },
      });

    } else {

      this.tarefaService.cadastrarTarefa(tarefa).subscribe({
        next: (resposta) => {

          this.tarefas = [...this.tarefas, resposta];

          this.cdr.detectChanges();

          console.log('Tarefa cadastrada:', resposta);

          this.cancelarFormulario();
          this.carregarTarefas();
        },
        error: (erro) => {
          console.error('Erro ao cadastrar tarefa:', erro);
        },
      });

    }
  }

  excluirTarefa(id: number): void {

    const confirmar = confirm('Tem certeza que deseja excluir esta tarefa?');

    if (!confirmar) {
      return;
    }

    this.tarefaService.excluirTarefa(id).subscribe({
      next: () => {

        console.log('Tarefa excluída com sucesso!');

        this.carregarTarefas();
      },
      error: (erro) => {
        console.error('Erro ao excluir tarefa:', erro);
      }
    });
  }

  iniciarEdicao(tarefa: Tarefa): void {

    this.tarefaEditandoId = tarefa.id!;

    this.tarefaForm.patchValue({
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      prioridade: tarefa.prioridade,
      concluida: tarefa.concluida,
    });

    this.mostrarFormulario = true;
  }

  iniciarNovoCadastro(): void {

    this.tarefaEditandoId = null;

    this.tarefaForm.reset({
      titulo: '',
      descricao: '',
      prioridade: 'MEDIA',
      concluida: false,
    });

    this.mostrarFormulario = true;
  }

  cancelarFormulario(): void {

    this.mostrarFormulario = false;
    this.tarefaEditandoId = null;

    this.tarefaForm.reset({
      titulo: '',
      descricao: '',
      prioridade: 'MEDIA',
      concluida: false,
    });
  }

  aplicarFiltros(): void {

    const prioridade = this.filtroPrioridade || undefined;

    const concluida = this.filtroStatus === ''
      ? undefined
      : this.filtroStatus === 'true';

    // Cancela uma consulta anterior, se ainda estiver em andamento.
    this.requisicaoAtual?.unsubscribe();

    this.requisicaoAtual = this.tarefaService
      .filtrarTarefas(prioridade, concluida)
      .subscribe({
        next: (resposta) => {

          this.tarefas = resposta;

          this.cdr.detectChanges();

          console.log('Tarefas filtradas:', resposta);
        },
        error: (erro) => {
          console.error('Erro ao aplicar filtros:', erro);
        }
      });
  }

  limparFiltros(): void {
  this.filtroPrioridade = '';
  this.filtroStatus = '';

  this.carregarTarefas();
}

}
