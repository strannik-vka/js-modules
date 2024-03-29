const setInputVal = (input, isPlus) => {
    let number = parseFloat(input.val()), min, max;

    if (isPlus === true) {
        number++;
    }

    if (isPlus === false) {
        number--;
    }

    if (input.attr('min')) {
        min = parseFloat(input.attr('min'));

        if (number < min) {
            number = min;
        }
    }

    if (input.attr('max')) {
        max = parseFloat(input.attr('max'));

        if (number > max) {
            number = max;
        }
    }

    if (isNaN(number)) {
        number = min ? min : 1;
    }

    input.val(number).trigger('change');
}

$(document)
    .on('click', '[data-plus]', (e) => {
        setInputVal($(e.currentTarget).parent().find('[data-count-pm]'), true);
    })
    .on('click', '[data-minus]', (e) => {
        setInputVal($(e.currentTarget).parent().find('[data-count-pm]'), false);
    })
    .on('input', '[data-count-pm]', (e) => {
        setInputVal($(e.currentTarget));
    })