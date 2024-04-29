import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { OutletContext, TotalPrice } from "../../types";
import { useEffect, useState } from "react";
import { ResourceDTO, ResourceStatusDTO } from "parking-sdk";
import fetchService from "../../services/fetchService";
import "./ParkingResource.css";
import { useOutletContext } from "react-router-dom";

type ParkingResourceProps = {
  setTotalPrice: React.Dispatch<React.SetStateAction<TotalPrice>>;
};

export function ParkingResource({ setTotalPrice }: ParkingResourceProps) {
  const [selectedResource, setSelectedResource] = useState<string>("");
  const [resources, setResources] = useState<ResourceDTO[]>([]);
  const [availableResources, setAvailableResources] = useState<
    ResourceStatusDTO[]
  >([]);

  const { booking, setBooking } = useOutletContext<OutletContext>();

  useEffect(() => {
    (async function () {
      if (resources.length <= 0) {
        const response =
          resources.length <= 0 ? await fetchService.getResources() : resources;
        setResources(response);
      }
      if (availableResources.length <= 0) {
        const resourceStatus =
          booking.departureDate && booking.arrivalDate
            ? await fetchService.getAvailableResourcesByDates(
                booking.departureDate,
                booking.arrivalDate
              )
            : [];
        setAvailableResources(resourceStatus);
      }
    })();

    if (booking.resource?.name) setSelectedResource(booking.resource.name);
  }, [booking]);

  function selectResource(e: React.ChangeEvent<HTMLInputElement>) {
    const resourceName = e.target.value;
    const resource = resources.filter(
      (resource) => resource.name === resourceName
    )[0];
    const resourcePrice = availableResources.filter(
      (available) => available.resource?.name === resourceName
    )[0].price;

    setBooking((booking) => ({ ...booking, resource }));
    if (resourcePrice)
      setTotalPrice((total: TotalPrice) => ({ ...total, resourcePrice }));
  }

  return (
    <>
      <h3>Plats*</h3>
      <RadioGroup
        name="resource"
        value={selectedResource}
        onChange={selectResource}
      >
        {resources.map((resource) => (
          <div key={resource.name} className="resource-radio-wrapper">
            <FormControlLabel
              value={resource.name}
              control={<Radio />}
              label={resource.label}
              disabled={availableResources.length <= 0}
            />
            {availableResources.map((status) => {
              if (status.resource?.name == resource.name)
                return (
                  <div
                    key={`${status.resource?.name}/${status.qty}`}
                    className="resource-status-label"
                  >
                    <span>{status.price}kr</span>
                    <span>
                      Bokade platser:{" "}
                      {(status.qty || 0) - (status.qtyAvailable || 0)}/
                      {status.qty}
                    </span>
                  </div>
                );
            })}
          </div>
        ))}
      </RadioGroup>
    </>
  );
}
