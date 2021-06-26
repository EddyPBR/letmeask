import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import { database } from "../../services/firebase";
import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useRoom from "../../hooks/useRoom";
import Question from "../../components/Question";
import RoomCode from "../../components/RoomCode";
import Button from "../../components/Button";
import logoSVG from "../../assets/images/logo.svg";
import styles from "../../assets/styles/pages/Room.module.scss";

type FirebaseRooms = Record<string, {
  authorId: string;
  questions: {},
  title: string;
}>;

type RoomQueryParams = {
  id?: string;
};

export default function Room({ title }) {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();
  const { id: roomId }: RoomQueryParams = router.query;

  const [newQuestion, setNewQuestion] = useState("");
  const { questions } = useRoom(roomId);

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
      isHighlighted: false,
      isAnswered: false,
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

  async function handleLogin() {
    if (!user) {
      await signInWithGoogle();
    }

    toast.success("Logado com sucesso!", {
      style: {
        background: "#68D391",
        color: "#FFF"
      },
      iconTheme: {
        primary: "#FFF",
        secondary: "#68D391"
      }
    });
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
          <RoomCode code={roomId} />
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
            {user ? (
              <div className={styles.userInfo}>
                <Image
                  src={user?.avatar}
                  alt={user.name}
                  width="32"
                  height="32"
                />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta,{" "}
                <button type="button" onClick={handleLogin}>
                  faça seu login
                </button>
                .
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>

        {questions.map((question) => {
          return (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
              likeId={question.likeId}
              likeCount={question.likeCount}
              id={question.id}
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const roomRef = await database.ref(`rooms/${params.id}`).get();
  const firebaseRoom: FirebaseRooms = roomRef.val();

  return {
    props: {
      title: firebaseRoom.title,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const roomRef = await database.ref(`rooms`).get();
  const firebaseRooms: FirebaseRooms[] = roomRef.val();

  const roomsProps = Object.entries(firebaseRooms).map(([key]) => {
    return {
      roomId: key,
    }
  });

  const paths = roomsProps.map((room) => {
    return {
      params: {
        id: room.roomId,
      }
    }
  });

  return {
    paths: paths,
    fallback: false,
  };
}