import { useEffect, useState } from "react";
import "./Home.css";
import { Navigate } from "react-router-dom";
import fetchService from "../../services/fetchService";
import { useUserContext } from "../../App";
import { FlightBookingDTO, HourBookingDTO } from "parking-sdk";
import { CurrentBookings } from "../../Components/CurrentBookings/CurrentBookings";

export function Home() {
  const [topic, setTopic] = useState<"ARRIVAL" | "DEPARTURE">("ARRIVAL");
  const [timeRange, setTimeRange] = useState<
    { from: string; to: string } | undefined
  >(undefined);
  const [currentArrivalBookings, setCurrentArrivalBookings] = useState<
    FlightBookingDTO[]
  >([]);
  const [currentDepartureBookings, setCurrentDepartureBookings] = useState<
    HourBookingDTO[]
  >([]);
  const { currentUser } = useUserContext();

  useEffect(() => {
    (async function getCurrentBookings() {
      const timeOffset = await fetchService.getCurrentTimeOffset();
      setTimeRange(timeOffset);
      const [arrivals, departures] = await fetchService.getCurrentBookings();

      setCurrentArrivalBookings(arrivals);
      setCurrentDepartureBookings(departures);
    })();
  }, []);

  if (!currentUser) {
    return <Navigate to={"/logga-in"} />;
  }
  return (
    <>
      <h2>{topic === "ARRIVAL" ? "Hämtlista" : "Lämnlista"}</h2>
      <section className="toggle-time-wrapper">
      <div className="topic-toggles">
        <button
          className={topic === "ARRIVAL" ? "active" : undefined}
          onClick={() => setTopic("ARRIVAL")}
        >
          Hämtlista
        </button>
        <button
          className={topic === "DEPARTURE" ? "active" : undefined}
          onClick={() => setTopic("DEPARTURE")}
        >
          Lämnlista
        </button>
      </div>
      <div className="time-range">
        <p>Visar bokningar</p>
        <p>{timeRange ? timeRange.from + " -> " + timeRange.to : undefined}</p>
      </div>
      </section>
      <article>
        {topic === 'ARRIVAL' ? <CurrentBookings groups={currentArrivalBookings} /> : <CurrentBookings groups={currentDepartureBookings} />}
      </article>
    </>
  );
}
