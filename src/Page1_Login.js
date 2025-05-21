import { useState } from 'react';
import { auth } from './firebase.js';
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './Page1_Login.css';

const Login = () => {
  // Estados pra controlar o email, senha e loading
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Hook pra navegar entre as páginas
  const navigate = useNavigate();

  // Função que roda quando o usuário envia o formulário de login
  const handleLogin = async (e) => {
    e.preventDefault(); // Evita que a página recarregue ao enviar o form
    setLoading(true); // Ativa o loading pra bloquear botão e avisar que tá processando
    
    try {
      // Tenta logar com o email e senha pelo Firebase
      await signInWithEmailAndPassword(auth, email, senha);
      // Se deu bom, manda o usuário pra página do dashboard
      navigate('/dashboard');
    } catch (error) {
      // Se deu ruim, mostra um aviso de erro
      toast.error("Email ou senha inválidos!");
    } finally {
      // Desativa o loading, tanto faz se deu bom ou ruim
      setLoading(false);
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <div className="login-content">
          <h2>LOGIN</h2>
          {/* Formulário de login */}
          <form onSubmit={handleLogin}>
            {/* Campo de email */}
            <input 
              type="email" 
              placeholder="E-mail" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} // Atualiza email no estado
              required 
            />
            {/* Campo de senha */}
            <input 
              type="password" 
              placeholder="Senha" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} // Atualiza senha no estado
              required
            />
            {/* Botão que desativa quando tá carregando */}
            <button type="submit" disabled={loading}>
              {loading ? 'Carregando...' : 'Entrar'}
            </button>
          </form>
          {/* Link pra página de cadastro */}
          <Link to="/cadastro" className="signup-link">Cadastre-se</Link>
          {/* Link pra página de resetar senha */}
          <Link to="/resetar-senha" className="forgot-password-link">Esqueceu a Senha?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;