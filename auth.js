// auth.js
// Coloque este arquivo na raiz do projeto e adicione <script type="module" src="auth.js"></script> no seu HTML

// --- CONFIGURAR AQUI: substitua com seu firebaseConfig obtido no console ---
const firebaseConfig = {
  apiKey: "AIzaSyA_BYNsmC6e8gYsWXV4GNdVJlFfo9Unou0",
  authDomain: "ecofolia-52ef9.firebaseapp.com",
  projectId: "ecofolia-52ef9",
  storageBucket: "ecofolia-52ef9.firebasestorage.app",
  messagingSenderId: "80195448589",
  appId: "1:80195448589:web:85cb2384e2e06a41538a44"
};
// -----------------------------------------------------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ---------- Helpers para UI (opcional) ---------- */
function showMessage(msg, type = 'info') {
  // implemente como quiser — por enquanto alert simples
  alert(msg);
}

/* ---------- Cadastro (criar usuário com email+senha) ---------- */
export async function signUp(email, password, extra = {}) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Salvar perfil adicional no Firestore (NÃO salvar senha)
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      email: user.email,
      createdAt: new Date().toISOString(),
      ...extra
    });

    showMessage('Cadastro realizado com sucesso!', 'success');
    return user;
  } catch (error) {
    console.error("Erro no signUp:", error);
    showMessage(error.message || "Erro no cadastro", "error");
    throw error;
  }
}

/* ---------- Login ---------- */
export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    showMessage('Login efetuado com sucesso!', 'success');
    return user;
  } catch (error) {
    console.error("Erro no signIn:", error);
    showMessage(error.message || "Erro no login", "error");
    throw error;
  }
}

/* ---------- Logout ---------- */
export async function logout() {
  try {
    await signOut(auth);
    showMessage('Você saiu da conta.', 'info');
  } catch (error) {
    console.error("Erro no logout:", error);
  }
}

/* ---------- Monitorar estado do usuário (opcional) ---------- */
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("Usuário logado:", user.uid, user.email);
    // opcional: pegar perfil firestore
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        console.log("Perfil:", userDoc.data());
      }
    } catch (e) {
      console.warn("Erro ao buscar perfil:", e);
    }
    // Atualize UI: exibir nome, mostrar botão logout, etc.
  } else {
    console.log("Nenhum usuário logado.");
    // Atualize UI: mostrar formulário de login/cadastro
  }
});

/* ---------- Verificar se usuário está autenticado ---------- */
export function getCurrentUser() {
  return auth.currentUser;
}

/* ---------- Obter dados do usuário ---------- */
export async function getUserData(uid) {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return null;
  }
}

/* ---------- Redirecionar para login se não autenticado ---------- */
export function requireAuth(callback) {
  const user = getCurrentUser();
  if (!user) {
    showMessage('Você precisa fazer login para acessar esta funcionalidade', 'warning');
    // Opcional: redirecionar para página de login
    // window.location.href = 'login.html';
    return null;
  }
  return callback(user);
}

/* ---------- Código para ligar forms HTML automaticamente (se existir) ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = signupForm.querySelector('input[name="email"]').value.trim();
      const password = signupForm.querySelector('input[name="password"]').value;
      const nome = signupForm.querySelector('input[name="nome"]') ? signupForm.querySelector('input[name="nome"]').value.trim() : '';
      try {
        await signUp(email, password, { nome });
        signupForm.reset();
      } catch (err) {
        // erro tratado na função signUp
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('input[name="email"]').value.trim();
      const password = loginForm.querySelector('input[name="password"]').value;
      try {
        await signIn(email, password);
        loginForm.reset();
      } catch (err) {
        // erro tratado na função signIn
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await logout();
    });
  }
});
