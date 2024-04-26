import { FeatureWithPriceDTO, MainFeatureDTO } from "parking-sdk";
import { TotalPrice } from "../types";

export function filterFeatures (
    availableFeatures: MainFeatureDTO[], 
    selectedFeatures: {[key:string]: boolean}, 
    setFilteredFeatures:React.Dispatch<React.SetStateAction<FeatureWithPriceDTO[]>>, 
    setTotalPrice: React.Dispatch<React.SetStateAction<TotalPrice>>
) {
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
  }