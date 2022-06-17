import Account from "./Account.svelte";

const app = new Account({
  target: document.body,
  props: {
    name: "Account",
  },
});

export default app;