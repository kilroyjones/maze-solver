<script lang="ts">
  import type { Coordinate } from "$lib/maze/maze";
  import { mazeStore } from "$lib/stores/maze.store";
  import { onMount, afterUpdate } from "svelte";

  let maze = $mazeStore.maze;
  let width = $mazeStore.width;
  let height = $mazeStore.height;
  let solution: Coordinate[] | undefined = $mazeStore.solution;
  let containerWidth: number = 0;
  let containerHeight: number = 0;
  let cellSize: number = 0;
  let gridElement: HTMLDivElement;

  mazeStore.subscribe(state => {
    maze = state.maze;
    width = state.width;
    height = state.height;
    solution = state.solution;
    maze = maze;
  });

  $: {
    if (containerWidth && containerHeight && width && height) {
      const maxWidth = containerWidth;
      const maxHeight = containerHeight;
      const aspectRatio = width / height;
      if (maxWidth / aspectRatio <= maxHeight) {
        cellSize = Math.floor((maxWidth - 1) / width);
      } else {
        cellSize = Math.floor((maxHeight - 1) / height);
      }
    }
  }

  function compareCoordinates(a: Coordinate, b: Coordinate): boolean {
    return a.x === b.x && a.y === b.y;
  }

  function isInSolution(loc: Coordinate): boolean {
    if (!solution) return false;
    const solutionPath = solution.slice(1, -1);
    return solutionPath.some(pathLoc => pathLoc.x === loc.x && pathLoc.y === loc.y);
  }

  function updateContainerSize() {
    if (gridElement) {
      const rect = gridElement.getBoundingClientRect();
      containerWidth = rect.width;
      containerHeight = rect.height;
    }
  }

  onMount(() => {
    updateContainerSize();
    const resizeObserver = new ResizeObserver(updateContainerSize);
    resizeObserver.observe(gridElement);
    return () => {
      resizeObserver.disconnect();
    };
  });

  afterUpdate(() => {
    updateContainerSize();
  });
</script>

<div class="container flex items-center justify-center w-full h-full p-4" bind:this={gridElement}>
  {#if maze}
    {#key solution}
      <div
        class="grid"
        style="grid-template-columns: repeat({width}, {cellSize}px); grid-template-rows: repeat({height}, {cellSize}px); width: {width *
          cellSize}px; height: {height * cellSize}px;"
      >
        {#each maze.getMazeArray() as row, rowIndex}
          {#each row as cell, colIndex}
            {@const currentLoc = { x: colIndex, y: rowIndex }}
            {#if compareCoordinates(maze.getStart(), currentLoc)}
              <div
                class="flex items-center justify-center font-bold text-white bg-error"
                data-row={rowIndex}
                data-col={colIndex}
              ></div>
            {:else if compareCoordinates(maze.getEnd(), currentLoc)}
              <div
                class="flex items-center justify-center font-bold text-white bg-success"
                data-row={rowIndex}
                data-col={colIndex}
              ></div>
            {:else if isInSolution(currentLoc)}
              <div class="bg-secondary" data-row={rowIndex} data-col={colIndex}></div>
            {:else}
              <div
                class={cell === 1 ? "bg-primary" : "bg-gray-200"}
                data-row={rowIndex}
                data-col={colIndex}
              ></div>
            {/if}
          {/each}
        {/each}
      </div>
    {/key}
  {/if}
</div>

<style>
  .grid {
    display: grid;
    gap: 0;
    overflow: hidden;
  }
  .grid > div {
    aspect-ratio: 1 / 1;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  }
</style>
