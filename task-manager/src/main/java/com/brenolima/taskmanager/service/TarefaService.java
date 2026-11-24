package com.brenolima.taskmanager.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.brenolima.taskmanager.dto.DashboardResponseDTO;
import com.brenolima.taskmanager.dto.TarefaRequestDTO;
import com.brenolima.taskmanager.dto.TarefaResponseDTO;
import com.brenolima.taskmanager.entity.Tarefa;
import com.brenolima.taskmanager.enums.Prioridade;
import com.brenolima.taskmanager.exception.TarefaNaoEncontradaException;
import com.brenolima.taskmanager.mapper.TarefaMapper;
import com.brenolima.taskmanager.repository.TarefaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TarefaService {

    private final TarefaRepository tarefaRepository;

    public TarefaResponseDTO criarTarefa(TarefaRequestDTO dto ){
        
        Tarefa tarefa = TarefaMapper.toEntity(dto);
        Tarefa tarefaSalva = tarefaRepository.save(tarefa);

        return TarefaMapper.toResponseDTO(tarefaSalva);
    }

    public List<TarefaResponseDTO> listarTarefas(){              
        return tarefaRepository.findAll()
                .stream()
                .map(TarefaMapper::toResponseDTO)
                .toList();    //Retorna uma lista não modificável

    }

    public List<TarefaResponseDTO> listarPorPrioridade(Prioridade prioridade) {

        return tarefaRepository.findByPrioridade(prioridade)
                .stream()
                .map(TarefaMapper::toResponseDTO)
                .toList();
    }

    public List<TarefaResponseDTO> listarPorConclusao(boolean concluida) {

        return tarefaRepository.findByConcluida(concluida)
            .stream()
            .map(TarefaMapper::toResponseDTO)
            .toList();
    }

    public List<TarefaResponseDTO> listarPorPrioridadeEConclusao(
    Prioridade prioridade,
    Boolean concluida) {

    List<Tarefa> tarefas;

    if (prioridade != null && concluida != null) {
        tarefas = tarefaRepository
            .findByPrioridadeAndConcluida(prioridade, concluida);

    } else if (prioridade != null) {
        tarefas = tarefaRepository.findByPrioridade(prioridade);

    } else if (concluida != null) {
        tarefas = tarefaRepository.findByConcluida(concluida);

    } else {
        tarefas = tarefaRepository.findAll();
    }

    return tarefas.stream()
        .map(TarefaMapper::toResponseDTO)
        .toList();
}

    private Tarefa buscarEntidadePorId(Long id) {
        return tarefaRepository.findById(id)
            .orElseThrow(() -> new TarefaNaoEncontradaException("Tarefa não encontrada"));
    }

    public TarefaResponseDTO buscarTarefaPorId(Long id){
        Tarefa tarefa = buscarEntidadePorId(id);
        return TarefaMapper.toResponseDTO(tarefa);
    }

    public TarefaResponseDTO atualizarTarefa(Long id, TarefaRequestDTO dto){
        Tarefa tarefa = buscarEntidadePorId(id);

        tarefa.setTitulo(dto.titulo());
        tarefa.setDescricao(dto.descricao());
        tarefa.setPrioridade(dto.prioridade());
        tarefa.setConcluida(dto.concluida());

        Tarefa tarefaAtualizada =  tarefaRepository.save(tarefa);

        return TarefaMapper.toResponseDTO(tarefaAtualizada);
    }

    public void excluirTarefa(Long id){
        Tarefa tarefa = buscarEntidadePorId(id);
        tarefaRepository.delete(tarefa);

    }

    public DashboardResponseDTO obterDashboard() {

        return new DashboardResponseDTO(
            tarefaRepository.count(),
            tarefaRepository.countByConcluida(true),
            tarefaRepository.countByConcluida(false),
            tarefaRepository.countByPrioridade(Prioridade.ALTA),
            tarefaRepository.countByPrioridade(Prioridade.MEDIA),
            tarefaRepository.countByPrioridade(Prioridade.BAIXA)
        );
    }
}
