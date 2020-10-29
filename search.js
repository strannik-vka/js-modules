window.search = {

    selector: {
        list: '[search-list]',
        item: '[search-item]',
        input: '[search-input]'
    },

    timeout: false,

    init: function () {
        $(search.selector.input).on('input', function () {
            search.ajax($(this), search.print);
        });
    },

    ajax: function (elem, callback) {
        var val = $.trim(elem.val());
        if (val) {
            if (search.timeout) clearTimeout(search.timeout);
            search.timeout = setTimeout(function () {
                $(search.selector.list).html('<div class="text-center my-5"><div class="spinner-border text-dark" role="status"><span class="sr-only">Loading...</span></div></div>');
                ajax({
                    url: '/api/search',
                    data: {
                        search: val
                    }
                }, callback);
            }, 800);
        } else {
            callback();
        }
    },

    print: function (json) {
        $(search.selector.list).html('');
        if (json && json.data && json.data.length) {
            $.each(json.data, function (i, item) {
                var html = $(search.selector.item + ':eq(0)').clone();
                html.find('[search-name]').html(item.name);
                html.find('[search-type]').html(item.type);
                html.attr('href', item.url);
                $(search.selector.list).append(html);
            });
        }
    }

}

search.init();