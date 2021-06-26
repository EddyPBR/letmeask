import { useState, useEffect } from "react";
import styles from "../assets/styles/components/DarkModeSwitch.module.scss";

export default function DarkModeSwitch() {
  const [isDarkModeActive, setIsDarkModeActive] = useState(false);

  useEffect(() => {
    if(localStorage.getItem("letmeask-darkMode")) {
      activeDarkMode();
    }
  }, [isDarkModeActive]);

  function activeDarkMode() {
    document.getElementsByTagName("html")[0].classList.add("dark-mode");
    localStorage.setItem("letmeask-darkMode", "true");
    setIsDarkModeActive(true);
  }

  function desactiveDarkMode() {
    document.getElementsByTagName("html")[0].classList.remove("dark-mode");
    localStorage.removeItem("letmeask-darkMode");
    setIsDarkModeActive(false);
  }

  function darkModeController() {
    isDarkModeActive ? desactiveDarkMode() : activeDarkMode();
  }

  return (
    <label className={styles.darkModeSwitch} htmlFor="darkModeInput">
      <input id="darkModeInput" type="checkbox" checked={isDarkModeActive} onChange={darkModeController} />
      <span className={`${isDarkModeActive ? styles.showMoon : ""}`}></span>
    </label>
  );
}
