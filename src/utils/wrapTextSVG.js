import * as d3 from 'd3';

export default function wrap(texts, width, center = false, truncate = false) {
    const truncateString = (str, len) => {
        if (str.length > len) {
            if (len <= 3) {
                return str.slice(0, len - 3) + '...';
            }
            else {
                return str.slice(0, len) + '...';
            }
        }
        else {
            return str;
        }
    };
    texts.each(function() {
        const text = d3.select(this);

        let fullText = text.text();
        if (truncate) fullText = truncateString(fullText, truncate);

        const words = fullText.split(/\s+/).reverse();
        let word = null;
        let line = [];
        let lineNumber = 0;
        const lineHeight = 1; // ems
        const x = parseInt(text.attr('x')) ? parseInt(text.attr('x')) : 0;
        const y = parseInt(text.attr('y')) ? parseInt(text.attr('y')) : 0;
        const dy = parseFloat(text.attr('dy'));
        let tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em');

        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(' '));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(' '));
                line = [word];
                tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
            }
        }

        if (center) {
            const heightText = text.node().getBoundingClientRect().height;
            const tspans = d3.select(this).selectAll('tspan');
            tspans.each(function() {
                const tspan = d3.select(this);
                tspan.attr('y', y - (heightText / 2));
            });
        }
    });
}

