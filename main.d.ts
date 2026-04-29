interface Country {
    cca2: string;
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
export declare function renderSearchCountryLayout(searchedCountry: Country, homePage: HTMLElement, newPage: HTMLElement): Promise<void>;
export declare function getSearchCountry(name: string): Promise<void>;
export {};
//# sourceMappingURL=main.d.ts.map