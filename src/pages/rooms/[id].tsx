import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import { database } from "../../services/firebase";
import { useState, useEffect, FormEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import RoomCode from "../../components/RoomCode";
import Button from "../../components/Button";
import logoSVG from "../../assets/images/logo.svg";
import styles from "../../assets/styles/pages/Room.module.scss";

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
}>

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
}

type RoomQueryParams = {
  id?: string;
};

export default function Room() {
  const { user } = useAuth();
  const router = useRouter();
  const { id: roomId }: RoomQueryParams = router.query;

  const [newQuestion, setNewQuestion] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on("value", room => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom?.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighLighted: value.isHighLighted,
          isAnswered: value.isAnswered,
        };
      });

      setTitle(databaseRoom?.title);
      setQuestions(parsedQuestions);
    });
  }, [roomId]);

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      toast.error("Campo deve ser preenchido!", {
        style: {
          background: "#F56565",
          color: "#FFF"
        },
        iconTheme: {
          primary: "#FFF",
          secondary: "#F56565"
        }
      });
      return;
    }

    if (!user) {
      toast.error("Usuário não encontrado", {
        style: {
          background: "#F56565",
          color: "#FFF"
        },
        iconTheme: {
          primary: "#FFF",
          secondary: "#F56565"
        }
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
        color: "#FFF"
      },
      iconTheme: {
        primary: "#FFF",
        secondary: "#68D391"
      }
    });

    setNewQuestion("");
  }

  return (
    <>
      <Head>
        <title>Sala {`${title ? title : "aberta"}`} | Letmetask</title>
      </Head>

      <header className={styles.header}>
        <div>
          <Image src={logoSVG} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main className={styles.main}>
        <div>
          <h1>Sala {title}</h1>
          {
            questions.length > 0 && (
              <span>{questions.length} {questions.length > 1 ? "perguntas" : "pergunta"}</span>
            )
          }
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

      <Toaster position="top-right" />
    </>
  );
}
