export default class Comparator<T> {
    static defaultCompareFunction = (a, b) => {
        if (a === b) {
            return 0;
        }
        return a < b ? -1 : 1;
    };

    compare: (a: T, b: T) => number;

    constructor(fn?: (a: T, b: T) => number) {
        this.compare = fn || Comparator.defaultCompareFunction;
    }

    equal(a: T, b: T) {
        return this.compare(a, b) === 0;
    }

    lessThan(a: T, b: T) {
        return this.compare(a, b) < 0;
    }

    greaterThan(a: T, b: T) {
        return this.compare(a, b) > 0;
    }

    lessThanOrEqual(a: T, b: T) {
        return this.lessThan(a, b) || this.equal(a, b);
    }

    greaterThanOrEqual(a: T, b: T) {
        return this.greaterThan(a, b) || this.equal(a, b);
    }

    reverse() {
        const compareOriginal = this.compare;
        this.compare = (a: T, b: T) => this.compare(b, a);
    }
}
