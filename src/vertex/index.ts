import * as uuid from 'uuid/v4';
import Edge from '../edge';
import LinkedList from '../linked-list';
import Node from '../node';

export default class Index<T> {
    public edges: LinkedList<Edge<T>>;
    public key: string;
    public value: T;

    constructor(value: T, key?: string) {
        if (value === undefined) {
            throw new Error('Vertex must have a value');
        }

        const edgeComparator = (a: Edge<T>, b: Edge<T>) => {
            if (a.getKey() === b.getKey()) {
                return 0;
            }

            return a.getKey() < b.getKey() ? -1 : 1;
        };

        // Value and key are distinct concepts: value may be any, key must be a string.
        // Using UUID v4 to try to keep unique keys within a collection of vertices.
        this.key = key === undefined ? uuid() : key;
        this.edges = new LinkedList(edgeComparator);
        this.value = value;
    }

    public add(edge: Edge<T>) {
        this.edges.append(edge);
        return this;
    }

    public delete(edge: Edge<T>) {
        this.edges.delete(edge);
    }

    public getNeighbors() {
        const edges = this.edges.toArray();

        // Return either start or end vertex.
        // For undirected graphs it is possible that current vertex will be the end one.
        return edges.map((node: Node<Edge<T>>) => node.value.start === this ? node.value.end : node.value.start);
    }

    public getEdges() {
        return this.edges.toArray().map(node => node.value);
    }

    public getDegree() {
        return this.edges.toArray().length;
    }

    public hasEdge(requiredEdge: Edge<T>) {
        const edgeNode = this.edges.find(undefined, edge => edge === requiredEdge);
        return !!edgeNode;
    }

    public hasNeighbor(vertex: Index<T>) {
        const vertexNode = this.edges.find(undefined, edge => edge.start === vertex || edge.end === vertex);
        return !!vertex;
    }

    public findEdge(vertex: Index<T>) {
        const found = this.edges.find(undefined, (edge) => edge.start === vertex || edge.end === vertex);
        return found ? found.value : null;
    }

    public getKey(): string {
        return this.key;
    }

    public getValue(): T {
        return this.value;
    }

    public deleteAllEdges() {
        this.getEdges().forEach(edge => this.delete(edge));
        return this;
    }

    public toString(callback: (value: T) => string) {
        return callback ? callback(this.value) : `${this.value}`;
    }
}
