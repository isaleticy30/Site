import { useState, useEffect } from 'react';
import { auth } from './firebase.js';
import { confirmPasswordReset } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Page1_Login.css';

const ConfirmarNovaSenha = () => {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmada, setConfirmada] = useState('');
  const [oobCode, setOobCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('oobCode');

    if (code) {
      setOobCode(code);
    } else {
      toast.error("Link inválido ou expirado");
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!oobCode) {
      toast.error("Código de redefinição inválido");
      return;
    }

    if (novaSenha !== confirmada) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (novaSenha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    
    try {
      await confirmPasswordReset(auth, oobCode, novaSenha);
      toast.success("Senha redefinida com sucesso!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Erro detalhado:", error);
      
      let errorMessage = "Erro ao redefinir senha";
      switch (error.code) {
        case 'auth/expired-action-code':
          errorMessage = "O link expirou. Solicite um novo.";
          break;
        case 'auth/invalid-action-code':
          errorMessage = "O link é inválido. Solicite um novo.";
          break;
        case 'auth/user-disabled':
          errorMessage = "Esta conta está desativada.";
          break;
        case 'auth/user-not-found':
          errorMessage = "Usuário não encontrado.";
          break;
        default:
          errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      navigate("/esqueci-senha"); // Redireciona para página de recuperação
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <div className="login-content">
          <h2>Nova Senha</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Nova senha (mínimo 6 caracteres)"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
              minLength="6"
            />
            <input
              type="password"
              placeholder="Confirmar nova senha"
              value={confirmada}
              onChange={(e) => setConfirmada(e.target.value)}
              required
              minLength="6"
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Processando..." : "Redefinir Senha"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmarNovaSenha;