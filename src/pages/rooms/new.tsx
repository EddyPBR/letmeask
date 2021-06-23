import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import { database } from "../../services/firebase";
import { useState, FormEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import Button from "../../components/Button";
import illustrationSVG from "../../assets/images/illustration.svg";
import logoSVG from "../../assets/images/logo.svg";
import styles from "../../assets/styles/pages/NewRoom.module.scss";

export default function NewRoom() {
  const { user } = useAuth();
  const [newRoom, setNewRoom] = useState("");

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if(newRoom.trim() === "") {
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

    const roomRef = database.ref("rooms");

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    if(!firebaseRoom) {
      toast.error("Falha ao criar sala!", {
        style: {
          background: "#F56565",
          color: "#FFF"
        },
        iconTheme: {
          primary: "#FFF",
          secondary: "#F56565"
        }
      });
    }
    
    Router.push(`/rooms/${firebaseRoom.key}`);
  }

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
          <form onSubmit={handleCreateRoom} method="POST">
            <input
              type="text"
              placeholder="Nome da sala"
              value={newRoom}
              onChange={(event) => setNewRoom(event.target.value)}
            />
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

      <Toaster position="top-right" />
    </div>
  );
}
