import PasswordReset from "./PasswordReset.svelte";

const app = new PasswordReset({
  target: document.body,
  props: {
    name: "PasswordReset",
  },
});

export default app;