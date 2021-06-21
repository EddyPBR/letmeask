import useAuth from "../hooks/useAuth";

export default function Home() {
  const { user, signIn } = useAuth();

  return (
    <main>
      <h1>Let me ask</h1>
      <p>mas com NextJS ^^</p>

      <div>
        <button type="button" onClick={() => signIn()}>
          Entrar com google
        </button>
      </div>
    </main>
  );
}
