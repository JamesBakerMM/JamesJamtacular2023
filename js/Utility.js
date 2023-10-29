class Utility {
    constructor() {
    }

    static getDifference(v1, v2) {
        if (v1 > v2) {
            return v1-v2;
        } else {
            return v2-v1;
        }
    }

    static getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(this.getDifference(x1, x2), 2) + Math.pow(this.getDifference(y1, y2), 2));
    }
}