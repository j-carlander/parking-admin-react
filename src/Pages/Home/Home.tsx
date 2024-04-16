import { useEffect, useState } from "react";
import './Home.css';
import { Navigate } from "react-router-dom";
import fetchService from "../../services/fetchService";
import { useUserContext } from "../../App";
import { FlightBookingDTO, HourBookingDTO } from "parking-sdk";

export function Home() {
  const [topic, setTopic] = useState<"ARRIVAL" | "DEPARTURE">("ARRIVAL");
  const [timeRange, setTimeRange] = useState<{ from: string, to: string } | undefined>(undefined);
  const [currentArrivalBookings, setCurrentArrivalBookings] = useState<FlightBookingDTO[] | undefined>(undefined);
  const [currentDepartureBookings, setCurrentDepartureBookings] = useState<HourBookingDTO[] | undefined>(undefined);
  const { currentUser } = useUserContext();
  
  useEffect(() => {
    (async function(){
      const timeOffset = await fetchService.getCurrentTimeOffset();
      setTimeRange(timeOffset);
      const [arrivals, departures] = await fetchService.getCurrentBookings();
      console.log(departures);
      
      setCurrentArrivalBookings(arrivals);
      setCurrentDepartureBookings(departures);
    })()
  },[])

 
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
      <div className="time-range">
        {timeRange ? timeRange.from + ' -> ' + timeRange.to : undefined}
      </div>
      <article>
        <p>Current topic: {topic}</p>
        {topic === 'ARRIVAL' ? (currentArrivalBookings?.map(group => <p key={group.flightNumber}>{group.flightNumber}</p>)) : (currentDepartureBookings?.map((group, index) => <p key={index}>{group?.departureDate?.toString()}</p>))} 
      </article>
    </>
  );
}
