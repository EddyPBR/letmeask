import { useState, createContext, ReactNode } from "react";
import Router from "next/router";
import firebase from "../services/firebase";

type AuthContextData = {
  user: {} | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<{} | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const signIn = async () => {
    console.log(firebase);
    try {
      setLoading(true);
      firebase.auth();
      return firebase
        .auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((response) => {
          setUser(response.user);
          Router.push("/profile");
        });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      Router.push("/");

      return firebase
        .auth()
        .signOut()
        .then(() => setUser(false));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const AuthConsumer = AuthContext.Consumer;

export default AuthContext;
