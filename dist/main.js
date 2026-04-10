// Taken from Chat to create my toggle button
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;
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
async function getCountryInfo() {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags");
    const result = await response.json();
    const container = document.getElementById("countryFlags");
    if (!container)
        return;
    // clear previous results
    container.innerHTML = "";
    for (let i = 0; i < result.length; i++) {
        let country = result[i]; // declared here
        // Column
        const col = document.createElement("div");
        col.classList.add("col-3");
        // Flag
        const img = document.createElement("img");
        img.src = country.flags.svg;
        img.alt = country.name.common;
        img.classList.add("img-fluid");
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
getCountryInfo();
export {};
//# sourceMappingURL=main.js.map