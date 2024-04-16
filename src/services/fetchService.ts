import { LoginRequest, OrderItemDTO, UserDTO } from "parking-sdk";
import { offsetCalc } from "../utils/offsetCalc";

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
async function signIn(credentials: LoginRequest, setUser: (value: UserDTO | undefined) => void){
  const response = await fetchHelper(
    "/public/auth/signin",
    "POST",
    credentials
  );
  const json = await response.json();
  console.log('json response: ', json);
  localStorage.setItem('TOKEN', json.jwt);
  setUser(await fetchService.getCurrentUser())
}

function isAuthenticated(){

    return !!localStorage.getItem('TOKEN');
}

function signOut(setUser: (value: UserDTO | undefined) => void){
    localStorage.removeItem('TOKEN');
    setUser(undefined);
}

async function getCurrentUser(){
    const response = await fetchHelper('/admin/users/me', 'GET');
    if(response.status !== 200) localStorage.removeItem('TOKEN');
    const json = await response.json();
    console.log('json response: ', json);
    return response.status === 200 ? json : undefined;
}

/** Get bookings */

async function getCurrentTimeOffset() {
  const fetchFrom = fetchHelper('/admin/settings/CURRENT_BOOKING_FROM_MINUTES', 'GET');
  const fetchTo = fetchHelper('/admin/settings/CURRENT_BOOKING_TO_MINUTES', 'GET');

  const [fromOffset, toOffset] = await Promise.all([fetchFrom, fetchTo]).then(async ([fromResp ,toResp]) => {
    const fromJson = await fromResp.json();
    const toJson = await toResp.json();
    return [fromJson.value, toJson.value]
  });

  return fromOffset && toOffset ? offsetCalc(fromOffset, toOffset) : undefined;

}

async function getCurrentBookings(){
  const fetchArrivals = await fetchHelper('/admin/flights/current?flightType=ARRIVAL', 'GET') 
  const fetchDepartures = await fetchHelper('/admin/flights/current/departures', 'GET');

  return await Promise.all([fetchArrivals, fetchDepartures]).then(async ([arrivalResp ,departureResp]) => {
    const arrivalJson = await arrivalResp.json();
    const departureJson = await departureResp.json();
    return [arrivalJson, departureJson]
  });
}

async function getBooking(bookingId:number) {
  if(!bookingId) return;
  const response = await fetchHelper(`/admin/bookings/${bookingId}`, 'GET');
  const bookingJson = await response.json();

  console.log('booking: ', bookingJson);
  
}

/** New booking and order */

async function postNewOrderObject(){
  const response = await fetchHelper('/admin/orders', 'POST')
  return await response.json();
 } 

async function postNewOrderItem(orderId:number, item: OrderItemDTO) {
  if(!orderId && !item) return;
  const response = await fetchHelper(`/admin/orders/${orderId}/orderItems`, 'POST', item);
  console.log('add Order item: ', await response.json());
   
}

async function postUpdateOrderItem(orderId:number, orderItemId: number, item: OrderItemDTO) {
  if(!orderId && !orderItemId) return;
  const response = await fetchHelper(`/admin/orders/${orderId}/orderItems/${orderItemId}`, 'POST', item)
  console.log('update Order item: ', await response.json());
}

/** Get features */

async function getMainFeatures() {
  const response = await fetchHelper('/public/mainfeatures', 'GET')
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
  postUpdateOrderItem
};
export default fetchService;
