import { Button, TextField } from "@mui/material";
import { useState } from "react";
import './Login.css';
import { useUserContext } from "../../App";
import { LoginRequest } from "parking-sdk";
import fetchService from "../../services/fetchService";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate()
  const {currentUser, setCurrentUser} = useUserContext();
  const [credentials, setCredentials] = useState<LoginRequest>({
    username: "",
    password: "",
  });

  console.log('sign in: ', credentials, currentUser);
  async function signIn(e: React.ChangeEvent<HTMLFormElement>){
    e.preventDefault();
    await fetchService.signIn(credentials, setCurrentUser);
    navigate('/');

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
