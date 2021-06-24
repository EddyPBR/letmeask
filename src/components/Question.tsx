import Image from "next/image";
import styles from "../assets/styles/components/Question.module.scss";

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
};

export default function Question({ content, author }: QuestionProps) {
  return (
    <section className={styles.question}>
      <p>{content}</p>
      <footer>
        <div className={styles.userInfo}>
          <Image src={author.avatar} alt={author.name} width="32" height="32" />
          <span>{author.name}</span>
        </div>
        <div></div>
      </footer>
    </section>
  );
}
