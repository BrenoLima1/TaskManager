
package com.brenolima.taskmanager.controller;

import java.util.List;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.PutMapping;

import com.brenolima.taskmanager.dto.DashboardResponseDTO;
import com.brenolima.taskmanager.dto.TarefaRequestDTO;
import com.brenolima.taskmanager.dto.TarefaResponseDTO;
import com.brenolima.taskmanager.enums.Prioridade;
import com.brenolima.taskmanager.service.TarefaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class TarefaController {

    private final TarefaService tarefaService;

    @GetMapping("/api/tarefas")
    public List<TarefaResponseDTO> listarTarefas() {
        return tarefaService.listarTarefas();
    }

    @GetMapping("/api/tarefas/{id}")
    public TarefaResponseDTO buscarTarefaPorId(@PathVariable Long id) {
        return tarefaService.buscarTarefaPorId(id);
    }

    @GetMapping("/api/tarefas/prioridade/{prioridade}")
    public List<TarefaResponseDTO> listarPorPrioridade(
        @PathVariable Prioridade prioridade) {

        return tarefaService.listarPorPrioridade(prioridade);
    }

    @GetMapping("/api/tarefas/concluida/{concluida}")
    public List<TarefaResponseDTO> listarPorConclusao(
        @PathVariable boolean concluida) {

        return tarefaService.listarPorConclusao(concluida);
    }

   @GetMapping("/api/tarefas/filtro")
    public List<TarefaResponseDTO> listarPorPrioridadeEConclusao(
    @RequestParam(required = false) Prioridade prioridade,
    @RequestParam(required = false) Boolean concluida) {

        return tarefaService.listarPorPrioridadeEConclusao(
          prioridade, concluida);
}

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/api/tarefas")
    public TarefaResponseDTO criarTarefa(@Valid @RequestBody TarefaRequestDTO dto) {
        return tarefaService.criarTarefa(dto);
    }

    @PutMapping("/api/tarefas/{id}")
    public TarefaResponseDTO atualizarTarefa(
            @PathVariable Long id,
            @Valid @RequestBody TarefaRequestDTO dto) {

        return tarefaService.atualizarTarefa(id, dto);
    }

    @DeleteMapping("/api/tarefas/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluirTarefa(@PathVariable Long id){
        tarefaService.excluirTarefa(id);
    }

    @GetMapping("/api/dashboard")
    public DashboardResponseDTO obterDashboard() {
        return tarefaService.obterDashboard();
    }
}
