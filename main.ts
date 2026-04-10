// Taken from Chat to create my toggle button
const themeToggle = document.getElementById("themeToggle") as HTMLInputElement;
const root = document.documentElement;

// Load saved theme on page load
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    root.setAttribute("data-bs-theme", "dark");
    themeToggle.checked = true;
} else {
    root.setAttribute("data-bs-theme", "light");
    themeToggle.checked = false;
}

// Toggle theme when switch changes
themeToggle.addEventListener("change", () => {
    const newTheme = themeToggle.checked ? "dark" : "light";

    root.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("theme", newTheme);
});

async function getFlags() {
    const response = await fetch("https://restcountries.com/v3.1/name/haiti");
    const result = await response.json();

    const container = document.getElementById("countryFlags");

    if (!container) return;

    const country = result[0];

    //  Create the column div
    const col = document.createElement("div");
    col.classList.add("col-3");

    // Create the image
    const img = document.createElement("img");
    img.src = country.flags.svg;
    img.alt = country.name.common;
    img.classList.add("img-fluid");

    // Put image inside div
    col.appendChild(img);

    // Put div into container
    container.appendChild(col);
}

getFlags();


getFlags();

getFlags();
getFlags();
