import { Accordion, AccordionDetails } from "@mui/material";
import { FlightBookingDTO, HourBookingDTO } from "parking-sdk";
import { ArrivalBookingSummary } from "./ArrivalBookingsSummary/ArrivalBookingsSummary";
import { DepartureBookingSummary } from "./DepartureBookingsSummary/DepartureBookingsSummary";
import "./CurrentBookings.css";

type CurrentBookingProps = {
  groups: FlightBookingDTO[] | HourBookingDTO[];
};

export function CurrentBookings({ groups }: CurrentBookingProps) {
  function callOrPickupGroup(group: FlightBookingDTO | HourBookingDTO) {
    if (
      ("flightNumber" in group &&
        (group.departureAirport === "Ringkunder" ||
          group.departureAirport === "Hämtade")) ||
      ("hourBookingType" in group && group.hourBookingType === "DROPPED_OFF")
    )
      return true;
    return false;
  }
  return (
    <>
      {groups.map((group, index) => {
        return (
          <Accordion key={index} className={callOrPickupGroup(group) ? "call-group group-accordion":"group-accordion"}>
            {"flightNumber" in group ? (
              <ArrivalBookingSummary {...{ group }} />
            ) : (
              <DepartureBookingSummary {...{ group }} />
            )}
            <AccordionDetails>
              {group.bookings?.map((booking) => (
                <p key={booking.registrationNumber}>
                  {booking.registrationNumber}
                </p>
              ))}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </>
  );
}
