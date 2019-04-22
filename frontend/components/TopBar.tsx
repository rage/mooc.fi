import * as React from "react";
import styled from "styled-components";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { signOut } from "../lib/authentication";
import LoginStateContext from "../contexes/LoginStateContext";
import { useApolloClient } from "react-apollo-hooks";

const EmptySpace = styled.div`
  flex: 2;
`;

const TopBar = () => {
  const loggedIn = React.useContext(LoginStateContext);
  const client = useApolloClient();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          Näyttökoe
        </Typography>
        <EmptySpace />
        {loggedIn && (
          <Button
            variant="contained"
            onClick={() => {
              signOut(client);
            }}
          >
            Kirjaudu ulos
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
