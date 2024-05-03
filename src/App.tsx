import { NavLink, Outlet, useOutletContext } from "react-router-dom";
import "./App.css";
import { Header } from "./Components/Header/Header";
import { BookingDTO, UserDTO } from "parking-sdk";
import { useEffect, useState } from "react";
import fetchService from "./services/fetchService";
import { OutletContext, UserContext } from "./types";
import { defaultBooking } from "./Pages/BookingForm/BookingForm";

function App() {
  const [currentUser, setCurrentUser] = useState<UserDTO | undefined>(
    undefined
  );
  const [booking, setBooking] = useState<BookingDTO>(defaultBooking);


  useEffect(() => {
    (async () => {
      setCurrentUser(await fetchService.getCurrentUser());
    })();
  }, []);

  return (
    <>
      <Header {...{ currentUser, setCurrentUser }} />
      <div className="page-wrapper">
        {currentUser ? <aside className="side-menu">
          <NavLink to={'/ny-bokning'}><span className="material-symbols-outlined side-menu-btn">add</span></NavLink>
          
          <span className="material-symbols-outlined side-menu-btn">
            search
          </span>
          <span className="material-symbols-outlined side-menu-btn">
            attach_money
          </span>
        </aside> : null}
        <main className="outlet-wrapper">
          <Outlet
            context={{ currentUser, setCurrentUser, booking, setBooking } satisfies OutletContext}
          />
        </main>
      </div>
    </>
  );
}

export default App;

// export function useContext() {
//   return useOutletContext<UserContext>();
// }
