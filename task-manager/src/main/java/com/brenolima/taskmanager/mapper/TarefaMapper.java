package com.brenolima.taskmanager.mapper;

import com.brenolima.taskmanager.dto.TarefaRequestDTO;
import com.brenolima.taskmanager.dto.TarefaResponseDTO;
import com.brenolima.taskmanager.entity.Tarefa;

public class TarefaMapper {

    public static Tarefa toEntity(TarefaRequestDTO dto) {

        Tarefa tarefa = new Tarefa();

        tarefa.setTitulo(dto.titulo());
        tarefa.setDescricao(dto.descricao());
        tarefa.setPrioridade(dto.prioridade());
        tarefa.setConcluida(dto.concluida());

        return tarefa;
    }

    public static TarefaResponseDTO toResponseDTO(Tarefa tarefa) {

        return new TarefaResponseDTO(
            tarefa.getId(),
            tarefa.getTitulo(),
            tarefa.getDescricao(),
            tarefa.getPrioridade(),
            tarefa.isConcluida()
        );

    }

}