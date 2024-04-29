import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { EngineTypeDTO } from "parking-sdk";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../../types";
import fetchService from "../../services/fetchService";
import './EngingeTypeRadios.css';

export function EngineTypeRadios() {
  const [selectedEngineType, setSelectedEngineType] = useState<string>("");
  const [engineTypes, setEngineTypes] = useState<EngineTypeDTO[]>([]);

  const { booking, setBooking } = useOutletContext<OutletContext>();

  useEffect(() => {
    (async function () {
      const response =
        engineTypes.length <= 0
          ? await fetchService.getEngineTypes()
          : engineTypes;

      setEngineTypes(response);
      booking.engineType?.label ? setSelectedEngineType(booking.engineType.label) : setSelectedEngineType(response[0].label || '')
    })();
  }, [booking]);

  function selectEngine(e: React.ChangeEvent<HTMLInputElement>) {
    const engineTypeLabel = e.target.value;
    const engineType = engineTypes.filter(
      (engine) => engine.label === engineTypeLabel
    )[0];

    setBooking((booking) => ({ ...booking, engineType }));

  }

  return (
    <div className="engine-radio-wrapper">
        <h5>Motor: </h5>
      <RadioGroup
      className="engine-radio-group"
        name="Engine"
        value={selectedEngineType}
        onChange={selectEngine}
      >
        {engineTypes.map((engine) => (
          <FormControlLabel
          key={engine.label} 
            value={engine.label}
            control={<Radio />}
            label={engine.label}
          />
        ))}
      </RadioGroup>
    </div>
  );
}
