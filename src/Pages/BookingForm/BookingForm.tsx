import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import { BookingDTO } from "parking-sdk";
import { useState } from "react";
import "./BookingForm.css";
import { CheckBox } from "@mui/icons-material";
import { SelectFlightForm } from "../../Components/SelectFlightForm/SelectFlightForm";
import { ParkingDateRange } from "../../Components/ParkingDateRange/ParkingDateRange";
import { ParkingResource } from "../../Components/ParkingResource/ParkingResource";
import { TotalPrice } from "../../types";
import { CarDetails } from "../../Components/CarDetails/CarDetails";

export function BookingForm() {
  const [booking, setBooking] = useState<BookingDTO>(defaultBooking);
  const [totalPrice, setTotalPrice] = useState<TotalPrice>({resourcePrice: 0, featurePrices: []});

  console.log("booking: ", booking);

  function calcTotalPrice(){
      return totalPrice.resourcePrice + totalPrice.featurePrices.reduce((tot: number, feature: number )=> tot + feature, 0)
  }

  return (
    <>
      <h2>Ny bokning</h2>
      <form className="booking-form">
        <SelectFlightForm {...{ booking, setBooking }} />
        <ParkingDateRange {...{ booking, setBooking }} />
        <ParkingResource {...{ booking, setBooking, setTotalPrice }} />
        <CarDetails {...{booking, setBooking}} /> 
        {/* Features */}
        <Accordion>
          <AccordionSummary
            className="features-accordion"
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="features"
          >
            <h3>Tjänster</h3>
          </AccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionDetails>
        </Accordion>
        <p className="total-price">
          <span>Totalpris: </span>
          {calcTotalPrice()} kr
        </p>
        <h3>Övriga uppgifter</h3>
        <TextField
          className="full-width-field"
          variant="filled"
          label="För- & Efternamn"
          type="text"
          name="name"
          // value={booking.arrivalDate?.toString() || ""}
          // onChange={updateBooking}
          placeholder=""
          // InputLabelProps={{
          //   shrink: true,
          // }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <PersonIcon />
              </InputAdornment>
            ),
          }}
          required
        />
        <section className="form-field-wrapper">
          <TextField
            variant="filled"
            label="Telefonnummer"
            type="text"
            name="phone"
            // value={booking.departureDate?.toString() || ""}
            // onChange={updateBooking}
            placeholder=""
            // InputLabelProps={{
            //   shrink: true,
            // }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <span className="material-symbols-outlined">call</span>
                </InputAdornment>
              ),
            }}
            required
          />
          <TextField
            variant="filled"
            label="E-post"
            type="text"
            name="email"
            // value={booking.arrivalDate?.toString() || ""}
            // onChange={updateBooking}
            placeholder=""
            // InputLabelProps={{
            //   shrink: true,
            // }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <span className="material-symbols-outlined">mail</span>
                </InputAdornment>
              ),
            }}
            required
          />
        </section>
        <FormControlLabel
          className="extras-checkbox"
          control={<CheckBox />}
          label="Incheckat bagage"
        />
        <FormControlLabel
          className="extras-checkbox"
          control={<CheckBox />}
          label="Bilbarnstol"
        />
        <TextField
          className="full-width-field"
          variant="filled"
          label="Kommentar"
          multiline
          rows={2}
          name="comment"
          // value={booking.arrivalDate?.toString() || ""}
          // onChange={updateBooking}
          placeholder=""
          // InputLabelProps={{
          //   shrink: true,
          // }}
        />
        <button className="submit-booking">Nästa</button>
      </form>
    </>
  );
}

/** Deafult object for a booking with all keys */
const defaultBooking: BookingDTO = {
  bookingId: undefined,
  name: undefined,
  phone: undefined,
  email: undefined,
  departureDate: undefined,
  arrivalDate: undefined,
  arrivalFlight: undefined,
  arrivalFlightNumber: undefined,
  departureFlight: undefined,
  departureFlightNumber: undefined,
  travelHomeFrom: undefined,
  registrationNumber: undefined,
  resource: undefined,
  qtyPersons: undefined,
  qtyPersonsPickedUp: undefined,
  qtyPersonsDroppedOff: undefined,
  handLuggageOnly: undefined,
  bookingStatus: undefined,
  comment: undefined,
  qr: undefined,
  qrImage: undefined,
  createdBy: undefined,
  createdDate: undefined,
  updatedBy: undefined,
  updatedDate: undefined,
  prepaidTicket: undefined,
  childSafetySeat: undefined,
  vehicleType: undefined,
  engineType: undefined,
}
