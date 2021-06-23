import { useRouter } from 'next/router'

export default function Room() {
  const router = useRouter();
  const { id } = router.query;

  return(
    <h1>{ id }</h1>
  )
}