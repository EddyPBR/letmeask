import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import RoomCode from "../../components/RoomCode";
import Button from "../../components/Button";
import logoSVG from "../../assets/images/logo.svg";
import styles from "../../assets/styles/pages/Room.module.scss";

type RoomQueryParams = {
  id?: string;
};

export default function Room() {
  const router = useRouter();
  const { id }: RoomQueryParams = router.query;

  return (
    <>
      <Head>
        <title>Sala aberta | Letmetask</title>
      </Head>
      
      <header className={styles.header}>
        <div>
          <Image src={logoSVG} alt="Letmeask" />
          <RoomCode code={id} />
        </div>
      </header>

      <main className={styles.main}>
        <div>
          <h1>Sala React</h1>
          <span>4 perguntas</span>
        </div>

        <form
          onSubmit={(event) => event.preventDefault()}
          method="POST"
          className={styles.formAsk}
        >
          <textarea placeholder="O que você quer perguntar?" />

          <div>
            <span>
              Para enviar uma pergunta,{" "}
              <button type="button">faça seu login</button>.
            </span>
            <Button type="submit">Enviar pergunta</Button>
          </div>
        </form>
      </main>
    </>
  );
}
