import { GetServerSideProps } from "next";
import Router, { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import { parseCookies } from "nookies";
import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      closedAt: new Date(),
    });

    toast.success("Sala foi fechada!", {
      style: {
        background: "#68D391",
        color: "#FFF",
      },
      iconTheme: {
        primary: "#FFF",
        secondary: "#68D391",
      },
    });

    Router.push("/");
  }

  return (
    <>
      <Head>
        <title>{`Admin sala ${title}`} | Letmetask</title>
      </Head>

      <header className={styles.header}>
        <div>
          <Image src={logoSVG} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button
              type="button"
              isOutlined
              onClick={() => setIsModalOpen(true)}
            >
              Encerrar sala
            </Button>
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

      <>
        <Modal
          isOpen={isModalOpen}
          ariaHideApp={false}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Deseja mesmo excluir o comentário?"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            },
            content: {
              position: "initial",
              width: "37rem",
              maxWidth: "90vw",
              height: "23rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "0",
              border: "none",
              background: "transparent",
            },
          }}
        >
          <div className={styles.excludeModal}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M29.66 18.3398L18.34 29.6598"
                stroke="#E73F5D"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M29.66 29.6598L18.34 18.3398"
                stroke="#E73F5D"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M24 42V42C14.058 42 6 33.942 6 24V24C6 14.058 14.058 6 24 6V6C33.942 6 42 14.058 42 24V24C42 33.942 33.942 42 24 42Z"
                stroke="#E73F5D"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <b>Encerrar a sala</b>

            <p>Tem certeza que você encerrar sala?</p>

            <div>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </button>
              <button type="button" onClick={handleEndRoom}>
                Sim, excluir
              </button>
            </div>
          </div>
        </Modal>
      </>
    </>
  );
}

type FirebaseRoom = {
  authorId: string;
  questions: {};
  title: string;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id: roomId } = ctx?.query;
  const { ["letmeask.userId"]: userId } = parseCookies(ctx);

  const roomRef = await database.ref(`rooms/${roomId}`).get();
  const firebaseRoom: FirebaseRoom = roomRef.val();

  const { authorId: adminId } = firebaseRoom;

  if (adminId !== userId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
