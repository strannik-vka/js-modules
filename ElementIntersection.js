class ElementIntersection {

	constructor(selector, runCallback, stopCallback) {
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
						let entryCallbacks = this.callbacks[entry.target.getAttribute('data-intersection')];

						if (entry.isIntersecting) {
							if (entryCallbacks.active == false) {
								entryCallbacks.active = true;
								entryCallbacks.run();
							}
						} else {
							if (entryCallbacks.active == true) {
								entryCallbacks.active = false;
								entryCallbacks.stop();
							}
						}
					})
				}
			}, {
				rootMargin: '50% 0px 50% 0px',
			})
		}
	}

	add(selector, runCallback, stopCallback) {
		this.createObserver();

		this.callbacks[selector] = {
			run: runCallback,
			stop: typeof stopCallback === 'function' ? stopCallback : () => { },
			active: false
		}

		let element = document.querySelector(selector);

		element.setAttribute('data-intersection', selector);

		this.observer.observe(element);
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