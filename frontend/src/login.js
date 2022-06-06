import Login from "./Login.svelte";

const app = new Login({
  target: document.body,
  props: {
    name: "Login",
  },
});

export default app;