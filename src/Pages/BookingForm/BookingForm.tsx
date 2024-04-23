import { BookingDTO } from "parking-sdk";
import { useState } from "react";
import "./BookingForm.css";
import { SelectFlightForm } from "../../Components/SelectFlightForm/SelectFlightForm";
import { ParkingDateRangeForm } from "../../Components/ParkingDateRangeForm/ParkingDateRangeForm";
import { ParkingResource } from "../../Components/ParkingResource/ParkingResource";
import { TotalPrice } from "../../types";
import { CarDetailsForm } from "../../Components/CarDetailsForm/CarDetailsForm";
import { ParkingFeaturesForm } from "../../Components/ParkingFeaturesForm/ParkingFeaturesForm";
import { ContactsAndExtraForm } from "../../Components/ContactsAndExtraForm/ContactsAndExtraForm";

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
        <ParkingDateRangeForm {...{ booking, setBooking }} />
        <ParkingResource {...{ booking, setBooking, setTotalPrice }} />
        <CarDetailsForm {...{booking, setBooking}} /> 
        <ParkingFeaturesForm {...{booking, setBooking}} />
        <p className="total-price">
          <span>Totalpris: </span>
          {calcTotalPrice()} kr
        </p>
        <ContactsAndExtraForm {...{booking, setBooking}} />
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
  handLuggageOnly: false,
  bookingStatus: undefined,
  comment: undefined,
  qr: undefined,
  qrImage: undefined,
  createdBy: undefined,
  createdDate: undefined,
  updatedBy: undefined,
  updatedDate: undefined,
  prepaidTicket: undefined,
  childSafetySeat: false,
  vehicleType: undefined,
  engineType: undefined,
}
