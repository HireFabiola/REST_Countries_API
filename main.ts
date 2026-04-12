const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle") as HTMLInputElement | null;
const searchForm = document.getElementById("searchForm") as HTMLFormElement;
const searchInput = document.getElementById("searchField") as HTMLInputElement;
const filterDD = document.getElementById("regionFilter") as HTMLInputElement;
const logo = document.getElementById("logoImage") as HTMLImageElement | null;

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
        <img src="${country.flags.svg}" alt="${country.name.common}" class="border rounded mb-2">
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
function createCountryImage(country: Country): HTMLDivElement {
    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("flag-wrapper");

    const img = document.createElement("img");
    img.src = country.flags.svg;
    img.alt = country.name.common;
    img.classList.add("flag-img");

    imgWrapper.appendChild(img);
    return imgWrapper;
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
    col.classList.add("position-relative", "border", "rounded", "p-2", "shadow-sm");

    col.addEventListener("click", clickHandler);

    // Add visited/ toggle icon to each card if user is logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
        const visitedToggle = createVisitedToggle(country);
        col.appendChild(visitedToggle);
    }
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
        col.classList.add("col-12", "col-md-6", "col-lg-3", "border", "rounded", "shadow-sm");
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
    leftCol.classList.add("col-12", "col-lg-6", "d-flex", "justify-content-center", "align-items-center");

    const img = document.createElement("img");
    img.src = searchedCountry.flags.svg;
    img.alt = searchedCountry.name.common;
    img.classList.add("flag-img", "border", "rounded");
    img.style.objectFit = "cover";

    // Append image to left column
    leftCol.appendChild(img);

    return leftCol;
}

