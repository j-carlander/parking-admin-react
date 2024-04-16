import { useState } from "react";
import './Home.css';
import { Navigate } from "react-router-dom";
import fetchService from "../../services/fetchService";
import { useUserContext } from "../../App";

export function Home() {
  const [topic, setTopic] = useState<"ARRIVAL" | "DEPARTURE">("ARRIVAL");
  const { currentUser } = useUserContext()

 
  if(!currentUser){
    return <Navigate to={'/logga-in'} />
  }
  return (
    <>
      <h2>{topic === "ARRIVAL" ? "Hämtlista" : "Lämnlista"}</h2>
      <div className="topic-toggles">
        <button className={topic === 'ARRIVAL' ? 'active': undefined} onClick={() => setTopic('ARRIVAL')}>Hämtlista</button>
        <button className={topic === 'DEPARTURE' ? 'active': undefined} onClick={() => setTopic('DEPARTURE')}>Lämnlista</button>
      </div>
      <article>
        <p>Current topic: {topic}</p>
      </article>
    </>
  );
}
