import { useState } from "react";
import './Home.css';
import { Navigate } from "react-router-dom";
import fetchService from "../../services/fetchService";

export function Home() {
  const [topic, setTopic] = useState<"ARRIVAL" | "DEPARTURE">("ARRIVAL");

 
  if(!fetchService.isAuthenticated()){
    return <Navigate to={'/logga-in'} />
  }
  return (
    <>
      <h2>{topic === "ARRIVAL" ? "Hämtlista" : "Lämnlista"}</h2>
      <div className="toggles">
        <button onClick={() => setTopic('ARRIVAL')}>Hämtlista</button>
        <button onClick={() => setTopic('DEPARTURE')}>Lämnlista</button>
      </div>
      <article>
        <p>Current topic: {topic}</p>
      </article>
    </>
  );
}
