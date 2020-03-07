<script>
  import Errors from "./Errors.svelte";
  import Projects from "./Projects.svelte";

  let project = "exampleorg";
</script>

<div class="container">
  <header class="header">
    <h1 style="margin-left: 12px;">SiteGazer</h1>
  </header>

  <Projects/>
  <Errors project={project}/>

  <footer class="footer">
    <div class="social-links">
      <a href="https://github.com/phanect/sitegazer">
        <img src="/assets/vendor/octicons/mark-github.svg" alt="GitHub" decoding="async">
      </a>
    </div>
    <p class="copyright">&copy; 2020 Jumpei Ogawa</p>
  </footer>
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: 180px 1fr;
    grid-template-rows: 60px 1fr 115px;

    column-gap: 24px;
    row-gap: 24px;
  }

  .header {
    grid-column: 1 / 3;
    grid-row: 1;

    background-color: var(--basecolor-lightest);
  }

  .projects {
    grid-column: 1;
    grid-row: 2;

    border-right: var(--border);
  }

  .errors {
    grid-column: 2;
    grid-row: 2;
  }

  .footer {
    grid-column: 1 / 3;
    grid-row: 3;

    padding-top: 12px;
    padding-bottom: 12px;

    border-top: var(--border);
  }
  .footer > .social-links {
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }
  .footer > .social-links img {
    width: 48px;
    height: 48px;
  }
  .footer > .copyright {
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
