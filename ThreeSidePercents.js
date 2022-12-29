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

        return percent1 - (diffPercent / 2);
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
            sides: [
                {
                    number: percentZ > 0 ? 1 : 3,
                    percent: viewPercentZ
                },
                {
                    number: percentX > 0 ? 2 : 4,
                    percent: viewPercentX
                },
                {
                    number: percentY > 0 ? 5 : 6,
                    percent: viewPercentY
                }
            ]
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