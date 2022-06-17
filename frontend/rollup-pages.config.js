import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import css from 'rollup-plugin-css-only';
import sveltePreprocess from "svelte-preprocess";

console.log("Something")

const inputs = [
  "main",
  {
    input: "src/history.js",
    output: { file: "../myapp/static/frontend/bundle_history.js", name: "history"},
    css: "bundle_history.css",
  }, //string defaults to input: src/[name].js and output: public/build/[name].js
  {
    input: "src/account.js",
    output: { file: "../myapp/static/frontend/bundle_account.js", name: "account"},
    css: "bundle_account.css",
  },
  {
    input: "src/password_change.js",
    output: { file: "../myapp/static/frontend/bundle_password_change.js", name: "password_change"},
    css: "bundle_password_change.css",
  },
  {
    input: "src/password_change_done.js",
    output: { file: "../myapp/static/frontend/bundle_password_change_done.js", name: "password_change_done"},
    css: "bundle_password_change_done.css",
  },
  {
    input: "src/password_reset.js",
    output: { file: "../myapp/static/frontend/bundle_password_reset.js", name: "password_reset"},
    css: "bundle_password_reset.css",
  },
  {
    input: "src/password_reset_done.js",
    output: { file: "../myapp/static/frontend/bundle_password_reset_done.js", name: "password_reset_done"},
    css: "bundle_password_reset_done.css",
  },
  {
    input: "src/reset_set_password.js",
    output: { file: "../myapp/static/frontend/bundle_reset_set_password.js", name: "reset_set_password"},
    css: "bundle_reset_set_password.css",
  },
  {
    input: "src/reset_password_complete.js",
    output: { file: "../myapp/static/frontend/bundle_reset_password_complete.js", name: "reset_password_complete"},
    css: "bundle_reset_password_complete.css",
  },
  {
    input: "src/login.js",
    output: { file: "../myapp/static/frontend/bundle_login.js", name: "login"},
    css: "bundle_login.css",
  }, //object for setting more specific values for input and output of roolup configuration
];
const production = !process.env.ROLLUP_WATCH;

console.log("Done")
//!!!
//To change rollup configuration go to createPageRollupExport (function)
//!!!

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn(
        "npm",
        ["run", "start", "--", "--dev"],
        {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        }
      );

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };

  

}
function createPageRollupExport(inp) {
  //nearly default config as in https://github.com/sveltejs/template
  //TODO add possibilty for different option with different inputs and destinations.
  const t = typeof inp;
  const input =
    t === "string"
      ? createPageInputByString(inp)
      : createPageInputByObject(inp);
  const output =
    t === "string"
      ? createPageOutputByString(inp)
      : createPageOutputByObject(inp);
  const cssPath = t === "string" ? createPageCssByString(inp) : createPageCssByObject(inp);

    console.log("Input")
    console.log(input)
    console.log("Output")
    console.log(output)
    console.log("CSS")
    console.log(cssPath)
  let def = {
    input: input,
    output: output,
    plugins: [
        svelte({
          preprocess: sveltePreprocess({ postcss: true }),
            compilerOptions: {
				      // enable run-time checks when not in production
				      dev: !production,
            }
        }),

        css({ output: cssPath }),
        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration -
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        resolve({
            browser: true,
            dedupe: ["svelte"],
        }),
        commonjs(),

        // In dev mode, call `npm run start` once
        // the bundle has been generated
        !production && serve(),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload('../myapp/static/frontend'),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser(),
    ],
    watch: {
        clearScreen: false,
    },
  };

  return def;
}

//#region utilities

function createPageInputByString(inp) {
  return `src/${inp}.js`;
}

function createPageInputByObject(inp) {
  return isStringNotNull(inp.input) ? inp.input : "src/main.js";
}

function createPageCssByString(inp) {
  return `${inp}.css`;
}

function createPageCssByObject(inp) {
  return isStringNotNull(inp.css) ? inp.css : "main.css";
}

function createPageOutputByString(inp) {
  return {
    sourcemap: false,
    format: "iife",
    name: `${inp}`,
    file: `../myapp/static/frontend/${inp}.js`,
  };
}

function createPageOutputByObject(inp) {
  let def = {
    sourcemap: false,
    format: "iife",
    name: "main",
    file: '../myapp/static/frontend/main.js',
  };

  return Object.assign(def, inp.output);
}

function validateInputSettings(inp) {
  return (
    isStringNotNull(inp) ||
    (typeof inp === "object" && inp.input && inp.output && inp.css)
  );
}

function  isStringNotNull(str) {
  return typeof str === "string" && str.length > 0;
}

//#endregion

export default (function () {
    let arrExportRollup = [];

    if (inputs instanceof Array) {
        inputs.forEach((i, index) => {
        if (validateInputSettings(i)) {
            console.log("Watching 1")
            arrExportRollup.push(createPageRollupExport(i));
        } else {
            console.warn(`skipping inputs${index} because of invalidity`);
        }
        });
    } else {
        throw new Error("inputs needs to be type of Array!");
    }
    return arrExportRollup;
})();