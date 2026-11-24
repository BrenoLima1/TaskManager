import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarefa } from './tarefa.model';

@Injectable({
  providedIn: 'root',
})
export class TarefaService {
  private apiUrl = 'http://localhost:8080/api/tarefas';

  constructor(private http: HttpClient) {}

  cadastrarTarefa(tarefa: Tarefa): Observable<Tarefa> {
    return this.http.post<Tarefa>(this.apiUrl, tarefa);
  }

  listarTarefas(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(this.apiUrl);
  }

  excluirTarefa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  atualizarTarefa(id: number, tarefa: Tarefa): Observable<Tarefa> {
    return this.http.put<Tarefa>(`${this.apiUrl}/${id}`, tarefa);
  }

  filtrarTarefas(
    prioridade?: string,
    concluida?: boolean
  ): Observable<Tarefa[]> {
  
    let params: any = {};
  
    if (prioridade) {
      params.prioridade = prioridade;
    }
  
    if (concluida !== undefined) {
      params.concluida = concluida;
    }
  
    return this.http.get<Tarefa[]>(`${this.apiUrl}/filtro`, {
      params
    });
  }
}
