const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle") as HTMLInputElement;
const searchForm = document.getElementById("searchForm") as HTMLFormElement;
const searchInput = document.getElementById("searchField") as HTMLInputElement;
const filterDD = document.getElementById("regionFilter") as HTMLInputElement;
const logo = document.getElementById("logoImage") as HTMLImageElement;

// Interface for country data returned from REST Countries API
interface Country {
    name: {
        common: string;
        official: string;
    };
    capital?: string[];
    region: string;
    subregion?: string;
    population: number;
    flags: {
        svg: string;
    };
    tld?: string[];
    currencies?: Record<string, {
        name: string;
        symbol?: string;
    }>;
    languages?: Record<string, string>;
    borders?: string[];
}

// Code for border countries hover cards
let activeHoverCard: HTMLDivElement | null = null;

function removeHoverCard(): void {
    if (activeHoverCard) {
        activeHoverCard.remove();
        activeHoverCard = null;
    }
}

async function showBorderCountryHover(
    countryName: string,
    anchor: HTMLElement
): Promise<void> {
    removeHoverCard();

    const response = await fetch(
        `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fields=name,capital,region,population,flags`
    );

    const result: Country[] = await response.json();
    const country = result[0];

    if (!country) return;

    const hoverCard = document.createElement("div");
    hoverCard.classList.add("country-hover-card");

    hoverCard.innerHTML = `
        <div class="fw-bold mb-2">${country.name.common}</div>
        <img src="${country.flags.svg}" alt="${country.name.common}" class="img-fluid border rounded mb-2">
        <p class="mb-1"><strong>Capital:</strong> ${country.capital?.[0] ?? "N/A"}</p>
        <p class="mb-1"><strong>Region:</strong> ${country.region}</p>
        <p class="mb-0"><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    `;

    document.body.appendChild(hoverCard);

    const rect = anchor.getBoundingClientRect();

    hoverCard.style.top = `${window.scrollY + rect.bottom + 8}px`;
    hoverCard.style.left = `${window.scrollX + rect.left}px`;

    activeHoverCard = hoverCard;
}

// Helper function to get container for country cards
function getCountryFlagsContainer(): HTMLElement | null {
    return document.getElementById("countryFlags");
}

// Helper function to clear previous results
function clearContainer(container: HTMLElement): void {
    container.innerHTML = "";
}

// Helper function to create country card image
function createCountryImage(country: Country): HTMLImageElement {
    const img = document.createElement("img");
    img.src = country.flags.svg;
    img.alt = country.name.common;
    img.classList.add("img-fluid", "border", "rounded");
    return img;
}

// Helper function to create country card name
function createCountryName(country: Country): HTMLHeadingElement {
    const name = document.createElement("h6");
    name.textContent = country.name.common;
    name.classList.add("mt-2", "fw-bold");
    return name;
}

// Helper function to create country card capital
function createCountryCapital(country: Country): HTMLParagraphElement {
    const capital = document.createElement("p");
    capital.textContent = `Capital: ${country.capital?.[0] ?? "N/A"}`;
    return capital;
}

// Helper function to create country card region
function createCountryRegion(country: Country): HTMLParagraphElement {
    const region = document.createElement("p");
    region.textContent = `Region: ${country.region}`;
    return region;
}

// Helper function to create country card population
function createCountryPopulation(country: Country): HTMLParagraphElement {
    const population = document.createElement("p");
    population.textContent = `Population: ${country.population.toLocaleString()}`;
    return population;
}

// Helper function to build reusable country card
function createCountryCard(
    country: Country,
    clickHandler: () => void
): HTMLDivElement {
    // Create columns
    const col = document.createElement("div");
    col.classList.add("col-3", "border", "rounded", "p-2", "shadow-sm");

    col.addEventListener("click", clickHandler);

    // Flag
    const img = createCountryImage(country);

    // Name
    const name = createCountryName(country);

    // Capital
    const capital = createCountryCapital(country);

    // Region
    const region = createCountryRegion(country);

    //  Population
    const population = createCountryPopulation(country);

    // Append everything to column
    col.appendChild(img);
    col.appendChild(name);
    col.appendChild(capital);
    col.appendChild(region);
    col.appendChild(population);

    return col;
}

