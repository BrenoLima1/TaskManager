package com.brenolima.taskmanager.dto;

public record DashboardResponseDTO(
    long totalTarefas,
    long tarefasConcluidas,
    long tarefasPendentes,
    long tarefasPrioridadeAlta,
    long tarefasPrioridadeMedia,
    long tarefasPrioridadeBaixa
) {
}