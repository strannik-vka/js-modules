class ThreeSidePercents {

    constructor(object) {
        this.max = {};
        this.setMaxPositions(object);
    }

    setMaxPositions(object) {
        this.max.x = object.x;
        this.max.y = object.y;
        this.max.z = object.z;
    }

    getPercent(num, max) {
        if (max) {
            if (num > max) {
                num = num;
            }

            let coefficient = max / num;

            return 100 / coefficient;
        }

        return null;
    }

    getViewPercent(percent1, percent2, percent3) {
        let maxPercent = percent2 > percent3 ? percent2 : percent3,
            allPercent = percent1 + maxPercent,
            diffPercent = allPercent - 100;

        let result = Math.round(percent1 - (diffPercent / 2));

        if (result > 100) {
            result = 100;
        } else if (result < 0) {
            result = 0;
        }

        return result;
    }

    get(cameraPosition) {
        /*
            [0, 0, 0 >= max], // 1 сторона 
            [0 >= max, 0, 0], // 2 сторона
            [0, 0, -max], // 3 сторона
            [-max, 0, 0], // 4 сторона
            [0, -max, 0], // вниз
            [0, max, 0], // вверх
        */

        let percentZ = this.getPercent(cameraPosition.z, this.max.z),
            percentX = this.getPercent(cameraPosition.x, this.max.x),
            percentY = this.getPercent(cameraPosition.y, this.max.y),
            percentZabs = Math.abs(percentZ),
            percentXabs = Math.abs(percentX),
            percentYabs = Math.abs(percentY),
            viewPercentZ = this.getViewPercent(percentZabs, percentXabs, percentYabs),
            viewPercentX = this.getViewPercent(percentXabs, percentZabs, percentYabs),
            viewPercentY = this.getViewPercent(percentYabs, percentXabs, percentZabs);

        let result = {
            activeNumber: null,
            activePercent: null,
            sides: []
        }

        if (percentZ > 0) {
            // 1
            result.sides.push({
                number: 1,
                percent: viewPercentZ
            })
        }

        if (percentX > 0) {
            // 2
            result.sides.push({
                number: 2,
                percent: viewPercentX
            })
        }

        if (percentZ <= 0) {
            // 3
            result.sides.push({
                number: 3,
                percent: viewPercentZ
            })
        }

        if (percentX <= 0) {
            // 4
            if (percentZ > 0) {
                result.sides.unshift({
                    number: 4,
                    percent: viewPercentX
                })
            } else {
                result.sides.push({
                    number: 4,
                    percent: viewPercentX
                })
            }
        }

        if (percentY > 0) {
            // 5
            result.sides.push({
                number: 5,
                percent: viewPercentY
            })
        }

        if (percentY <= 0) {
            // 6
            result.sides.push({
                number: 6,
                percent: viewPercentY
            })
        }

        result.sides.forEach(side => {
            if (result.activeNumber === null) {
                result.activeNumber = side.number;
                result.activePercent = side.percent;
            } else if (side.percent > result.activePercent) {
                result.activeNumber = side.number;
                result.activePercent = side.percent;
            }
        });

        return result;
    }

}

export default ThreeSidePercents;