const params = new URLSearchParams(window.location.search);
const countryName = params.get("country");
if (countryName) {
    getSearchCountry(countryName);
}
async function getSearchCountry(name) {
    const dataPull = await fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,nativeName,capital,region,subregion,population,flags,tld,currencies,languages,borders`);
    const result = await dataPull.json();
    const searchedCountry = result[0];
    const newPage = document.getElementById("infoPage");
    if (!newPage)
        return;
    // Hide main page visibility and enable newLayout visibility
    newPage.classList.remove("d-none");
    if (!searchedCountry) {
        console.error("Country not found");
        return;
    }
    // Otherwise, good to go with output
    // Clear any previous content
    newPage.innerHTML = "";
    // Outermost row container
    const outerRow = document.createElement("div");
    outerRow.classList.add("row", "g-3");
    // Left column for flag
    const leftCol = document.createElement("div");
    leftCol.classList.add("col-12", "col-md-6", "p-3");
    const img = document.createElement("img");
    img.src = searchedCountry.flags.svg;
    img.alt = searchedCountry.name.common;
    img.classList.add("img-fluid", "border", "rounded");
    // Append image to left column
    leftCol.appendChild(img);
    // Right column containing nested rows and columns
    const rightCol = document.createElement("div");
    rightCol.classList.add("col-12", "col-md-6");
    const rightColInner = document.createElement("div");
    rightColInner.classList.add("d-flex", "flex-column", "h-100", "gap-3");
    // Top row of right outer column
    const topSection = document.createElement("div");
    topSection.classList.add("p-3");
    topSection.style.flex = "2";
    const topRow = document.createElement("div");
    topRow.classList.add("row", "g-3", "h-100");
    // Left inner column
    const topLeft = document.createElement("div");
    topLeft.classList.add("col-6", "p-3");
    // Sets country's name
    const countryName = document.createElement("h4");
    countryName.textContent = searchedCountry.name.common;
    // Set country's native name
    const nativeName = document.createElement("p");
    nativeName.textContent = `Native Name: ${searchedCountry.name.official}`;
    console.log(searchedCountry.name.official);
    // Set country's population
    const population = document.createElement("p");
    population.textContent = `Population: ${searchedCountry.population.toLocaleString()}`;
    // Set country's region
    const region = document.createElement("p");
    region.textContent = `Region: ${searchedCountry.region}`;
    // Set country's sub-region
    const subRegion = document.createElement("p");
    subRegion.textContent = `Sub-region: ${searchedCountry.subregion ?? "N/A"}`;
    // Set country's capital
    const capital = document.createElement("p");
    capital.textContent = `Capital: ${searchedCountry.capital?.[0] ?? "N/A"}`;
    topLeft.appendChild(countryName);
    topLeft.appendChild(nativeName);
    topLeft.appendChild(population);
    topLeft.appendChild(region);
    topLeft.appendChild(subRegion);
    topLeft.appendChild(capital);
    // Top right inner column
    const topRight = document.createElement("div");
    topRight.classList.add("col-6", "p-3");
    const tld = document.createElement("p");
    tld.textContent = `Top Level Domain: ${searchedCountry.tld?.join(", ") ?? "N/A"}`;
    const currencies = document.createElement("p");
    const currencyList = searchedCountry.currencies
        ? Object.values(searchedCountry.currencies)
            .map((currency) => currency.name)
            .join(", ")
        : "N/A";
    currencies.textContent = `Currencies: ${currencyList}`;
    const languages = document.createElement("p");
    const languageList = searchedCountry.languages
        ? Object.values(searchedCountry.languages).join(", ")
        : "N/A";
    languages.textContent = `Languages: ${languageList}`;
    topRight.appendChild(tld);
    topRight.appendChild(currencies);
    topRight.appendChild(languages);
    topRow.appendChild(topLeft);
    topRow.appendChild(topRight);
    topSection.appendChild(topRow);
    // Bottom section of outer right column for border countries
    const bottomSection = document.createElement("div");
    bottomSection.classList.add("p-3");
    bottomSection.style.flex = "1";
    const borderTitle = document.createElement("p");
    borderTitle.classList.add("fw-bold", "mb-2");
    borderTitle.textContent = "Border Countries:";
    const borderWrap = document.createElement("div");
    borderWrap.classList.add("d-flex", "flex-wrap", "gap-2");
    bottomSection.appendChild(borderTitle);
    bottomSection.appendChild(borderWrap);
    if (searchedCountry.borders && searchedCountry.borders.length > 0) {
        const codes = searchedCountry.borders.join(",");
        const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha?codes=${codes}&fields=name`);
        const borderData = await borderResponse.json();
        borderData.forEach((country) => {
            const borderItem = document.createElement("button");
            borderItem.classList.add("border", "rounded", "px-2", "py-1");
            borderItem.textContent = country.name.common;
            // Create on click listener for each country
            borderItem.addEventListener("click", () => {
                getSearchCountry(country.name.common);
            });
            borderWrap.appendChild(borderItem);
        });
    }
    else {
        const noBorders = document.createElement("span");
        noBorders.textContent = "None";
        borderWrap.appendChild(noBorders);
    }
    // Assemble right side
    rightColInner.appendChild(topSection);
    rightColInner.appendChild(bottomSection);
    rightCol.appendChild(rightColInner);
    // Assemble outer row
    outerRow.appendChild(leftCol);
    outerRow.appendChild(rightCol);
    // Add to page
    newPage.appendChild(outerRow);
}
export {};
//# sourceMappingURL=info.js.map