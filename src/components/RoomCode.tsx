import Image from "next/image";
import { useState } from "react";
import CopySVG from "../assets/images/copy.svg";
import styles from "../assets/styles/components/RoomCode.module.scss";

type RoomCodeProps = {
  code: string;
};

export default function RoomCode({ code }: RoomCodeProps) {
  const [copied, setCopied] = useState(false);

  async function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setCopiedToFalse();
  }

  function setCopiedToFalse() {
    setTimeout(() => {
      setCopied(false);
    }, 3200);
  }

  return (
    <button className={`${styles.roomCode} ${copied ? styles.copied : ""}`} onClick={copyRoomCodeToClipboard}>
      <div>
        <Image src={CopySVG} alt="Copiar código da sala" />
      </div>
      <span>Sala: {code}</span>
    </button>
  );
}
