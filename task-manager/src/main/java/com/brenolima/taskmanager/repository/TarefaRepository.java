package com.brenolima.taskmanager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.brenolima.taskmanager.entity.Tarefa;
import com.brenolima.taskmanager.enums.Prioridade;

public interface TarefaRepository extends JpaRepository<Tarefa, Long>{

    List<Tarefa> findByPrioridade(Prioridade prioridade);

    List<Tarefa> findByConcluida(boolean concluida);

    List<Tarefa> findByPrioridadeAndConcluida(
        Prioridade prioridade,
        boolean concluida
    );

    long countByConcluida(boolean concluida);

    long countByPrioridade(Prioridade prioridade);

    long count();
    
}
