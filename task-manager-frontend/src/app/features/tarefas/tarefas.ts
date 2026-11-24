import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Tarefa } from './tarefa.model';
import { TarefaService } from './tarefa.service';


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

  constructor(
    private fb: FormBuilder,
    private tarefaService: TarefaService,
    private cdr: ChangeDetectorRef
  ) {
    this.tarefaForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: [''],
      prioridade: ['MEDIA', Validators.required],
    });
  }

  ngOnInit(): void {
  this.tarefaService.listarTarefas().subscribe({

    next: (resposta) => {
      this.tarefas = resposta;
      this.cdr.detectChanges();
      console.log('Tarefas carregadas:', this.tarefas);
    },

    error: (erro) => {
      console.error('Erro ao buscar tarefas:', erro);
    }

  });
}

  salvarTarefa() {
    if (this.tarefaForm.invalid) {
      this.tarefaForm.markAllAsTouched();
      return;
    }

    const tarefa: Tarefa = {
      titulo: this.tarefaForm.value.titulo ?? '',
      descricao: this.tarefaForm.value.descricao ?? '',
      prioridade: this.tarefaForm.value.prioridade as Tarefa['prioridade'],
      concluida: false,
    };

    this.tarefaService.cadastrarTarefa(tarefa).subscribe({
      next: (resposta) => {
        console.log('Tarefa cadastrada:', resposta);

        this.tarefas = [...this.tarefas, resposta];

        this.tarefaForm.reset({
          titulo: '',
          descricao: '',
          prioridade: 'MEDIA',
        });

        this.mostrarFormulario = false;
      },

      error: (erro) => {
        console.error('Erro ao cadastrar tarefa:', erro);
      },
    });
  }

  excluirTarefa(id: number): void {
  const confirmar = confirm('Tem certeza que deseja excluir esta tarefa?');

  if (!confirmar) {
    return;
  }

  this.tarefaService.excluirTarefa(id).subscribe({
    next: () => {
      this.tarefas = this.tarefas.filter(tarefa => tarefa.id !== id);

      this.cdr.detectChanges();

      console.log('Tarefa excluída com sucesso!');
    },

    error: (erro) => {
      console.error('Erro ao excluir tarefa:', erro);
    }
  });
}
}
