import History from "./History.svelte";

const app = new History({
  target: document.body,
  props: {
    name: "History",
  },
});

export default app;