declare namespace schema {
  export interface Node {
    name?: string;
    children?: Node[];
  }
  // Circular Reference Pattern
  export interface Circular {
    root?: Node;
  }
}
