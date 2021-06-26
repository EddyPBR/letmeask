import { AuthProvider } from "../contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import DarkModeSwitch from "../components/DarkModeSwitch";

import "../assets/styles/global.scss";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Toaster position="top-right" />
      <DarkModeSwitch />
    </AuthProvider>
  );
}

export default MyApp;
