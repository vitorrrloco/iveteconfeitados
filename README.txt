IVETE CONFEITADOS - PACOTE CORRIGIDO

Arquivos:
- index.html: interface responsiva e navegação com eventos delegados.
- firebase.js: autenticação e sincronização Firestore, mantendo o projeto existente.
- manifest.json: configuração PWA.
- sw.js: cache atualizado para forçar a versão v4.

INSTALAÇÃO
1. Faça backup dos dados pelo menu Dados e backup no sistema atual, se conseguir.
2. No GitHub, abra o repositório vitorrrloco/iveteconfeitados.
3. Substitua os arquivos index.html, firebase.js, manifest.json e sw.js pelos deste pacote.
4. Faça commit na branch main.
5. Abra o site e atualize. Se o iPhone continuar mostrando a versão antiga, feche a aba e abra novamente.

IMPORTANTE
- Não exclua nem recrie o projeto Firebase.
- Não altere as regras do Firestore para permitir acesso público.
- O pacote mantém a coleção users/{uid} e o campo data usado pela versão anterior.
- Faça um backup antes de substituir arquivos. O pacote foi revisado estaticamente, mas precisa ser testado no seu navegador e com sua conta antes de ser considerado validado.
