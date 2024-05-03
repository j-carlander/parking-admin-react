import { FlightDTO } from "parking-sdk";
import { TravelDates } from "../Components/SelectFlightForm/SelectFlightForm";
import fetchService from "./fetchService";

export async function getFlightsByDate(
  travelDates: TravelDates,
  setFlightLists: React.Dispatch<
    React.SetStateAction<{
      departure: FlightDTO[];
      arrival: FlightDTO[];
    }>
  >
) {
  const fetchDeparture = fetchService.getFlights(
    travelDates.departure,
    "departure"
  );
  const fetchArrival = fetchService.getFlights(
    travelDates.arrival, 
    "arrival"
  );
  const [resultDeparture, resultArrival] = await Promise.all([
    fetchDeparture,
    fetchArrival,
  ]);
  setFlightLists({ departure: resultDeparture, arrival: resultArrival });
}
