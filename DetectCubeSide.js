class DetectCubeSide {
    constructor(x, y, z) {
        this.max = {};
        this.setMaxPositions(x, y, z);
    }

    setMaxPositions(x, y, z) {
        this.max.x = x;
        this.max.y = y;
        this.max.z = z;
    }

    getPercent(num, max) {
        let coefficient = max / num;
        return 100 / coefficient;
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

        let sideZ = this.getPercent(cameraPosition.z, this.max.z),
            sideX = this.getPercent(cameraPosition.x, this.max.x),
            sideY = this.getPercent(cameraPosition.y, this.max.y);

        let result = {
            number: 0,
            percent: 0,
        };

        if (sideZ >= 0 && sideX >= 0) {
            if (sideZ > sideX) {
                result.number = 1;
                result.percent = sideZ;
            } else {
                result.number = 2;
                result.percent = sideX;
            }
        } else if (sideX >= 0 && sideZ <= 0) {
            if (sideX > Math.abs(sideZ)) {
                result.number = 2;
                result.percent = sideX;
            } else {
                result.number = 3;
                result.percent = Math.abs(sideZ);
            }
        } else if (sideZ <= 0 && sideX <= 0) {
            if (sideZ < sideX) {
                result.number = 3;
                result.percent = Math.abs(sideZ);
            } else {
                result.number = 4;
                result.percent = Math.abs(sideX);
            }
        } else if (sideZ >= 0 && sideX <= 0) {
            if (sideZ > Math.abs(sideX)) {
                result.number = 1;
                result.percent = sideZ;
            } else {
                result.number = 4;
                result.percent = Math.abs(sideX);
            }
        }

        if (Math.abs(sideY) > result.percent) {
            result.number = sideY > 0 ? 5 : 6;
            result.percent = Math.abs(sideY);
        }

        return result;
    }
}

export default DetectCubeSide;