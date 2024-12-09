import React, { useEffect, useState } from 'react';
import { Tarefa } from '../interfaces/Tarefa';
import { Categoria } from '../interfaces/Categoria';

function ListaTarefasConcluidas(){
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);

    useEffect(() => {
        getTarefasConcluidas();

        fetch('http://localhost:5000/categoria/listar') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição: ' + response.statusText);
            }

            return response.json();
        })
        .then(data => {
            setCategorias(data);
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    }, []);

    function getTarefasConcluidas(){
        fetch('http://localhost:5000/tarefas/concluidas')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição: ' + response.statusText);
            }

            return response.json();
        })
        .then(data => {
            setTarefas(data);
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    }


    function getNomeCategoria(id: string):string{
        var nome = "";
        
        categorias.map(
            categoria => {
                if(categoria.categoriaId == id){
                    nome = categoria.nome;
                }
            }
        );

        return nome;
    }

    function deletarTarefa(id: string){
        fetch(`http://localhost:5000/tarefas/deletar/${id}`,  {method: 'DELETE'})
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                getTarefasConcluidas();
            })
            .catch(error => {
                console.error('Erro:', error);
            });

        return id;
    }

    function listagem(){
        if(tarefas.length > 0){
            return(
                tarefas.map(t => (
                    <tr key={t.tarefaId}>
                        <td>{t.titulo}</td>
                        <td>{t.descricao}</td>
                        <td>{getNomeCategoria(t.categoriaId)}</td>
                        <td>{t.status}</td>
                        <td>{t.criadoEm.toString()}</td>
                        <td className='acoes'>
                            <button onClick={e => {deletarTarefa(t.tarefaId)}} className='deletar'>Deletar</button>
                        </td>
                    </tr>
                ))
            );
        }else{
            return(
                <tr>
                    <td colSpan={6}>Nenhuma tarefa encontrada</td>
                </tr>
            );
        }
    }

    return (
        <div>
            <h1>Lista de Tarefas Concluídas</h1>
            <table border={1}>
                <thead>
                    <tr>
                        <th>Titulo</th>
                        <th>Descrição</th>
                        <th>Categoria</th>
                        <th>Status</th>
                        <th>Criado em</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {listagem()}
                </tbody>
            </table>
        </div>
    );
}

export default ListaTarefasConcluidas;