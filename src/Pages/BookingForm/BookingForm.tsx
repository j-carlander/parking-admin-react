import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import { BookingDTO } from "parking-sdk";
import { useState } from "react";
import "./BookingForm.css";
import { CheckBox } from "@mui/icons-material";
import { SelectFlightForm } from "../../Components/SelectFlightForm/SelectFlightForm";


export function BookingForm() {
  const [booking, setBooking] = useState<BookingDTO>({});
  const [totalPrice, setTotalPrice] = useState(0);

  console.log("booking: ", booking);

  function updateBooking(e: React.ChangeEvent<HTMLInputElement>) {
    const field: string = e.currentTarget.name;
    const value: string = e.currentTarget.value;

    setBooking((prevData) => ({ ...prevData, [field]: value }));
  }

  return (
    <>
      <h2>Ny bokning</h2>
      <form className="booking-form">
        <SelectFlightForm {...{booking, setBooking}}/>
        <h3>Parkeringsperiod</h3>

        <section className="form-field-wrapper">
          <TextField
            variant="filled"
            label="Startdatum"
            type="date"
            name="departureDate"
            value={booking.departureDate?.toString() || ""}
            onChange={updateBooking}
            placeholder=""
            InputLabelProps={{
              shrink: true,
            }}
            required
          />

          <TextField
            variant="filled"
            label="Slutdatum"
            type="date"
            name="arrivalDate"
            value={booking.arrivalDate?.toString() || ""}
            onChange={updateBooking}
            placeholder=""
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </section>
        <section className="form-field-wrapper">
          <TextField
            variant="filled"
            label="Starttid"
            type="text"
            name="departureDate"
            value={booking.departureDate?.toString() || ""}
            onChange={updateBooking}
            placeholder="tt:mm"
            // InputLabelProps={{
            //   shrink: true,
            // }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <span className="material-symbols-outlined">schedule</span>
                </InputAdornment>
              ),
            }}
            required
          />

          <TextField
            variant="filled"
            label="Sluttid"
            type="text"
            name="arrivalDate"
            value={booking.arrivalDate?.toString() || ""}
            onChange={updateBooking}
            placeholder="tt:mm"
            // InputLabelProps={{
            //   shrink: true,
            // }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <span className="material-symbols-outlined">schedule</span>
                </InputAdornment>
              ),
            }}
            required
          />
        </section>
        <h3>Plats*</h3>
        <RadioGroup
    name="resource"
    // value={value}
    // onChange={handleChange}
  >
    <FormControlLabel value="garage" control={<Radio />} label="garage" />
    <FormControlLabel value="utomhus" control={<Radio />} label="utomhus" />
  </RadioGroup>
        {/* Contact info */}
        <section className="form-field-wrapper">
          <TextField
            variant="filled"
            label="Registreringsnummer"
            type="text"
            name="registrationNumber"
            // value={booking.departureDate?.toString() || ""}
            // onChange={updateBooking}
            placeholder=""
            // InputLabelProps={{
            //   shrink: true,
            // }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <span className="material-symbols-outlined">
                    directions_car
                  </span>
                </InputAdornment>
              ),
            }}
            required
          />
          <TextField
            variant="filled"
            label="Antal resenärer"
            type="text"
            name="qtyPeople"
            // value={booking.arrivalDate?.toString() || ""}
            // onChange={updateBooking}
            placeholder=""
            // InputLabelProps={{
            //   shrink: true,
            // }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <span className="material-symbols-outlined">group</span>
                </InputAdornment>
              ),
            }}
            required
          />
        </section>
{/* Prepaid/Member */}
        <TextField
          className="full-width-field"
          variant="filled"
          label="Abonnemang"
          select
          name="prepaid"
          // value={booking.arrivalDate?.toString() || ""}
          // onChange={updateBooking}
          placeholder=""
          // InputLabelProps={{
          //   shrink: true,
          // }}
          required
        >
          <MenuItem key={"notInUse"} value={"notInUse"}>
            Använd ej
          </MenuItem>
          {/* {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))} */}
        </TextField>
          {/* Features */}
        <Accordion >
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
          {totalPrice} kr
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
