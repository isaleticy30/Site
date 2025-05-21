import { useState } from 'react'; // Hook pra guardar estado do email
import { auth } from './firebase.js'; // Firebase configurado
import { sendPasswordResetEmail } from "firebase/auth"; // Função pra mandar email de reset de senha
import { toast } from 'react-toastify'; // Pra mostrar mensagem de erro/sucesso
import { Link } from 'react-router-dom'; // Link pra navegar entre páginas
import './Page1_Login.css'; // Estilos do login

const ResetSenha = () => {
  const [email, setEmail] = useState(''); // Estado pra guardar o email digitado

  // Função que dispara quando o form é enviado
  const handleReset = async (e) => {
    e.preventDefault(); // Não deixa a página recarregar
    try {
      // Manda o email de reset de senha via Firebase, com link de redirecionamento customizado
      await sendPasswordResetEmail(auth, email, {
        url: 'https://login---dashboards.web.app/login/confirmar-nova-senha', // URL onde o usuário vai depois de clicar no link no email
        handleCodeInApp: true, // Pra tratar o código no app (não só via web)
      });
      toast.success("Email de redefinição enviado!"); // Mensagem de sucesso
    } catch (error) {
      // Trata erros comuns de email inválido ou não cadastrado e exibe mensagem
      if (error.code === 'auth/user-not-found') {
        toast.error("Esse e-mail não está cadastrado.");
      } else if (error.code === 'auth/invalid-email') {
        toast.error("E-mail inválido.");
      } else {
        toast.error("Erro ao tentar redefinir a senha: " + error.message);
      }
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <div className="login-content">
          <h2>Redefinir Senha</h2>
          {/* Form que chama handleReset no submit */}
          <form onSubmit={handleReset}>
            <input 
              type="email" 
              placeholder="Digite seu e-mail" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} // Atualiza o estado do email enquanto digita
              required 
            />
            <button type="submit">Enviar link</button>
          </form>
          {/* Link pra voltar pra página de login */}
          <Link to="/" className="signup-link">Voltar Para a Página de Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetSenha;