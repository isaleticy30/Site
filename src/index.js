import React from 'react'; // Importa o React pra usar JSX e componentes
import ReactDOM from 'react-dom/client'; // Importa a API nova do ReactDOM pra renderizar na raiz
import App from './App.js'; // Importa o componente principal da aplicação
import './index.css'; // Importa o CSS global do projeto
import { HashRouter } from 'react-router-dom'; // Importa o roteador baseado em hash pra navegação

const root = ReactDOM.createRoot(document.getElementById('root')); 
// Pega o elemento HTML com id 'root' e cria uma raiz React pra renderizar lá dentro

root.render(
  <React.StrictMode>
    {/* React Strict Mode ajuda a pegar erros e avisos durante o desenvolvimento */}
    <HashRouter>
      {/* Envolve a aplicação com roteamento via URL hash (#) */}
      <App />
      {/* Renderiza o componente principal que vai ter todas as outras rotas e componentes */}
    </HashRouter>
  </React.StrictMode>
);