// Helper function to create top left detail section
function createTopLeftDetails(searchedCountry: Country): HTMLDivElement {
    // Left inner column
    const topLeft = document.createElement("div");
    topLeft.classList.add("col-12", "col-lg-6", "p-3");

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

    // 🔹 Hover (already working)
    borderItem.addEventListener("mouseenter", async () => {
        await showBorderCountryHover(country.name.common, borderItem);
    });

    borderItem.addEventListener("mouseleave", () => {
        removeHoverCard();
    });

    // 🔥 NEW: Click → go to info page
    borderItem.addEventListener("click", (event) => {
        event.stopPropagation();

        const countryName = encodeURIComponent(country.name.common);
        window.open(`info.html?country=${countryName}`, "_blank");
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
export async function renderSearchCountryLayout(
    searchedCountry: Country,
    homePage: HTMLElement,
    newPage: HTMLElement
): Promise<void> {
    // Clear any previous content
    newPage.innerHTML = "";

    // Create container for formatting consistency across pages
    const container = document.createElement("div");
    container.classList.add("container", "py-3");

    // Only if on main page, otherwise not needed for new window
    if (document.getElementById("countryFlags")) {
        const backButton = createBackButton(homePage, newPage);
        container.appendChild(backButton);
    }

    // Outermost row container
    const outerRow = document.createElement("div");
    outerRow.classList.add("row", "g-3", "align-items-stretch");

    const leftCol = createSearchLeftColumn(searchedCountry);
    const rightCol = await createSearchRightColumn(searchedCountry);

    // Assemble outer row
    outerRow.appendChild(leftCol);
    outerRow.appendChild(rightCol);

    // Add row to container
    container.appendChild(outerRow);

    // Add container to page
    newPage.appendChild(container);
}

type Theme = "dark" | "light";

const logos: Record<Theme, string> = {
    dark: "../Project_HtmlCSSJavaScript/images/DarkLogo.png",
    light: "../Project_HtmlCSSJavaScript/images/WhiteLogo.png"
};


function applyTheme(theme: Theme): void {
    root.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);

    if (themeToggle) {
        themeToggle.checked = theme === "dark";
    }

    if (logo) {
        logo.src = logos[theme];
    }
}

// Default to light on first load
const savedTheme = (localStorage.getItem("theme") as Theme) || "light";

applyTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener("change", () => {
        const newTheme: Theme = themeToggle.checked ? "dark" : "light";
        applyTheme(newTheme);
    });
}

// Add event listener for filter
filterDD?.addEventListener("change", handleChange);

// Add event listener for searcgh field
searchForm?.addEventListener("submit", handleSubmit);

function showVisitedCountries(): void {
    const user = getLoggedInRegisteredUser();
    const container = getCountryFlagsContainer();

    if (!container) return;

    // Not logged in
    if (!user) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    Log in to view your visited countries.
                </div>
            </div>
        `;
        return;
    }

    const visitedNames = user.visitedCountries;

    // No visited countries yet
    if (visitedNames.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    You haven't marked any countries as visited yet.
                </div>
            </div>
        `;
        return;
    }

    const containerChildren = Array.from(container.children) as HTMLDivElement[];

    containerChildren.forEach(card => {
        const countryName = card.querySelector("h6")?.textContent;

        if (countryName && visitedNames.includes(countryName)) {
            (card as HTMLElement).style.display = "block";
        } else {
            (card as HTMLElement).style.display = "none";
        }
    });
}
// Function to handle selected filter option
async function handleChange(event: Event) {
    const selectedRegion = filterDD.value;

    if (selectedRegion === "visited") {
        showVisitedCountries();
        return;
    }

    if (!selectedRegion) {
        await getCountryInfo();
        return;
    }

    const pullData = await fetch(`https://restcountries.com/v3.1/region/${selectedRegion}`);
    const result: Country[] = await pullData.json();

    renderCountryCards(result, (country: Country) => {
        return () => {
            const countryName = encodeURIComponent(country.name.common);
            window.location.href = `info.html?country=${countryName}`;
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
    renderTravelCounter(result.length);
}

export async function getSearchCountry(name: string) {
    try {
        const dataPull = await fetch(
            `https://restcountries.com/v3.1/name/${name}?fields=name,nativeName,capital,region,subregion,population,flags,tld,currencies,languages,borders`
        );
        if (!dataPull.ok) {
            throw new Error("Country not found")
        }

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
    } catch (error) {
        console.log("Search: error:", error);
        showErrorMessage("Country not found.  Please ensure you are typing the name of an actual country")
    }
}

function showErrorMessage(message: string) {
    const container = document.getElementById("countryFlags");

    if (!container) return;

    container.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger text-center">
                ${message}
            </div>
        </div>
    `;
}

function renderTravelCounter(totalCountries: number): void {
    const counter = document.getElementById("travelCounter");
    const user = getLoggedInRegisteredUser();

    if (!counter) return;

    if (!user) {
        counter.innerHTML = `
            <div class="text-center">
                <div class="fw-bold">Because we know all who wander... 🌍</div>
                <div>Log in or register to track the countries you've explored.</div>
            </div>
        `;
        return;
    }

    const username = user.name;
    const visited = user.visitedCountries.length;
    const percent = totalCountries > 0
        ? ((visited / totalCountries) * 100).toFixed(1)
        : "0";

    counter.innerHTML = `
        <div class="text-center">
            <div>Welcome <strong>${username}</strong>! </div>
            <div>You’ve explored <strong>${visited}</strong> countries</div>
            <div><strong>${percent}%</strong> of the globe 🌍</div>
            <div class="mt-1">Where will your next adventure be?✈️</div>
        </div>
    `;
}

type RegisteredUser = {
    name: string;
    email: string;
    password: string;
    visitedCountries: string[];
};

type ActiveSession = {
    name: string;
    email: string;
};

function getRegisteredUsers(): RegisteredUser[] {
    const raw = localStorage.getItem("wanderlustUsers");
    return raw ? JSON.parse(raw) as RegisteredUser[] : [];
}

function saveRegisteredUsers(users: RegisteredUser[]): void {
    localStorage.setItem("wanderlustUsers", JSON.stringify(users));
}

function getCurrentUser(): ActiveSession | null {
    const raw = localStorage.getItem("wanderlustCurrentUser");
    return raw ? JSON.parse(raw) as ActiveSession : null;
}

function saveCurrentUser(user: ActiveSession): void {
    localStorage.setItem("wanderlustCurrentUser", JSON.stringify(user));
}

function clearCurrentUser(): void {
    localStorage.removeItem("wanderlustCurrentUser");
    sessionStorage.removeItem("wanderlustCurrentUser");
}

function setMessage(elementId: string, message: string, isError: boolean = true): void {
    const el = document.getElementById(elementId);
    if (!el) return;

    el.textContent = message;
    el.classList.remove("text-danger", "text-success");
    el.classList.add(isError ? "text-danger" : "text-success");
}

function clearMessage(elementId: string): void {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = "";
}

function updateAuthUI(): void {
    const authLink = document.getElementById("authLink") as HTMLAnchorElement | null;
    const welcomeUser = document.getElementById("welcomeUser") as HTMLElement | null;
    const logoutLink = document.getElementById("logoutLink") as HTMLAnchorElement | null;

    const currentUser = getCurrentUser();

    if (currentUser) {
        if (authLink) authLink.classList.add("d-none");
        if (logoutLink) logoutLink.classList.remove("d-none");
        // if (welcomeUser) welcomeUser.textContent = `Hi, ${currentUser.name}`;
    } else {
        if (authLink) authLink.classList.remove("d-none");
        if (logoutLink) logoutLink.classList.add("d-none");
        if (welcomeUser) welcomeUser.textContent = "";
    }
}

function closeAuthModal(): void {
    const modalEl = document.getElementById("authModal");
    if (!modalEl) return;

    const modal = (window as any).bootstrap?.Modal.getInstance(modalEl);
    modal?.hide();
}

function initAuth(): void {
    const loginForm = document.getElementById("loginForm") as HTMLFormElement | null;
    const registerForm = document.getElementById("registerForm") as HTMLFormElement | null;
    const logoutLink = document.getElementById("logoutLink") as HTMLAnchorElement | null;

    if (registerForm) {
        registerForm.addEventListener("submit", (event) => {
            event.preventDefault();
            clearMessage("registerMessage");

            const name = (document.getElementById("registerName") as HTMLInputElement).value.trim();
            const email = (document.getElementById("registerEmail") as HTMLInputElement).value.trim();
            const password = (document.getElementById("registerPassword") as HTMLInputElement).value.trim();

            if (!name || !email || !password) {
                setMessage("registerMessage", "Please complete all fields.");
                return;
            }

            const users = getRegisteredUsers();
            const exists = users.some(user => user.email.toLowerCase() === email.toLowerCase());

            if (exists) {
                setMessage("registerMessage", "An account with this email already exists.");
                return;
            }

            users.push({
                name,
                email,
                password,
                visitedCountries: []
            });

            saveRegisteredUsers(users);
            saveCurrentUser({ name, email });

            setMessage("registerMessage", "Registration successful.", false);
            updateAuthUI();
            updateSearchPlaceholder();
            getCountryInfo();
            renderVisitedFilter();
            registerForm.reset();

            setTimeout(() => closeAuthModal(), 500);
        });
    }


    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            clearMessage("loginMessage");

            const email = (document.getElementById("loginEmail") as HTMLInputElement).value.trim();
            const password = (document.getElementById("loginPassword") as HTMLInputElement).value.trim();

            if (!email || !password) {
                setMessage("loginMessage", "Please enter email and password.");
                return;
            }

            const user = getRegisteredUsers().find(
                u => u.email.toLowerCase() === email.toLowerCase()
            );

            if (!user) {
                setMessage("loginMessage", "No account found with that email.");
                return;
            }

            if (user.password !== password) {
                setMessage("loginMessage", "Incorrect password.");
                return;
            }

            saveCurrentUser({ name: user.name, email: user.email });
            setMessage("loginMessage", "Login successful.", false);
            updateAuthUI();
            updateSearchPlaceholder();
            getCountryInfo();
            renderVisitedFilter();
            loginForm.reset();

            setTimeout(() => closeAuthModal(), 500);
        });
    }

    if (logoutLink) {
        logoutLink.addEventListener("click", (event) => {
            event.preventDefault();
            clearCurrentUser();
            updateAuthUI();
            updateSearchPlaceholder();
            getCountryInfo();
            renderVisitedFilter();
        });
    }

    updateAuthUI();
    updateSearchPlaceholder();

}

function updateSearchPlaceholder(): void {
    const user = getCurrentUser(); // or getLoggedInRegisteredUser()
    console.log("I am in placeholer function", user)
    if (!searchInput) return;

    if (user) {
        searchInput.placeholder = `Pack your bags! Where to next... `;
    } else {
        searchInput.placeholder = "Search a country...";
    }
}
function getLoggedInRegisteredUser(): RegisteredUser | null {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;

    const users = getRegisteredUsers();
    return users.find(
        user => user.email.toLowerCase() === currentUser.email.toLowerCase()
    ) ?? null;
}

function isCountryVisited(countryName: string): boolean {
    const user = getLoggedInRegisteredUser();
    if (!user) return false;

    return user.visitedCountries.includes(countryName);
}

function toggleVisitedCountry(countryName: string): void {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert("Please log in or register to track countries you've visited.");
        return;
    }

    const users = getRegisteredUsers();
    const user = users.find(
        u => u.email.toLowerCase() === currentUser.email.toLowerCase()
    );

    if (!user) return;

    const alreadyVisited = user.visitedCountries.includes(countryName);

    if (alreadyVisited) {
        user.visitedCountries = user.visitedCountries.filter(
            name => name !== countryName
        );
    } else {
        user.visitedCountries.push(countryName);
    }

    saveRegisteredUsers(users);
}

function updateVisitedButtonState(
    button: HTMLButtonElement,
    countryName: string
): void {
    const visited = isCountryVisited(countryName);

    button.innerHTML = visited
        ? `<i class="bi bi-bookmark-check-fill"></i>`
        : `<i class="bi bi-bookmark"></i>`;

    button.classList.toggle("visited", visited);
    button.title = visited ? "Visited" : "Mark as visited";
    button.setAttribute(
        "aria-label",
        visited
            ? `${countryName} marked as visited`
            : `Mark ${countryName} as visited`
    );
}

function updateTravelCounterFromStoredCountries(): void {
    const totalCountries = document.querySelectorAll("#countryFlags > div").length;

    if (totalCountries > 0) {
        renderTravelCounter(totalCountries);
    }
}

function createVisitedToggle(country: Country): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("visited-toggle", "btn", "btn-sm");
    button.setAttribute("aria-label", `Mark ${country.name.common} as visited`);
    button.title = "Mark as visited";

    updateVisitedButtonState(button, country.name.common);

    button.addEventListener("click", (event) => {
        event.stopPropagation();

        toggleVisitedCountry(country.name.common);
        updateVisitedButtonState(button, country.name.common);
        updateTravelCounterFromStoredCountries();
        renderVisitedFilter();
    });

    return button;
}

function renderVisitedFilter(): void {
    const container = document.getElementById("visitedFilterContainer");
    if (!container) return;

    const user = getLoggedInRegisteredUser();

    container.innerHTML = "";

    if (!user || user.visitedCountries.length === 0) {
        return;
    }

    let showingVisited = false;

    const button = document.createElement("button");
    button.classList.add("btn", "btn-outline-success", "btn-sm");
    button.textContent = `Visited (${user.visitedCountries.length})`;

    button.addEventListener("click", () => {
        showingVisited = !showingVisited;

        if (showingVisited) {
            button.textContent = "Show All";
            showVisitedCountries();
        } else {
            button.textContent = `Visited (${user.visitedCountries.length})`;
            getCountryInfo();
            renderVisitedFilter();
        }
    });

    container.appendChild(button);
}


initAuth();
updateSearchPlaceholder();
getCountryInfo();
renderVisitedFilter();