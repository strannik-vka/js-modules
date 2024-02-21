class ElementIntersection {

	constructor(selector, runCallback, stopCallback, options) {
		if (typeof stopCallback === 'object' && stopCallback != null) {
			options = stopCallback;
			stopCallback = null;
		}

		options = options ?? {};

		this.rootMargin = options.rootMargin ?? '50% 0px 50% 0px';
		this.isPlay = location.hash ? false : true;
		this.callbacks = {}
		this.observer = null;

		if (selector) {
			this.add(selector, runCallback, stopCallback);
		}

		if (location.hash) {
			$(document).one('scroll-complete', () => {
				this.isPlay = true;
			})
		}
	}

	createObserver() {
		if (this.observer === null) {
			this.observer = new IntersectionObserver((entries) => {
				if (this.isPlay == true) {
					entries.forEach(entry => {
						const name = entry.target.getAttribute('data-intersection');

						if (entry.isIntersecting) {
							if (this.callbacks[name].active == false) {
								this.callbacks[name].active = true;
								this.callbacks[name].run();
							}
						} else {
							if (typeof this.callbacks[name] === 'object' && this.callbacks[name] != null) {
								if (this.callbacks[name].active == true) {
									if (typeof this.callbacks[name].stop === 'function') {
										this.callbacks[name].active = false;
										this.callbacks[name].stop();
									}
								}
							} else {
								this.observer.unobserve(entry.target);
							}
						}
					})
				}
			}, {
				rootMargin: this.rootMargin,
			})
		}
	}

	add(selector, runCallback, stopCallback) {
		let element = document.querySelector(selector);

		if (element) {
			this.createObserver();

			this.callbacks[selector] = {
				run: runCallback,
				stop: typeof stopCallback === 'function' ? stopCallback : null,
				active: false
			}

			element.setAttribute('data-intersection', selector);

			this.observer.observe(element);
		}
	}

	del(selector) {
		let element = document.querySelector(selector);

		if (element) {
			if (this.observer !== null) {
				this.observer.unobserve(element);
			}

			element.removeAttribute('data-intersection');
		}

		if (this.callbacks[selector]) {
			delete this.callbacks[selector];
		}
	}

	destroy() {
		if (this.observer !== null) {
			this.observer.disconnect();
			this.callbacks = {};
			this.observer = null;
			this.isPlay = false;
		}
	}

}

export default ElementIntersection;