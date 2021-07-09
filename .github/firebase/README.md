<br />
<h1 align="center">
  <img alt="Firebase configuração" src="https://github.com/EddyPBR/letmeask/blob/main/.github/assets/firebase-logo.png" width="180px" /> 
  <br />
  <br />
  Guia Firebase
</h1>
<br />

Para executarmos o projeto devemos configurar o firebase para setarmos algumas configurações,
mas o firebase é simples, fácil e rápido de ser configurado, esse guia é para lhe ajudar a 
configurar o projeto, então vamos lá? :)

<br />

## Passo-a-passo

Assumindo que você tenha feito o login siga o passo-a-passo logo abaixo:

- No menu superior clique em "ir para o console", vai carregar uma nova página;
- Agora clique em "adicionar projeto", e informe o nome (Ex.: letmeask), e continue;
- Desative o google analitcs e clique em "criar projeto", aguarde e continue, aguarde mais uma vez e você será redirecionado;
- No menu lateral esquerdo na parte de "criação" clique em "authentication";
- Agora vá na aba "Sign-in method" e selecione "Google", agora clique no botão de ativar, informe seu email (pode ser o que você fez login) e salve;
- No menu lateral esquerdo novamente vá em "Realtime database";
- Agora clique em "criar banco de dados", será carregada uma box, agora clique em proxima, deixe a opção "modo bloqueado" ativado e clique em ativar e aguarde;
- No menu lateral esquerdo clique em "Visão geral do projeto", agora nos botões do banner clique em "web", na nova caixa de texto coloque o nome do projeto (Ex.: letmeask-web) deixe a opção "firebase hosting" desativada e clique em "Registrar app" e aguarde;
- Será mostrada uma box com códigos, copie os valores dos campos que estão dentro da variavel "firebaseConfig" e no arquivo ".env.local" do seu projeto, preencha os seguintes valores;

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NODE_ENV=
```

- Pronto seu firebase esta configurado;
<br />

## Configuração do Realtime Database

Agora precisamos configurar somente as permissões do banco de dados do firebase, isso é bem simples. Primeiramente no menu lateral a esquerda
clique em `Realtime Database`, agora selecione a aba `Regras`, enfim na box com o JSON das regras copie e cole o seguinte:

```
{
  "rules": {
    "rooms": {
      ".read": true,
      ".write": "auth != null",
      "$roomId": {
        ".read": true,
        ".write": "auth != null && (!data.exists() || data.child('authorId').val() == auth.uid)",
        "questions": {
          ".read": true,
          ".write": "auth != null && (!data.exists() || data.parent().child('authorId').val() == auth.uid)",
          "likes": {
            ".read": true,
            ".write": "auth != null && (!data.exists() || data.child('authorId').val() == auth.uid)",
          }
        }
      }
    }
  }
}
```

Pronto seu banco de dados esta configurado!

<br />

## Continuando

O projeto esta quase que totalmente pronto para ser executado, siga o resto do passo-a-passo e espero que goste :)

att,
@EddyPBR
