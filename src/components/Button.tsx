import { ButtonHTMLAttributes } from "react";

import styles from "../assets/styles/components/Button.module.scss";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
};

export default function Button({ isOutlined, ...props }: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${isOutlined ? styles.outlined : ""}`}
      {...props}
    />
  );
}
