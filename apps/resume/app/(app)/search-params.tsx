import { createLoader, parseAsString } from "nuqs/server";

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const coordinatesSearchParams = {
  style: parseAsString.withDefault("default"),
  token: parseAsString.withDefault(""),
  lang: parseAsString.withDefault("fr"),
};

export const loadSearchParams = createLoader(coordinatesSearchParams);
