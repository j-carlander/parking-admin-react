import {
  Autocomplete,
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
  TextField,
} from "@mui/material";
import { FlightDTO } from "parking-sdk";
import { useEffect, useState } from "react";
import fetchService from "../../services/fetchService";
import { suggestParkingDate } from "../../utils/suggestParkingDate";
import { OutletContext } from "../../types";
import { useOutletContext } from "react-router-dom";


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

  const { booking, setBooking} = useOutletContext<OutletContext>();

  useEffect(() => {
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
  }, [booking]);

  useEffect(() => {
    (async function () {
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
    })();
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
    reason: AutocompleteChangeReason | AutocompleteInputChangeReason,
    direction: "departure" | "arrival"
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
            onAutoCompleteChange(selectedFlight, reason, "departure");
          }}
          inputValue={manualFlightInput.departure}
          onInputChange={(e, selectedFlight, reason) => {
            onAutoCompleteChange(selectedFlight, reason, "departure");
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
            onAutoCompleteChange(selectedFlight, reason, "arrival");
          }}
          inputValue={manualFlightInput.arrival}
          onInputChange={(e, selectedFlight, reason) => {
            onAutoCompleteChange(selectedFlight, reason, "arrival");
          }}
          renderInput={(params) => (
            <TextField {...params} variant="filled" label="Flyg hemresa" />
          )}
        />
      </section>
    </>
  );
}
