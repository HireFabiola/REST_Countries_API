Frontend Mentor - REST Countries API with Color Theme Switcher Solution

This is my adaptation of the REST Countries API with color theme switcher challenge on Frontend Mentor. I used this project to get more comfortable working with APIs, and building a clean, responsive UI.  While it was designed as a heavy in JavaScript challenge, I decided to challenge myself further and implement it with TypeScript.

Table of contents
Overview
The Challenge
Screenshot
Links
My Process
Built With
What I Learned
Continued Development
Useful Resources
Author
Overview
The Challenge

Users should be able to:
See all countries from the API on the homepage
Search for a country using an input field
Filter countries by region
Click on a country to see more detailed information
Click through to border countries
Toggle between light and dark mode
This submission meets requirements to be an MVP.  The adaptation to the challenge, was my attempt to convert this REST API into a travel journal requiring additional implementation and a bit more extensive use of localStorage.

Screenshot
../images/screenshot...

Links
Live Site URL: TBD

Built With
Semantic HTML5 markup
CSS custom properties
Flexbox
Bootstrap 5
CSS Grid
Mobile-first workflow
TypeScript
Styled Components

What I Learned
This project helped me get more comfortable with a few things:
Working with API data and handling it cleanly with try catch blocks.
Using TypeScript to add structure and catch errors earlier and understand compiler errors for debugging.
Setting up dynamic routing elements using DOM objectst
Really seeing the benefit of modularized code.  And buiolding 
responsive  layout that works well across screen sizes.




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


Continued Development
The app is a long way from finished.  I want to ultimately develop all functionalities I envision for a good comprehensive travel app.  I want to include a photo gallery and information about each contry perhaps tieing another API that renders unique information about every country.

Things I still want to improve on:
I still want to improve on my knowledge of Typescript until I become fluent in it as a programmind language.  The more comfortable I become with advanced TypeScript patterns, the more robust my applications will be.  Knowing this doesn't scracth the surface of how complex an app can bem I must improve myability to organize files and import and export functions and utilities as needed.
Improving how I manage state as apps get more complex

Writing tests instead of just relying on manual testing
Useful Resources

https://www.typescriptlang.org/docs/
https://styled-components.com/docs
Author
Name: Fabiola Aurelien