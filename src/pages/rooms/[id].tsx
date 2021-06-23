import { useRouter } from "next/router";
import Image from "next/image";
import Button from "../../components/Button";
import logoSVG from "../../assets/images/logo.svg";
import styles from "../../assets/styles/pages/Room.module.scss";

export default function Room() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <header className={styles.header}>
        <div>
          <Image src={logoSVG} alt="Letmeask" />
          <div>Código</div>
        </div>
      </header>

      <main className={styles.main}>
        <div>
          <h1>Sala React</h1>
          <span>4 perguntas</span>
        </div>

        <form onSubmit={(event) => event.preventDefault()} method="POST" className={styles.formAsk}>
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
