import { InputAdornment, MenuItem, TextField } from "@mui/material";
import { BookingProps } from "../../types";
import { useEffect, useState } from "react";
import fetchService from "../../services/fetchService";
import { PrepaidTicketWithBookingDTO } from "parking-sdk";

export function CarDetails({ booking, setBooking }: BookingProps) {
  const [prepaids, setPrepaids] = useState<PrepaidTicketWithBookingDTO[]>([]);

  useEffect(() => {
    (async function (){
      if (
        booking.registrationNumber &&
        booking.registrationNumber.length >= 6 &&
        booking.resource?.resourceId
      ) {
        const result = await fetchService.findPrepaidTicketsByBookingAdmin(
          booking.registrationNumber,
          booking.resource?.resourceId,
          booking.departureDate,
          booking.arrivalDate
        );
        if (result.length >= 0) setPrepaids(result);
      }
    })();
  }, [booking]);

  function updateBooking(e: React.ChangeEvent<HTMLInputElement>) {
    setBooking((booking) => ({ ...booking, [e.target.name]: e.target.value }));
  }
  return (
    <>
      <section className="form-field-wrapper">
        <TextField
          variant="filled"
          label="Registreringsnummer"
          type="text"
          name="registrationNumber"
          value={booking.registrationNumber || ""}
          onChange={updateBooking}
          placeholder=""
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
          name="qtyPersons"
          value={booking.qtyPersons || ""}
          onChange={updateBooking}
          placeholder=""
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
        value="notInUse"
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
        {prepaids.length >= 0
          ? prepaids.map((prepaid) => (
              <MenuItem key={prepaid.prepaidTicketId} value={prepaid.name}>
                {prepaid.name}
              </MenuItem>
            ))
          : null}
      </TextField>
    </>
  );
}
