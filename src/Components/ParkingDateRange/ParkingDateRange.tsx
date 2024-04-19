import { InputAdornment, TextField } from "@mui/material";
import { BookingProps } from "../../types";
import { useEffect, useState } from "react";
import { formatTimeString } from "../../utils/formatTimeString";

type ParkingTime = {
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
};

export function ParkingDateRange({ booking, setBooking }: BookingProps) {
  const [parkingTime, setParkingTime] = useState<ParkingTime>({
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
  });

  useEffect(() => {
    if (booking.departureDate) {
      setParkingTime((parkingTime) => ({
        ...parkingTime,
        departureDate: new Intl.DateTimeFormat("sv-SE").format(
          booking.departureDate
        ),
        departureTime: new Intl.DateTimeFormat("sv-SE", {
          timeStyle: "short",
        }).format(booking.departureDate),
      }));
    }
    if (booking.arrivalDate) {
      setParkingTime((parkingTime) => ({
        ...parkingTime,
        arrivalDate: new Intl.DateTimeFormat("sv-SE").format(
          booking.arrivalDate
        ),
        arrivalTime: new Intl.DateTimeFormat("sv-SE", {
          timeStyle: "short",
        }).format(booking.arrivalDate),
      }));
    }
  }, [booking]);

  function updateParkingTime(e: React.ChangeEvent<HTMLInputElement>) {
    const field: string = e.currentTarget.name;
    let value: string = e.currentTarget.value;
    const timeExp = /[0-2][0-9]:[0-5][0-9]/gm;

    if (field === "departureTime" || field === "arrivalTime") {
      value = formatTimeString(value);
      setParkingTime((parkingTime) => ({ ...parkingTime, [field]: value }));

      if (timeExp.test(value)) {
        setBooking((booking) => {
          const target =
            field === "departureTime" ? "departureDate" : "arrivalDate";
          const date =
            field === "departureTime"
              ? parkingTime.departureDate
              : parkingTime.arrivalDate;
          const time = new Date(date + "T" + value);
          return { ...booking, [target]: time };
        });
      }
    } else {
      setBooking((booking) => {
        const time =
          field === "departureDate"
            ? parkingTime.departureTime
            : parkingTime.arrivalTime;
        const date = new Date(value + "T" + time);
        return { ...booking, [field]: date };
      });
    }
  }

  return (
    <>
    <br />
      <section className="form-field-wrapper">
        <TextField
          variant="filled"
          label="Startdatum"
          type="date"
          name="departureDate"
          value={parkingTime.departureDate}
          onChange={updateParkingTime}
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
          value={parkingTime.arrivalDate}
          onChange={updateParkingTime}
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
          name="departureTime"
          value={parkingTime.departureTime}
          onChange={updateParkingTime}
          placeholder="tt:mm"
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
          name="arrivalTime"
          value={parkingTime.arrivalTime}
          onChange={updateParkingTime}
          placeholder="tt:mm"
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
    </>
  );
}
