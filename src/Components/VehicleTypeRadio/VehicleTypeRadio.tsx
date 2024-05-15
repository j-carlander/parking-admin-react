import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { VehicleTypeDTO } from "parking-sdk";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../../types";
import fetchService from "../../services/fetchService";
import './VehicleTypeRadio.css';

export function VehicleTypeRadios() {
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>("");
  const [vehicleTypes, setVehicleTypes] = useState<VehicleTypeDTO[]>([]);

  const { booking, setBooking } = useOutletContext<OutletContext>();

    console.log('booking: ', booking);
    

  useEffect(() => {
    (async function () {
      const response =
        vehicleTypes.length <= 0
          ? await fetchService.getVehicleTypes()
          : vehicleTypes;

      setVehicleTypes(response);
      booking.vehicleType?.label ? setSelectedVehicleType(booking.vehicleType.label) : setSelectedVehicleType(response[0].label || '')
    })();

  }, [booking]);

  function selectVehicle(e: React.ChangeEvent<HTMLInputElement>) {
    const vehicleTypeLabel = e.target.value;
    const vehicleType = vehicleTypes.filter(
      (vehicle) => vehicle.label === vehicleTypeLabel
    )[0];

    setBooking((booking) => ({ ...booking, vehicleType }));

  }

  return (
    <div className="vehicle-radio-wrapper">
        <h5>Storlek: </h5>
      <RadioGroup
      className="vehicle-radio-group"
        name="Vehicle"
        value={selectedVehicleType}
        onChange={selectVehicle}
      >
        {vehicleTypes.map((vehicle) => (
          <FormControlLabel
          key={vehicle.label} 
            value={vehicle.label}
            control={<Radio />}
            label={vehicle.label}
          />
        ))}
      </RadioGroup>
    </div>
  );
}
