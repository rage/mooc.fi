# Authentication

The Authentication API located mainly in `/backend/auth` is based on OAuth2.0 and utilizes JWT. This document will describe the various endpoints, grants, services, and front-end consumption.  

Within `/backend/server.ts`, all of the `/auth` endpoints are behind a rate limiter using `express-rate-limit`.

There are a number of oddities within the Authentication system, mainly to ensure compatability with TMC's prior authentication system.

## Sign Up
The `/auth/signUp` POST endpoint requires:
* email
* password
* confirmPassword

We also accept optional fields (complying with TMC's signUp) which include:
* extra_fields
* user_fields

To begin the sign up process, we must validate the user's Email and Password. This makes use of the functions within `/util/validateAuth`. The `validateEmail` function checks if the input email is a valid email format and `validatePassword` checks if the password is a valid string. 

Next, we check if the email exists within the database. It's important to note, even if the email exists, a password for this email may not exist, which means the account was created by TMC and aggregated to MOOC in the past. We'll get into how we handled this issue in the `Token` section. 

If any email does not exist, we will create a user using `createUser`, which is a service function calling the TMC API for creating new users. This service function also logs the newly created user in TMC, so we can receive the TMC Token. We then use that TMC Token to get the User Details of the newly created user. This is important for getting the `upstream_id` directly from TMC, since aggregation between TMC and MOOC upon user creation isn't immediate.

We then hash the user's input password using Argon2. Then we create the user by selecting their `upstream_id`, given it does not exist, we insert a new user using the given information. The SignUp function will return the user details from the TMC `getCurrentUserDetails` query.

Once the user is created (`_signUp` has been successful), we run the MOOC `signIn` function so we can get the TMC Token again. We then use that TMC Token to update the user on the TMC back-end with any `extra_fields` or `user_fields` data. Once this has been updated, it will also aggregate back to the MOOC database.

Notes:
It would be more ideal if we update the user's `extra_fields` or `user_fields` (see `other` fields), on the MOOC back-end without touching TMC at all. The issue being if we update the fields soley on the MOOC back-end, it does not aggregate back to TMC. In the future, I suppose we will phase out all user management from TMC, so this won't be a pitfall anymore.

## requireAuth
Going forward, because of how often it's used, we will address the `requireAuth` function, from `/util/validateAuth`. This function checks specifically for the MOOC JWT. 

* Checks for JWT existence by requiring Token string.
* Checks if Token exists within access_tokens table. 
* Checks if Token valid boolean is True.
* Verifies Token using `jwt.verify` and the publicKey
* If `jwt.verify` returns expired or errors, the Token validity will be set to False in the access_tokens table.


## Sign Out
The `/auth/signOut` POST endpoint requires: 
* Authorization header

If the Bearer Token from the Authorization Header is valid, we update the Token within `access_tokens` to be False on column `valid`.

## Password Reset
The `/auth/passwordReset` POST endpoint requires:
* email

The `passwordReset` endpoint checks if an email has been inputted and if the email exists within the database. If the email does exist, we query TMC's password reset endpoint and TMC sends a reset email. 

Notes:
In the future, password reset will be handled entirely from MOOC as we phase out TMC authentication. The current issue is, we would need to set a reset email from MOOC. The second issue is currently if a user were to change their password on MOOC, it would not update their password on TMC, effectively breaking the TMC authentication (side note, updating the TMC password also won't work since we don't have a TMC Token anywhere in this flow).

## Token
The `/auth/token` POST endpoint is the largest endpoint and the main focus of the Authentication system. We will break down `/auth/token` in a series of `grants` which make up the `/auth/token` endpoint. I will also be referring to this endpoint as `/auth/token` rather than "Token", to avoid confusion. 

The beginning of the `/auth/token` flow begins on line 285 of the `token.js` file with the `token` function. This function requires:
* grant_type

Depending on the `grant_type`, we select the correct `grant` to use. The available `grant_type` are:
* password
* authorization_code
* client_credentials
* client_authorize

You might recognize the first three grants as being standard in most OAuth2.0 systems. Any additional grant created was created on a necessity basis.

### Password
The `password` grant is a standard email/password login and invokes the `exchangePassword` function. This function invokes the `signIn` function, which unfortunately is not a standard signIn function. As previously stated, we need to bridge compatability with TMC's prior authentication, so we do a lot of that here. The password grant is currently only used on mooc.fi.

Requires:
* email
* password

The `signIn` function requires an email and password. If the email exists within the database, we first attempt to receive the TMC Token using the input email and password. 

Afterwards, we check if the user's row has a populated password column in the MOOC database. If it does, we verify the user's password using `argon2.verify`. If the verification is successful and the TMC Token was acquired, we return the TMC Token and MOOC JWT (Access Token).

Notes: 
* See Issue Token section
* See Throttle section

Since we are essentially migrating user accounts from TMC to MOOC, there may be many cases in which users have a NULL password field in MOOC. If that is the case, we first check if their TMC Token exists and their user account exists on MOOC. We then hash their inputted password using Argon2 and update their user row with the hashed password. Finally, we issue their user token based on this information. 

Notes: 
You may have noticed some instances in client queries in the `signIn` function. By default, MOOC accounts are `native` clients. The future plan for this check was for identifying accounts created on other SSO platforms, for example a Google Sign In, Github, etc.


### Authorization Code
The `authorization_code` grant is useful for establishing a Single Sign On flow to be used with other MOOC courses. 
The flow is as outlined in a three-way handshake:

User attempts to Sign In on Course with Authorization Grant ->
Authorization Grant issues an Authorization Code ->
Open window / Redirect to MOOC.fi ->
Cookie is checked on MOOC.fi for Authentication ->
If not authenticated, ask for authentication ->
If not consented, ask for consent ->
Associate authenticated MOOC user Token with authorization Code ->
Redirect back to course ->
Issue Token to Course and remove authorization code

The `authorization_code` grant requires:
* client_id
* redirect_uri

optional: 
* response_type

The `authorization_code` grant is a large one, made up of several functions, so we'll go through each of them. 

Starting with `grantAuthorizationCode`, this function takes the `client_id` and `redirect_uri`. It is the first step in the `authorization_code` flow and requires `response_type` to be `code`. 
This function will generate a random string to be used as the authorization code and returned to the user. It also checks for the existence of a client based on the `client_id`, courses should be added as clients to be authenticated. The authorization code is saved to the database in the `authorization_codes` table, along with the `client_id` and `redirect_uri`. A `user_id` field is also set to null for later use. Finally, we return the authorization code and a targetUri to the user. The latter will be used to redirect the user from the course page, to the MOOC website and continue the authentication flow there, with the authorization code as a query parameter. 

Once the user is redirected to the `/authorization` front-end, the `/auth/authorize` GET endpoint is called in the background. 

Requires:
* code
* Authorization Header

The `authorize` function first checks if the code exists within the `authorization_codes` table. The Authorization Header is then checked next. If the Authorization Header is not present or invalid, the front-end will redirect the User to log into Mooc.fi and receive a valid Token. 

If the code and Authorization Header are valid, consent will be checked. If this is the user's first time signing into the course (`client_id`) using the `authorization_code` grant, we will ask the user for consent to use MOOC.fi Tokens as a form of authentication. Consent is persisted by checking previous `client_id` / `user_id` entries in the `access_tokens` table, so this will only be asked once unless denied. 

Having consent or accepting the consent form will trigger the `/auth/decision` GET endpoint. 

Requires:
* code
* Authorization Header

This endpoint checks the code's existence in the `authorization_codes` table and if the Authorization Header is valid. If everything is deemed valid, we update the `user_id` field in the `authorization_codes` table with the user's user_id. We then respond with the `redirect_uri` previously stored at the beginning, which will redirect the user back to the course. 

Once back on the course, the `/auth/token` POST endpoint is triggered again, this time without a `response_type` set. 

Requires:
* client_id
* code

This will run the `exchangeAuthorizationCode` function, which will validate the `code` and `client_id` by checking if they exist in their respective tables. By checking the `authorization_codes` table using the `code`, we can get the `user_id` of the user. Then we will check if a valid `access_token` already exists for this combination of `client_id` and `user_id`. If so, we will return that `access_token`, if not, we will query for the user information and then issue a new token.

### Client Credentials
The `client_credentials` grant is useful for issuing a token for communicating between servers. It is not useful for retrieving user information. 

Requires: 
* client { client_id, client_secret }

This grant uses the `exchangeClientCredentials` function to issue non-user client Tokens. This exchange checks if the `client_id` and `client_secret` are valid, then issues a new Token. 

Notes:
`client_secret` should always be secret and behind a server / API. 

There isn't a large use case for `client_credentials` at the moment. One possible future would be to use this grant as a more secure form of the `client_authorize` psuedo-grant, as `client_credentials` can accomplish a similar result, but with a three-way handshake.

### Client Authorize
The `client_authorize` grant is a pseduo-grant and should be used sparingly. 

Requires: 
* client_secret
* personal_unique_code

This grant was originally created to be used with the Haka/Shibbo login system. Using a client's `client_secret` key, we would use that to validate the client has authorization to make queries on the MOOC back-end and issue tokens for users. The `personal_unique_code` could possible be a HAKA ID from the `verified_user` table or an `id` (upstream_id) from the `user` table. 

Notes:
I say this should be used sparingly because it works fine for internal back-ends such as Shibbo, TMC, or Quizzes, but third-parties might have far too much control over issuing tokens and reading MOOC user data. The `client_credentials` grant might be a more suitable alternative in the future.

## Clients
The clients system are a way to assign and manage `client_id` and `client_secret` keys to third-party entities. For example, courses can be considered clients as well as other servers (TMC, Quizzes, etc). This ensures that only authorized entities can access MOOC data.

Consumption of the client APIs can be found in the `/frontend/pages/[lng]/auth` folder. Only administrators have the ability to manage client data. 

POST `/auth/clients` - Will store a new client and generate a `client_id` and `client_secret`
Requires: 
* Admin Authorization Header
* name
* redirect_uri

GET `/auth/clients` - Gets a list of clients 
Requires: 
* Admin Authorization Header

GET `/auth/client/:id` - Gets a single client by id
Requires:
* Admin Authorization Header
* id

POST `/auth/deleteClient/:id` - Deletes a single client
Requires:
* Admin Authorization Header
* id

I also wrote a function for regenerating the `client_secret` but it appears I never implemented it.

## Implicit Token
There's not much I can say about this endpoint, it was developed to comply with IMSGlobal's LTI standard security framework. It should be noted the usage of implicit tokens are not secure and are deprecated in OAuth2.0 flows. Nevertheless, this endpoint is written for the sake of having it work with the IMC Learning Platform. 

POST `/auth/implicit-token` - Issues an implicit user token using `login_hint` as the UserID
Requires:
* iss
* login_hint
* target_link_uri

I recommend not using this endpoint at all. Maybe even removing it until there's a point for it to exist. 

## Validate

GET `/auth/validate` - Checks if a JWT is valid
Requires:
* Authorization Header





