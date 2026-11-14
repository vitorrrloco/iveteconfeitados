# Ivete Confeitados | versão Firebase + GitHub Pages

Aplicação web responsiva e instalável (PWA), com autenticação por e-mail/senha e sincronização em nuvem pelo Cloud Firestore.

## 1. Publicar no GitHub Pages
1. Extraia este ZIP no computador.
2. Envie **todos os arquivos e pastas** para a raiz do repositório `vitorrrloco/iveteconfeitados` (branch `main`). O arquivo `index.html` deve ficar na raiz, não dentro de outra pasta.
3. No GitHub, abra **Settings → Pages**.
4. Em **Build and deployment**, selecione **Deploy from a branch**, branch `main`, pasta `/ (root)`, e salve.
5. Aguarde a publicação. O endereço esperado é `https://vitorrrloco.github.io/iveteconfeitados/`.

## 2. Preparar Firebase (uma vez)
No projeto `ivete-confeitados` em https://console.firebase.google.com/:

### Authentication
1. Abra **Authentication → Sign-in method**.
2. Ative **E-mail/senha (Email/Password)** e salve.
3. Abra **Authentication → Settings → Authorized domains**.
4. Clique em **Add domain** e adicione exatamente `vitorrrloco.github.io` (somente o domínio, sem `https://`, sem `/iveteconfeitados/`).
5. Mantenha também `ivete-confeitados.firebaseapp.com` na lista.

### Cloud Firestore
1. Abra **Firestore Database** e crie o banco, se ainda não existir.
2. Na aba **Rules**, substitua as regras pelo conteúdo do arquivo `firestore.rules` deste ZIP e publique.
3. As regras limitam cada usuário autenticado a ler e gravar somente o próprio documento.

## 3. Primeiro acesso
1. Abra `https://vitorrrloco.github.io/iveteconfeitados/` no Safari ou navegador.
2. Clique em **Criar minha conta**, informe e-mail e senha com pelo menos 6 caracteres.
3. Depois use o mesmo e-mail e senha em todos os aparelhos. Os dados ficam vinculados à conta e sincronizam pelo Firestore.

## 4. Instalar no iPhone
1. Abra o endereço publicado no **Safari**.
2. Toque em **Compartilhar**.
3. Escolha **Adicionar à Tela de Início** e confirme.

## O que já está incluído
- Painel, estoque, receitas/fichas técnicas e cálculo de custos
- Produtos e preços, encomendas e quadro de produção
- Clientes, financeiro e relatórios básicos
- Backup JSON: exportação e importação
- Login e criação de conta com Firebase Authentication
- Sincronização automática em tempo real via Cloud Firestore
- Interface responsiva e PWA para iPhone e computador

## Segurança e observações importantes
- A configuração Web do Firebase incluída em `firebase.js` identifica o projeto. Ela não é uma chave administrativa. A segurança depende das regras do Firestore e das permissões do Authentication.
- Não publique regras abertas como `allow read, write: if true`. Use as regras fornecidas em `firestore.rules`.
- Cada conta possui seus próprios dados. Se a Ivete e outras pessoas precisarem acessar exatamente o mesmo cadastro, todas deverão entrar com **a mesma conta**. Não compartilhe a senha com pessoas não autorizadas. Uma próxima evolução pode implementar convite e perfis de equipe.
- A primeira vez que uma conta entra, o app importa dados locais existentes naquele navegador se o documento da nuvem ainda não existir. Depois disso, a nuvem passa a ser a fonte de sincronização.
- Faça backups periódicos em **Dados e backup**.
- Para testar a instalação, publicação e sincronização, abra a mesma conta em dois dispositivos e crie um cadastro de teste.
