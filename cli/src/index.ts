import { MazeGenerator } from "./generator";
import { Coordinate, Maze } from "./maze";
import { MazeSolver, MazeSolverAlgorithms } from "./solver";
import * as fs from "fs";

/**
 * @interface Dimensions
 * @description Represents the dimensions of a maze.
 */
interface Dimensions {
  width: number;
  height: number;
}

/**
 * @class DimensionError
 * @classdesc Custom error class for dimension-related errors.
 */
class DimensionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DimensionError";
  }
}

/**
 * @class MazeManager
 * @classdesc Manages the maze generation, solving, and file operations.
 */
class MazeManager {
  private dimensions: Dimensions | undefined;
  private maze: Maze | undefined;

  /**
   * Parses the dimensions string into a Dimensions object.
   *
   * @param input: string of dimension in form "w,h"
   * @returns Dimensions
   * @throws {DimensionError} If the input is invalid.
   */
  private parseDimensions(input: string): Dimensions {
    let [width, height] = input.split(",").map(Number);
    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      throw new DimensionError(
        "Invalid dimensions. Dimensions should be in width,height form, ie. 31, 31"
      );
    }

    // Ensuring we're working with odd sizes which is necessary for the
    // algorithm to work correctly.
    width = width % 2 == 0 ? width + 1 : width;
    height = height % 2 == 0 ? height + 1 : height;
    return { width, height };
  }

  /**
   * Generates a new maze based on the provided dimensions.
   *
   * @returns void
   */

  private generateMaze(): void {
    if (this.dimensions) {
      const mazeGenerator = new MazeGenerator(this.dimensions.width, this.dimensions.height);
      this.maze = mazeGenerator.generate();
    }
  }

  /**
   * Given a string representing a maze file, creates a Maze object.
   *
   * @param mazeString
   * @returns
   */
  private parseMazeFile(mazeString: string): Maze {
    const lines = mazeString.trim().split("\n");

    if (lines.length === 0) {
      throw new Error("Maze cannot be empty");
    }

    // Check to ensure the maze is a valid rectangular shape
    const lineLength = lines[0].length;
    const allLinesEqualLength = lines.every(line => line.length === lineLength);
    if (!allLinesEqualLength) {
      throw new Error("All lines in the maze must have the same length");
    }

    // Check to make sure maze is a reasonable size
    if (lines.length < 2 || lines[0].length < 2) {
      throw new Error("Maze must be at least 2x2");
    }

    const mazeArray: number[][] = [];
    let start = [-1, -1];
    let end = [-1, -1];

    for (let i = 0; i < lines.length; i++) {
      const row: number[] = [];
      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        switch (char) {
          case "S":
            start = [i, j];
            row.push(0);
            break;
          case "E":
            end = [i, j];
            row.push(0);
            break;
          case "0":
          case "1":
            row.push(parseInt(char));
            break;
          default:
            throw new Error(`Invalid character '${char}' at position (${i}, ${j})`);
        }
      }
      mazeArray.push(row);
    }

    if (start[0] === -1 || end[0] === -1) {
      throw new Error("Start or end position not found in the maze");
    }

    const startLoc: Coordinate = { x: start[1], y: start[0] };
    const endLoc: Coordinate = { x: end[1], y: end[0] };
    return Maze.create(mazeArray, startLoc, endLoc);
  }

  /**
   * Reads a maze from a file.
   *
   * @param filename: string
   * @throws {Error} If the file cannot be read.
   */
  private readMazeFromFile(filename: string): void {
    try {
      const content = fs.readFileSync(filename, "utf-8");
      this.maze = this.parseMazeFile(content);
    } catch (error) {
      throw new Error(
        `Failed to read maze from file: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Solves the current maze using the A* algorithm.
   *
   * @returns The solution as a string representation of the maze with the path, or undefined if no solution is found.
   */
  private solveMaze(): string | undefined {
    if (this.maze) {
      const mazeSolver = new MazeSolver(this.maze);
      const solution = mazeSolver.solve(MazeSolverAlgorithms.ASTAR);
      return solution ? this.maze.draw(solution) : undefined;
    }
    return undefined;
  }

  /**
   * Prints the usage instructions for the CLI.
   *
   * @returns void
   */
  private static printHelp(): void {
    console.log("Usage: ts-node app.ts --dim width,height");
    console.log("   or: ts-node app.ts --file filename");
    console.log("Example: ts-node app.ts --dim 13,17");
    console.log("Example: ts-node app.ts --file maze.txt");
  }

  /**
   * Runs the maze generation and solving process based on command-line arguments.
   *
   * @returns void
   */
  public run(): void {
    const args = process.argv.slice(2);
    const dimIndex = args.indexOf("--dim");
    const fileIndex = args.indexOf("--file");

    if (dimIndex === -1 && fileIndex === -1) {
      console.error("Error: Either --dim or --file parameter is required.");
      MazeManager.printHelp();
      process.exit(1);
    }

    try {
      if (dimIndex !== -1 && dimIndex < args.length - 1) {
        this.dimensions = this.parseDimensions(args[dimIndex + 1]);
        this.generateMaze();
      } else if (fileIndex !== -1 && fileIndex < args.length - 1) {
        this.readMazeFromFile(args[fileIndex + 1]);
      } else {
        throw new Error("Invalid command-line arguments.");
      }

      const solution = this.solveMaze();
      if (solution) {
        console.log(solution);
      } else {
        console.error("No solution found");
      }
    } catch (error) {
      if (error instanceof DimensionError) {
        console.error(error.message);
      } else if (error instanceof Error) {
        console.error("An error occurred:", error.message);
      } else {
        console.error("An unknown error occurred");
      }
      MazeManager.printHelp();
      process.exit(1);
    }
  }
}

/**
 * Program's entry point
 */
function main(): void {
  const mazeManager = new MazeManager();
  mazeManager.run();
}

main();
