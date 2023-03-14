$(document)
    .on('change', '[name^="poll_"]', (e) => {
        let input = $(e.currentTarget),
            parent = input.parents('.poll'),
            question = input.parents('[poll-question]'),
            answers = parent.find('[poll-answer]'),
            pollId = input.attr('name'),
            token = typeof csrf_token !== 'undefined' ? csrf_token : null,
            url = '/postAddVoicePoll/' + input.attr('data-post-id');

        if (input.parents('[data-action]').length > 0) {
            url = input.parents('[data-action]').attr('data-action');
        }

        $.post(url, {
            _token: token,
            id: pollId,
            key: input.attr('value')
        }, (json) => {
            if (json && json.contents) {
                $.each(json.contents, (id, item) => {
                    if (pollId == id) {
                        $.each(item.value.variants, (i, variant) => {
                            answers.find('[html="percent"]:eq(' + i + ')').html(variant.percent);
                            answers.find('[data-progress]:eq(' + i + ')')
                                .attr('aria-valuenow', variant.percent)
                                .css('width', variant.percent + '%');
                        });

                        return false;
                    }
                });
            }
        }, 'json');

        question.hide();
        answers.show();
    });