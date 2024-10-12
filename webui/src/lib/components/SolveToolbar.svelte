<script lang="ts">
  import { mazeStore } from "$lib/stores/maze.store";
  import type { Coordinate } from "$lib/maze/maze";

  let solution: Coordinate[] | undefined = $mazeStore.solution;

  $: {
    solution = $mazeStore.solution;
  }

  function solve() {
    mazeStore.solveMaze();
  }
</script>

<div class="flex items-center justify-center p-4">
  <div class="join">
    <button class="bg-gray-300 btn join-item" on:click={solve}> Solve</button>
  </div>
</div>
