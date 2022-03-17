import { RegularContainer } from "/components/Container"
import ConfirmEmail from "/components/ConfirmEmail"
import withSignedIn from "/lib/with-signed-in"

const ConfirmEmailPage = () => {
  return (
    <div>
      <RegularContainer>
        <ConfirmEmail onComplete={() => {}} />
      </RegularContainer>
    </div>
  )
}

export default withSignedIn(ConfirmEmailPage)
