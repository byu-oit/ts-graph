import * as uuid from 'uuid/v4';
import Edge from './edge';
import LinkedList from '../linked-list';
import Node from '../node';

export default class Vertex<T> {
    edges: LinkedList<Edge<T>>;
    value: T;
    key: string;

    constructor(value: T, key?: string) {
        if (value === undefined) {
            throw new Error('Vertex must have a value');
        }

        const edgeComparator = (a: Edge<T>, b: Edge<T>) => {
            if (a.getKey() === b.getKey()) {
                return 0
            }

            return a.getKey() < b.getKey() ? -1 : 1;
        };

        this.key = key === undefined ? uuid() : key;
        this.value = value;
        this.edges = new LinkedList(edgeComparator);
    }

    add(edge: Edge<T>) {
        this.edges.append(edge);
        return this;
    }

    delete(edge: Edge<T>) {
        this.edges.delete(edge)
    }

    getNeighbors() {
        const edges = this.edges.toArray();

        return edges.map((node: Node<Edge<T>>) => {
            return node.value.start === this ? node.value.end : node.value.start;
        });
    }

    getEdges() {
        return this.edges.toArray().map(node => node.value);
    }

    getDegree() {
        return this.edges.toArray().length;
    }

    hasEdge(requireEdge) {
        const edgeNode = this.edges.find(undefined, edge => edge === requireEdge);
        return !!edgeNode;
    }

    hasNeighbor(vertex: Vertex<T>) {
        const vertexNode = this.edges.find(undefined, edge => edge.start === vertex || edge.end === vertex);
        return !!vertex
    }

    findEdge(vertex: Vertex<T>) {
        const edge = this.edges.find(undefined, (edge) => edge.start === vertex || edge.end === vertex);
        return edge ? edge.value : null;
    }

    getKey(): string {
        return this.key;
    }

    getValue(): T {
        return this.value;
    }

    deleteAllEdges() {
        this.getEdges().forEach(edge => this.delete(edge));
        return this;
    }

    toString(callback: (value: T) => string) {
        return callback ? callback(this.value) : `${this.value}`;
    }
}
