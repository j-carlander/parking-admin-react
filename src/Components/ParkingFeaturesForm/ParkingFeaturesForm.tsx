import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./ParkingFeaturesForm.css";
import { SelectedFeatures } from "../../types";

import { MainFeatureDTO } from "parking-sdk";

type ParkingFeaturesProps = {
  availableFeatures: MainFeatureDTO[]
  selectedFeatures: SelectedFeatures; 
  setSelectedFeatures: React.Dispatch<React.SetStateAction<SelectedFeatures>>;
};

export function ParkingFeaturesForm({ selectedFeatures, setSelectedFeatures, availableFeatures }: ParkingFeaturesProps) {


  function handleCheckBox(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedFeatures((selected) => {
      const updated = {...selected, [e.target.name]: !selected[e.target.name]}
      console.log("selectedFeatures: ", updated);
      return updated;
    });
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
          {availableFeatures.length > 0 ? availableFeatures?.map((mainFeature) => {
            return (
              <div key={mainFeature.mainFeatureId}>
                <h4>{mainFeature.name}</h4>
                {mainFeature.features?.map((feature) => {
                 return feature.name ? (
                  <FormControlLabel
                    key={feature.featureId}
                    name={feature.name}
                    checked={selectedFeatures[feature.name] || false}
                    className="extras-checkbox"
                    control={<Checkbox onChange={handleCheckBox} />}
                    label={`${feature.name} ${feature.price}kr`}
                  />
                ) : null})}
              </div>
            );
          }) : null}
        </AccordionDetails>
      </Accordion>
    </>
  );
}