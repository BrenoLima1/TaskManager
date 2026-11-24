package com.brenolima.taskmanager.dto;

import com.brenolima.taskmanager.enums.Prioridade;

public record TarefaResponseDTO(

    Long id,
    String titulo,
    String descricao,
    Prioridade prioridade,
    boolean concluida

) {
}