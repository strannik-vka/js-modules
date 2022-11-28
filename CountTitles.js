export default (number, titles, numberView) => {
    number = Math.abs(number);

    let result = '';

    if (Number.isInteger(number)) {
        result = titles[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5]];
    } else {
        result = titles[1];
    }

    return numberView ? number + ' ' + result : result;
}