import { Routes, Route } from 'react-router-dom';
import Login from './Page1_Login.js';
import Cadastro from './Cadastro.js';
import Dashboard from './Page2_Dashboard.js';
import ResetSenha from './ResetSenha.js';
import ConfirmarNovaSenha from './ConfirmarNovaSenha.js';
import EmailAutenticado from './EmailAutenticado';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Função principal do app (componente raiz)
function App() {
  return (
    <>
      {/* Container que exibe os toasts (notificações) automáticos com tempo de 3 segundos */}
      <ToastContainer autoClose={3000} />

      {/* Definição das rotas da aplicação */}
      <Routes>
        {/* Rota para a página de login (página inicial) */}
        <Route path="/" element={<Login />} />

        {/* Rota para a página de cadastro */}
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rota para o dashboard (página principal após login) */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Rota para resetar a senha */}
        <Route path="/resetar-senha" element={<ResetSenha />} />

        {/* Rota para confirmar a nova senha após reset */}
        <Route path="/confirmar-nova-senha" element={<ConfirmarNovaSenha />} />

        {/* Rota para a página de confirmação de e-mail autenticado */}
        <Route path="/email-autenticado" element={<EmailAutenticado />} />
      </Routes>
    </>
  );
}

// Exporta o componente App para ser usado em outros arquivos (como index.js)
export default App;