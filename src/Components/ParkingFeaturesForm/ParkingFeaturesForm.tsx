import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./ParkingFeaturesForm.css";
import { BookingProps } from "../../types";
import { useEffect, useState } from "react";
import fetchService from "../../services/fetchService";
import { FeatureWithPriceDTO, MainFeatureDTO } from "parking-sdk";

export function ParkingFeaturesForm({ booking }: BookingProps) {
  const [availableFeatures, setAvailableFeatures] =
    useState<MainFeatureDTO[]>();
    const [selectedFeatures, setSelectedFeatures] =
    useState<string[]>([]);



  useEffect(() => {
    (async function () {
       if(booking.arrivalDate && booking.departureDate && booking.registrationNumber && booking.resource?.resourceId){ 
      const result = await fetchService.getMainFeaturesByBooking(booking);
      console.log('main features: ', result);
      setAvailableFeatures(result);
}
    })();
  }, [booking]);

  function handleCheckBox(e:React.ChangeEvent<HTMLInputElement> ){
    setSelectedFeatures(selected => {
        const index = selected.indexOf(e.target.name);
        index >= 0 ? selected.splice(index,1): selected.push(e.target.name);
        console.log('selectedFeatures: ', selected);
        return selected
    })
  }

  return (
    <>
      {/* Features */}
      <Accordion>
        <AccordionSummary
          className="features-accordion"
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="features"
        >
          <h3>Tjänster</h3>
        </AccordionSummary>
        <AccordionDetails>
          {availableFeatures?.map((mainFeature) => {
            return (
              <div key={mainFeature.mainFeatureId}>
                <h4>{mainFeature.name}</h4>
                {mainFeature.features?.map((feature) => (
                  <FormControlLabel
                    key={feature.featureId}
                    name={feature.name}
                    checked={selectedFeatures?.some(value => value === feature.name) }
                    
                    className="extras-checkbox"
                    control={<Checkbox onChange={handleCheckBox} />}
                    label={`${feature.name} ${feature.price}kr`}
                  />
                ))}
              </div>
            );
          })}
        </AccordionDetails>
      </Accordion>
    </>
  );
}
