import { Outlet, useOutletContext } from "react-router-dom";
import "./App.css";
import { Header } from "./Components/Header/Header";
import { UserDTO } from "parking-sdk";
import { useEffect, useState } from "react";
import fetchService from "./services/fetchService";
import { UserContext } from "./types";

function App() {
  const [currentUser, setCurrentUser] = useState<UserDTO | undefined>(
    undefined
  );

  console.log("current user: ", currentUser);

  useEffect(() => {
    (async () => {
      setCurrentUser(await fetchService.getCurrentUser());
    })();
  }, []);
  
  return (
    <>
      <Header {...{ currentUser, setCurrentUser }} />
      <div className="outlet-wrapper">
        <Outlet
          context={{ currentUser, setCurrentUser } satisfies UserContext}
        />
      </div>
    </>
  );
}

export default App;

export function useUserContext() {
  return useOutletContext<UserContext>();
}
