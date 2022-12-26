class MixColors {

	get(rgb1, rgb2, percent1, percent2) {
		let red = this.mix(rgb1[0], rgb2[0], percent1, percent2),
			green = this.mix(rgb1[1], rgb2[1], percent1, percent2),
			blue = this.mix(rgb1[2], rgb2[2], percent1, percent2);

		return [red, green, blue];
	}

	mix(number1, number2, percent1, percent2) {
		let percent;

		if (number1 < number2) {
			if (percent1 > percent2) {
				percent = 100 - percent1;
			} else {
				percent = percent2;
			}
		} else {
			if (percent1 < percent2) {
				percent = 100 - percent2;
			} else {
				percent = percent1;
			}
		}

		let diff = Math.abs(number1 - number2);

		let number = diff * percent / 100;

		return Math.round(number1 > number2 ? number2 + number : number1 + number);
	}

}

export default new MixColors();