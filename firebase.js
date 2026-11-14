import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBqxo7C-_Zj68Pds_3_LSrFC87dbJBfycs',
  authDomain: 'ivete-confeitados.firebaseapp.com',
  projectId: 'ivete-confeitados',
  storageBucket: 'ivete-confeitados.firebasestorage.app',
  messagingSenderId: '739981238602',
  appId: '1:739981238602:web:de5da3bffc35a4790ea1b3',
  measurementId: 'G-7Q3CWNDYLZ'
};
const app=initializeApp(firebaseConfig),auth=getAuth(app),firestore=getFirestore(app);
const authScreen=document.getElementById('authScreen'),logoutBtn=document.getElementById('logoutBtn'),errorBox=document.getElementById('authError');
let activeUser=null,unsubscribe=null,saveTimer=null,writing=false;
function showAuth(show){authScreen.style.display=show?'flex':'none';logoutBtn.style.display=show?'none':'inline-flex'}
function showError(e){const map={'auth/invalid-email':'Digite um e-mail válido.','auth/missing-password':'Digite sua senha.','auth/weak-password':'A senha precisa ter pelo menos 6 caracteres.','auth/email-already-in-use':'Este e-mail já possui conta.','auth/invalid-credential':'E-mail ou senha incorretos.','auth/user-not-found':'Conta não encontrada. Crie sua conta primeiro.','auth/too-many-requests':'Muitas tentativas. Aguarde um pouco.','auth/unauthorized-domain':'Domínio não autorizado no Firebase.'};errorBox.textContent=map[e.code]||e.message||'Não foi possível entrar.'}
async function login(){errorBox.textContent='';try{await signInWithEmailAndPassword(auth,document.getElementById('authEmail').value.trim(),document.getElementById('authPassword').value)}catch(e){showError(e)}}
async function register(){errorBox.textContent='';try{await createUserWithEmailAndPassword(auth,document.getElementById('authEmail').value.trim(),document.getElementById('authPassword').value)}catch(e){showError(e)}}
document.getElementById('loginBtn').addEventListener('click',login);
document.getElementById('registerBtn').addEventListener('click',register);
document.getElementById('authPassword').addEventListener('keydown',e=>{if(e.key==='Enter')login()});
logoutBtn.addEventListener('click',async()=>{if(confirm('Deseja sair da sua conta?'))await signOut(auth)});
window.iveteCloudSave=data=>{if(!activeUser||writing)return;clearTimeout(saveTimer);saveTimer=setTimeout(async()=>{try{await setDoc(doc(firestore,'users',activeUser.uid),{data,updatedAt:serverTimestamp()},{merge:true})}catch(e){console.error('Falha ao salvar no Firestore:',e);alert('Não foi possível sincronizar os dados. Verifique a conexão e as regras do Firestore.')}},700)};
onAuthStateChanged(auth,async user=>{
 activeUser=user;if(unsubscribe){unsubscribe();unsubscribe=null}
 if(!user){showAuth(true);return}
 showAuth(false);
 const ref=doc(firestore,'users',user.uid);
 try{
  const initial=await getDoc(ref);
  if(!initial.exists()){
   const local=JSON.parse(localStorage.getItem('ivete_data')||'{}');
   const hasLocal=Object.values(local).some(v=>Array.isArray(v)&&v.length);
   await setDoc(ref,{data:hasLocal?local:{},updatedAt:serverTimestamp()});
  }
  unsubscribe=onSnapshot(ref,snap=>{
   if(!snap.exists())return;
   writing=true;
   try{window.iveteApplyCloudData(snap.data().data||{})}finally{writing=false}
   window.iveteSetCloudReady?.();
  },e=>{console.error('Erro Firestore:',e);alert('Erro ao carregar dados da nuvem. Confira as regras do Firestore.')});
 }catch(e){console.error(e);errorBox.textContent='Não foi possível carregar os dados. Verifique as regras do Firestore.'}
});