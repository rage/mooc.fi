import ConfirmEmail from "/components/ConfirmEmail"
import { RegularContainer } from "/components/Container"
import withSignedIn from "/lib/with-signed-in"

const ConfirmEmailPage = () => {
  return (
    <div>
      <RegularContainer>
        <ConfirmEmail onComplete={() => void 0} />
      </RegularContainer>
    </div>
  )
}

export default withSignedIn(ConfirmEmailPage)
