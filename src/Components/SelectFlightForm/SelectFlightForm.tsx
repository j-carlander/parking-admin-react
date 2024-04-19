import { Autocomplete, TextField } from "@mui/material";
import { BookingDTO, FlightDTO } from "parking-sdk";
import { useState } from "react";
import fetchService from "../../services/fetchService";
import { suggestParkingDate } from "../../utils/suggestParkingDate";
/** Types */
type SelectFlightProps = {
  booking: BookingDTO | undefined;
  setBooking: React.Dispatch<React.SetStateAction<BookingDTO>>;
};
export type TravelDates = {
  departure: string;
  arrival: string;
};

/** Component */
export function SelectFlightForm({ booking, setBooking }: SelectFlightProps) {
  /** States */
  const [travelDates, setTravelDates] = useState<TravelDates>({
    departure: booking?.departureDate
      ? new Intl.DateTimeFormat("sv-SE").format(booking.departureDate)
      : "",
    arrival: booking?.arrivalDate
      ? new Intl.DateTimeFormat("sv-SE").format(booking.arrivalDate)
      : "",
  });

  const [flightLists, setFlightLists] = useState<{
    departure: FlightDTO[];
    arrival: FlightDTO[];
  }>({ departure: [], arrival: [] });

  const [selectedFlights, setSelectedFlights] = useState<{
    departure: FlightDTO;
    arrival: FlightDTO;
  }>({ departure: {}, arrival: {} });

  const [manualFlightInput, setManualFlightInput] = useState<{
    departure: string;
    arrival: string;
  }>({ departure: "", arrival: "" });

  /** Functions */
  async function updateFlightList(e: React.ChangeEvent<HTMLInputElement>) {
    const direction: string = e.currentTarget.name;
    const date: string = e.currentTarget.value;
    setTravelDates((dates) => ({ ...dates, [direction]: date }));
    setBooking((booking) => ({
      ...booking,
      [`${direction}Date`]: new Date(date),
    }));
    const result = await fetchService.getFlights(date, direction);
    setFlightLists((lists) => ({ ...lists, [direction]: result }));
  }

  function generateOptionLabel(option: string | FlightDTO, direction: string) {
    return typeof option === "string"
      ? ""
      : direction === "departure"
      ? `${option.flightNumber ? option.flightNumber + " " : ""}${
          option.arrivalAirport ? option.arrivalAirport + " " : ""
        }${
          option.scheduledDepartureDate
            ? new Intl.DateTimeFormat("sv-SE", { timeStyle: "short" }).format(
                new Date(option.scheduledDepartureDate)
              )
            : ""
        }`
      : `${option.flightNumber ? option.flightNumber + " " : ""}${
          option.departureAirport ? option.departureAirport + " " : ""
        }${
          option.scheduledArrivalDate
            ? new Intl.DateTimeFormat("sv-SE", { timeStyle: "short" }).format(
                new Date(option.scheduledArrivalDate)
              )
            : ""
        }`;
  }

  function onAutoCompleteChange(
    selectedFlight: FlightDTO | string | null,
    direction: "departure" | "arrival"
  ) {
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
        [`${direction}Date`]: travelDates[direction],
      }));
    }
  }

  return (
    <>
      <section className="form-field-wrapper">
        <TextField
          variant="filled"
          label="Utresa"
          type="date"
          name="departure"
          value={travelDates.departure}
          onChange={updateFlightList}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Autocomplete
          freeSolo
          options={flightLists.departure}
          getOptionLabel={(option) => generateOptionLabel(option, "departure")}
          value={selectedFlights.departure}
          onChange={(e, selectedFlight) => {
            onAutoCompleteChange(selectedFlight, "departure");
          }}
          inputValue={manualFlightInput.departure}
          onInputChange={(e, selectedFlight) => {
            onAutoCompleteChange(selectedFlight, "departure");
          }}
          renderInput={(params) => (
            <TextField {...params} variant="filled" label="Flyg utresa" />
          )}
        />
      </section>
      <section className="form-field-wrapper">
        <TextField
          variant="filled"
          label="Hemresa"
          type="date"
          name="arrival"
          value={travelDates.arrival}
          onChange={updateFlightList}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Autocomplete
          freeSolo
          options={flightLists.arrival}
          getOptionLabel={(option) => generateOptionLabel(option, "arrival")}
          value={selectedFlights.arrival}
          onChange={(e, selectedFlight) => {
            selectedFlight && typeof selectedFlight !== "string"
              ? setSelectedFlights((flights) => ({
                  ...flights,
                  arrival: selectedFlight,
                }))
              : null;
          }}
          inputValue={manualFlightInput.arrival}
          onInputChange={(e, value) => {
            setManualFlightInput((manuals) => ({ ...manuals, arrival: value }));
          }}
          renderInput={(params) => (
            <TextField {...params} variant="filled" label="Flyg hemresa" />
          )}
        />
      </section>
    </>
  );
}