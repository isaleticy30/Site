import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase (versão simplificada para teste)
const firebaseConfig = {
  apiKey: "AIzaSyD2NbuG3UJ4CH14b-DeZaVcEwcqEnvTScg",
  authDomain: "login---dashboards.firebaseapp.com",
  projectId: "login---dashboards",
  storageBucket: "login---dashboards.appspot.com",
  messagingSenderId: "885976601485",
  appId: "1:885976601485:web:cb967bedab0961d7b863c4",
  measurementId: "G-6E88T633DL"
};

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);

// Serviços Firebase (apenas os essenciais)
const auth = getAuth(app);
const db = getFirestore(app);

// Exportação dos serviços
export { auth, db };