<script>
  let projects = [
    {
      name: "example.org",
      success: true,
    },
    {
      name: "example.com",
      success: false,
    }
  ];
</script>

<nav class="projects">
  {#each projects as { name, success }, i}
    <div class="project">
      <span class="project-status">
        <img
          src="/assets/vendor/fontawesome/{ success ? 'check' : 'exclamation' }-circle.svg"
          alt={ success ? 'No errors found in this project' : 'Errors found in this project' }
          decoding="async">
      </span>
      <span class="project-name">{name}</span>
      <span class="project-config">
        <img src="/assets/vendor/fontawesome/cog.svg" alt="Configure {name} project" decoding="async">
      </span>
    </div>
  {/each}
</nav>

<style>
  .project {
    display: grid;
    grid-template-columns: 24px 1fr 24px;

    column-gap: 6px;
    row-gap: 6px;
    padding-right: 6px;
    padding-left: 6px;

    padding-top: 16px;
    padding-bottom: 16px;

    color: #333;
    background-color: var(--basecolor-light);

    border-style: solid;
    border-color: #000000;

    border-top-width: 1px;
    border-bottom-width: 0;
  }

  .project:last-child {
    border-bottom-width: 1px;
  }
  .project-status {
    grid-column: 1 / 2;
    grid-row: 1;
  }
  .project-name {
    grid-column: 2 / 3;
    grid-row: 1;
  }
  .project-config {
    grid-column: 3 / 4;
    grid-row: 1;
  }
</style>
