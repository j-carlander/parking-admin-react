import { HourBookingDTO } from "parking-sdk";
import { AccordionSummary } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import GroupIcon from "@mui/icons-material/Group";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SummaryIcons } from "../SummaryIcons/SummaryIcons";

type DepartureBookingProp = {
  group: HourBookingDTO;
};

export function DepartureBookingSummary({ group }: DepartureBookingProp) {
  return (
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div className="group-summary">
      <div className="summary-info">
        {group.departureDate ? (
          <span className="flight-info">
            <DirectionsCarIcon />{" "}
            {new Intl.DateTimeFormat("sv-SE", { timeStyle: "short" }).format(
              new Date(group.departureDate)
            )}
          </span>
        ) : (
          <span className="flight-info">
            <ChecklistRtlIcon /> Lämnade
          </span>
        )}
        <span>
          <GroupIcon />{" "}
          {group.bookings?.reduce(
            (prev, booking) => prev + (booking.qtyPersons || 0),
            0
          )}
        </span>
      </div>
        <SummaryIcons {...{group}} />
        </div>
    </AccordionSummary>
  );
}
