import { Outlet } from "react-router-dom";
import "./App.css";
import { Header } from "./Components/Header/Header";


function App() {
  return (
    <>
      <Header />
      <div className="outlet-wrapper">
      <Outlet />
      </div>
    </>
  );
}

export default App;
