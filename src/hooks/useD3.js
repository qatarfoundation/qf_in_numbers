// React
import React, { useEffect, useRef } from 'react';

// Modules
import * as d3 from 'd3';

export const useD3 = (renderChartFn, dependencies) => {
    // References
    const ref = useRef();
    // Effects
    useEffect(() => {
        renderChartFn(d3.select(ref.current));
        return () => {};
    }, dependencies);
    return ref;
};
