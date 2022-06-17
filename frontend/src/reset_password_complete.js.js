import ResetPasswordComplete from "./ResetPasswordComplete.svelte";

const app = new ResetPasswordComplete({
  target: document.body,
  props: {
    name: "ResetPasswordComplete",
  },
});

export default app;