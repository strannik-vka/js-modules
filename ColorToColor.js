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

    nextRGB() {
        let result = [];

        if (this.rgb1[0] > this.rgb2[0]) {
            result.push(this.rgb1[0] - 1);
        } else if (this.rgb1[0] < this.rgb2[0]) {
            result.push(this.rgb1[0] + 1);
        } else {
            result.push(this.rgb1[0]);
        }

        if (this.rgb1[1] > this.rgb2[1]) {
            result.push(this.rgb1[1] - 1);
        } else if (this.rgb1[1] < this.rgb2[1]) {
            result.push(this.rgb1[1] + 1);
        } else {
            result.push(this.rgb1[1]);
        }

        if (this.rgb1[2] > this.rgb2[2]) {
            result.push(this.rgb1[2] - 1);
        } else if (this.rgb1[2] < this.rgb2[2]) {
            result.push(this.rgb1[2] + 1);
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