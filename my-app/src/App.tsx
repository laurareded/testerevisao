import React from 'react';
import { Link, Route } from 'react-router-dom';
import { BrowserRouter, Routes } from 'react-router-dom';
import ListaTarefas from './components/ListarTarefas'; 
import './css/App.css';
import CadastrarTarefa from './components/CadastrarTarefa';
import AlterarTarefa from './components/AlterarTarefa'; 
import ListaTarefasConcluidas from './components/ListaTarefasConcluidas';
import ListaTarefasNaoConcluidas from './components/ListaTarefasNaoConcluidas';

function App() {
  return (
    <div>
      <BrowserRouter>
        <div className="App">
          <nav>
              <ul>
                  <li>
                      <Link to="/pages/tarefa/listar">Lista de Tarefas</Link>
                  </li>
                  <li>
                      <Link to="/pages/tarefa/cadastrar">Cadastro de Tarefa</Link>
                  </li>
                  <li>
                      <Link to="/pages/tarefa/concluidas">Tarefas Concluídas</Link>
                  </li>
                  <li>
                      <Link to="/pages/tarefa/naoConcluida">Tarefas Não Concluídas</Link>
                  </li>
                  <li>
                    <Link to="/pages/tarefa/alterar/:id">Alterar Tarefas</Link>
                  </li>
              </ul>
          </nav>
          <Routes>
              <Route path="/pages/tarefa/listar" element={<ListaTarefas />} />
              <Route path="/pages/tarefa/cadastrar" element={<CadastrarTarefa />} />
              <Route path="/pages/tarefa/alterar/:id" element={<AlterarTarefa />} /> 
              <Route path="/pages/tarefa/concluidas" element={<ListaTarefasConcluidas />} />
              <Route path="/pages/tarefa/naoConcluida" element={<ListaTarefasNaoConcluidas />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;