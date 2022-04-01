// Vendor
import React, { createContext, useContext } from 'react';
import queryString from 'query-string';

const EnvironmentContext = createContext();

export const PRODUCTION = 'PRODUCTION';
export const DEVELOPMENT = 'DEVELOPMENT';

export function useEnvironment() {
    return useContext(EnvironmentContext);
}

export function EnvironmentProvider({ children }) {
    const parsed = queryString.parse(location.search);
    const isProduction = parsed.production || parsed.production === null || process.env.NODE_ENV === 'production';

    let environment = 'production';
    if (!isProduction && process.env.NODE_ENV === 'development') {
        environment = 'development';
    }

    return (
        <EnvironmentContext.Provider value={ environment }>
            { children }
        </EnvironmentContext.Provider>
    );
}
