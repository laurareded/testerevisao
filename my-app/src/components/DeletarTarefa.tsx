import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DeletarTarefa({ tarefaId }: { tarefaId: string }) {
    const navigate = useNavigate();

    function handleDelete() {
        if (window.confirm("Deseja realmente excluir esta tarefa?")) {
            fetch(`http://localhost:5000/tarefas/deletar/${tarefaId}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao excluir tarefa: ' + response.statusText);
                    }
                    return response.json();
                })
                .then(() => {
                    alert('Tarefa excluída com sucesso!');
                    navigate("/pages/tarefa/listar");
                })
                .catch(error => {
                    console.error('Erro:', error);
                });
        }
    }

    return (
        <button onClick={handleDelete} style={{ color: 'red' }}>
            Excluir
        </button>
    );
}

export default DeletarTarefa;