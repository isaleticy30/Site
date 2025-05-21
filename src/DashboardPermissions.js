// Array com os dashboards disponíveis
const dashboards = [
  {
    nome: 'Dashboard Preditivo', // Nome do dashboard
    descricao: 'Indicadores preditivos de Ordens de Serviço', // Descrição rápida do que ele mostra
    url: 'http://localhost:8501', // Link pra acessar o dashboard (local no caso)
    departamentos: ['SEGURANÇA DO TRABALHO', 'PROCESSOS'], // Quem tem acesso (departamentos)
    cor: '#4CAF50'
  }
];

// Exporta essa lista pra poder usar em outros arquivos
export default dashboards;