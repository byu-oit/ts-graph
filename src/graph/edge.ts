import Vertex from './vertex';

export default class Edge<T> {
    start: Vertex<T>;
    end: Vertex<T>;
    weight: number = 0;

    constructor(start: Vertex<T>, end: Vertex<T>, weight?: number) {
        this.start = start;
        this.end = end;
        this.weight = weight;
    }

    getKey() {
        const startKey = this.start.getKey();
        const endKey = this.end.getKey();
        return `${startKey}_${endKey}`
    }

    reverse() {
        const temp = this.start;
        this.start = this.end;
        this.end = temp;
    }

    toString() {
        return this.getKey();
    }
}
