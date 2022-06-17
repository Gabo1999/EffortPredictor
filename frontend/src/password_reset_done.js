import PasswordResetDone from "./PasswordResetDone.svelte";

const app = new PasswordResetDone({
  target: document.body,
  props: {
    name: "PasswordResetDone",
  },
});

export default app;