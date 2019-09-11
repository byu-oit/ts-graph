import Edge from './edge';
import Vertex from './vertex';

export default class Graph<T> {
    public vertices: { [key: string]: Vertex<T> } = {};
    public edges: { [key: string]: Edge<T> } = {};
    public isDirected = false;

    constructor(isDirected: boolean) {
        this.isDirected = isDirected;
    }

    public addVertex(value: T | Vertex<T>, key?: string) {
        let vertex: Vertex<T>;
        if (!(value instanceof Vertex)) {
            vertex = new Vertex(value, key);
        } else {
            vertex = value;
        }
        this.vertices[vertex.getKey()] = vertex;
        return vertex;
    }

    public getVertexByKey(vertexKey: string) {
        return this.vertices[vertexKey];
    }

    public getNeighbors(vertex: Vertex<T>) {
        return vertex.getNeighbors();
    }

    public getAllVertices() {
        return Object.values(this.vertices);
    }

    public getAllEdges() {
        return Object.values(this.edges);
    }

    public addEdge(start: Vertex<T>, end: Vertex<T>) {
        const value = new Edge<T>(start, end);

        // Try to find and end start vertices.
        let startVertex = this.getVertexByKey(value.start.getKey());
        let endVertex = this.getVertexByKey(value.end.getKey());

        // Insert start vertex if it wasn't inserted.
        if (!startVertex) {
            this.addVertex(value.start);
            startVertex = this.getVertexByKey(value.start.getKey());
        }

        // Insert end vertex if it wasn't inserted.
        if (!endVertex) {
            this.addVertex(value.end);
            endVertex = this.getVertexByKey(value.end.getKey());
        }

        // Check if edge has been already added.
        if (this.edges[value.getKey()]) {
            throw new Error('Edge has already been added before');
        } else {
            this.edges[value.getKey()] = value;
        }

        // Add edge to the vertices.
        if (this.isDirected) {
            // If graph IS directed then add the edge only to start vertex.
            startVertex.add(value);
        } else {
            // If graph ISN'T directed then add the edge to both vertices.
            startVertex.add(value);
            endVertex.add(value);
        }

        return this;
    }

    public deleteEdge(edge: Edge<T>) {
        // Delete edge from the list of edges.
        if (this.edges[edge.getKey()]) {
            delete this.edges[edge.getKey()];
        } else {
            throw new Error('Edge not found in graph');
        }

        // Try to find and end start vertices and delete edge from them.
        const startVertex = this.getVertexByKey(edge.start.getKey());
        const endVertex = this.getVertexByKey(edge.end.getKey());

        startVertex.delete(edge);
        endVertex.delete(edge);
    }

    public findEdge(startVertex: Vertex<T>, endVertex: Vertex<T>) {
        const vertex = this.getVertexByKey(startVertex.getKey());

        if (!vertex) {
            return null;
        }

        return vertex.findEdge(endVertex);
    }

    public getWeight() {
        return this.getAllEdges().reduce((weight, graphEdge) => {
            return weight + graphEdge.weight;
        }, 0);
    }

    public reverse() {
        this.getAllEdges().forEach((edge) => {
            // Delete straight edge from graph and from vertices.
            this.deleteEdge(edge);

            // Reverse the edge.
            edge.reverse();

            // Add reversed edge back to the graph and its vertices.
            this.addEdge(edge.start, edge.end);
        });

        return this;
    }

    public getVerticesIndices() {
        const verticesIndices: { [key: string]: number } = {};
        this.getAllVertices().forEach((vertex, index) => {
            verticesIndices[vertex.getKey()] = index;
        });

        return verticesIndices;
    }

    public getAdjacencyMatrix() {
        const vertices = this.getAllVertices();
        const verticesIndices = this.getVerticesIndices();

        // Init matrix with infinities meaning that there is no ways of
        // getting from one vertex to another yet.
        const adjacencyMatrix: Array<Array<number | null>> = Array(vertices.length).fill(null).map(() => {
            return Array(vertices.length).fill(Infinity);
        });

        // Fill the columns.
        vertices.forEach((vertex, vertexIndex) => {
            vertex.getNeighbors().forEach((neighbor) => {
                const neighborIndex = verticesIndices[neighbor.getKey()];
                // @ts-ignore - edge will not be null in this case
                adjacencyMatrix[vertexIndex][neighborIndex] = this.findEdge(vertex, neighbor).weight;
            });
        });

        return adjacencyMatrix;
    }
}
