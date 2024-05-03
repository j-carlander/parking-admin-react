import { BookingDTO, FlightDTO } from "parking-sdk";
import { TravelDates } from "../Components/SelectFlightForm/SelectFlightForm";
import { AutocompleteChangeReason, AutocompleteInputChangeReason } from "@mui/material";
import { suggestParkingDate } from "../utils/suggestParkingDate";

export function onAutoCompleteChange(
    selectedFlight: FlightDTO | string | null,
    reason: AutocompleteChangeReason | AutocompleteInputChangeReason,
    direction: "departure" | "arrival",
    setManualFlightInput: React.Dispatch<React.SetStateAction<{
        departure: string;
        arrival: string;
    }>>,
    setSelectedFlights: React.Dispatch<React.SetStateAction<{
        departure: FlightDTO;
        arrival: FlightDTO;
    }>>,
    setBooking: React.Dispatch<React.SetStateAction<BookingDTO>>,
    travelDates: TravelDates
  ) {
    console.log("reason: ", reason);
    if (reason === "clear") {
      setManualFlightInput((manuals) => ({
        ...manuals,
        [direction]: "",
      }));
      setSelectedFlights((flights) => ({
        ...flights,
        [direction]: {},
      }));
      setBooking((booking) => ({
        ...booking,
        [`${direction}Flight`]: undefined,
        [`${direction}FlightNumber`]: undefined,
        [`${direction}Date`]: new Date(travelDates[direction]),
      }));
      return;
    }

    if (selectedFlight && typeof selectedFlight === "object") {
      setSelectedFlights((flights) => ({
        ...flights,
        [direction]: selectedFlight,
      }));

      const suggestedDate = suggestParkingDate(
        direction,
        selectedFlight,
        travelDates
      );
      setBooking((booking) => ({
        ...booking,
        [`${direction}Flight`]: selectedFlight,
        [`${direction}FlightNumber`]: undefined,
        [`${direction}Date`]: suggestedDate,
      }));
    } else {
      setManualFlightInput((manuals) => ({
        ...manuals,
        [direction]: selectedFlight,
      }));
      setBooking((booking) => ({
        ...booking,
        [`${direction}Flight`]: undefined,
        [`${direction}FlightNumber`]: selectedFlight,
        [`${direction}Date`]: new Date(travelDates[direction]),
      }));
    }
  }