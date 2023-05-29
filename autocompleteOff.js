const removeAttr = () => {
    $('[readonly="ac-off"]').each((i, item) => {
        $(item).removeAttr('readonly');
    });
}

$(document).on('click', removeAttr);