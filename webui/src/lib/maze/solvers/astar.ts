import { Maze } from "../maze";
import type { Coordinate } from "../maze";

/**
 * Implementation of the A* pathfinding algorithm over a given maze.
 *
 * @description
 * The A* algorithm works by tracking two separate costs for each given node.
 * These are known as gScore and fScore, where the former is the
 * cost of the path up to that point and the fScore is the gScore plus the
 * estimated cost of reaching the target. The A* algorithm is essentially the
 * same as Dijkstra's in that it uses a priority queue to keep track of the
 * current best node (i.e., path end) to look at.
 *
 * @remarks
 *
 */
export class AStarSolver {
  /**
   * Given a Maze object, it will return a list of Coordinates denoting the path
   * from start to end.
   *
   * @param maze Maze
   * @returns
   */
  public findPath(maze: Maze): Coordinate[] | null {
    const start: Coordinate = maze.getStart();
    const end: Coordinate = maze.getEnd();

    const openSet = new PriorityQueue<Coordinate>();
    openSet.enqueue(start, 0);

    const parentMap = new Map<string, Coordinate>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();

    // Set our start coordinate scores
    gScore.set(this.coordinateToString(start), 0);
    fScore.set(this.coordinateToString(start), this.heuristic(start, end));

    while (!openSet.isEmpty()) {
      const current = openSet.dequeue()!;

      // Check for end
      if (current.x === end.x && current.y === end.y) {
        return this.buildPath(parentMap, current);
      }

      const neighbors = this.getNeighbors(current);
      for (const neighbor of neighbors) {
        if (!maze.isValidMove(neighbor)) {
          continue;
        }

        // We use ! to avoid typscript errors since we know that anything on the
        // queue will also have a valid gScore. Note the adding of 1 to the gScore.
        const tentativeGScore = gScore.get(this.coordinateToString(current))! + 1;
        const neighborKey = this.coordinateToString(neighbor);

        // If there is no existing gScore for the neighboring node, or if score
        // of the current node is less than than that of the neighbor, we need
        // to update the neighbor's score.
        if (!gScore.has(neighborKey) || tentativeGScore < gScore.get(neighborKey)!) {
          // Set that neighbor to point back at the current node
          parentMap.set(neighborKey, current);

          // Update the neighbor's gScore
          gScore.set(neighborKey, tentativeGScore);

          // Update the neighbor's fScore and requeue it. Note, that this method
          // will lead to some nodes being queue multiple times with different
          // scores, but we'll only really care about the one with the lowest
          // overall score. There are implementations that avoid this.
          const f = tentativeGScore + this.heuristic(neighbor, end);
          fScore.set(neighborKey, f);
          openSet.enqueue(neighbor, f);
        }
      }
    }

    return null;
  }

  /**
   * A simple Manhattan distance heuristic
   *
   * @param a Coordinate
   * @param b Coordinate
   * @returns number
   */
  private heuristic(a: Coordinate, b: Coordinate): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  /**
   * Used to create string keys for hash maps
   *
   * @param coord Coordinate
   * @returns string
   */
  private coordinateToString(coord: Coordinate): string {
    return `${coord.x},${coord.y}`;
  }

  /**
   * Gets all possible neighbors of a given coordinate.
   *
   * @param coord Coordinate
   * @returns Coordinate[]
   */
  private getNeighbors(coord: Coordinate): Coordinate[] {
    return [
      { x: coord.x - 1, y: coord.y },
      { x: coord.x + 1, y: coord.y },
      { x: coord.x, y: coord.y - 1 },
      { x: coord.x, y: coord.y + 1 },
    ];
  }

  /**
   */

  /**
   * This builds our path, starting from the current (end) node and working its
   * way back to the start.
   *
   * @param parentMap Map<string, Coordinate>
   * @param current Coordinate
   * @returns Coordinate[]
   */
  private buildPath(parentMap: Map<string, Coordinate>, currentCoord: Coordinate): Coordinate[] {
    const path = [currentCoord];
    let key = this.coordinateToString(currentCoord);
    while (parentMap.has(key)) {
      currentCoord = parentMap.get(key)!;
      path.unshift(currentCoord);
      key = this.coordinateToString(currentCoord);
    }
    return path;
  }
}

/**
 * @class PriorityQueue
 * @classdesc Priority queue implementation used for A*
 *
 * @remarks
 * We could have made this non-generic, given that we're only used it for
 * Coordinates
 *
 */
class PriorityQueue<T> {
  private elements: [T, number][] = [];

  /**
   * Enqueue the next item
   *
   * @remarks
   * I'm not sure how great using "sort" is here when insert a single item into
   * an already sorted list. A simple for loop might be better.
   *
   * @param element: T
   * @param priority: number
   */
  enqueue(element: T, priority: number): void {
    this.elements.push([element, priority]);
    this.elements.sort((a, b) => a[1] - b[1]);
  }

  /**
   * Removes an item from the queue
   *
   * @returns T | undefined
   */
  dequeue(): T | undefined {
    return this.elements.shift()?.[0];
  }

  /**
   * Check is queue is empty
   *
   * @returns boolean
   */
  isEmpty(): boolean {
    return this.elements.length === 0;
  }
}
