// Watch route updates
exports.onRouteUpdate = (props) => {
    const { location, prevLocation } = props;
    location.previous = prevLocation;
};
