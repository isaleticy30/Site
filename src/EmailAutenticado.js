// Importa o CSS do react-toastify (mesmo que não use toast aqui, tá no código)
import 'react-toastify/dist/ReactToastify.css';

// Componente simples que mostra uma mensagem de sucesso na autenticação do email
const EmailAutenticado = () => {
  return (
    // Div com estilo inline pra centralizar o texto, deixar preto e dar um espaçamento
    <div style={{
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      color: 'black',
      fontSize: '1.5rem',
      padding: '2rem'
    }}>
      {/* Mensagem que aparece quando o email foi autenticado */}
      <p>Email autenticado com sucesso!</p>
      <p>Por favor, feche esta aba.</p>
    </div>
  );
};

// Exporta o componente pra usar em outras partes do app
export default EmailAutenticado;