// Helper function to render list of countries to page
function renderCountryCards(
    countryList: Country[],
    clickHandlerBuilder: (country: Country) => () => void
): void {
    const container = getCountryFlagsContainer();

    if (!container) return;

    clearContainer(container);

    for (const country of countryList) {
        const col = createCountryCard(country, clickHandlerBuilder(country));
        container.appendChild(col);
    }
}

// Helper function to create back button
function createBackButton(homePage: HTMLElement, newPage: HTMLElement): HTMLDivElement {
    // Create Back button
    const backButton = document.createElement("div");
    backButton.textContent = "← Back";
    backButton.classList.add("btn", "btn-outline-secondary", "mb-3", "d-inline-block");

    // Add back button event listener
    backButton.addEventListener("click", async () => {
        newPage.classList.add("d-none");
        homePage.classList.remove("d-none");
    });

    return backButton;
}

// Helper function to create left flag column for search layout
function createSearchLeftColumn(searchedCountry: Country): HTMLDivElement {
    // Left column for flag
    const leftCol = document.createElement("div");
    leftCol.classList.add("col-12", "col-md-6", "p-3");

    const img = document.createElement("img");
    img.src = searchedCountry.flags.svg;
    img.alt = searchedCountry.name.common;
    img.classList.add("img-fluid", "border", "rounded");

    // Append image to left column
    leftCol.appendChild(img);

    return leftCol;
}

// Helper function to create top left detail section
function createTopLeftDetails(searchedCountry: Country): HTMLDivElement {
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

    return topLeft;
}

// Helper function to create top right detail section
function createTopRightDetails(searchedCountry: Country): HTMLDivElement {
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

    return topRight;
}

// Helper function to create top section of search detail layout
function createSearchTopSection(searchedCountry: Country): HTMLDivElement {
    // Top row of right outer column
    const topSection = document.createElement("div");
    topSection.classList.add("p-3");
    topSection.style.flex = "2";

    const topRow = document.createElement("div");
    topRow.classList.add("row", "g-3", "h-100");

    const topLeft = createTopLeftDetails(searchedCountry);
    const topRight = createTopRightDetails(searchedCountry);

    topRow.appendChild(topLeft);
    topRow.appendChild(topRight);
    topSection.appendChild(topRow);

    return topSection;
}

// Helper function to create border button
function createBorderCountryButton(country: { name: { common: string } }): HTMLButtonElement {
    const borderItem = document.createElement("button");
    borderItem.type = "button";
    borderItem.textContent = country.name.common;
    borderItem.classList.add("btn", "btn-outline-primary", "btn-sm");

    borderItem.addEventListener("mouseenter", async () => {
        await showBorderCountryHover(country.name.common, borderItem);
    });

    borderItem.addEventListener("mouseleave", () => {
        removeHoverCard();
    });

    return borderItem;
}

// Helper function to create bottom section shell
function createBottomSectionShell(): { bottomSection: HTMLDivElement; borderWrap: HTMLDivElement } {
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

    return { bottomSection, borderWrap };
}

// Helper function to render border countries
async function renderBorderCountries(
    searchedCountry: Country,
    borderWrap: HTMLDivElement
): Promise<void> {
    if (searchedCountry.borders && searchedCountry.borders.length > 0) {
        const codes = searchedCountry.borders.join(",");

        const borderResponse = await fetch(
            `https://restcountries.com/v3.1/alpha?codes=${codes}&fields=name`
        );

        const borderData: { name: { common: string } }[] = await borderResponse.json();

        borderData.forEach((country) => {
            const borderItem = createBorderCountryButton(country);
            borderWrap.appendChild(borderItem);
        });

    } else {
        const noBorders = document.createElement("span");
        noBorders.textContent = "None";
        borderWrap.appendChild(noBorders);
    }
}

// Helper function to create bottom section of search detail layout
async function createSearchBottomSection(searchedCountry: Country): Promise<HTMLDivElement> {
    const { bottomSection, borderWrap } = createBottomSectionShell();
    await renderBorderCountries(searchedCountry, borderWrap);
    return bottomSection;
}

