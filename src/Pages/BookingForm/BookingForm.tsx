import {
  BookingDTO,
  FeatureWithPriceDTO,
  MainFeatureDTO,
  OrderDTO,
} from "parking-sdk";
import { FormEvent, useEffect, useState } from "react";
import "./BookingForm.css";
import { SelectFlightForm } from "../../Components/SelectFlightForm/SelectFlightForm";
import { ParkingDateRangeForm } from "../../Components/ParkingDateRangeForm/ParkingDateRangeForm";
import { ParkingResource } from "../../Components/ParkingResource/ParkingResource";
import { OutletContext, SelectedFeatures, TotalPrice } from "../../types";
import { CarDetailsForm } from "../../Components/CarDetailsForm/CarDetailsForm";
import { ParkingFeaturesForm } from "../../Components/ParkingFeaturesForm/ParkingFeaturesForm";
import { ContactsAndExtraForm } from "../../Components/ContactsAndExtraForm/ContactsAndExtraForm";
import fetchService from "../../services/fetchService";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { filterFeatures } from "../../services/filterFeatures";
import { selectFeaturesByOrder } from "../../services/selectFeatureByOrder";
import { getBookingToEdit } from "../../services/getBookingToEdit";
import { checkRequiredFields } from "../../services/checkRequiredFields";
// import { useFilterFeatures } from "../../Hooks/useFilterFeatures";

export function BookingForm() {
  // const [booking, setBooking] = useState<BookingDTO>(defaultBooking);
  const [order, setOrder] = useState<OrderDTO>();
  const [selectedFeaturesByName, setSelectedFeaturesByName] =
    useState<SelectedFeatures>({});
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
  const {currentUser, booking, setBooking} = useOutletContext<OutletContext>();

  const navigate = useNavigate();
  // Get order and booking for editing
  useEffect(() => {
    if (bookingId && Number(bookingId)) {
      getBookingToEdit(bookingId, setOrder, setBooking, setTotalPrice, setSelectedFeaturesByName);
    } else {
      setBooking(defaultBooking);
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

  // useEffect(() => {
  //   selectFeaturesByOrder(order, setSelectedFeaturesByName);
  // }, [order]);

  // Get available features once when dates have been selected
  useEffect(() => {
    if (booking.arrivalDate && availableFeatures?.length <= 0) {
      (async function () {
        const result = await fetchService.getMainFeaturesByBooking(booking);
        setAvailableFeatures(result);
      })();
    }
  }, [booking]);

  async function placeOrder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Place Order");
    if (checkRequiredFields(booking)) {
      let newOrder = await fetchService.createNewOrderObject();
      if (newOrder.orderId) {
        newOrder = await fetchService.postNewOrderItem(newOrder.orderId, {
          orderItemType: "RESOURCE",
          booking,
        });
        console.log("new order booking: ", newOrder);

        if (filteredFeatures.length > 0) {
          filteredFeatures.forEach(async (feature) => {
            await fetchService.postNewOrderItem(newOrder.orderId!, {
              orderItemType: "FEATURE",
              feature,
            });
          });
        }

        if (
          newOrder.orderItems?.some((item) => item.orderItemType === "RESOURCE")
        ) {
          navigate("/checka-ut", { state: { orderId: newOrder.orderId } });
        }
      }
    }
  }

  // if (!currentUser) {
  //   return <Navigate to={"/logga-in"} />;
  // }
  return (
    <>
      <form className="booking-form" onSubmit={placeOrder}>
      <h2>Ny bokning</h2>
        <SelectFlightForm />
        <ParkingDateRangeForm />
        <ParkingResource {...{ setTotalPrice }} />
        <CarDetailsForm />
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
          {(!booking.prepaidTicket ? totalPrice.resourcePrice : 0) +
            totalPrice.featurePrices}{" "}
          kr
        </p>
        <ContactsAndExtraForm />
        <button className="general-button">Nästa</button>
      </form>
    </>
  );
}

/** Deafult object for a booking with all keys */
export const defaultBooking: BookingDTO = {
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
