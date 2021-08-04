import { NextPageContext } from "next"

const SPLogout = () => {
  return <div>You are logged out. You should not be able to see this page.</div>
}

SPLogout.getInitialProps = (ctx: NextPageContext) => {
  if (ctx.query.return) {
    ctx?.res?.writeHead(302, { location: ctx.query.return })
    ctx?.res?.end()
  }

  return {}
}

export default SPLogout
