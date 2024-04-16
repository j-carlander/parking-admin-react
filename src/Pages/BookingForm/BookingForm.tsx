import { TextField } from "@mui/material";
import { BookingDTO } from "parking-sdk";
import { useState } from "react";
import './BookingForm.css';


export function BookingForm() {
  const [booking, setBooking] = useState<BookingDTO>({});

  console.log("booking: ", booking);

  function handleFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    const field: string = e.currentTarget.name;
    const value: string = e.currentTarget.value;

    setBooking((prevData) => ({ ...prevData, [field]: value }));
  }

  return (
    <>
      <h2>Ny bokning</h2>
      <form>
        <div className="form-field-wrapper">
          <TextField
            label="Start Parkering"
            type="date"
            name="departureDate"
            value={booking.departureDate?.toString() || ""}
            onChange={handleFieldChange}
            placeholder=""
            InputLabelProps={{
              shrink: true,
            }}
          />
          <span>-</span>
          <TextField
            label="Slut Parkering"
            type="date"
            name="arrivalDate"
            value={booking.arrivalDate?.toString() || ""}
            onChange={handleFieldChange}
            placeholder=""
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
      </form>
    </>
  );
}
