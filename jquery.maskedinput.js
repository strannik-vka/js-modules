var iPhone = /iphone/i.test(navigator.userAgent),
	caretTimeoutId;

$.mask = {
	definitions: {
		'H': "[0-2]",
		'h': "[0-9]",
		'M': "[0-5]",
		'm': "[0-9]",
		'9': "[0-9]",
		'a': "[A-Za-z]",
		'*': "[A-Za-z0-9]"
	},
	autoclear: true,
	dataName: "rawMaskFn",
	placeholder: '_'
};

$.fn.extend({
	caret: function (begin, end) {
		var range;

		if (this.length === 0 || this.is(":hidden") || this.get(0) !== document.activeElement) {
			return;
		}

		if (typeof begin == 'number') {
			end = (typeof end === 'number') ? end : begin;
			return this.each(function () {
				if (this.setSelectionRange) {
					this.setSelectionRange(begin, end);
				} else if (this.createTextRange) {
					range = this.createTextRange();
					range.collapse(true);
					range.moveEnd('character', end);
					range.moveStart('character', begin);
					range.select();
				}
			});
		} else {
			if (this[0].setSelectionRange) {
				begin = this[0].selectionStart;
				end = this[0].selectionEnd;
			} else if (document.selection && document.selection.createRange) {
				range = document.selection.createRange();
				begin = 0 - range.duplicate().moveStart('character', -100000);
				end = begin + range.text.length;
			}
			return { begin: begin, end: end };
		}
	},
	unmask: function () {
		return this.trigger("unmask");
	},
	mask: function (mask, settings) {
		var input,
			defs,
			tests,
			partialPosition,
			firstNonMaskPos,
			lastRequiredNonMaskPos,
			len,
			oldVal,
			onInputVal;

		if (!mask && this.length > 0) {
			input = $(this[0]);
			var fn = input.data($.mask.dataName)
			return fn ? fn() : undefined;
		}

		settings = $.extend({
			autoclear: $.mask.autoclear,
			placeholder: $.mask.placeholder, // Load default placeholder
			completed: null
		}, settings);


		defs = $.mask.definitions;
		tests = [];
		partialPosition = len = mask.length;
		firstNonMaskPos = null;

		mask = String(mask);

		$.each(mask.split(""), function (i, c) {
			if (c == '?') {
				len--;
				partialPosition = i;
			} else if (defs[c]) {
				tests.push(new RegExp(defs[c]));
				if (firstNonMaskPos === null) {
					firstNonMaskPos = tests.length - 1;
				}
				if (i < partialPosition) {
					lastRequiredNonMaskPos = tests.length - 1;
				}
			} else {
				tests.push(null);
			}
		});

		return this.trigger("unmask").each(function () {
			var input = $(this),
				buffer = $.map(
					mask.split(""),
					function (c, i) {
						if (c != '?') {
							return defs[c] ? getPlaceholder(i) : c;
						}
					}),
				defaultBuffer = buffer.join(''),
				focusText = input.val(),
				isFocus = false;

			function onCompleted() {
				if (settings.completed) {
					for (var i = firstNonMaskPos; i <= lastRequiredNonMaskPos; i++) {
						if (tests[i] && buffer[i] === getPlaceholder(i)) {
							return;
						}
					}

					settings.completed.call(input);
				}
			}

			function getPlaceholder(i) {
				if (i < settings.placeholder.length)
					return settings.placeholder.charAt(i);
				return settings.placeholder.charAt(0);
			}

			function seekNext(pos) {
				while (++pos < len && !tests[pos]);
				return pos;
			}

			function seekPrev(pos) {
				while (--pos >= 0 && !tests[pos]);
				return pos;
			}

			function shiftL(begin, end) {
				var i,
					j;

				if (begin < 0) {
					return;
				}

				for (i = begin, j = seekNext(end); i < len; i++) {
					if (tests[i]) {
						if (j < len && tests[i].test(buffer[j])) {
							buffer[i] = buffer[j];
							buffer[j] = getPlaceholder(j);
						} else {
							break;
						}

						j = seekNext(j);
					}
				}
				writeBuffer();
				input.caret(Math.max(firstNonMaskPos, begin));
			}

			function shiftR(pos) {
				var i,
					c,
					j,
					t;

				for (i = pos, c = getPlaceholder(pos); i < len; i++) {
					if (tests[i]) {
						j = seekNext(i);
						t = buffer[i];
						buffer[i] = c;
						if (j < len && tests[j].test(t)) {
							c = t;
						} else {
							break;
						}
					}
				}
			}

			function clearBuffer(start, end) {
				var i;
				for (i = start; i < end && i < len; i++) {
					if (tests[i]) {
						buffer[i] = getPlaceholder(i);
					}
				}
			}

			function writeBuffer() {
				input.val(buffer.join(''));
			}

			function getPositionMask() {
				var test = input.val(), lastMatch = -1, i, c, pos;

				for (i = 0, pos = 0; i < len; i++) {
					if (tests[i]) {
						buffer[i] = getPlaceholder(i);
						while (pos++ < test.length) {
							c = test.charAt(pos - 1);
							if (tests[i].test(c)) {
								buffer[i] = c;
								lastMatch = i;
								break;
							}
						}
						if (pos > test.length) {
							clearBuffer(i + 1, len);
							break;
						}
					} else {
						if (buffer[i] === test.charAt(pos)) {
							pos++;
						}
						if (i < partialPosition) {
							lastMatch = i;
						}
					}
				}

				return partialPosition ? i : firstNonMaskPos;
			}

			function checkVal(allow) {
				//try to place characters where they belong
				var test = input.val(),
					lastMatch = -1,
					i,
					c,
					pos;

				onInputVal = input.val();

				for (i = 0, pos = 0; i < len; i++) {
					if (tests[i]) {
						buffer[i] = getPlaceholder(i);
						while (pos++ < test.length) {
							c = test.charAt(pos - 1);
							if (tests[i].test(c)) {
								buffer[i] = c;
								lastMatch = i;
								break;
							}
						}
						if (pos > test.length) {
							clearBuffer(i + 1, len);
							break;
						}
					} else {
						if (buffer[i] === test.charAt(pos)) {
							pos++;
						}
						if (i < partialPosition) {
							lastMatch = i;
						}
					}
				}

				var position = partialPosition ? i : firstNonMaskPos;

				if (allow) {
					writeBuffer();
					input.caret(position);
				} else if (lastMatch + 1 < partialPosition) {
					if (settings.autoclear || buffer.join('') === defaultBuffer) {
						// Invalid value. Remove it and replace it with the
						// mask, which is the default behavior.
						if (input.val()) input.val("");
						clearBuffer(0, len);
					} else {
						// Invalid value, but we opt to show the value to the
						// user and allow them to correct their mistake.
						writeBuffer();
						input.caret(position);
					}
				} else {
					writeBuffer();
					input.val(input.val().substring(0, lastMatch + 1));
					input.caret(position);
				}

				return position;
			}

			function isPhoneInput(elem) {
				return elem.attr('data-type-phone') !== undefined ||
					elem.attr('data-mask-phone') !== undefined ||
					elem.attr('type') == 'phone' ||
					(elem.attr('name') ? elem.attr('name').indexOf('phone') > -1 : false);
			}

			function getCursorPos(elem) {
				var input = elem[0],
					r, re, rc,
					pos;

				if (input.selectionStart) {
					pos = input.selectionStart;
				} else if (document.selection) {
					input.focus();

					r = document.selection.createRange();
					if (r === null || typeof r === 'undefined') {
						pos = 0;
					} else {
						re = input.createTextRange();
						rc = re.duplicate();
						re.moveToBookmark(r.getBookmark());
						rc.setEndPoint('EndToStart', re);

						pos = rc.text.length;
					}
				} else {
					pos = 0;
				}

				return pos;
			}

			function isDelteKeys(keyCode) {
				return keyCode === 8 || keyCode === 46 || (iPhone && keyCode === 127);
			}

			function setCursorMaskAnd() {
				setTimeout(function () {
					var cursorPos = getCursorPos(input), pos = getPositionMask();
					if (cursorPos > pos) {
						if (input.caret) input.caret(pos);
					}
				}, 110);
			}

			function unmaskEvent() {
				input
					.off(".mask")
					.removeData($.mask.dataName);
			}

			function focusEvent() {
				if (input.prop("readonly")) {
					return;
				}

				focusText = input.val();

				var pos = checkVal();

				clearTimeout(caretTimeoutId);

				caretTimeoutId = setTimeout(function () {
					if (input.get(0) === document.activeElement) {
						writeBuffer();

						if (pos == mask.replace("?", "").length) {
							input.caret(0, pos);
						} else {
							input.caret(pos);
						}

						isFocus = true;
					}
				}, 100);
			}

			function mousedownEvent() {
				if (isPhoneInput(input) && isFocus) {
					setCursorMaskAnd();
				}
			}

			function blurEvent() {
				isFocus = false;

				checkVal();

				input.trigger('change');
			}

			function keydownEvent(e) {
				if (input.prop("readonly")) {
					return;
				}

				var keyCode = e.which || e.keyCode,
					pos,
					begin,
					end;

				oldVal = input.val();

				if ([38, 39, 40].indexOf(keyCode) > -1) {
					setCursorMaskAnd();
				} else if (isDelteKeys(keyCode)) {
					pos = input.caret();

					if (typeof pos !== 'undefined') {
						begin = pos.begin;
						end = pos.end;

						if (end - begin === 0) {
							begin = keyCode !== 46 ? seekPrev(begin) : (end = seekNext(begin - 1));
							end = keyCode === 46 ? seekNext(end) : end;
						}
						clearBuffer(begin, end);
						shiftL(begin, end - 1);

						e.preventDefault();
					}
				} else if (keyCode === 13) { // enter
					blurEvent.call(this, e);
				} else if (keyCode === 27) { // escape
					input.val(focusText);
					input.caret(0, checkVal());
					e.preventDefault();
				}
			}

			function keypressEvent(e) {
				if (input.prop("readonly")) {
					return;
				}

				var keyCode = e.which || e.keyCode,
					pos = input.caret(),
					p,
					c,
					next;

				if (e.ctrlKey || e.altKey || e.metaKey || keyCode < 32 || typeof pos === 'undefined') {
					return;
				} else if (keyCode && keyCode !== 13) {
					if (pos.end - pos.begin !== 0) {
						clearBuffer(pos.begin, pos.end);
						shiftL(pos.begin, pos.end - 1);
					}

					p = seekNext(pos.begin - 1);
					if (p < len) {
						c = String.fromCharCode(keyCode);
						if (tests[p].test(c)) {
							shiftR(p);

							buffer[p] = c;
							// writeBuffer();
							next = seekNext(p);
						}
					}
					// e.preventDefault();
				}
			}

			function inputEvent() {
				if (input.prop("readonly")) {
					return;
				}

				checkVal(true);
				onCompleted();

				phoneInput.change();
			}

			// Ввод телефона
			var phoneInput = {
				// Проверка на цифру
				isNumber: function (char) {
					return /\d/.test(char);
				},

				// Ввод телефона
				change: function () {
					var oldNumber = new String(oldVal.match(/\d+/g)),
						newNumber = new String(onInputVal.match(/\d+/g)),
						isDelete = newNumber.length < oldNumber.length,
						isAdd = newNumber.length > oldNumber.length;

					if (isDelete) {
						phoneInput.two_click = 0;
					}

					if (
						isPhoneInput(input) &&
						isAdd && isDelete == false && newNumber
					) {
						phoneInput.val = input.val();

						var char = newNumber[newNumber.length - 1];

						if (phoneInput.isNumber(char)) {
							if (phoneInput.allowDelete()) {
								var firstNonMask = input.val().substr(0, firstNonMaskPos);
								input.val(firstNonMask + phoneInput.val + '' + char);
								phoneInput.two_click = 1;
								checkVal();
							}
						}
					}

					onInputVal = '';
				},

				// Можно ли удалять первую цифру
				allowDelete: function () {
					if (getPositionMask() == len) {
						if (phoneInput.two_click == 1 && phoneInput.val == oldVal) {
							phoneInput.val = phoneInput.val.slice(firstNonMaskPos + 1);

							return true;
						}
						phoneInput.two_click = 1;
					} else {
						phoneInput.two_click = 0;
					}

					return false;
				}
			}

			input.data($.mask.dataName, function () {
				return $.map(buffer, function (c, i) {
					return tests[i] && c != getPlaceholder(i) ? c : null;
				}).join('');
			});

			input
				.on("unmask", unmaskEvent)
				.on("focus.mask", focusEvent)
				.on('mousedown.mask', mousedownEvent)
				.on("blur.mask", blurEvent)
				.on("keydown.mask", keydownEvent)
				.on("keypress.mask", keypressEvent)
				.on("input.mask", inputEvent);

			checkVal();
		});
	}
});