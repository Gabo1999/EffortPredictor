import { writable } from 'svelte/store';

console.log("Doing something")

const csrftoken = Cookies.get('csrftoken');

console.log("Doing something 2")
token.set(csrftoken)

export const token = writable([])