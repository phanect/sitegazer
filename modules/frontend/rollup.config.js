import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";
import livereload from "rollup-plugin-livereload";
import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser";

const isProd = (process.env.NODE_ENV === "production");

function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;

        require("child_process").spawn("npm", [ "run", "start", "--", "--dev" ], {
          stdio: [ "ignore", "inherit", "inherit" ],
          shell: true,
        });
      }
    },
  };
}

export default {
  input: "src/main.js",
  output: {
    sourcemap: !isProd,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },
  plugins: [
    copy({
      targets: [].concat(
        [
          "cog",
          "check-circle",
          "exclamation-circle",
          "desktop",
          "mobile-alt",
        ].map(iconName => ({
          src: `node_modules/@fortawesome/fontawesome-free/svgs/solid/${iconName}.svg`,
          dest: "public/assets/vendor/fontawesome/",
        })),
        [
          "mark-github",
        ].map(iconName => ({
          src: `node_modules/@primer/octicons/build/svg/${iconName}.svg`,
          dest: "public/assets/vendor/octicons/",
        })),
      ),
    }),
    svelte({
      // enable run-time checks when not in production
      dev: !isProd,
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css: css => {
        css.write("public/build/bundle.css");
      },
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: [ "svelte" ],
    }),
    commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !isProd && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !isProd && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    isProd && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
