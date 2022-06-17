import ResetSetPassword from "./ResetSetPassword.svelte";

const app = new ResetSetPassword({
  target: document.body,
  props: {
    name: "ResetSetPassword",
  },
});

export default app;