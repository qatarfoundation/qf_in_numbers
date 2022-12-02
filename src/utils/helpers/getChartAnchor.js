import getChartTitle from './getChartTitle';

export default function getChartAnchor(chart) {
    const title = getChartTitle(chart);
    return title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
}
