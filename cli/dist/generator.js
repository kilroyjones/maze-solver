"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MazeGenerator = void 0;
const maze_1 = require("./maze");
// Directions used in function shuffleDirections
const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
];
/**
 * @class MazeGenerator
 * @classdesc Generates mazes use depth-first search
 */
class MazeGenerator {
    /**
     * Constructor assigning width and height and our initial fill maze.
     *
     * @param width
     * @param height
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.mazeArray = Array(height)
            .fill(null)
            .map(() => Array(width).fill(1));
    }
    /**
     * Entry location for maze generation starting from a random location.
     *
     * @returns Maze
     */
    generate() {
        const startCell = {
            x: 1 + Math.floor(Math.random() * Math.floor((this.width - 1) / 2)) * 2,
            y: 1 + Math.floor(Math.random() * Math.floor((this.height - 1) / 2)) * 2,
        };
        this.recursiveBacktrack(startCell);
        const [start, end] = this.createStartAndEnd();
        return maze_1.Maze.create(this.mazeArray, start, end);
    }
    /**
     * Performs a depth-first maze creation. See README for detailed explanation
     * of this algorithm.
     *
     * @param loc: Location
     */
    recursiveBacktrack(loc) {
        this.mazeArray[loc.y][loc.x] = 0;
        const directions = this.shuffleDirections();
        for (const [dx, dy] of directions) {
            const newX = loc.x + dx * 2;
            const newY = loc.y + dy * 2;
            if (this.isValidLocation(newX, newY) && this.mazeArray[newY][newX] === 1) {
                this.mazeArray[loc.y + dy][loc.x + dx] = 0;
                this.recursiveBacktrack({ x: newX, y: newY });
            }
        }
    }
    /**
     * Checks if cells is within the bounds of the maze.
     *
     * @param x: number
     * @param y: number
     * @returns boolean
     */
    isValidLocation(x, y) {
        return x > 0 && x < this.width - 1 && y > 0 && y < this.height - 1;
    }
    /**
     * Simple shuffling algorithm to randomize directions taken by DFS
     *
     * @returns
     */
    shuffleDirections() {
        for (let i = directions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [directions[i], directions[j]] = [directions[j], directions[i]];
        }
        return directions;
    }
    /**
     * Defines our start and end points of the maze.
     *
     * @description
     * We ensure the maze starts on two different sides and the set those points
     * to be passable.
     *
     * @returns [Location, Location]
     */
    createStartAndEnd() {
        const sides = ["top", "right", "bottom", "left"];
        const [startSide, endSide] = sides.sort(() => Math.random() - 0.5).slice(0, 2);
        const start = this.createStartEndLocation(startSide);
        const end = this.createStartEndLocation(endSide);
        this.mazeArray[start.y][start.x] = 0;
        this.mazeArray[end.y][end.x] = 0;
        return [start, end];
    }
    /**
     * Ensures the location selected for start or end is valid
     *
     * @description
     * We are always selecting points along the walls of the maze, but we can't
     * ensure that these aren't bordeded by impassable cells on all three sides.
     * To attempt to avoid that we randomly select points along that chosen side
     * and then keep choosing until we get a location that works.
     *
     * @remarks
     * This is hacky, but should be almost all the time. An alternative would be
     * to check the wall for all valid spots and then choose one of those
     * randomly. In this case, that would probably take more time than this method.
     *
     * @param side: string
     * @returns Location
     */
    createStartEndLocation(side) {
        let loc;
        let isValid = false;
        let attempts = 0;
        const maxAttempts = 100; // Used in case there's no valid location
        while (!isValid && attempts < maxAttempts) {
            loc = this.getRandomSideLocation(side);
            isValid = this.isValidStartEndPoint(loc);
            attempts++;
        }
        if (!isValid) {
            throw new Error(`Failed to create usable maze`);
        }
        return loc;
    }
    /**
     * Given a side, it will choose a random location along a given side.
     *
     * @param side: string
     * @returns Location
     */
    getRandomSideLocation(side) {
        switch (side) {
            case "top":
                return { x: 1 + Math.floor(Math.random() * (this.width - 2)), y: 0 };
            case "right":
                return { x: this.width - 1, y: 1 + Math.floor(Math.random() * (this.height - 2)) };
            case "bottom":
                return { x: 1 + Math.floor(Math.random() * (this.width - 2)), y: this.height - 1 };
            case "left":
                return { x: 0, y: 1 + Math.floor(Math.random() * (this.height - 2)) };
            default:
                throw new Error("Invalid side");
        }
    }
    /**
     *
     * @param location
     * @returns
     */
    isValidStartEndPoint(location) {
        var _a, _b, _c, _d, _e, _f;
        const { x, y } = location;
        const surroundingWalls = [
            (_b = (_a = this.mazeArray[y - 1]) === null || _a === void 0 ? void 0 : _a[x]) !== null && _b !== void 0 ? _b : 1,
            (_d = (_c = this.mazeArray[y + 1]) === null || _c === void 0 ? void 0 : _c[x]) !== null && _d !== void 0 ? _d : 1,
            (_e = this.mazeArray[y][x - 1]) !== null && _e !== void 0 ? _e : 1,
            (_f = this.mazeArray[y][x + 1]) !== null && _f !== void 0 ? _f : 1,
        ].filter(cell => cell === 1).length;
        return surroundingWalls <= 2;
    }
}
exports.MazeGenerator = MazeGenerator;
