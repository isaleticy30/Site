import { useState, useEffect } from 'react';
import { auth, db } from './firebase.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import './Cadastro.css';

const Cadastro = () => {
  // Estado que controla qual aba tá ativa: 'auth' (criar conta) ou 'user' (dados pessoais)
  const [activeTab, setActiveTab] = useState('auth');
  // Estado que indica se alguma operação está rolando (criar conta ou salvar dados)
  const [loading, setLoading] = useState(false);
  // Estado pra armazenar os dados de autenticação digitados (email, senha, confirmar senha)
  const [authData, setAuthData] = useState({
    email: '',
    senha: '',
    confirmarSenha: '',
  });
  // Estado pra armazenar os dados pessoais digitados após criar conta (nome, usuário, departamento, unidade)
  const [userData, setUserData] = useState({
    nome: '',
    usuario: '',
    departamento: '',
    unidade: '',
  });
  // Estado que guarda o usuário autenticado atualmente (null se ninguém logado)
  const [user, setUser] = useState(null);

  // Monitorar login atual
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // atualiza o estado com o usuário logado
    });

    return () => unsubscribe(); // limpeza do listener
  }, []);

  // Funções de validação simples
  const validateAuthForm = () => {
    if (!authData.email.includes('@')) {
      toast.error('Email inválido');
      return false;
    }
    if (authData.senha.length < 6) {
      toast.error('Senha precisa ter pelo menos 6 caracteres');
      return false;
    }
    if (authData.senha !== authData.confirmarSenha) {
      toast.error('Senhas não conferem');
      return false;
    }
    return true;
  };

  const validateUserForm = () => {
    if (!userData.nome.trim()) {
      toast.error('Nome é obrigatório');
      return false;
    }
    if (!userData.usuario.trim()) {
      toast.error('Usuário é obrigatório');
      return false;
    }
    if (!userData.departamento.trim()) {
      toast.error('Departamento é obrigatório');
      return false;
    }
    if (!userData.unidade.trim()) {
      toast.error('Unidade é obrigatório');
      return false;
    }
    return true;
  };

  // Criar conta e mandar email verificação
  const handleCriarConta = async () => {
    if (!validateAuthForm()) return;

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        authData.email,
        authData.senha
      );
      await sendEmailVerification(userCredential.user);
      toast.success('Conta criada! Verifique seu email para ativar.');
      setAuthData({ email: '', senha: '', confirmarSenha: '' });
      setActiveTab('user');
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email já está em uso');
      } else {
        toast.error('Erro ao criar conta');
      }
    }
    setLoading(false);
  };

  // Salvar dados do usuário no Firestore
  const handleSalvarUsuario = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para salvar dados do usuário.');
      return;
    }
    if (!validateUserForm()) return;

    setLoading(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        nome: userData.nome,
        usuario: userData.usuario,
        departamento: userData.departamento,
        unidade: userData.unidade,
        email: user.email,
        criadoEm: Timestamp.now(),
      });
      toast.success('Dados do usuário salvos com sucesso!');
      setUserData({ nome: '', usuario: '', departamento: '', unidade: '', });
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar dados do usuário');
    }
    setLoading(false);
  };

  return (
    <div className="cadastro-background">
      <div className="cadastro-container">
        <div className="cadastro-tabs">
          <button
            className={activeTab === 'auth' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('auth')}
            disabled={loading}
          >
            Autenticação
          </button>
          <button
            className={activeTab === 'user' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('user')}
            disabled={loading}
          >
            Usuário
          </button>
        </div>

        {activeTab === 'auth' && (
          <form
            className="cadastro-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleCriarConta();
            }}
          >
            <input
              type="email"
              placeholder="Email"
              value={authData.email}
              onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
              required
              disabled={loading}
              className="cadastro-input"
            />
            <input
              type="password"
              placeholder="Senha"
              value={authData.senha}
              onChange={(e) => setAuthData({ ...authData, senha: e.target.value })}
              required
              minLength={6}
              disabled={loading}
              className="cadastro-input"
            />
            <input
              type="password"
              placeholder="Confirmar senha"
              value={authData.confirmarSenha}
              onChange={(e) => setAuthData({ ...authData, confirmarSenha: e.target.value })}
              required
              disabled={loading}
              className="cadastro-input"
            />
            <button type="submit" disabled={loading} className="cadastro-button">
              {loading ? 'Carregando...' : 'Criar Conta'}
            </button>
          </form>
        )}
        {activeTab === 'user' && (
          <form
            className="cadastro-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSalvarUsuario();
            }}
          >
            <input
              type="text"
              placeholder="Nome"
              value={userData.nome}
              onChange={(e) => setUserData({ ...userData, nome: e.target.value })}
              required
              disabled={loading}
              className="cadastro-input"
            />
            <input
              type="text"
              placeholder="Usuário"
              value={userData.usuario}
              onChange={(e) => setUserData({ ...userData, usuario: e.target.value })}
              required
              disabled={loading}
              className="cadastro-input"
            />
            <select
              value={userData.departamento || ""}
              onChange={(e) => setUserData({ ...userData, departamento: e.target.value })}
              required
              disabled={loading}
              className="cadastro-input"
              style={{color: userData.departamento ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.6)',backgroundColor: 'black',}}>
              <option value="">Selecione o Departamento</option>
              <option value="ALMOXARIFADO">ALMOXARIFADO</option>
              <option value="CENTRAL DE NOTAS">CENTRAL DE NOTAS</option>
              <option value="COMPLIANCE E DIREITOS HUMANOS">COMPLIANCE E DIREITOS HUMANOS</option>
              <option value="COMPRAS">COMPRAS</option>
              <option value="CONTABILIDADE">CONTABILIDADE</option>
              <option value="CONTROLADORIA">CONTROLADORIA</option>
              <option value="CSC">CSC</option>
              <option value="OPERACIONAL - SERVIÇOS">OPERACIONAL - SERVIÇOS</option>
              <option value="OPERACIONAL">OPERACIONAL</option>
              <option value="DEPARTAMENTO PESSOAL">DEPARTAMENTO PESSOAL</option>
              <option value="FINANCEIRO">FINANCEIRO</option>
              <option value="FROTAS">FROTAS</option>
              <option value="JURÍDICO CÍVEL">JURÍDICO CÍVEL</option>
              <option value="JURÍDICO TRABALHISTA">JURÍDICO TRABALHISTA</option>
              <option value="MONITORIA">MONITORIA</option>
              <option value="PROCESSOS">PROCESSOS</option>
              <option value="RECURSOS HUMANOS">RECURSOS HUMANOS</option>
              <option value="SAÚDE, SEGURANÇA, MEIO AMBIENTE E QUALIDADE">SAÚDE, SEGURANÇA, MEIO AMBIENTE E QUALIDADE</option>
              <option value="SEGURANÇA DO TRABALHO">SEGURANÇA DO TRABALHO</option>
              <option value="SUPPLY CHAIN">SUPPLY CHAIN</option>
              <option value="TECNOLOGIA DA INFORMAÇÃO">TECNOLOGIA DA INFORMAÇÃO</option>
            </select>
            <select
              value={userData.unidade || ""}
              onChange={(e) => setUserData({ ...userData, unidade: e.target.value })}
              required
              disabled={loading}
              className="cadastro-input"
              style={{
                color: userData.unidade ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                backgroundColor: 'black',
              }}>
              <option value="">Selecione a Unidade de Trabalho</option>
              <option value="APARECIDA DE GOIÂNIA">APARECIDA DE GOIÂNIA</option>
              <option value="CALDAS NOVAS">CALDAS NOVAS</option>
              <option value="CATALÃO">CATALÃO</option>
              <option value="CUIABÁ">CUIABÁ</option>
              <option value="ITUMBIARA">ITUMBIARA</option>
              <option value="MORRINHOS">MORRINHOS</option>
              <option value="PALMAS">PALMAS</option>
              <option value="PIRES DO RIO">PIRES DO RIO</option>
              <option value="RIO VERDE">RIO VERDE</option>
              <option value="VÁRZEA GRANDE">VÁRZEA GRANDE</option>
            </select>
            <button type="submit" disabled={loading || !user} className="cadastro-button">{loading ? 'Carregando...' : 'Salvar Dados'}</button>
            {!user && (<p style={{ color: 'red', marginTop: '10px' }}>Você precisa estar logado para salvar os dados.</p>)}
          </form>
        )}
        
        {/* Adicionando o link "Já tem login? Entre na Sua Conta" */}
        <div style={{ textAlign: 'center', marginTop: '20px', color: 'white' }}>
          Já tem login? <a href="/login" style={{ color: '#4CAF50', textDecoration: 'none' }}>Entre na Sua Conta</a>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;