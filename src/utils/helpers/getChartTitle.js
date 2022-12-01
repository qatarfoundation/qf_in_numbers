export default function getChartTitle(chart) {
    if (chart.title && Array.isArray(chart.title)) {
        return chart.title.map(part => part.value).join(' ');
    } else if (chart.title && typeof chart.title === 'string') {
        return chart.title;
    }
    return '';
}
