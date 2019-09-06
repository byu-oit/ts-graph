import Node from '../node';
import Comparator from '../util/comparator';

export default class LinkedList<T> {
    public head: Node<T> | null = null;
    public tail: Node<T> | null = null;
    public compare: Comparator<T>;

    constructor(fn?: (a: T, b: T) => number) {
        this.compare = new Comparator(fn);
    }

    public prepend(value: T) {
        // Make new node to be a head.
        const newHead = new Node(value, this.head);
        this.head = newHead;

        // If there is no tail yet let's make new node a tail.
        if (!this.tail) {
            this.tail = newHead;
        }

        return this;
    }

    public append(value: T) {
        const node = new Node(value);

        // If there is no head or tail yet let's make new node a head and the tail.
        if (!this.head || !this.tail) {
            this.head = node;
            this.tail = node;
        } else { // Otherwise, attach new node to the end of linked list.
            this.tail.next = node;
            this.tail = node;
        }

        return this;
    }

    public delete(value: T) {
        if (!this.head || !this.tail) {
            return null;
        }

        let deleted = null;

        // If the head must be deleted then make next node that is differ
        // from the head to be a new head.
        while (this.head && this.compare.equal(this.head.value, value)) {
            deleted = this.head;
            this.head = this.head.next;
        }

        let current = this.head;

        if (current !== null) {
            // If next node must be deleted then make next node to be a next next one.
            while (current.next) {
                if (current.next.value === value) {
                    deleted = current.next;
                    current.next = current.next.next;
                } else {
                    current = current.next;
                }
            }
        }

        if (this.compare.equal(this.tail.value, value)) {
            this.tail = current;
        }

        return deleted;
    }

    public find(value?: T, callback?: (value: T) => boolean) {
        if (!this.head || !this.tail) {
            return null;
        }

        let current: Node<T> | null = this.head;

        while (current) {
            // If callback is specified then try to find node by callback.
            if (callback && callback(current.value)) {
                return current;
            }

            // If value is specified then try to compare by value.
            if (value !== undefined && current.value === value) {
                return current;
            }

            current = current.next;
        }

        return null;
    }

    public deleteTail() {
        const deleted = this.tail;

        if (this.head === this.tail) {
            // There is only one node in linked list.
            this.head = null;
            this.tail = null;

            return deleted;
        }

        // If there are many nodes in linked list...

        // Rewind to the last node and delete "next" link for the node before the last one.
        let current = this.head;
        while (current && current.next) {
            if (!current.next.next) {
                current.next = null;
            } else {
                current = current.next;
            }
        }

        this.tail = current;

        return deleted;
    }

    public deleteHead() {
        if (!this.head) {
            return null;
        }
        const deleted = this.head;
        if (this.head.next) {
            this.head = this.head.next;
        } else {
            this.head = null;
            this.tail = null;
        }
        return deleted;
    }

    public fromArray(values: T[]) {
        values.forEach(value => this.append(value));
        return this;
    }

    public toArray() {
        const nodes: Array<Node<T>> = [];
        let current = this.head;
        while (current) {
            nodes.push(current);
            current = current.next;
        }
        return nodes;
    }

    public toString(callback?: (value: T) => string) {
        return this.toArray().map(node => node.toString(callback)).toString();
    }

    public reverse() {
        let current = this.head;
        let previous = null;
        let next = null;

        while (current) {
            // Store next node.
            next = current.next;

            // Change next node of the current node so it would link to previous node.
            current.next = previous;

            // Move prevNode and currNode nodes one step forward.
            previous = current;
            current = next;
        }

        // Reset head and tail.
        this.tail = this.head;
        this.head = previous;

        return this;
    }
}
