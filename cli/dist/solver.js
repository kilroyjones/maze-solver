"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MazeSolver = void 0;
/**
 * @class MazeSolve
 * @classdesc
 */
class MazeSolver {
    /**
     * @description Constructor
     *
     * @param maze
     */
    constructor(maze) {
        this.maze = maze;
    }
    findPath() {
        const start = this.maze.getStart();
        const end = this.maze.getEnd();
        const queue = [start];
        const visited = new Set();
        const cameFrom = new Map();
        while (queue.length > 0) {
            const current = queue.shift();
            const currentKey = `${current.x},${current.y}`;
            if (current.x === end.x && current.y === end.y) {
                return this.reconstructPath(cameFrom, current);
            }
            if (visited.has(currentKey))
                continue;
            visited.add(currentKey);
            const neighbors = this.getNeighbors(current);
            for (const neighbor of neighbors) {
                const neighborKey = `${neighbor.x},${neighbor.y}`;
                if (!visited.has(neighborKey) && this.maze.isValidMove(neighbor)) {
                    queue.push(neighbor);
                    cameFrom.set(neighborKey, current);
                }
            }
        }
        return null;
    }
    getNeighbors(coord) {
        return [
            { x: coord.x - 1, y: coord.y },
            { x: coord.x + 1, y: coord.y },
            { x: coord.x, y: coord.y - 1 },
            { x: coord.x, y: coord.y + 1 },
        ];
    }
    reconstructPath(cameFrom, current) {
        const path = [current];
        let key = `${current.x},${current.y}`;
        while (cameFrom.has(key)) {
            current = cameFrom.get(key);
            path.unshift(current);
            key = `${current.x},${current.y}`;
        }
        return path;
    }
    solve() {
        const path = this.findPath();
        if (!path) {
            return "No path found";
        }
        return this.maze.formatPath(path);
    }
}
exports.MazeSolver = MazeSolver;
// // Example usage
// const testMaze: Maze = Maze.create(
//   [
//     [0, 1, 0, 0, 0],
//     [0, 1, 0, 1, 0],
//     [0, 0, 0, 1, 0],
//     [0, 1, 1, 1, 0],
//     [0, 1, 0, 0, 0],
//   ],
//   { x: 0, y: 0 },
//   { x: 4, y: 4 }
// );
// const solver = new MazeSolver(testMaze);
// console.log(solver.solve());
