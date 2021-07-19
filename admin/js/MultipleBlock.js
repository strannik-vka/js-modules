var MultipleBlock = {

    init: function () {
        MultipleBlock.each();

        $(document)
            .on('click', '[multiple-block-del]', MultipleBlock.del)
            .on('click', '[multiple-block-add]', function () {
                MultipleBlock.add($(this).parents('[multiple-block]'));
            });
    },

    each: function () {
        $('[multiple-block]').each(function (id) {
            $(this).attr('multiple-block', id);

            $(this).find('legend').append('<div multiple-block-add class="multiple_block_icon"><svg viewBox="0 0 16 16"><path d="M7.977 14.963c.407 0 .747-.324.747-.723V8.72h5.362c.399 0 .74-.34.74-.747a.746.746 0 00-.74-.738H8.724V1.706c0-.398-.34-.722-.747-.722a.732.732 0 00-.739.722v5.529h-5.37a.746.746 0 00-.74.738c0 .407.341.747.74.747h5.37v5.52c0 .399.332.723.739.723z"></path></svg></div><div multiple-block-del class="multiple_block_icon"><svg viewBox="0 0 14 14" class="sidebarTrash" style="width: 14px; height: 100%; display: block; fill: rgba(55, 53, 47, 0.4); flex-shrink: 0; backface-visibility: hidden;"><path d="M13.5000308,3.23952 C13.5000308,4.55848168 11.9230308,12.0493 11.9230308,12.0782 C11.9230308,12.6571 9.73825083,14 7.04165083,14 C4.34504083,14 2.16025083,12.6571 2.16025083,12.0782 C2.16025083,12.0541 0.5,4.55799105 0.5,3.23952 C0.5,1.91780104 3.02713083,0 7.03525083,0 C11.0433308,0 13.5000308,1.9178004 13.5000308,3.23952 Z M7,2 C3.625,2 2.5,3.25 2.5,4 C2.5,4.75 3.625,6 7,6 C10.375,6 11.5,4.75 11.5,4 C11.5,3.25 10.375,2 7,2 Z"></path></svg></div>');
        });
    },

    getIndex: function (block) {
        var index = 0;

        block.attr('data-current', 'true');

        $('[multiple-block="' + block.attr('multiple-block') + '"]').each(function (i) {
            if ($(this).attr('data-current')) {
                index = i;
                return false;
            }
        });

        block.removeAttr('data-current');

        return index;
    },

    getName: function (block) {
        var name = block.find('[name]:eq(0)').attr('name');
        name = name.split('[');
        return name[0];
    },

    del: function () {
        var block = $(this).parents('[multiple-block]'),
            count = $('[multiple-block="' + block.attr('multiple-block') + '"]').length,
            isData = false,
            slideUp = function (block, callback) {
                block.slideUp('fast', function () {
                    $(this).remove();
                    if (callback) callback();
                });
            };

        if (count > 1) {
            block.find('[name]').each(function () {
                if ($(this).val() != '') {
                    isData = true;
                    return false;
                }
            });

            if (isData) {
                if (!confirm('Уверены, что хотите удалить?')) return false;
            }

            if (block.find('[file-delete]').length) {
                app.form.fileDelete(block.find('[file-delete]'), {
                    confirm: false,
                    noty: false,
                    success: function () {
                        slideUp(block, function () {
                            app.preloader('Подождите, сохраняю..');
                            app.form.ajax($('#formModal form'), function (json) {
                                if (json && json.success) {
                                    app.item.update(json.success);
                                }
                            });
                        });
                    }
                });
            } else {
                slideUp(block);
            }
        }
    },

    add: function (block, obj) {
        var clone = block.clone().hide(),
            obj = typeof obj !== 'object' || obj == null ? {} : obj;

        if (typeof obj.animate === 'undefined') {
            obj.animate = true;
        }

        clone.find('label[for]').each(function () {
            var label_for = $(this).attr('for'),
                label_for = label_for.split('_uniqid_'),
                label_for = label_for[0],
                label_for_new = label_for + '_uniqid_' + MultipleBlock.uniqid();

            clone.find('[id="' + label_for + '"]').attr('id', label_for_new);

            $(this).attr('for', label_for_new);
        });

        if (obj.after) {
            block.after(clone);
        } else {
            block.before(clone);
        }

        var clone_block = obj.after ? block.next() : block.prev();

        if (obj.animate) {
            clone_block.slideDown('fast');
        } else {
            clone_block.show();
        }

        MultipleBlock.reset(clone_block);
    },

    reset: function (block) {
        block.find('[name]').val('');
        block.find('[type="file"]').trigger('change');
        block.find('[images-list], [files-list]').html('');
        block.find('[type="hidden"][name*="_url"]').val('');
        block.find('[summernote]').summernote('code', '');
        block.find('.selectized').each(function () {
            $(this)[0].selectize.clear();
        });
    },

    uniqid: function () {
        var pr = pr || '', en = en || false, result;

        this.seed = function (s, w) {
            s = parseInt(s, 10).toString(16);
            return w < s.length ? s.slice(s.length - w) :
                (w > s.length) ? new Array(1 + (w - s.length)).join('0') + s : s;
        };

        result = pr + this.seed(parseInt(new Date().getTime() / 1000, 10), 8)
            + this.seed(Math.floor(Math.random() * 0x75bcd15) + 1, 5);

        if (en) result += (Math.random() * 10).toFixed(8).toString();

        return result;
    }

}

$(MultipleBlock.init);

export default MultipleBlock;