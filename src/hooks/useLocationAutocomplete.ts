import { useRef, useState, useCallback } from "react";
import { Location } from "../types/User";

interface UseLocationAutocompleteProps {
  initialLocation?: Partial<Location>;
  onLocationChange: (location: Location) => void;
}

export const useLocationAutocomplete = ({ initialLocation, onLocationChange }: UseLocationAutocompleteProps) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [locationInput, setLocationInput] = useState<string>(
    initialLocation 
      ? initialLocation.name || `${initialLocation.city}, ${initialLocation.country}`
      : ""
  );

  const handlePlaceChanged = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location?.lat();
        const lng = place.geometry.location?.lng();
        const state = place.address_components?.find((comp) =>
          comp.types.includes("administrative_area_level_1")
        )?.short_name;
        const formattedAddress = place.formatted_address;
        const name = place.name;
        const city = place.address_components?.find((comp) =>
          comp.types.includes("locality")
        )?.long_name;
        const country = place.address_components?.find((comp) =>
          comp.types.includes("country")
        )?.long_name;

        if (lat !== undefined && lng !== undefined) {
          const newLocation: Location = {
            latitude: lat,
            longitude: lng,
            city: city || "",
            country: country || "",
            state: state || "",
            formattedAddress: formattedAddress || "",
            name: name,
          };

          onLocationChange(newLocation);
          setLocationInput(name || formattedAddress || "");
        }
      }
    }
  }, [onLocationChange]);

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationInput(e.target.value);
  };

  const onLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  return {
    locationInput,
    handleLocationInputChange,
    handlePlaceChanged,
    onLoad,
    setLocationInput
  };
};
