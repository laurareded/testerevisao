import React, { useEffect, useState } from 'react';
import { Categoria } from '../interfaces/Categoria';
import { useNavigate } from 'react-router-dom';

function CadastrarTarefa(){
    const navigate = useNavigate();
    const [titulo, setTitulo] = useState<string>('');
    const [descricao, setDescricao] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [categoriaId, setCategoriaId] = useState<string>('');
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    
    useEffect(() => {
        carregarCategorias();
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

    function handleSubmit (e: any) {
        e.preventDefault();

        const novaTarefa = {
            titulo,
            descricao,
            status,
            categoriaId
        };

        fetch('http://localhost:5000/tarefas/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaTarefa)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            setTitulo('');
            setDescricao('');
            setStatus('');
            setCategoriaId('');
            navigate("/pages/tarefa/listar");
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    };

    return (
        <div>
            <h2>Cadastrar Nova Tarefa</h2>
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
                    <select onChange={(e: any) => setCategoriaId(e.target.value)} required>
                        <option>Selecione...</option>
                        {categorias.map((categoria) => (
                            <option value={categoria.categoriaId} key={categoria.categoriaId}>
                                {categoria.nome}
                            </option>
                        ))}
                   </select>
                </label>
                <button type="submit">Cadastrar</button>
            </form>
        </div>
    );
}

export default CadastrarTarefa;