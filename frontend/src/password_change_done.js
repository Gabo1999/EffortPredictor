import PasswordChangeDone from "./PasswordChangeDone.svelte";

const app = new PasswordChangeDone({
  target: document.body,
  props: {
    name: "PasswordChangeDone",
  },
});

export default app;