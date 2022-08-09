// Vendor
import React, { createContext, useContext } from 'react';
import queryString from 'query-string';

// Utils
import isBrowser from '@/utils/isBrowser';

// Context
const EnvironmentContext = createContext();

// States
export const PRODUCTION = 'PRODUCTION';
export const DEVELOPMENT = 'DEVELOPMENT';

export function getEnvironment() {
    const parsed = isBrowser ? queryString.parse(location.search) : {};
    const isProduction = parsed.production || parsed.production === null || process.env.NODE_ENV === 'production';

    let environment = PRODUCTION;
    if (!isProduction && process.env.NODE_ENV === 'development') {
        environment = DEVELOPMENT;
    }

    // Debug
    // return PRODUCTION;

    return environment;
}

export function useEnvironment() {
    return useContext(EnvironmentContext);
}

export function EnvironmentProvider({ children }) {
    const environment = getEnvironment();

    return (
        <EnvironmentContext.Provider value={ environment }>
            { children }
        </EnvironmentContext.Provider>
    );
}
