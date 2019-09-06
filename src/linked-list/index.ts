import Node from '../node'
import Comparator from '../util/comparator'

export default class LinkedList<T> {
    head: Node<T> | null = null;
    tail: Node<T> | null = null;
    compare: Comparator<T>;

    constructor(fn?: (a: T, b: T) => number) {
        this.compare = new Comparator(fn)
    }

    prepend(value: T) {
        const node = new Node(value, this.head);
        this.head = node;
        if (!this.tail) {
            this.tail = node;
        }
        return this
    }

    append(value: T) {
        const node = new Node(value);
        if (!this.head) {
            this.head = node;
            this.tail = node;
            return this;
        }
        this.tail.next = node;
        this.tail = node;
        return this
    }

    delete(value: T) {
        if (!this.head) {
            return null;
        }
        let deleted = null;
        while (this.head && this.head.value === value) {
            deleted = this.head;
            this.head = this.head.next;
        }
        let current = this.head;
        if (current !== null) {
            while (current.next) {
                if (current.next.value === value) {
                    deleted = current.next;
                    current.next = current.next.next;
                } else {
                    current = current.next;
                }
            }
        }
        if (this.tail.value === value) {
            this.tail = current;
        }
        return deleted;
    }

    find(value?: T, callback?: (value: T) => boolean) {
        if (!this.head) {
            return null;
        }
        let current = this.head;
        while (current) {
            if (callback && callback(current.value)) {
                return current;
            }
            if (value !== undefined && current.value === value) {
                return current;
            }
            current = current.next;
        }
        return null;
    }

    deleteTail() {
        const deleted = this.tail;
        if (this.head === this.tail) {
            this.head = null;
            this.tail = null;
            return null;
        }
        let current = this.head;
        while (current.next) {
            if (!current.next.next) {
                current.next = null;
            } else {
                current = current.next;
            }
        }
        this.tail = current;
        return deleted;
    }

    deleteHead() {
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
        return deleted
    }

    fromArray(values: T[]) {
        values.forEach(value => this.append(value));
        return this;
    }

    toArray() {
        const nodes: Node<T>[] = [];
        let current = this.head;
        while (current) {
            nodes.push(current);
            current = current.next;
        }
        return nodes;
    }

    toString(callback?: (value: T) => string) {
        return this.toArray().map(node => node.toString(callback)).toString();
    }

    reverse() {
        let current = this.head;
        let previous = null;
        let next = null;
        while (current) {
            next = current.next;
            current.next = previous;
            previous = current;
            current = next;
        }
        this.tail = this.head;
        this.head = previous;
        return this;
    }
}
