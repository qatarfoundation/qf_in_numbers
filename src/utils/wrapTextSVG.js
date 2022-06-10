import * as d3 from 'd3';

export default function wrap(texts, width, center = false) {
    texts.each(function() {
        let text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1, // ems
            x = parseInt(text.attr('x')) ? parseInt(text.attr('x')) : 0,
            y = parseInt(text.attr('y')) ? parseInt(text.attr('y')) : 0,
            dy = parseFloat(text.attr('dy')),
            tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em');
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
