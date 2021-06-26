import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";
import { database } from "../services/firebase";
import useAuth from "../hooks/useAuth";
import styles from "../assets/styles/components/Question.module.scss";

type QuestionProps = {
  id?: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  likeId?: string;
  likeCount?: number;
  isAdmin?: boolean;
  roomId: string;
  isAnswered?: boolean;
  isHighlighted?: boolean;
};

export default function Question({
  id,
  content,
  author,
  likeId,
  likeCount,
  isAdmin,
  roomId,
  isAnswered = false,
  isHighlighted = false
}: QuestionProps) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
    if(!user) {
      toast.error("Necessário fazer login", {
        style: {
          background: "#F56565",
          color: "#FFF",
        },
        iconTheme: {
          primary: "#FFF",
          secondary: "#F56565",
        },
      });
      return
    }

    if(likeId) {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove();
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id,
      });
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();

    toast.success("Pergunta foi removida!", {
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

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });

    toast.success("Pergunta foi respondida!", {
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

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });

    toast.success("Respondendo pergunta...", {
      style: {
        background: "#4d96eb",
        color: "#FFF"
      },
      iconTheme: {
        primary: "#FFF",
        secondary: "#FFF",
      },
      icon: "📣"
    });
  }
  
  return (
    <section className={`${styles.question} ${isAnswered ? styles.answered : ""} ${isHighlighted && !isAnswered ? styles.highlighted : ""}`}>
      <p>{content}</p>
      <footer>
        <div className={styles.userInfo}>
          <Image src={author.avatar} alt={author.name} width="32" height="32" />
          <span>{author.name}</span>
        </div>
        <div>
          {
            !isAdmin ? (
              <button
                className={`${styles.likeButton} ${likeId ? styles.liked : ""}`}
                type="button"
                aria-label="Marcar como gostei"
                onClick={() => handleLikeQuestion(id, likeId)}
              >
                {likeCount > 0 && <span>{likeCount}</span>}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                    stroke="#737380"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ) : (
              <>
                {
                  !isAnswered && (
                    <>
                      <button
                        className={`${ !isAnswered ? styles.checkButton : ""}`}
                        type="button"
                        aria-label="Marcar pergunta como respondida"
                        onClick={() => handleCheckQuestionAsAnswered(id)}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12.0003" cy="11.9998" r="9.00375" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>

                      <button
                        className={`${!isAnswered ? styles.answerButton : ""} ${ isHighlighted && !isAnswered ? styles.active : ""}`}
                        type="button"
                        aria-label="Dar destaque à pergunta"
                        onClick={() => handleHighlightQuestion(id)}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </>
                  )
                }

                <button
                  className={styles.deleteButton}
                  type="button"
                  aria-label="Remover pergunta"
                  onClick={() => setIsModalOpen(true)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 5.99988H5H21" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </>
            )
          }
        </div>
      </footer>

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
          }
        }}
      >
        <div className={styles.excludeModal}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5.99988H5H21" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

          <b>Excluir pergunta</b>

          <p>Tem certeza que você deseja exluir esta pergunta?</p>
          
          <div>
            <button type="button" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </button>
            <button type="button" onClick={() => handleDeleteQuestion(id)}>
              Sim, excluir
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
