import PasswordChange from "./PasswordChange.svelte";

const app = new PasswordChange({
  target: document.body,
  props: {
    name: "PasswordChange",
  },
});

export default app;