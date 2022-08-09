export default function average(elements, number = 0) {
    let sum = 0;

    // taking `number` elements from the end to make the average, if there are not enought, 1
    const lastElements = elements.slice(Math.max(elements.length - number, 1));

    for (let i = 0; i < lastElements.length; i++) {
        sum = sum + lastElements[i];
    }

    return Math.ceil(sum / number);
}
