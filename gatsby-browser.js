// Hooks
const useStore = require('@/hooks/useStore').default;

// Watch route updates
exports.onRouteUpdate = (props) => {
    const { location, prevLocation } = props;
    location.previous = prevLocation;
    useStore.setState({ previousRoute: prevLocation?.pathname });
};
