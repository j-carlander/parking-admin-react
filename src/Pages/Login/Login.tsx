import { Button, TextField } from "@mui/material";
import { useState } from "react";
import './Login.css';

export function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  function signIn(e: React.ChangeEvent<HTMLFormElement>){
    e.preventDefault();
    console.log('sign in: ', credentials);
    
  }
  return (
    <>
      <h2>Logga in</h2>
      <form className="login-form" onSubmit={signIn}>
        <TextField
          id="usernameField"
          label="Användarnamn"
          variant="outlined"
          value={credentials.username}
          onChange={(e) =>
            setCredentials((c) => ({ ...c, username: e.target.value }))
          }
        />
        <TextField
        type="password"
          id="passwordField"
          label="Lösenord"
          variant="outlined"
          value={credentials.password}
          onChange={(e) =>
            setCredentials((c) => ({ ...c, password: e.target.value }))
          }
        />
        <div className="login-btns">

        <Button variant="outlined" type="reset">Avbryt</Button>
        <Button variant="contained" type="submit">Logga in</Button>
        </div>
      </form>
    </>
  );
}
