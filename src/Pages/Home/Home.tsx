import { useState } from "react";
import './Home.css';

export function Home() {
  const [topic, setTopic] = useState<"ARRIVAL" | "DEPARTURE">("ARRIVAL");
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
