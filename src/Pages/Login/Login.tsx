import { Button, TextField } from "@mui/material";
import { useState } from "react";
import "./Login.css";
import { LoginRequest } from "parking-sdk";
import fetchService from "../../services/fetchService";
import { Navigate, useNavigate, useOutletContext } from "react-router-dom";
import { OutletContext } from "../../types";

export function Login() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useOutletContext<OutletContext>();
  const [credentials, setCredentials] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const [userError, setUserError] = useState("");

  async function signIn(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (
      testUsername(credentials.username) &&
      testPassword(credentials.password)
    ) {
      const status = await fetchService.signIn(credentials, setCurrentUser);
      if (status === 200) {
        navigate("/");
      } else {
        setUserError("Fel användarnamn eller lösenord");
      }
    }
  }

  function testUsername(username: string | undefined) {
    return !!username && /\@[a-zA-Z]+\.[a-zA-Z]+/.test(username);
  }

  function testPassword(password: string | undefined) {
    return !!password && password?.length >= 6;
  }

  if (currentUser) {
    return <Navigate to={"/"} />;
  }
  return (
    <>
      <h2 className="login-title">Logga in</h2>
      <form className="login-form" onSubmit={signIn}>
        <TextField
          type="email"
          id="usernameField"
          label="Användarnamn"
          variant="standard"
          error={credentials.username !== '' && !testUsername(credentials.username)}
          value={credentials.username}
          onChange={(e) =>
            setCredentials((c) => ({ ...c, username: e.target.value }))
          }
        />
        <TextField
          type="password"
          id="passwordField"
          label="Lösenord"
          variant="standard"
          error={credentials.password !== '' && !testPassword(credentials.password)}
          value={credentials.password}
          onChange={(e) =>
            setCredentials((c) => ({ ...c, password: e.target.value }))
          }
        />
        <p className="login-error-msg">{userError}</p>
        <div className="login-btns">
          <Button variant="contained" type="submit">
            Logga in
          </Button>
        </div>
      </form>
    </>
  );
}
