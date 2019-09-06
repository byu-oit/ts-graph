import Vertex from '../vertex';

export default class Index<T> {
    public start: Vertex<T>;
    public end: Vertex<T>;
    public weight: number;

    constructor(start: Vertex<T>, end: Vertex<T>, weight: number = 0) {
        this.start = start;
        this.end = end;
        this.weight = weight;
    }

    public getKey() {
        const startKey = this.start.getKey();
        const endKey = this.end.getKey();
        return `${startKey}_${endKey}`;
    }

    public reverse() {
        const temp = this.start;
        this.start = this.end;
        this.end = temp;
    }

    public toString() {
        return this.getKey();
    }
}
