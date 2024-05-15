import { BookingDTO, FlightDTO } from "parking-sdk";
import { TravelDates } from "../Components/SelectFlightForm/SelectFlightForm";

export function updateFlightAndDateFromEditBooking(
    booking: BookingDTO,
    travelDates: TravelDates,
    setTravelDates: React.Dispatch<React.SetStateAction<TravelDates>>,
    setManualFlightInput: React.Dispatch<React.SetStateAction<{
        departure: string;
        arrival: string;
    }>>,
    setSelectedFlights: React.Dispatch<React.SetStateAction<{
        departure: FlightDTO;
        arrival: FlightDTO;
    }>>,
){
    if (booking.departureDate && !travelDates.departure) {
        setTravelDates((traveldates) => ({
          ...traveldates,
          departure: new Intl.DateTimeFormat("sv-SE").format(
            booking.departureDate
          ),
        }));
      }
      if (booking.arrivalDate && !travelDates.arrival) {
        setTravelDates((traveldates) => ({
          ...traveldates,
          arrival: new Intl.DateTimeFormat("sv-SE").format(booking.arrivalDate),
        }));
      }
  
      if (
        booking.arrivalFlight !== undefined &&
        booking.departureFlight !== undefined
      ) {
        setSelectedFlights({
          departure: booking.departureFlight,
          arrival: booking.arrivalFlight,
        });
      }
      if (
        booking.arrivalFlightNumber !== undefined &&
        booking.departureFlightNumber !== undefined
      ) {
        setManualFlightInput({
          departure: booking.departureFlightNumber,
          arrival: booking.arrivalFlightNumber,
        });
      }
}