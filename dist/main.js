const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchField");
const filterDD = document.getElementById("regionFilter");
// Load saved theme on page load
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    root.setAttribute("data-bs-theme", "dark");
    themeToggle.checked = true;
}
else {
    root.setAttribute("data-bs-theme", "light");
    themeToggle.checked = false;
}
// Toggle theme when switch changes
themeToggle.addEventListener("change", () => {
    const newTheme = themeToggle.checked ? "dark" : "light";
    root.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("theme", newTheme);
});
// Add event listener for filter
filterDD?.addEventListener("change", handleChange);
// Add event listener for searcgh field
searchForm?.addEventListener("submit", handleSubmit);
// Function to handle selected filter option
async function handleChange(event) {
    // Get selected region to use in region API
    const selectedRegion = filterDD.value;
    console.log(selectedRegion);
    const pullData = await fetch(`https://restcountries.com/v3.1/region/${selectedRegion}`);
    const result = await pullData.json();
    // This is repeated code to rerender exact same output layout from initial load will create a render function for this if time permits
    const container = document.getElementById("countryFlags");
    if (!container)
        return;
    // clear previous results
    container.innerHTML = "";
    // Loop entire returned list of countries
    for (let i = 0; i < result.length; i++) {
        let country = result[i];
        // Create columns
        const col = document.createElement("div");
        col.classList.add("col-3", "border", "rounded", "p-2", "shadow-sm");
        col.addEventListener("click", () => {
            console.log("I am here");
            const countryName = encodeURIComponent(country.name.common);
            window.location.href = `detail.html?country=${countryName}`;
        });
        // Flag
        const img = document.createElement("img");
        img.src = country.flags.svg;
        img.alt = country.name.common;
        img.classList.add("img-fluid", "border", "rounded");
        // Name
        const name = document.createElement("h6");
        name.textContent = country.name.common;
        name.classList.add("mt-2", "fw-bold");
        // Capital
        const capital = document.createElement("p");
        capital.textContent = `Capital: ${country.capital?.[0] ?? "N/A"}`;
        // Region
        const region = document.createElement("p");
        region.textContent = `Region: ${country.region}`;
        //  Population
        const population = document.createElement("p");
        population.textContent = `Population: ${country.population.toLocaleString()}`;
        // Append everything to column
        col.appendChild(img);
        col.appendChild(name);
        col.appendChild(capital);
        col.appendChild(region);
        col.appendChild(population);
        // Append column to container
        container.appendChild(col);
    }
    ;
}
// Function to handle submit 
async function handleSubmit(event) {
    event.preventDefault(); // prevent default page refresh
    const searchValue = searchInput.value.trim();
    if (!searchValue) {
        console.log("No input provided");
        return;
    }
    console.log("Searching for:", searchValue);
    // Call your function
    await getSearchCountry(searchValue);
}
async function getCountryInfo() {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags");
    const result = await response.json();
    const container = document.getElementById("countryFlags");
    if (!container)
        return;
    // clear previous results
    container.innerHTML = "";
    // Loop entire returned list of countries
    for (let i = 0; i < result.length; i++) {
        let country = result[i];
        // Create columns
        const col = document.createElement("div");
        col.classList.add("col-3", "border", "rounded", "p-2", "shadow-sm");
        // Add event listener for click to get more info on country
        col.addEventListener("click", () => {
            const countryName = encodeURIComponent(country.name.common);
            window.open(`detail.html?country=${countryName}`, "_blank");
        });
        // Flag
        const img = document.createElement("img");
        img.src = country.flags.svg;
        img.alt = country.name.common;
        img.classList.add("img-fluid", "border", "rounded");
        // Name
        const name = document.createElement("h6");
        name.textContent = country.name.common;
        name.classList.add("mt-2", "fw-bold");
        // Capital
        const capital = document.createElement("p");
        capital.textContent = `Capital: ${country.capital?.[0] ?? "N/A"}`;
        // Region
        const region = document.createElement("p");
        region.textContent = `Region: ${country.region}`;
        //  Population
        const population = document.createElement("p");
        population.textContent = `Population: ${country.population.toLocaleString()}`;
        // Append everything to column
        col.appendChild(img);
        col.appendChild(name);
        col.appendChild(capital);
        col.appendChild(region);
        col.appendChild(population);
        // Append column to container
        container.appendChild(col);
    }
    ;
}
async function getSearchCountry(name) {
    const dataPull = await fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,nativeName,capital,region,subregion,population,flags,tld,currencies,languages,borders`);
    const result = await dataPull.json();
    const searchedCountry = result[0];
    const homePage = document.getElementById("onLoadLayout");
    const newPage = document.getElementById("newLayout");
    if (!homePage || !newPage)
        return;
    // Hide main page visibility and enable newLayout visibility
    homePage.classList.add("d-none");
    newPage.classList.remove("d-none");
    if (!searchedCountry) {
        console.error("Country not found");
        return;
    }
    // Otherwise, good to go with output
    // Clear any previous content
    newPage.innerHTML = "";
    // Create Back button
    const backButton = document.createElement("div");
    backButton.textContent = "← Back";
    backButton.classList.add("btn", "btn-outline-secondary", "mb-3", "d-inline-block");
    // Add back button event listener
    backButton.addEventListener("click", async () => {
        newPage.classList.add("d-none");
        homePage.classList.remove("d-none");
    });
    // Append button to page
    newPage.appendChild(backButton);
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
            const borderItem = document.createElement("span");
            borderItem.classList.add("border", "rounded", "px-2", "py-1");
            borderItem.textContent = country.name.common;
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
getCountryInfo();
export {};
//# sourceMappingURL=main.js.map