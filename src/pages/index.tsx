import Head from "next/head";
import Image from "next/image";
import Router from "next/router";
import useAuth from "../hooks/useAuth";
import Button from "../components/Button";
import logoSVG from "../assets/images/logo.svg";
import googleIconSVG from "../assets/images/google-icon.svg";
import illustrationSVG from "../assets/images/illustration.svg";
import styles from "../assets/styles/pages/Home.module.scss";

export default function Home() {
  const { user, signInWithGoogle } = useAuth();

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    Router.push("/rooms/new");
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
          <button
            type="button"
            className={styles.googleButton}
            onClick={handleCreateRoom}
          >
            <Image src={googleIconSVG} alt="Logo do Google" />
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
