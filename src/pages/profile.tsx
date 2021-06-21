import useAuth from "./../hooks/useAuth";

export default function Profile() {
  const { user }: { user: { displayName?: string } } = useAuth();

  return (
    <div>
      <p>Profile page, welcome</p>
      <h1>{user?.displayName}</h1>
    </div>
  );
}
