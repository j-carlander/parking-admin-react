import { BookingDTO, UserDTO } from "parking-sdk";

export type UserContext = {
    currentUser: UserDTO | undefined;
    setCurrentUser: React.Dispatch<React.SetStateAction<UserDTO | undefined>>;
  };
  
export type BookingContext = {
  booking: BookingDTO;
  setBooking: React.Dispatch<React.SetStateAction<BookingDTO>>;
};

export type TotalPrice = {
  resourcePrice: number;
  featurePrices: number;
}

export type SelectedFeatures = {
  [key:string]:boolean
}

export type OutletContext = UserContext & BookingContext;