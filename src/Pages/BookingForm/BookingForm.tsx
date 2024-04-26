import {
  BookingDTO,
  FeatureWithPriceDTO,
  MainFeatureDTO,
  OrderDTO,
} from "parking-sdk";
import { useEffect, useState } from "react";
import "./BookingForm.css";
import { SelectFlightForm } from "../../Components/SelectFlightForm/SelectFlightForm";
import { ParkingDateRangeForm } from "../../Components/ParkingDateRangeForm/ParkingDateRangeForm";
import { ParkingResource } from "../../Components/ParkingResource/ParkingResource";
import { SelectedFeatures, TotalPrice } from "../../types";
import { CarDetailsForm } from "../../Components/CarDetailsForm/CarDetailsForm";
import { ParkingFeaturesForm } from "../../Components/ParkingFeaturesForm/ParkingFeaturesForm";
import { ContactsAndExtraForm } from "../../Components/ContactsAndExtraForm/ContactsAndExtraForm";
import fetchService from "../../services/fetchService";
import { Navigate, useParams } from "react-router-dom";
import { useUserContext } from "../../App";
import { filterFeatures } from "../../services/filterFeatures";
import { selectFeaturesByOrder } from "../../services/selectFeatureByOrder";
import { getBookingToEdit } from "../../services/getBookingToEdit";
// import { useFilterFeatures } from "../../Hooks/useFilterFeatures";

export function BookingForm() {
  const [booking, setBooking] = useState<BookingDTO>(defaultBooking);
  const [order, setOrder] = useState<OrderDTO>();
  const [selectedFeaturesByName, setSelectedFeaturesByName] = useState<SelectedFeatures>(
    {}
  );
  const [availableFeatures, setAvailableFeatures] = useState<MainFeatureDTO[]>(
    []
  );
  const [totalPrice, setTotalPrice] = useState<TotalPrice>({
    resourcePrice: 0,
    featurePrices: 0,
  });
  const [filteredFeatures, setFilteredFeatures] = useState<
    FeatureWithPriceDTO[]
  >([]);
  const { bookingId } = useParams();
  const { currentUser } = useUserContext();


  // Get order and booking for editing
  useEffect(() => {
    if (bookingId && Number(bookingId)) {
      getBookingToEdit(bookingId, setOrder, setBooking, setTotalPrice);
    } else {
      setBooking(defaultBooking)
    }
  }, []);

  useEffect(() => {
    filterFeatures(
      availableFeatures,
      selectedFeaturesByName,
      setFilteredFeatures,
      setTotalPrice
    );
  }, [selectedFeaturesByName, availableFeatures]);

  useEffect(() => {
    selectFeaturesByOrder(order, setSelectedFeaturesByName);
  }, [order]);


  // Get available features once when dates have been selected
  useEffect(() => {
    if (booking.arrivalDate && availableFeatures?.length <= 0) {
      (async function () {
        const result = await fetchService.getMainFeaturesByBooking(booking);
        setAvailableFeatures(result);
      })();
    }
  }, [booking]);


  function placeOrder(){
    console.log('Place Order');
    
  }

  // if (!currentUser) {
  //   return <Navigate to={"/logga-in"} />;
  // }
  return (
    <>
      <h2>Ny bokning</h2>
      <form className="booking-form">
        <SelectFlightForm {...{ booking, setBooking }} />
        <ParkingDateRangeForm {...{ booking, setBooking }} />
        <ParkingResource {...{ booking, setBooking, setTotalPrice }} />
        <CarDetailsForm {...{ booking, setBooking }} />
        <ParkingFeaturesForm
          {...{
            selectedFeaturesByName,
            setSelectedFeaturesByName,
            availableFeatures,
            order,
          }}
        />
        <p className="total-price">
          <span>Totalpris: </span>
          {(!booking.prepaidTicket ? totalPrice.resourcePrice : 0) + totalPrice.featurePrices} kr
        </p>
        <ContactsAndExtraForm {...{ booking, setBooking }} />
        <button className="submit-booking" onClick={placeOrder}>Nästa</button>
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
