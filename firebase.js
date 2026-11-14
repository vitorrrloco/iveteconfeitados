import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

// Configuração Web do projeto Ivete Confeitados.
const firebaseConfig = {
  apiKey: 'AIzaSyBqxo7C-_Zj68Pds_3_LSrFC87dbJBfycs',
  authDomain: 'ivete-confeitados.firebaseapp.com',
  projectId: 'ivete-confeitados',
  storageBucket: 'ivete-confeitados.firebasestorage.app',
  messagingSenderId: '739981238602',
  appId: '1:739981238602:web:de5da3bffc35a4790ea1b3',
  measurementId: 'G-7Q3CWNDYLZ'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const authScreen = document.getElementById('authScreen');
const statusPill = document.getElementById('syncStatus');
const logoutBtn = document.getElementById('logoutBtn');
const errorBox = document.getElementById('authError');
let activeUser = null;
let unsubscribeData = null;
let saveTimer = null;
let firstSnapshot = true;
let writing = false;

function setStatus(message, color) {
  statusPill.textContent = message;
  statusPill.style.background = color || '#f8edf1';
}
function showAuth(show) {
  authScreen.style.display = show ? 'flex' : 'none';
  logoutBtn.style.display = show ? 'none' : 'inline-flex';
}
function authError(error) {
  const messages = {
    'auth/invalid-email': 'Digite um e-mail válido.',
    'auth/missing-password': 'Digite sua senha.',
    'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
    'auth/email-already-in-use': 'Este e-mail já possui uma conta. Tente entrar.',
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/user-not-found': 'Conta não encontrada. Crie sua conta primeiro.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco e tente novamente.',
    'auth/unauthorized-domain': 'Este domínio ainda não foi autorizado no Firebase Authentication.'
  };
  errorBox.textContent = messages[error.code] || `Não foi possível concluir: ${error.message || error.code}`;
}
async function login() {
  errorBox.textContent = '';
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  try { await signInWithEmailAndPassword(auth, email, password); }
  catch (e) { authError(e); }
}
async function register() {
  errorBox.textContent = '';
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  try { await createUserWithEmailAndPassword(auth, email, password); }
  catch (e) { authError(e); }
}
document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('registerBtn').addEventListener('click', register);
document.getElementById('authPassword').addEventListener('keydown', e => { if (e.key === 'Enter') login(); });
window.iveteLogout = async () => { if (confirm('Deseja sair da sua conta?')) await signOut(auth); };

window.iveteCloudSave = data => {
  if (!activeUser || writing) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      setStatus('Sincronizando...');
      await setDoc(doc(firestore, 'users', activeUser.uid), {
        data,
        updatedAt: serverTimestamp()
      }, { merge: true });
      setStatus('Sincronizado', '#e9f5ef');
    } catch (e) {
      console.error(e);
      setStatus('Falha na sincronização', '#fff0f1');
    }
  }, 650);
};

onAuthStateChanged(auth, async user => {
  activeUser = user;
  if (unsubscribeData) { unsubscribeData(); unsubscribeData = null; }
  if (!user) {
    showAuth(true);
    setStatus('Faça login');
    return;
  }
  showAuth(false);
  setStatus('Carregando nuvem...');
  const userDoc = doc(firestore, 'users', user.uid);
  try {
    const initial = await getDoc(userDoc);
    if (!initial.exists()) {
      const local = JSON.parse(localStorage.getItem('ivete_data') || '{}');
      const hasLocal = Object.values(local).some(v => Array.isArray(v) && v.length);
      if (hasLocal) await setDoc(userDoc, { data: local, updatedAt: serverTimestamp() });
      else await setDoc(userDoc, { data: {}, updatedAt: serverTimestamp() });
    }
    firstSnapshot = true;
    unsubscribeData = onSnapshot(userDoc, snapshot => {
      if (!snapshot.exists()) return;
      const cloudData = snapshot.data().data || {};
      writing = true;
      window.iveteApplyCloudData(cloudData);
      writing = false;
      firstSnapshot = false;
      setStatus('Sincronizado', '#e9f5ef');
    }, error => {
      console.error(error);
      setStatus('Erro de acesso ao banco', '#fff0f1');
    });
  } catch (e) {
    console.error(e);
    setStatus('Erro ao conectar', '#fff0f1');
    errorBox.textContent = 'Não foi possível carregar os dados. Verifique as regras do Firestore e sua conexão.';
  }
});
