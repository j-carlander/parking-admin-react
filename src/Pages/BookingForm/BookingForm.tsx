import { BookingDTO, MainFeatureDTO, OrderDTO } from "parking-sdk";
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
import { useFilterFeatures } from "../../Hooks/useFilterFeatures";

export function BookingForm() {
  const [booking, setBooking] = useState<BookingDTO>(defaultBooking);
  const [order, setOrder] = useState<OrderDTO>();
  const [selectedFeatures, setSelectedFeatures] = useState<SelectedFeatures>(
    {}
  );
  const [availableFeatures, setAvailableFeatures] = useState<MainFeatureDTO[]>(
    []
  );
  const [totalPrice, setTotalPrice] = useState<TotalPrice>({
    resourcePrice: 0,
    featurePrices: 0,
  });
  const { bookingId } = useParams();

  const [filteredFeatures] = useFilterFeatures(
    availableFeatures,
    selectedFeatures,
    setSelectedFeatures,
    setTotalPrice,
    order
  );
  console.log("filteredFeatures: ", filteredFeatures);

  const { currentUser } = useUserContext();

  // Get order and booking for editing
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
        const getBooking = fetchService.getBooking(Number(bookingId));
        const [orderResponse, bookingResponse] = await Promise.all([
          getOrders,
          getBooking,
        ]);
        if (orderResponse.content && orderResponse.content?.length > 0) {
          const content = orderResponse.content[0];
          console.log("order content: ", content);

          if ("orderId" in content) {
            setOrder(content);

            const resource = content.orderItems?.filter((item) => item.orderItemType === "RESOURCE")[0];
            const resourcePrice = resource?.amount
            if (resourcePrice)
              setTotalPrice((total: TotalPrice) => ({
                ...total,
                resourcePrice,
              }));
          }
        }
        if ("bookingId" in bookingResponse)
          setBooking({
            ...bookingResponse,
            departureDate: new Date(bookingResponse.departureDate!),
            arrivalDate: new Date(bookingResponse.arrivalDate!),
          });
      }
    })();
  }, []);

  // Get available features once when dates have been selected
  useEffect(() => {
    if (booking.arrivalDate && availableFeatures?.length <= 0) {
      (async function () {
        const result = await fetchService.getMainFeaturesByBooking(booking);
        console.log(
          "main features: ",
          result.flatMap((main): any[] =>
            main.features ? main.features?.map((feature) => feature) : []
          )
        );
        setAvailableFeatures(result);
      })();
    }
  }, [booking]);

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
            selectedFeatures,
            setSelectedFeatures,
            availableFeatures,
            order,
          }}
        />
        <p className="total-price">
          <span>Totalpris: </span>
          {totalPrice.resourcePrice + totalPrice.featurePrices} kr
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
