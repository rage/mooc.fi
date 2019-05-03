import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { Card, CardContent, TextField } from "@material-ui/core";
import styled from "styled-components";
import { signIn } from "../lib/authentication";
import NextI18Next from '../i18n';


const Row = styled.div`
  margin-bottom: 1.5rem;
`;

const Alert = styled.div`
  margin-bottom: 1.5rem;
  color: red;

`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  height: 3em;
  & > * {
    margin-right: 1rem;
  }
  margin-bottom: 1rem;
`;

function SignIn(t: Function) {
  console.log(t)
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <Card>
      <CardContent>
        <TitleContainer>
          <Avatar>
            <LockOutlinedIcon />
          </Avatar>
          <Typography 
            component="h2" 
            variant="h2" 
            gutterBottom={true}
            id='login'
            >
          <NextI18Next.Trans i18nKey='login'/>
          </Typography>
        </TitleContainer>

        <form 
          role="form"
          aria-labelledby="login"
        >
          <Row>
            <Typography component="p" paragraph>
              <NextI18Next.Trans i18nKey='form-info'/>
            </Typography>
          </Row>
          <Row>
            <TextField
              required
              id="outlined-adornment-password"
              variant="outlined"
              label={<NextI18Next.Trans i18nKey='username'/>}
              fullWidth
              value={email}
              onChange={o => {
                setEmail(o.target.value);
                setError(false);
              }}
              type="username"
            />
          </Row>
          <Row>
            <TextField
              required
              id="outlined-adornment-password"
              variant="outlined"
              type="password"
              label= {<NextI18Next.Trans i18nKey='password'/>}
              fullWidth
              value={password}
              onChange={o => {
                setPassword(o.target.value);
                setError(false);
              }}
            />
          </Row>
          {error && <Alert role='alert'> <NextI18Next.Trans i18nKey='error'/> {errorMessage}</Alert>}
          <Button
            onClick={async e => {
              e.preventDefault();
              try {
                await signIn({ email, password });
              } catch (e) {
                setError(true);
                setErrorMessage(e.message);
              }
            }}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            role="formsubmit"
          >
            <NextI18Next.Trans i18nKey='login'/>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default NextI18Next.withNamespaces('common')(SignIn);
