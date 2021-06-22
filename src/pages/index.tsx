import Head from "next/head";
import Image from "next/image";
import Router from "next/router";
// import useAuth from "../hooks/useAuth";
import Button from "../components/Button";
import illustrationSVG from "../assets/images/illustration.svg";
import logoSVG from "../assets/images/logo.svg";
import googleIconImg from "../assets/images/google-icon.svg";

import styles from "../assets/styles/pages/Home.module.scss";

export default function Home() {
  // const { user, signIn } = useAuth();

  function NavigateToNewRoom() {
    Router.push("/rooms/new/");
  }

  return (
    <div className={styles.pageAuth}>
      <Head>
        <title>Letmeask</title>
      </Head>
      
      <aside className={styles.info}>
        <Image
          src={illustrationSVG}
          alt="ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>

      <main className={styles.content}>
        <div>
          <Image src={logoSVG} alt="Letmeask" />
          <button type="button" className={styles.googleButton} onClick={NavigateToNewRoom}>
            <Image src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o google
          </button>
          <div className={styles.separator}>ou entre em uma sala</div>
          <form>
            <input type="text" placeholder="Digite o código da sala" />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
