import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase (versão simplificada para teste)
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);

// Serviços Firebase (apenas os essenciais)
const auth = getAuth(app);
const db = getFirestore(app);

// Exportação dos serviços
export { auth, db };
