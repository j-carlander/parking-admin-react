import { OrderDTO } from "parking-sdk";
import { SelectedFeatures } from "../types";

export function selectFeaturesByOrder (order: OrderDTO | undefined, setSelectedFeatures: React.Dispatch<React.SetStateAction<SelectedFeatures>>) {
    order?.orderItems?.forEach((item) => {
      if (item.orderItemType === "FEATURE" && item.feature?.name)
        setSelectedFeatures((features) => ({
          ...features,
          [item.feature!.name!]: true,
        }));
    });
  }