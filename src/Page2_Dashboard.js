import { useState, useEffect } from 'react';
import { auth } from './firebase.js';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase.js';
import dashboards from './DashboardPermissions';
import './Page2_Dashboard.css';

const Dashboard = () => {
  // Estados pra usuário logado, departamento, nome, aba ativa
  const [user, setUser] = useState(null);
  const [userDepartment, setUserDepartment] = useState(null);
  const [userName, setUserName] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const navigate = useNavigate();

  // Hook que roda só uma vez: fica de olho na autenticação do Firebase
  useEffect(() => {
    // Assina o evento de mudança de usuário logado
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user); // Atualiza o usuário no estado
      if (user) {
        // Se tiver usuário logado, pega os dados dele no Firestore
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserDepartment(data.departamento); // Pega o departamento
          setUserName(data.nome); // Pega o nome
        }
      }
    });
    // Desinscreve o listener quando o componente desmonta
    return unsubscribe;
  }, []);

  // Função pra deslogar usuário e mandar pra página inicial
  const logout = () => {
    auth.signOut();
    navigate('/');
  };

  // Função pra trocar a aba ativa
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // Voltar pra aba principal
  const handleBack = () => {
    setActiveTab(null);
  };

  // Enquanto carrega as permissões do usuário, mostra essa mensagem
  if (user && !userDepartment) {
    return <p>Carregando permissões...</p>;
  }

  // Render principal
  return (
    <div className="dashboard-container">
      {user ? (  // Se usuário tá logado, mostra dashboard
        <>
          <div className="dashboard-header">
            {/* Mostra mensagem de boas-vindas ou título da aba */}
            <h2>
              {activeTab === null ? `Bem-vindo(a), ${userName || user.displayName || user.email}` : 'Machine Learning'}
            </h2>
            {/* Botão de sair ou voltar, dependendo da aba */}
            {activeTab === null ? (
              <button onClick={logout} className="logout-button">Sair</button>
            ) : (
              <button onClick={handleBack} className="back-button">Voltar</button>
            )}
          </div>

          <div className="content-area">
            {activeTab === null ? (
              // Tela inicial: cartão pra entrar no Machine Learning
              <div className="ml-card" onClick={() => handleTabClick('machineLearning')}>
                <img src="/ML.png" alt="Machine Learning" />
                <span>Machine Learning</span>
              </div>
            ) : (
              // Tela dentro da aba Machine Learning: lista de dashboards permitidos pro departamento do usuário
              <div className="dashboard-list">
                <h3>Dashboards Preditivos</h3>
                {dashboards
                    // Filtra dashboards que têm o departamento do usuário na lista de permissões
                    .filter(d =>
                      d.departamentos.map(dep => dep.toUpperCase().trim())
                        .includes(userDepartment?.toUpperCase().trim())
                    )
                    // Mapeia cada dashboard permitido pra um card clicável que abre a URL em nova aba
                    .map((d, i) => (
                    <div key={i} onClick={() => window.open(d.url, '_blank')} className="dashboard-item" style={{ color: d.cor }} >
                      <h4>{d.nome}</h4>
                      <p>{d.descricao}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </>
      ) : (
        // Se não tem usuário, mostra carregando
        <div> <p>Carregando...</p> </div>
      )}
    </div>
  );
};

export default Dashboard;