import { AuthProvider } from "../contexts/AuthContext";
import { Toaster } from "react-hot-toast";

import "../assets/styles/global.scss";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default MyApp;
