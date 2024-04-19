import { BookingDTO, UserDTO } from "parking-sdk";

export type UserContext = {
    currentUser: UserDTO | undefined;
    setCurrentUser: React.Dispatch<React.SetStateAction<UserDTO>>;
  };
  
export type BookingProps = {
  booking: BookingDTO;
  setBooking: React.Dispatch<React.SetStateAction<BookingDTO>>;
};