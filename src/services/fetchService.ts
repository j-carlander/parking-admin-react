import {
  BookingDTO,
  EngineTypeDTO,
  FlightDTO,
  LoginRequest,
  MainFeatureDTO,
  OrderDTO,
  OrderItemDTO,
  PageOrderDTO,
  PrepaidTicketWithBookingDTO,
  ResourceDTO,
  ResourceStatusDTO,
  UserDTO,
  VehicleTypeDTO,
} from "parking-sdk";
import { calcOffset } from "../utils/calcOffset";

type Options = {
  method: string;
  headers: {
    "Content-Type": string;
    authorization?: string;
  };
  body?: any;
};

function fetchHelper(url: string, method: string, body?: any) {
  const options: Options = {
    method: method.toUpperCase(),
    headers: { "Content-Type": "application/json" },
  };

  if (method.toUpperCase() !== "GET") {
    options.body = JSON.stringify(body);
  }

  const token = localStorage.getItem("TOKEN");

  if (token !== null) {
    options.headers.authorization = `Bearer ${token}`;
  }

  return fetch(import.meta.env.VITE_API_URL + url, options);
}

/**
 * Functions to be exported below,
 * remember to add to fetchService object at end of file
 * */

/** Authentication */
async function signIn(
  credentials: LoginRequest,
  setUser: (value: UserDTO | undefined) => void
) {
  const response = await fetchHelper(
    "/public/auth/signin",
    "POST",
    credentials
  );
  const json = await response.json();
  console.log("json response: ", json);
  localStorage.setItem("TOKEN", json.jwt);
  setUser(await fetchService.getCurrentUser());
}

function isAuthenticated() {
  return !!localStorage.getItem("TOKEN");
}

function signOut(setUser: (value: UserDTO | undefined) => void) {
  localStorage.removeItem("TOKEN");
  setUser(undefined);
}

async function getCurrentUser() {
  const response = await fetchHelper("/admin/users/me", "GET");
  if (response.status !== 200) localStorage.removeItem("TOKEN");
  const json = await response.json();
  return response.status === 200 ? json : undefined;
}

/** Get bookings */

async function getCurrentTimeOffset() {
  const fetchFrom = fetchHelper(
    "/admin/settings/CURRENT_BOOKING_FROM_MINUTES",
    "GET"
  );
  const fetchTo = fetchHelper(
    "/admin/settings/CURRENT_BOOKING_TO_MINUTES",
    "GET"
  );

  const [fromOffset, toOffset] = await Promise.all([fetchFrom, fetchTo]).then(
    async ([fromResp, toResp]) => {
      const fromJson = await fromResp.json();
      const toJson = await toResp.json();
      return [fromJson.value, toJson.value];
    }
  );

  return fromOffset && toOffset ? calcOffset(fromOffset, toOffset) : undefined;
}

async function getCurrentBookings() {
  const fetchArrivals = await fetchHelper(
    "/admin/flights/current?flightType=ARRIVAL",
    "GET"
  );
  const fetchDepartures = await fetchHelper(
    "/admin/flights/current/departures",
    "GET"
  );

  return await Promise.all([fetchArrivals, fetchDepartures]).then(
    async ([arrivalResp, departureResp]) => {
      const arrivalJson = await arrivalResp.json();
      const departureJson = await departureResp.json();
      return [arrivalJson, departureJson];
    }
  );
}

async function getBooking(bookingId: number): Promise<BookingDTO> {
  const response = await fetchHelper(`/admin/bookings/${bookingId}`, "GET");
  const bookingJson = await response.json();

  return bookingJson;
}

/** New booking and order */

async function createNewOrderObject(): Promise<OrderDTO> {
  const response = await fetchHelper("/admin/orders", "POST");
  return await response.json();
}

async function postNewOrderItem(
  orderId: number,
  item: OrderItemDTO
): Promise<OrderDTO> {
  if (!orderId && !item) throw new Error("Missing order id or order item");
  const response = await fetchHelper(
    `/admin/orders/${orderId}/orderItems`,
    "POST",
    item
  );
  const json = await response.json();
  console.log("add Order item: ", json);
  return json;
}

async function checkoutOrderNoPay(orderId: number): Promise<OrderDTO> {
  const response = await fetchHelper(
    `/admin/orders/${orderId}/checkoutnopay`,
    "POST"
  );
  return await response.json();
}
async function postUpdateOrderItem(
  orderId: number,
  orderItemId: number,
  item: OrderItemDTO
) {
  if (!orderId && !orderItemId) return;
  const response = await fetchHelper(
    `/admin/orders/${orderId}/orderItems/${orderItemId}`,
    "POST",
    item
  );
  console.log("update Order item: ", await response.json());
}

