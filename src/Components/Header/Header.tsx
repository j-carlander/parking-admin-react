import { UserDTO } from "parking-sdk";
import fetchService from "../../services/fetchService";
import { Navbar } from "../Navbar/Navbar";
import "./Header.css";
import { useNavigate } from "react-router-dom";

type HeaderProps ={
  currentUser: UserDTO | undefined,
  setCurrentUser: (value: UserDTO | undefined) => void
}

export function Header({currentUser ,setCurrentUser}: HeaderProps) {
  const navigate = useNavigate()

  function signOut(){
    fetchService.signOut(setCurrentUser);
    navigate('/logga-in');
  }

  return (
    <header>
      <div className="title-bar">
        <div className="logo-wrapper">
          <img
            className="header-logo"
            src="/lindskrog_logo.png"
            alt="Lindskrog Logo"
            aria-label="Lindskrog"
          />
        </div>
        <h1>
        </h1>
        {currentUser ? <button className="signout-btn" onClick={signOut}>Logga ut</button> : null}
      </div>
      {currentUser ? <Navbar /> : null}
    </header>
  );
}
