import { BookingDTO, OrderDTO } from "parking-sdk";
import { SelectedFeatures, TotalPrice } from "../types";
import fetchService from "./fetchService";
import { selectFeaturesByOrder } from "./selectFeatureByOrder";

export async function getBookingToEdit(
  bookingId: string,
  setOrder: React.Dispatch<React.SetStateAction<OrderDTO | undefined>>,
  setBooking: React.Dispatch<React.SetStateAction<BookingDTO>>,
  setTotalPrice: React.Dispatch<React.SetStateAction<TotalPrice>>,
  setSelectedFeaturesByName: React.Dispatch<React.SetStateAction<SelectedFeatures>>
) {
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
      selectFeaturesByOrder(content, setSelectedFeaturesByName)
      const resource = content.orderItems?.filter(
        (item) => item.orderItemType === "RESOURCE"
      )[0];
      const resourcePrice = resource?.amount;
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
