import {
  Checkbox,
  FormControlLabel,
  InputAdornment,
  TextField,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { BookingProps } from "../../types";

export function ContactsAndExtraForm({ booking, setBooking }: BookingProps) {

  function updateBooking(e: React.ChangeEvent<HTMLInputElement>) {
    setBooking((booking) => ({ ...booking, [e.target.name]: e.target.value }));
  }
  return (
    <>
      <h3>Övriga uppgifter</h3>
      <TextField
        className="full-width-field"
        variant="filled"
        label="För- & Efternamn"
        type="text"
        name="name"
        value={booking.name || ""}
        onChange={updateBooking}
        placeholder=""
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <PersonIcon />
            </InputAdornment>
          ),
        }}
        required
      />
      <section className="form-field-wrapper">
        <TextField
          variant="filled"
          label="Telefonnummer"
          type="text"
          name="phone"
          value={booking.phone || ""}
          onChange={updateBooking}
          placeholder=""
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <span className="material-symbols-outlined">call</span>
              </InputAdornment>
            ),
          }}
          required
        />
        <TextField
          variant="filled"
          label="E-post"
          type="text"
          name="email"
          value={booking.email || ""}
          onChange={updateBooking}
          placeholder=""
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <span className="material-symbols-outlined">mail</span>
              </InputAdornment>
            ),
          }}
          required
        />
      </section>
      <FormControlLabel
        className="extras-checkbox"
        checked={!booking.handLuggageOnly}
        control={
          <Checkbox
            name="handLuggageOnly"
            onChange={(e) =>
              setBooking((booking) => ({
                ...booking,
                handLuggageOnly: !e.target.checked,
              }))
            }
          />
        }
        label="Incheckat bagage"
      />
      <FormControlLabel
        className="extras-checkbox"
        control={
          <Checkbox
            name="childSafetySeat"
            checked={booking.childSafetySeat}
            onChange={(e) =>
              setBooking((booking) => ({
                ...booking,
                childSafetySeat: e.target.checked,
              }))
            }
          />
        }
        label="Bilbarnstol"
      />
      <TextField
        className="full-width-field"
        variant="filled"
        label="Kommentar"
        multiline
        rows={2}
        name="comment"
        value={booking.comment || ""}
        onChange={updateBooking}
        placeholder=""

      />
    </>
  );
}
