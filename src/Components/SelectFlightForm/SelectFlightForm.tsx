import { Autocomplete, TextField } from "@mui/material";
import { FlightDTO } from "parking-sdk";
import { useEffect, useState } from "react";
import { OutletContext } from "../../types";
import { useOutletContext } from "react-router-dom";
import { generateOptionLabel } from "../../utils/generateOptionLabel";
import { onAutoCompleteChange } from "../../services/onAutoCompleteChange";
import { updateFlightAndDateFromEditBooking } from "../../services/updateFlightAndDateFromEditBooking";
import { getFlightsByDate } from "../../services/getFlightsByDate";

export type TravelDates = {
  departure: string;
  arrival: string;
};

export function SelectFlightForm() {
  const [travelDates, setTravelDates] = useState<TravelDates>({
    departure: "",
    arrival: "",
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

  const { booking, setBooking } = useOutletContext<OutletContext>();

  useEffect(() => {
    if (booking.bookingId) {
      updateFlightAndDateFromEditBooking(
        booking,
        travelDates,
        setTravelDates,
        setManualFlightInput,
        setSelectedFlights
      );
    }
  }, [booking]);

  useEffect(() => {
   getFlightsByDate(travelDates, setFlightLists);
  }, [travelDates]);

  /** Functions */
  async function updateFlightList(e: React.ChangeEvent<HTMLInputElement>) {
    const direction: string = e.currentTarget.name;
    const date: string = e.currentTarget.value;
    setTravelDates((dates) => ({ ...dates, [direction]: date }));
    setBooking((booking) => ({
      ...booking,
      [`${direction}Flight`]: undefined,
      [`${direction}FlightNumber`]: undefined,
      [`${direction}Date`]: new Date(date),
    }));
    setManualFlightInput((manuals) => ({
      ...manuals,
      [direction]: "",
    }));
    setSelectedFlights((flights) => ({
      ...flights,
      [direction]: {},
    }));
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
          onChange={(e, selectedFlight, reason) => {
            onAutoCompleteChange(
              selectedFlight,
              reason,
              "departure",
              setManualFlightInput,
              setSelectedFlights,
              setBooking,
              travelDates
            );
          }}
          inputValue={manualFlightInput.departure}
          onInputChange={(e, selectedFlight, reason) => {
            onAutoCompleteChange(
              selectedFlight,
              reason,
              "departure",
              setManualFlightInput,
              setSelectedFlights,
              setBooking,
              travelDates
            );
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
          onChange={(e, selectedFlight, reason) => {
            onAutoCompleteChange(
              selectedFlight,
              reason,
              "arrival",
              setManualFlightInput,
              setSelectedFlights,
              setBooking,
              travelDates
            );
          }}
          inputValue={manualFlightInput.arrival}
          onInputChange={(e, selectedFlight, reason) => {
            onAutoCompleteChange(
              selectedFlight,
              reason,
              "arrival",
              setManualFlightInput,
              setSelectedFlights,
              setBooking,
              travelDates
            );
          }}
          renderInput={(params) => (
            <TextField {...params} variant="filled" label="Flyg hemresa" />
          )}
        />
      </section>
    </>
  );
}
