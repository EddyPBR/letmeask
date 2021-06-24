import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import { database } from "../../../services/firebase";
import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
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
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();
  const { id: roomId }: RoomQueryParams = router.query;

  const [newQuestion, setNewQuestion] = useState("");
  const { title, questions } = useRoom(roomId);

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      toast.error("Campo deve ser preenchido!", {
        style: {
          background: "#F56565",
          color: "#FFF",
        },
        iconTheme: {
          primary: "#FFF",
          secondary: "#F56565",
        },
      });
      return;
    }

    if (!user) {
      toast.error("Usuário não encontrado", {
        style: {
          background: "#F56565",
          color: "#FFF",
        },
        iconTheme: {
          primary: "#FFF",
          secondary: "#F56565",
        },
      });
      return;
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

    toast.success("Pergunta enviada!", {
      style: {
        background: "#68D391",
        color: "#FFF",
      },
      iconTheme: {
        primary: "#FFF",
        secondary: "#68D391",
      },
    });

    setNewQuestion("");
  }

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }
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
            <Button type="button" isOutlined>Encerrar sala</Button>
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
              content={question.content}
              author={question.author}
            />
          );
        })}
      </main>
    </>
  );
}