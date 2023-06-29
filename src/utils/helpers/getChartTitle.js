export default function getChartTitle(chart) {
    if (chart.title && Array.isArray(chart.title)) {
        return chart.title.map(part => part.value).join(' ');
    } else if (chart.title && typeof chart.title === 'string') {
        return chart.title;
    }
    return '';
}

export function formatNumbers(num) {
    if (typeof(num) != 'number') return num;
    if (num >= 1000000) num = Math.round(num / 1000000) + 'M';
    if (num >= 1000000000) num = Math.round(num / 1000000000) + 'B';
    return num;
}