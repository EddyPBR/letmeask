import Router, { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import toast from "react-hot-toast";
import { database } from "../../../services/firebase";
import useRoom from "../../../hooks/useRoom";
import Question from "../../../components/Question";
import RoomCode from "../../../components/RoomCode";
import Button from "../../../components/Button";
import logoSVG from "../../../assets/images/logo.svg";
import styles from "../../../assets/styles/pages/Room.module.scss";

type RoomQueryParams = {
  id?: string;
};

export default function AdminRoom() {
  const router = useRouter();
  const { id: roomId }: RoomQueryParams = router.query;
  const { title, questions } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      closedAt: new Date(),
    });

    toast.success("Sala foi fechada!", {
      style: {
        background: "#68D391",
        color: "#FFF"
      },
      iconTheme: {
        primary: "#FFF",
        secondary: "#68D391"
      }
    });

    Router.push("/")
  }

  return (
    <>
      <Head>
        <meta property="og:title" content={`Letmeask ${title ? title : ""}`} />
        <meta
          property="og:description"
          content={`A sala ${title} está ao vivo e com tudo preparado para retirar suas dúvidas!`}
        />
        <title>Sala {`${title ? title : "aberta"}`} | Letmetask</title>
      </Head>

      <header className={styles.header}>
        <div>
          <Image src={logoSVG} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button type="button" isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div>
          <h1>Sala {title}</h1>
          {questions.length > 0 && (
            <span>
              {questions.length}{" "}
              {questions.length > 1 ? "perguntas" : "pergunta"}
            </span>
          )}
        </div>

        {questions.map((question) => {
          return (
            <Question
              key={question.id}
              id={question.id}
              content={question.content}
              author={question.author}
              isAdmin
              roomId={roomId}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}
            />
          );
        })}
      </main>
    </>
  );
}
