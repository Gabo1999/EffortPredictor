<script>
//	export let name;
	import Tailwindcss from './Tailwindcss.svelte';

	let errorMessage;
	let responseText;
	let responseSomething;
	function downloadHistory() {
        fetch('http://127.0.0.1:8000/history/all/')
		.then(response => {
            if (response.ok) {
				console.log(response)
				response.json().then(function(text) {
					responseSomething = text['profiles'];
				})
				/*response.text().then(function(text) {
					var obj = JSON.parse(text);
					responseSomething = obj['profiles']
					console.log(responseSomething);
					//responseText = text;
				})*/
				} else {
					console.error('Error:', response.statusText);
					response.text().then(function(text) {
						var obj = JSON.parse(text);
						errorMessage = obj['Error'];
					})
				}
        }).catch((error) => {
            //responseText = error;
        })
    }
	downloadHistory();
</script>

<Tailwindcss />
<body class="flex flex-col h-full">
	<header class="text-gray-600 body-font">
		<div class=" mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
			<!-- svelte-ignore a11y-missing-attribute -->
			<a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
				<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
				</svg>
				<span class="ml-3 text-xl">Tailblocks</span>
			</a>
			<nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">
				<!-- svelte-ignore a11y-missing-attribute -->
				<a class="mr-5 hover:text-gray-900">First Link</a>
				<!-- svelte-ignore a11y-missing-attribute -->
				<a class="mr-5 hover:text-gray-900">Second Link</a>
				<!-- svelte-ignore a11y-missing-attribute -->
				<a class="mr-5 hover:text-gray-900">Third Link</a>
				<!-- svelte-ignore a11y-missing-attribute -->
				<a class="mr-5 hover:text-gray-900">Fourth Link</a>
			</nav>
			<button class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Button
				<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
				<path d="M5 12h14M12 5l7 7-7 7"></path>
				</svg>
			</button>
		</div>
	</header>
	<main class="grow">
		<section class="text-gray-600 body-font overflow-hidden">
			<div class="container px-0 py-10 mx-auto">
				<div class="-my-8 divide-y-2 divide-gray-100">
					<div class="container px-5 py-4 mx-auto">
						<div class="text-center mb-10">
							<h1 class="sm:text-3xl text-2xl font-medium text-center title-font text-gray-900 mb-4">Entries History</h1>
						</div>
						<div class="flex flex-wrap -m-4 text-center">
							<div class="p-4 pr-1 sm:w-1/2 w-1/2">
								<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" class="text-indigo-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 20 24">
									<path fill="none" d="M16.254,3.399h-0.695V3.052c0-0.576-0.467-1.042-1.041-1.042c-0.576,0-1.043,0.467-1.043,1.042v0.347H6.526V3.052c0-0.576-0.467-1.042-1.042-1.042S4.441,2.476,4.441,3.052v0.347H3.747c-0.768,0-1.39,0.622-1.39,1.39v11.813c0,0.768,0.622,1.39,1.39,1.39h12.507c0.768,0,1.391-0.622,1.391-1.39V4.789C17.645,4.021,17.021,3.399,16.254,3.399z M14.17,3.052c0-0.192,0.154-0.348,0.348-0.348c0.191,0,0.348,0.156,0.348,0.348v0.347H14.17V3.052z M5.136,3.052c0-0.192,0.156-0.348,0.348-0.348S5.831,2.86,5.831,3.052v0.347H5.136V3.052z M16.949,16.602c0,0.384-0.311,0.694-0.695,0.694H3.747c-0.384,0-0.695-0.311-0.695-0.694V7.568h13.897V16.602z M16.949,6.874H3.052V4.789c0-0.383,0.311-0.695,0.695-0.695h12.507c0.385,0,0.695,0.312,0.695,0.695V6.874z M5.484,11.737c0.576,0,1.042-0.467,1.042-1.042c0-0.576-0.467-1.043-1.042-1.043s-1.042,0.467-1.042,1.043C4.441,11.271,4.908,11.737,5.484,11.737z M5.484,10.348c0.192,0,0.347,0.155,0.347,0.348c0,0.191-0.155,0.348-0.347,0.348s-0.348-0.156-0.348-0.348C5.136,10.503,5.292,10.348,5.484,10.348z M14.518,11.737c0.574,0,1.041-0.467,1.041-1.042c0-0.576-0.467-1.043-1.041-1.043c-0.576,0-1.043,0.467-1.043,1.043C13.475,11.271,13.941,11.737,14.518,11.737z M14.518,10.348c0.191,0,0.348,0.155,0.348,0.348c0,0.191-0.156,0.348-0.348,0.348c-0.193,0-0.348-0.156-0.348-0.348C14.17,10.503,14.324,10.348,14.518,10.348z M14.518,15.212c0.574,0,1.041-0.467,1.041-1.043c0-0.575-0.467-1.042-1.041-1.042c-0.576,0-1.043,0.467-1.043,1.042C13.475,14.745,13.941,15.212,14.518,15.212z M14.518,13.822c0.191,0,0.348,0.155,0.348,0.347c0,0.192-0.156,0.348-0.348,0.348c-0.193,0-0.348-0.155-0.348-0.348C14.17,13.978,14.324,13.822,14.518,13.822z M10,15.212c0.575,0,1.042-0.467,1.042-1.043c0-0.575-0.467-1.042-1.042-1.042c-0.576,0-1.042,0.467-1.042,1.042C8.958,14.745,9.425,15.212,10,15.212z M10,13.822c0.192,0,0.348,0.155,0.348,0.347c0,0.192-0.156,0.348-0.348,0.348s-0.348-0.155-0.348-0.348C9.653,13.978,9.809,13.822,10,13.822z M5.484,15.212c0.576,0,1.042-0.467,1.042-1.043c0-0.575-0.467-1.042-1.042-1.042s-1.042,0.467-1.042,1.042C4.441,14.745,4.908,15.212,5.484,15.212z M5.484,13.822c0.192,0,0.347,0.155,0.347,0.347c0,0.192-0.155,0.348-0.347,0.348s-0.348-0.155-0.348-0.348C5.136,13.978,5.292,13.822,5.484,13.822z M10,11.737c0.575,0,1.042-0.467,1.042-1.042c0-0.576-0.467-1.043-1.042-1.043c-0.576,0-1.042,0.467-1.042,1.043C8.958,11.271,9.425,11.737,10,11.737z M10,10.348c0.192,0,0.348,0.155,0.348,0.348c0,0.191-0.156,0.348-0.348,0.348s-0.348-0.156-0.348-0.348C9.653,10.503,9.809,10.348,10,10.348z"></path>
								</svg>
								<p class="leading-relaxed">Date</p>
							</div>
							<div class="p-4 pr-16 sm:w-1/2 w-1/2">
								<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" class="text-indigo-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 18 24">
									<path fill="none" d="M19.521,7.267c-0.144-0.204-0.38-0.328-0.631-0.328h-3.582l-0.272-1.826c-0.055-0.379-0.379-0.656-0.76-0.656
										H9.802l-0.39-0.891c-0.123-0.279-0.399-0.46-0.704-0.46H1.11c-0.222,0-0.434,0.096-0.58,0.264C0.385,3.537,0.319,3.76,0.349,3.981
										l1.673,12.243c0,0,0,0,0,0.002v0.004c0.015,0.113,0.06,0.213,0.119,0.303c0.006,0.009,0.006,0.023,0.012,0.033
										c0.012,0.016,0.033,0.024,0.046,0.04c0.054,0.065,0.114,0.118,0.185,0.161c0.027,0.018,0.051,0.035,0.078,0.048
										c0.099,0.045,0.206,0.078,0.32,0.078h0.002l0,0h13.03c0.323,0,0.611-0.201,0.722-0.505l3.076-8.416
										C19.698,7.735,19.663,7.474,19.521,7.267z M8.203,4.644l0.391,0.889c0.123,0.279,0.399,0.461,0.704,0.461h4.315l0.141,0.944H5.859
										c-0.323,0-0.611,0.201-0.723,0.505l-2.011,5.505L1.992,4.644H8.203z M15.276,15.356H3.882l2.515-6.879H17.79L15.276,15.356z">
									</path>
								</svg>
								<p class="leading-relaxed">File Name</p>
							</div>
						</div>
					</div>
					{#if responseSomething}
						{#each responseSomething as {id, name, estimation_date, issue_key, severity, priority, summary, description, days_of_work}, i}
							<button class="
								accordion-button
								collapsed
								relative
								flex
								items-center
								w-full
								py-4
								px-5
								text-base text-gray-800 text-left
								bg-white
								border-0
								rounded-none
								transition
								focus:outline-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapse{i}" aria-expanded="false"
								aria-controls="collapseExample">
								<div class="container px-5 py-2 mx-auto divide-y divide-dashed">
									<div class="flex flex-wrap -m-4 text-center">
										<div class="p-4 sm:w-1/2 w-1/2">
											<h2 class="title-font font-medium text-2xl text-gray-900">{estimation_date}</h2>
										</div>
										<div class="p-4 sm:w-1/2 w-1/2">
											<h2 class="special-case title-font font-medium text-2xl text-gray-900">{name}</h2>
										</div>
									</div>
								</div>
							</button>
							{#if name == "Form"}
								<div class="collapse" id="collapse{i}">
									<div class="block p-6 rounded-lg shadow-lg bg-white">
										<table class="table-auto w-full text-center whitespace-no-wrap">
											<thead>
											<tr>
												<th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">Issue Key</th>
												<th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Severity</th>
												<th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Priority</th>
												<th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Summary</th>
												<th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Description</th>
												<th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Days of Work</th>
												<th class="w-10 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tr rounded-br"></th>
											</tr>
											</thead>
											<tbody>
											<tr>
												<td class="px-4 py-3">{issue_key}</td>
												<td class="px-4 py-3">{severity}</td>
												<td class="px-4 py-3">{priority}</td>
												<td class="px-4 py-3">{summary}</td>
												<td class="px-4 py-3">{description}</td>
												<td class="px-4 py-3 text-lg text-gray-900">{days_of_work}</td>
											</tr>
											</tbody>
										</table>
									</div>
								</div>
							{:else}
								<div class="collapse" id="collapse{i}">
									<div class="container mx-auto block p-6 rounded-lg shadow-lg bg-white">
										<div class="-m-4 text-center items-center">
											<p class="text-gray-900 inline-block">Download Link:</p>
											<a class="text-gray-500 ml-1 inline-block" href="javascript:void(0)">{name}</a>
										</div>
									</div>
								</div>
							{/if}
						{/each}
					{/if}
				</div>
			</div>
		</section>
	</main>
	<footer class="text-gray-600 body-font">
		<div class="container px-5 py-0 mx-auto flex items-center sm:flex-row flex-col">
			<!-- svelte-ignore a11y-missing-attribute -->
			<p class="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">© 2022 EffortPredictor —
				<a href="javascript:void(0)" class="text-gray-600 ml-1" rel="noopener noreferrer" target="_blank">@DedicatedCoders</a>
			</p>
			<span class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
				<!-- svelte-ignore a11y-missing-attribute -->
				<a class="text-gray-500">
				<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
					<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
				</svg>
				</a>
				<!-- svelte-ignore a11y-missing-attribute -->
				<a class="ml-3 text-gray-500">
				<svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
					<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
				</svg>
				</a>
				<!-- svelte-ignore a11y-missing-attribute -->
				<a class="ml-3 text-gray-500">
				<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
					<rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
					<path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
				</svg>
				</a>
				<!-- svelte-ignore a11y-missing-attribute -->
				<a class="ml-3 text-gray-500">
				<svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" class="w-5 h-5" viewBox="0 0 24 24">
					<path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
					<circle cx="4" cy="4" r="2" stroke="none"></circle>
				</svg>
				</a>
			</span>
		</div>
	</footer>
</body>

<style>
	

	.special-case {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

</style>