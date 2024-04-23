import { BookingDTO, OrderDTO } from "parking-sdk";
import { useEffect, useState } from "react";
import "./BookingForm.css";
import { SelectFlightForm } from "../../Components/SelectFlightForm/SelectFlightForm";
import { ParkingDateRangeForm } from "../../Components/ParkingDateRangeForm/ParkingDateRangeForm";
import { ParkingResource } from "../../Components/ParkingResource/ParkingResource";
import { TotalPrice } from "../../types";
import { CarDetailsForm } from "../../Components/CarDetailsForm/CarDetailsForm";
import { ParkingFeaturesForm } from "../../Components/ParkingFeaturesForm/ParkingFeaturesForm";
import { ContactsAndExtraForm } from "../../Components/ContactsAndExtraForm/ContactsAndExtraForm";
import fetchService from "../../services/fetchService";
import { useParams } from "react-router-dom";

export function BookingForm() {
  const [booking, setBooking] = useState<BookingDTO>(defaultBooking);
  const [order, setOrder] = useState<OrderDTO>();
  const [totalPrice, setTotalPrice] = useState<TotalPrice>({
    resourcePrice: 0,
    featurePrices: [],
  });
 const {bookingId} = useParams()
  console.log("booking: ", booking);
  console.log("bookingId: ", bookingId);

  useEffect(() => {
    (async function () {
      if (bookingId && Number(bookingId)) {
      const getOrders = fetchService.getOrdersAdmin(
        undefined,
        1,
        undefined,
        undefined,
        undefined,
        Number(bookingId)
      );
      const getBooking = fetchService.getBooking(Number(bookingId))
      const [orderResponse, bookingResponse] = await Promise.all([getOrders, getBooking])
      if (orderResponse.content && orderResponse.content?.length > 0) {
        const content = orderResponse.content[0];
        console.log('orderContent: ', content);
        
        if ("orderId" in content) setOrder(content);
      }
      if('bookingId' in bookingResponse) setBooking({...bookingResponse, departureDate: new Date(bookingResponse.departureDate!), arrivalDate: new Date(bookingResponse.arrivalDate!)})
      
      }
    })();
  }, []);

  function calcTotalPrice() {
    return (
      totalPrice.resourcePrice +
      totalPrice.featurePrices.reduce(
        (tot: number, feature: number) => tot + feature,
        0
      )
    );
  }

  return (
    <>
      <h2>Ny bokning</h2>
      <form className="booking-form">
        <SelectFlightForm {...{ booking, setBooking }} />
        <ParkingDateRangeForm {...{ booking, setBooking }} />
        <ParkingResource {...{ booking, setBooking, setTotalPrice }} />
        <CarDetailsForm {...{ booking, setBooking }} />
        <ParkingFeaturesForm {...{ booking, setBooking }} />
        <p className="total-price">
          <span>Totalpris: </span>
          {calcTotalPrice()} kr
        </p>
        <ContactsAndExtraForm {...{ booking, setBooking }} />
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
};
