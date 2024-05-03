import { FlightDTO } from "parking-sdk";

export  function generateOptionLabel(option: string | FlightDTO, direction: string) {
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