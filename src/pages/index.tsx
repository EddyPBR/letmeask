import Head from "next/head";
import Image from "next/image";
import Router from "next/router";
import { database } from "../services/firebase";
import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import Button from "../components/Button";
import logoSVG from "../assets/images/logo.svg";
import googleIconSVG from "../assets/images/google-icon.svg";
import illustrationSVG from "../assets/images/illustration.svg";
import styles from "../assets/styles/pages/Home.module.scss";

export default function Home() {
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  async function handleCreateRoom() {
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

    Router.push("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === "") {
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

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      toast.error("Sala não encontrada", {
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

    if (roomRef.val().closedAt) {
      toast.error("Sala já foi encerrada", {
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

    toast.success("Bem-vindo a sala!", {
      style: {
        background: "#68D391",
        color: "#FFF"
      },
      iconTheme: {
        primary: "#FFF",
        secondary: "#68D391"
      }
    });

    Router.push(`rooms/${roomCode}`);
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
          <form onSubmit={handleJoinRoom} method="GET">
            <input
              type="text"
              placeholder="Digite o código da sala"
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value)}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
