import { FlightDTO } from "parking-sdk";
import { TravelDates } from "../Components/SelectFlightForm/SelectFlightForm";

export function suggestParkingDate(direction: "departure" | "arrival", flight: FlightDTO, travelDates: TravelDates){
    let date: Date;
    if(direction === 'departure'){
      date = flight.suggestedParkingFrom ? new Date(flight.suggestedParkingFrom) : new Date(travelDates.departure)
    } else {
      date = flight.suggestedParkingTo ? new Date(flight.suggestedParkingTo) : new Date(travelDates.arrival)
    }
    return date
  }