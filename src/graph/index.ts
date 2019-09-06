import Edge from './edge';
import Vertex from './vertex';

export default class Graph<T> {
    vertices: {[key: string]: Vertex<T>} = {};
    edges: {[key: string]: Edge<T>} = {};
    isDirected = false;

    constructor(isDirected: boolean) {
        this.isDirected = isDirected;
    }

    private toVertex(value: T | Vertex<T>): Vertex<T> {
        if (value instanceof Vertex) {
            return value;
        }
        return new Vertex(value);
    }

    addVertex(value: T | Vertex<T>) {
        value = this.toVertex(value);
        this.vertices[value.getKey()] = value;
        return this;
    }

    getVertexByKey(vertexKey: string) {
        return this.vertices[vertexKey];
    }

    getNeighbors(vertex: Vertex<T>) {
        return vertex.getNeighbors()
    }

    getAllVertices() {
        return Object.values(this.vertices);
    }

    getAllEdges() {
        return Object.values(this.edges);
    }

    addEdge(edge: Edge<T>) {
        let startVertex = this.getVertexByKey(edge.start.getKey());
        let endVertex = this.getVertexByKey(edge.end.getKey());

        if (!startVertex) {
            this.addVertex(edge.start);
            startVertex = this.getVertexByKey(edge.start.getKey());
        }

        if (!endVertex) {
            this.addVertex(edge.end);
            endVertex = this.getVertexByKey(edge.end.getKey());
        }

        if (this.edges[edge.getKey()]) {
            throw new Error('Edge has already been added before');
        } else {
            this.edges[edge.getKey()] = edge;
        }

        if (this.isDirected) {
            startVertex.add(edge);
        } else {
            startVertex.add(edge);
            endVertex.add(edge);
        }

        return this;
    }
}
