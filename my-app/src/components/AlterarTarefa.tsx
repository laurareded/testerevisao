import React, { useEffect, useState } from 'react';
import { Categoria } from '../interfaces/Categoria';
import { useNavigate } from 'react-router-dom';

function AlterarTarefa() {
    const navigate = useNavigate();
    const [id, setId] = useState<string>('');
    const [titulo, setTitulo] = useState<string>('');
    const [descricao, setDescricao] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [categoriaId, setCategoriaId] = useState<string>('');
    const [categorias, setCategorias] = useState<Categoria[]>([]);

    useEffect(() => {
        carregarCategorias();
        carregarTarefa();
    }, []);

    function carregarCategorias() {
        fetch("http://localhost:5000/categoria/listar")
            .then((resposta) => resposta.json())
            .then((categorias: Categoria[]) => {
                setCategorias(categorias);
            }).catch(error => {
                console.error('Erro:', error);
            });
    }

    function carregarTarefa() {
        const tarefaId = new URLSearchParams(window.location.search).get("id");
        if (tarefaId) {
            fetch(`http://localhost:5000/tarefas/${tarefaId}`)
                .then(res => res.json())
                .then(tarefa => {
                    setId(tarefa.id);
                    setTitulo(tarefa.titulo);
                    setDescricao(tarefa.descricao);
                    setStatus(tarefa.status);
                    setCategoriaId(tarefa.categoriaId);
                })
                .catch(error => {
                    console.error('Erro ao carregar tarefa:', error);
                });
        }
    }

    function handleSubmit(e: any) {
        e.preventDefault();

        const tarefaAtualizada = {
            id,
            titulo,
            descricao,
            status,
            categoriaId
        };

        fetch(`http://localhost:5000/tarefas/alterar/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tarefaAtualizada)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                navigate("/pages/tarefa/listar");
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    };

    return (
        <div>
            <h2>Alterar Tarefa</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Titulo:
                    <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required />
                </label>
                <label>
                    Descrição:
                    <input type="text" value={descricao} onChange={e => setDescricao(e.target.value)} required />
                </label>
                <label>Categorias:
                    <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} required>
                        <option>Selecione...</option>
                        {categorias.map((categoria) => (
                            <option value={categoria.categoriaId} key={categoria.categoriaId}>
                                {categoria.nome}
                            </option>
                        ))}
                    </select>
                </label>
                <button type="submit">Alterar</button>
            </form>
        </div>
    );
}

export default AlterarTarefa;