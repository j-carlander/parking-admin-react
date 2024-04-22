import {
  FlightDTO,
  LoginRequest,
  OrderItemDTO,
  ResourceDTO,
  ResourceStatusDTO,
  UserDTO,
} from "parking-sdk";
import { calcOffset } from "../utils/calcOffset";
import { resolvePath } from "react-router-dom";

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

async function getBooking(bookingId: number) {
  if (!bookingId) return;
  const response = await fetchHelper(`/admin/bookings/${bookingId}`, "GET");
  const bookingJson = await response.json();

  console.log("booking: ", bookingJson);
}

/** New booking and order */

async function postNewOrderObject() {
  const response = await fetchHelper("/admin/orders", "POST");
  return await response.json();
}

async function postNewOrderItem(orderId: number, item: OrderItemDTO) {
  if (!orderId && !item) return;
  const response = await fetchHelper(
    `/admin/orders/${orderId}/orderItems`,
    "POST",
    item
  );
  console.log("add Order item: ", await response.json());
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

/** Get features */

async function getMainFeatures() {
  const response = await fetchHelper("/public/mainfeatures", "GET");
  return await response.json();
}

/** Get flights by day and direction(type) */

async function getFlights(
  flightDate: string,
  flightType: string
): Promise<FlightDTO[]> {
  const queryParams = new URLSearchParams({
    flightDate,
    flightType: flightType.toUpperCase(),
  });
  console.log("query: ", queryParams.toString());

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
) {
  if (!regNum || !resourceId)
    throw new Error("Missing parameter registration number and/or resource ID");

  const params = `?registrationNumber=${regNum}&resourceId=${resourceId}${
    departureDate ? "&" + departureDate.toISOString() : ""
  }${arrivalDate ? "&" + arrivalDate.toISOString() : ""}`;

  const response = await fetchHelper(
    `/admin/prepaidtickets/booking${params}`,
    "GET"
  );
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
  postNewOrderObject,
  postNewOrderItem,
  postUpdateOrderItem,
  getFlights,
  getMainFeatures,
  getResources,
  getAvailableResourcesByDates,
  findPrepaidTicketsByBookingAdmin,
};
export default fetchService;