// Helper function to create right column for search detail layout
async function createSearchRightColumn(searchedCountry: Country): Promise<HTMLDivElement> {
    // Right column containing nested rows and columns
    const rightCol = document.createElement("div");
    rightCol.classList.add("col-12", "col-md-6");

    const rightColInner = document.createElement("div");
    rightColInner.classList.add("d-flex", "flex-column", "h-100", "gap-3");

    const topSection = createSearchTopSection(searchedCountry);
    const bottomSection = await createSearchBottomSection(searchedCountry);

    // Assemble right side
    rightColInner.appendChild(topSection);
    rightColInner.appendChild(bottomSection);
    rightCol.appendChild(rightColInner);

    return rightCol;
}

// Helper function to render searched country detail layout
async function renderSearchCountryLayout(
    searchedCountry: Country,
    homePage: HTMLElement,
    newPage: HTMLElement
): Promise<void> {
    // Clear any previous content
    newPage.innerHTML = "";

    const backButton = createBackButton(homePage, newPage);
    newPage.appendChild(backButton);

    // Outermost row container
    const outerRow = document.createElement("div");
    outerRow.classList.add("row", "g-3");

    const leftCol = createSearchLeftColumn(searchedCountry);
    const rightCol = await createSearchRightColumn(searchedCountry);

    // Assemble outer row
    outerRow.appendChild(leftCol);
    outerRow.appendChild(rightCol);

    // Add to page
    newPage.appendChild(outerRow);
}

type Theme = "dark" | "light";

const logos: Record<Theme, string> = {
    dark: "../Project_HtmlCSSJavaScript/images/DarkLogo.png",
    light: "../Project_HtmlCSSJavaScript/images/WhiteLogo.png"
};

function applyTheme(theme: Theme): void {
    root.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);

    // checked = DARK mode (your current logic)
    themeToggle.checked = theme === "dark";

    logo.src = logos[theme];
}

// Default to light on first load
const savedTheme = (localStorage.getItem("theme") as Theme) || "light";

applyTheme(savedTheme);

themeToggle.addEventListener("change", () => {
    const newTheme: Theme = themeToggle.checked ? "dark" : "light";
    applyTheme(newTheme);
});

// Add event listener for filter
filterDD?.addEventListener("change", handleChange);

// Add event listener for searcgh field
searchForm?.addEventListener("submit", handleSubmit);

// Function to handle selected filter option
async function handleChange(event: Event) {
    // Get selected region to use in region API
    const selectedRegion = filterDD.value;
    console.log(selectedRegion);
    const pullData = await fetch(`https://restcountries.com/v3.1/region/${selectedRegion}`);
    const result: Country[] = await pullData.json();

    renderCountryCards(result, (country: Country) => {
        return () => {
            console.log("I am here");
            const countryName = encodeURIComponent(country.name.common);
            window.location.href = `detail.html?country=${countryName}`;
        };
    });
}



// Function to handle submit 
async function handleSubmit(event: Event) {
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
    const response = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags"
    );

    const result: Country[] = await response.json();

    renderCountryCards(result, (country: Country) => {
        return () => {
            // Add event listener for click to get more info on country
            const countryName = encodeURIComponent(country.name.common);

            window.open(`info.html?country=${countryName}`, "_blank");
            console.log(countryName);
        };
    });
}

async function getSearchCountry(name: string) {
    const dataPull = await fetch(
        `https://restcountries.com/v3.1/name/${name}?fields=name,nativeName,capital,region,subregion,population,flags,tld,currencies,languages,borders`
    );

    const result: Country[] = await dataPull.json();
    const searchedCountry: Country | undefined = result[0];

    const homePage = document.getElementById("onLoadLayout");
    const newPage = document.getElementById("newLayout");

    if (!homePage || !newPage) return;

    // Hide main page visibility and enable newLayout visibility
    homePage.classList.add("d-none");
    newPage.classList.remove("d-none");


    if (!searchedCountry) {
        console.error("Country not found");
        return;
    }
    // Otherwise, good to go with output
    await renderSearchCountryLayout(searchedCountry, homePage, newPage);
}

getCountryInfo();