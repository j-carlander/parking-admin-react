import { InputAdornment, MenuItem, TextField } from "@mui/material";
import { BookingProps } from "../../types";
import { useEffect, useState } from "react";
import fetchService from "../../services/fetchService";
import { PrepaidTicketDTO, PrepaidTicketWithBookingDTO } from "parking-sdk";

export function CarDetailsForm({ booking, setBooking }: BookingProps) {
  const [prepaids, setPrepaids] = useState<PrepaidTicketDTO[]>([]);
  const [selectedPrepaid, setSelectedPrepaid] = useState<PrepaidTicketDTO>();

  useEffect(() => {
    (async function () {
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

        if (result.length >= 0) {

          const prepaidTickets: PrepaidTicketDTO[] = result.reduce((res: PrepaidTicketDTO[], ticket: PrepaidTicketWithBookingDTO) => {
            const prepaid = { ...ticket };
            delete prepaid.bookings;

            if(ticket.bookings?.some(item => item.registrationNumber == booking.registrationNumber)) {
              //If current booking is edited and already uses a prepaid, select it
              updatePrepaid(prepaid)
              res.push(prepaid)
            } else if(ticket.bookings && ticket.maxPark && ticket.bookings.length <= ticket.maxPark){
              //If prepaid has room for a booking add it to the list of selectable prepaids
              res.push(prepaid)
            } 
            return res;

            
          }, []);
          setPrepaids(prepaidTickets);
          if(!selectedPrepaid) updatePrepaid(prepaids[0])
        }
      }
    })();
  }, [booking]);

  function updateBooking(e: React.ChangeEvent<HTMLInputElement>) {
    setBooking((booking) => ({ ...booking, [e.target.name]: e.target.value }));
  }

  function updatePrepaid(prepaidTicket: PrepaidTicketDTO | string){
    let prepaid: PrepaidTicketDTO;

    if(typeof prepaidTicket === 'string'){
      if(prepaidTicket === 'notInUse'){
        setSelectedPrepaid({name: undefined})
        setBooking((booking) => ({ ...booking, prepaidTicket: undefined }));
        return
      } 
      prepaid = prepaids.filter(ticket => ticket.name === prepaidTicket)[0]
    } else {
      prepaid = prepaidTicket
    }
    setSelectedPrepaid(prepaid)
    setBooking((booking) => ({ ...booking, prepaidTicket: prepaid }));
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
        // value="notInUse"
        value={selectedPrepaid?.name || "notInUse"}
        onChange={(e) => updatePrepaid(e.target.value)}
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
