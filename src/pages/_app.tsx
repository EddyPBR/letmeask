import { useEffect } from "react"
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../contexts/AuthContext";
import DarkModeSwitch from "../components/DarkModeSwitch";

import "../assets/styles/global.scss";

function MyApp({ Component, pageProps }) {
  // PWA service worker register
  useEffect(() => {
    if("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
       navigator.serviceWorker.register("/sw.js").then(
          function (registration) {
            console.log("Service Worker registration successful with scope: ", registration.scope);
          },
          function (err) {
            console.log("Service Worker registration failed: ", err);
          }
        );
      });
    }
  }, []);

  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Toaster position="top-right" />
      <DarkModeSwitch />
    </AuthProvider>
  );
}

export default MyApp;
