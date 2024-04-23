import { FlightBookingDTO } from "parking-sdk";
import { AccordionSummary } from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import GroupIcon from "@mui/icons-material/Group";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SummaryIcons } from "../SummaryIcons/SummaryIcons";

type ArrivalBookingProp = {
  group: FlightBookingDTO;
};

export function ArrivalBookingSummary({ group }: ArrivalBookingProp) {
  return (
    <AccordionSummary expandIcon={<ExpandMoreIcon />} className="group-summary">
        <div className="group-summary">
      <div className="summary-info">
        {group.flightNumber ? (
          <span className="flight-info">
            <FlightIcon className="icon-rotate" /> {group.flightNumber}{" "}
            {group.arrivalDate
              ? new Intl.DateTimeFormat("sv-SE", {
                  timeStyle: "short",
                }).format(new Date(group.arrivalDate))
              : ""}
          </span>
        ) : group.departureAirport === "Ringkunder" ? (
          <span className="flight-info">
            <LocalPhoneIcon /> Ringkunder
          </span>
        ) : (
          <span className="flight-info">
            <ChecklistRtlIcon /> Hämtade
          </span>
        )}
        <span>
          <GroupIcon />{" "}
          {group.bookings?.reduce(
            (prev, booking) => prev + (booking.qtyPersons || 0),
            0
          )}
        </span>
        {group.flightNumber ? <span>{group.departureAirport}</span> : null}
      </div>
      <SummaryIcons {...{ group }} />
      </div>
    </AccordionSummary>
  );
}
