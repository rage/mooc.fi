import * as React from "react";
import SignIn from "../components/SignIn";
import { NextContext } from "next";
import { isSignedIn } from "../lib/authentication";
import redirect from "../lib/redirect";

const SignInPage = () => {
return(
<div role='main'><SignIn /></div>
)
}

//If user is already logged in, redirect them straight to 
//register-completion page
SignInPage.getInitialProps = function(context: NextContext) {
    if (isSignedIn(context)) {
      redirect(context, "/register-completion");
    }
    return {};
  };

export default SignInPage;
