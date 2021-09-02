### Connect accounts

`/connect/(hy|haka)[?language=(fi|en)]`

* goes through shibbo and returns attributes in headers
  * if not all required attributes received, error ->
* get `access_token` from cookie
  * if no access_token, error ->
* post GraphQL mutation `addVerifiedUser` to backend with `access_token` in headers and attributes as data
  * if not successful, error ->
* on success, redirect to `/{language}/profile/connect/success` through the shibbo logout url
* on every error, redirect to `/{language}/profile/connect/failure` with the error encoded as query parameter -- note: not redirecting through logout url

### Sign in with account

`/sign-in/(hy|haka)[?language=(fi|en)]`

* goes through shibbo and returns attributes in headers
  * if no `schacpersonaluniquecode` received, error with `auth-fail` ->
* if `access_token` already set in headers, error with `already-signed-in` ->
* post to `/auth/token` with `personal_unique_code` as data and `access_token` in headers
  * on success, set `access_token` and `admin` values received in cookies and redirect to `/{language}/` through shibbo logout url
  * on failure, error with `no-user-found` ->
* on every error, redirect to `/{language}/sign-in?error={errorType}&message={error_message}` through shibbo logout url

### Sign up with account

`/sign-up/(hy|haka)[?language=(fi|en)]`

* goes through shibbo and returns attributes in headers
* post to `/api/user/register` with attributes
  * on error, see what we got in response
    * we already have a user?
      * we don't have a verified_user?
        * we have an access token?
          * we are already logged in, but not verified - set cookies
        * we don't have an access token?
          * set email in query parameter; error type ???
      * we have a verified_user?
        * set email in query, error with `already-registered` ->
* on error, redirect to `/{language}/sign-up/error/{errorType}` through shibbo logout url
* on success, redirect to `/{language}/sign-up/edit-details` through shibbo logout url
 