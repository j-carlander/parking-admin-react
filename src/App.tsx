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

  useEffect(() => {
    (async () => {
      setCurrentUser(await fetchService.getCurrentUser());
    })();
  }, []);

  return (
    <>
      <Header {...{ currentUser, setCurrentUser }} />
      <div className="page-wrapper">
        <aside className="side-menu">
          <span className="material-symbols-outlined side-menu-btn">add</span>
          <span className="material-symbols-outlined side-menu-btn">
            search
          </span>
          <span className="material-symbols-outlined side-menu-btn">
            attach_money
          </span>
        </aside>
        <main className="outlet-wrapper">
          <Outlet
            context={{ currentUser, setCurrentUser } satisfies UserContext}
          />
        </main>
      </div>
    </>
  );
}

export default App;

export function useUserContext() {
  return useOutletContext<UserContext>();
}
