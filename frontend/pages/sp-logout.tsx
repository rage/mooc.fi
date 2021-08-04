import { NextPageContext } from "next"
import { useRouter } from "next/router"

interface SPLogoutProps {
  redirect?: string
}

const SPLogout = ({ redirect }: SPLogoutProps) => {
  const router = useRouter()

  if (redirect) {
    router.replace(redirect)
  }
  return <div>You are logged out. You should not be able to see this page.</div>
}

SPLogout.getInitialProps = (ctx: NextPageContext) => {
  if (ctx.query.return) {
    ctx?.res?.writeHead(302, { location: ctx.query.return })
    ctx?.res?.end()
  }

  return { redirect: ctx.query.return }
}

export default SPLogout
