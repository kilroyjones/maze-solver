import { Maze } from "./maze";
import { AStarSolver } from "./solvers/astar";
import type { Coordinate } from "./maze";

export enum MazeSolverAlgorithms {
  ASTAR = "astar",
}

/**
 * Implements the A* pathfinding algorithm over a given maze.
 *
 * @description
 * Wraps over the algorithm(s) that can be used to solve the maze. This leaves
 * room open for other algorithms to be implemented by adding them to the enum
 * and calling their respective "findPath" function.
 *
 */
export class MazeSolver {
  private maze: Maze;
  private aStarSolver: AStarSolver;

  constructor(maze: Maze) {
    this.maze = maze;
    this.aStarSolver = new AStarSolver();
  }

  public solve(algorithm: MazeSolverAlgorithms): Coordinate[] | null {
    switch (algorithm) {
      case MazeSolverAlgorithms.ASTAR:
        return this.aStarSolver.findPath(this.maze);
    }
    return null;
  }
}