async function getOrdersAdmin(
  page?: number,
  size?: number,
  sort?: string,
  orderId?: number,
  orderItemId?: number,
  bookingId?: number,
  featureId?: number,
  createdFromDate?: Date,
  createdToDate?: Date,
  searchTerm?: string,
  paymentMethodId?: string,
  paymentStatusId?: string
): Promise<PageOrderDTO> {
  let queryParameters = new URLSearchParams();
  if (page !== undefined) {
    queryParameters.append("page", <any>page);
  }
  if (size !== undefined) {
    queryParameters.append("size", <any>size);
  }
  if (sort !== undefined) {
    queryParameters.append("sort", <any>sort);
  }
  if (orderId !== undefined) {
    queryParameters.append("orderId", <any>orderId);
  }
  if (orderItemId !== undefined) {
    queryParameters.append("orderItemId", <any>orderItemId);
  }
  if (bookingId !== undefined) {
    queryParameters.append("bookingId", <any>bookingId);
  }
  if (featureId !== undefined) {
    queryParameters.append("featureId", <any>featureId);
  }
  if (createdFromDate !== undefined) {
    queryParameters.append(
      "createdFromDate",
      <any>createdFromDate.toISOString()
    );
  }
  if (createdToDate !== undefined) {
    queryParameters.append("createdToDate", <any>createdToDate.toISOString());
  }
  if (searchTerm !== undefined) {
    queryParameters.append("searchTerm", <any>searchTerm);
  }
  if (paymentMethodId !== undefined) {
    queryParameters.append("paymentMethodId", <any>paymentMethodId);
  }
  if (paymentStatusId !== undefined) {
    queryParameters.append("paymentStatusId", <any>paymentStatusId);
  }

  console.log("queryParams: ", queryParameters.toString());
  const response = await fetchHelper(
    `/admin/orders?${queryParameters.toString()}`,
    "GET"
  );
  return await response.json();
}

/** Get flights by day and direction(type) */

async function getFlights(
  flightDate: string | undefined,
  flightType: string
): Promise<FlightDTO[]> {
  if (!flightDate) return [];

  const queryParams = new URLSearchParams({
    flightDate,
    flightType: flightType.toUpperCase(),
  });

  const response = await fetchHelper(
    `/admin/flights?${queryParams.toString()}`,
    "GET"
  );
  const json = await response.json();
  return json;
}

async function getResources(): Promise<ResourceDTO[]> {
  const response = await fetchHelper("/public/resources", "GET");
  if (response.status === 200) return await response.json();
  return [];
}

async function getAvailableResourcesByDates(
  fromDate: Date,
  toDate: Date
): Promise<ResourceStatusDTO[]> {
  if (!fromDate || !toDate)
    throw new Error("Missing parameter registration number and/or resource ID");

  const params = `?fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}`;
  const response = await fetchHelper(
    `/public/resources/available${params}`,
    "GET"
  );

  return await response.json();
}

async function findPrepaidTicketsByBookingAdmin(
  regNum: string,
  resourceId: number,
  departureDate?: Date,
  arrivalDate?: Date
): Promise<PrepaidTicketWithBookingDTO[]> {
  if (!regNum || !resourceId)
    throw new Error("Missing parameter registration number and/or resource ID");

  const params = `?registrationNumber=${regNum}&resourceId=${resourceId}${
    departureDate ? "&departureDate=" + departureDate.toISOString() : ""
  }${arrivalDate ? "&arrivalDate=" + arrivalDate.toISOString() : ""}`;

  const response = await fetchHelper(
    `/admin/prepaidtickets/booking${params}`,
    "GET"
  );
  return await response.json();
}

/** Get features */

async function getMainFeatures() {
  const response = await fetchHelper("/public/mainfeatures", "GET");
  return await response.json();
}

async function getMainFeaturesByBooking(
  body?: BookingDTO
): Promise<MainFeatureDTO[]> {
  const response = await fetchHelper("/public/mainfeatures", "POST", body);
  return await response.json();
}

async function getVehicleTypes(): Promise<VehicleTypeDTO[]> {
  const response = await fetchHelper("/public/cars/vehicletypes", "GET");
  return await response.json();
}

async function getEngineTypes(): Promise<EngineTypeDTO[]> {
  const response = await fetchHelper('/public/cars/enginetypes', 'GET');
  return await response.json();
}

/** Exported object */
const fetchService = {
  signIn,
  isAuthenticated,
  signOut,
  getCurrentUser,
  getCurrentTimeOffset,
  getCurrentBookings,
  getBooking,
  createNewOrderObject,
  postNewOrderItem,
  postUpdateOrderItem,
  getFlights,
  getMainFeatures,
  getResources,
  getAvailableResourcesByDates,
  findPrepaidTicketsByBookingAdmin,
  getMainFeaturesByBooking,
  getOrdersAdmin,
  checkoutOrderNoPay,
  getVehicleTypes,
  getEngineTypes
};
export default fetchService;
