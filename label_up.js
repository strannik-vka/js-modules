$('input.form-control').each(function () {
	if($(this).prev().length){
		if ($(this).prev()[0].tagName == 'LABEL' && $.trim($(this).val())) {
			$(this).prev().addClass('label-up');
		}
	}
});
$(document).on('focus', 'input.form-control', function () {
	if($(this).prev().length){
		if ($(this).prev()[0].tagName == 'LABEL') {
			$(this).prev().addClass('label-up');
		}
	}
}).on('blur', 'input.form-control', function () {
	if($(this).prev().length){
		if ($(this).prev()[0].tagName == 'LABEL' && !$.trim($(this).val())) {
			$(this).prev().removeClass('label-up');
		}
	}
});