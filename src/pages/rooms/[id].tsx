import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import { database } from "../../services/firebase";
import { useState, FormEvent } from "react";
import useAuth from "../../hooks/useAuth";
import RoomCode from "../../components/RoomCode";
import Button from "../../components/Button";
import logoSVG from "../../assets/images/logo.svg";
import styles from "../../assets/styles/pages/Room.module.scss";

type RoomQueryParams = {
  id?: string;
};

export default function Room() {
  const { user } = useAuth();
  const router = useRouter();
  const { id: roomId }: RoomQueryParams = router.query;

  const [newQuestion, setNewQuestion] = useState("");

  console.log(user?.avatar);

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      return;
    }

    if (!user) {
      throw new Error("Você precisa estar logado!");
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighLighted: false,
      isAnswer: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion("");
  }

  return (
    <>
      <Head>
        <title>Sala aberta | Letmetask</title>
      </Head>

      <header className={styles.header}>
        <div>
          <Image src={logoSVG} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main className={styles.main}>
        <div>
          <h1>Sala React</h1>
          <span>4 perguntas</span>
        </div>

        <form
          onSubmit={handleSendQuestion}
          method="POST"
          className={styles.formAsk}
        >
          <textarea
            placeholder="O que você quer perguntar?"
            value={newQuestion}
            onChange={(event) => setNewQuestion(event.target.value)}
          />

          <div>
            {
              user ? (
                <div className={styles.userInfo}>
                  <Image src={user?.avatar} alt={user.name} width="32" height="32" />
                  <span>{user.name}</span>
                </div>
              ) : (
                <span>
                  Para enviar uma pergunta,{" "}
                  <button type="button">faça seu login</button>.
                </span>
              )
            }
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>
      </main>
    </>
  );
}
