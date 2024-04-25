import { useEffect, useState } from "react";
import { SelectedFeatures, TotalPrice } from "../types";
import { FeatureWithPriceDTO, MainFeatureDTO, OrderDTO } from "parking-sdk";

export function useFilterFeatures(
  availableFeatures: MainFeatureDTO[],
  selectedFeatures: SelectedFeatures,
  setSelectedFeatures: React.Dispatch<React.SetStateAction<SelectedFeatures>>,
  setTotalPrice: React.Dispatch<React.SetStateAction<TotalPrice>>,
  order?: OrderDTO
) {
  const [filteredFeatures, setFilteredFeatures] = useState<
    FeatureWithPriceDTO[]
  >([]);

  useEffect(() => {
    (function () {
      const allFeatures = availableFeatures.flatMap(
        (main): FeatureWithPriceDTO[] =>
          main.features ? main.features?.map((feature) => feature) : []
      );
      const featuresWithPrice: FeatureWithPriceDTO[] = [];
      for (const key in selectedFeatures) {
        if (selectedFeatures[key]) {
          featuresWithPrice.push(
            allFeatures.filter((feature) => feature.name === key)[0]
          );
        }
      }
      setFilteredFeatures(featuresWithPrice);
      if (featuresWithPrice.length > 0) {
        const totalPrice = featuresWithPrice.reduce(
          (tot: number, feature: FeatureWithPriceDTO) =>
            tot + (feature?.price || 0),
          0
        );

        setTotalPrice((total) => ({ ...total, featurePrices: totalPrice }));
      } else {
        setTotalPrice((total) => ({ ...total, featurePrices: 0 }));
      }
    })();
  }, [selectedFeatures, availableFeatures]);

  useEffect(() => {
    (function () {
      console.log("useFilter order: ", order);
      order?.orderItems?.forEach(item => {if(item.orderItemType === 'FEATURE' && item.feature?.name)  setSelectedFeatures(features => ({...features, [item.feature!.name!]: true})) })
    })();
  }, [order]);

  return [filteredFeatures];
}
