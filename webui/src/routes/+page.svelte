<script lang="ts">
  import Maze from "$lib/components/Maze.svelte";
  import GenerateToolbar from "$lib/components/GenerateToolbar.svelte";
  import SolveToolbar from "$lib/components/SolveToolbar.svelte";
</script>

<div class="flex flex-col min-h-screen lg:flex-row">
  <div class="hidden p-4 lg:block lg:w-1/6"></div>
  <div class="flex flex-col w-full h-screen p-4 lg:w-2/3">
    <div class="flex-shrink-0 mb-4">
      <GenerateToolbar />
    </div>
    <div class="flex items-center justify-center flex-1 min-h-0 overflow-auto">
      <Maze />
    </div>
    <div class="flex-shrink-0 mt-4">
      <SolveToolbar />
    </div>
  </div>
  <div class="hidden p-4 lg:block md:w-1/6"></div>
</div>
