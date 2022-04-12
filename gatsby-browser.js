// Watch route updates
exports.onRouteUpdate = ({ location, prevLocation }) => {
    location.previous = prevLocation;
};
