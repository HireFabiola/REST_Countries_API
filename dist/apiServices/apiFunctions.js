export async function getFlags() {
    const response = await fetch("https://restcountries.com/v3.1/name/haiti");
    const result = await response.json();
    const container = document.getElementById("countryFlags");
    if (!container)
        return;
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
//# sourceMappingURL=apiFunctions.js.map