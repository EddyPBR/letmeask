import Router from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { database } from "../services/firebase";

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
};

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
  }
>;

export default function useRoom(roomId: string) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on("value", (room) => {
      const databaseRoom = room.val();

      if(databaseRoom?.closedAt && (user?.id !== databaseRoom?.authorId)) {
        toast.error("Sala foi encerrada pelo admin", {
          style: {
            background: "#F56565",
            color: "#FFF",
          },
          iconTheme: {
            primary: "#FFF",
            secondary: "#F56565",
          },
        });

        Router.push("/");

        return () => {
          roomRef.off("value");
        };
      }

      const firebaseQuestions: FirebaseQuestions =
        databaseRoom?.questions ?? {};

      console.log(databaseRoom);

      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            isAnswered: value.isAnswered,
            likeCount: Object.values(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {}).find(
              ([key, like]) => like.authorId === user?.id
            )?.[0],
          };
        }
      );

      const orderQuestionsByLikeCount = parsedQuestions.sort((roomA, roomB) =>
        roomA.likeCount < roomB.likeCount ? 1 : roomA.likeCount > roomB.likeCount ? -1 : 0
      );

      const orderQuestionByNotAnswer = orderQuestionsByLikeCount.sort((roomA, roomB) => 
        roomA.isAnswered > roomB.isAnswered ? 1 : roomA.isAnswered < roomB.isAnswered ? -1 : 0
      );

      setTitle(databaseRoom?.title);
      setQuestions(orderQuestionByNotAnswer);
    });

    return () => {
      roomRef.off("value");
    };
  }, [roomId, user?.id]);

  return { questions, title };
}
