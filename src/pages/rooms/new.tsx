import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Button from "../../components/Button";
import illustrationSVG from "../../assets/images/illustration.svg";
import logoSVG from "../../assets/images/logo.svg";
import styles from "../../assets/styles/pages/NewRoom.module.scss";
// import useAuth from "../../hooks/useAuth";

export default function NewRoom() {
  // const { user } = useAuth();

  return (
    <div className={styles.pageAuth}>
      <Head>
        <title>Criar sala | Letmetask</title>
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
          <h2>Criar uma nova sala</h2>
          <form>
            <input type="text" placeholder="Nome da sala" />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente?
            <Link href="/">
              <a>clique aqui</a>
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
