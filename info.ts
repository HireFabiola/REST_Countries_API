import { getSearchCountry } from "./main.js";

const params = new URLSearchParams(window.location.search);
const countryName = params.get("country");

if (countryName) {
    getSearchCountry(countryName);
} else {
    console.error("No country provided in URL");
}

