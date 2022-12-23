class ColorToColor {

    constructor(rgb1, rgb2) {
        this.setColors(rgb1, rgb2);
    }

    setColors(rgb1, rgb2) {
        this.rgb1_original = rgb1;
        this.rgb1 = rgb1;
        this.rgb2 = rgb2;
    }

    reverce() {
        this.setColors(this.rgb2, this.rgb1_original);
    }

    nextRGB(step) {
        let result = [], r, g, b;

        step = step ? step : 1;

        if (this.rgb1_original[0] > this.rgb2[0]) {
            r = this.rgb1[0] - step;
            result.push(r < this.rgb2[0] ? this.rgb2[0] : r);
        } else if (this.rgb1_original[0] < this.rgb2[0]) {
            r = this.rgb1[0] + step;
            result.push(r > this.rgb2[0] ? this.rgb2[0] : r);
        } else {
            result.push(this.rgb1[0]);
        }

        if (this.rgb1_original[1] > this.rgb2[1]) {
            g = this.rgb1[1] - step;
            result.push(g < this.rgb2[1] ? this.rgb2[1] : g);
        } else if (this.rgb1_original[1] < this.rgb2[1]) {
            g = this.rgb1[1] + step;
            result.push(g > this.rgb2[1] ? this.rgb2[1] : g);
        } else {
            result.push(this.rgb1[1]);
        }

        if (this.rgb1_original[2] > this.rgb2[2]) {
            b = this.rgb1[2] - step;
            result.push(b < this.rgb2[2] ? this.rgb2[2] : b);
        } else if (this.rgb1_original[2] < this.rgb2[2]) {
            b = this.rgb1[2] + step;
            result.push(b > this.rgb2[2] ? this.rgb2[2] : b);
        } else {
            result.push(this.rgb1[2]);
        }

        this.rgb1 = result;

        return result;
    }

    isFinish() {
        return JSON.stringify(this.rgb1) == JSON.stringify(this.rgb2);
    }

}

export default ColorToColor;