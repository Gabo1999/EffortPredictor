<script>
	import Tailwindcss from './Tailwindcss.svelte';

</script>

<Tailwindcss />
<body class="flex flex-col h-full">
	<header class="text-gray-600 body-font z-20 relative">
		<div class=" mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center z-30">
			<!-- svelte-ignore a11y-missing-attribute -->
			<a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
				<svg width="200.94008" height="54.687969" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-14 h-14 text-white p-2 bg-cemex-red rounded-full" viewBox="0 0 24 24">	
					<g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(471.61508,-127.2739)">
					  	<path class="shrink" style="fill:#FFFFFF;fill-opacity:1" d="m -399.69329,127.2779 20.14157,-0.004 -0.12532,0.16378 -45.78858,54.41665 -19.78427,0.0346 45.5566,-54.61115 z" id="path2884" sodipodi:nodetypes="cccccccccccscccccscccccccccccccccccccccscccsscccccscccsccccccccccsssssccccccccccsccccccccccssssscccccsssssccccccccccssscccccccccscccccccsssssccccccccscccccccccccccccccccccccccccccc"/>
						<path class="shrink" style="fill:#FFFFFF;fill-opacity:1" d="m -471.6055,181.84225 45.4664,-54.49499 20.16591,0 -0.17379,0.18798 -45.80667,54.42663 -9.87711,0 c -9.4002,0 -9.87217,-0.006 -9.77474,-0.11962 z" id="path2884-1" sodipodi:nodetypes="ccccccc"/>
					</g>
				</svg>
				<a class="ml-3 text-xl text-gray-900 hover:text-gray-900" href="http://127.0.0.1:8000/">EffortPredictor</a>
			</a>
			<nav class="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center">
				<!-- svelte-ignore a11y-missing-attribute -->
				<a class="mr-5 hover:text-gray-900 text-gray-900" href="http://127.0.0.1:8000/history/">History</a>
				<!-- svelte-ignore a11y-missing-attribute -->
				<a class="mr-5 hover:text-gray-900 text-gray-900" href="http://127.0.0.1:8000/account/">Account</a>
			</nav>
			<button type="button" onclick="location.href='http://127.0.0.1:8000/accounts/logout'" class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Log Out
				<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
					<path d="M7 6a1 1 0 0 0 0-2H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h2a1 1 0 0 0 0-2H6V6z"/>
					<path d="M20.82 11.42l-2.82-4a1 1 0 0 0-1.39-.24 1 1 0 0 0-.24 1.4L18.09 11H10a1 1 0 0 0 0 2h8l-1.8 2.4a1 1 0 0 0 .2 1.4 1 1 0 0 0 .6.2 1 1 0 0 0 .8-.4l3-4a1 1 0 0 0 .02-1.18z"/>
				</svg>
			</button>
		</div>
	</header>
	<main class="flex-grow">
		<section class="text-gray-600 body-font relative">
			<div class="text-center mb-10">
				<h1 class="sm:text-3xl text-2xl font-medium text-center title-font text-gray-900 mb-4">Password Change Successful</h1>
				<p class="lg:w-2/3 mx-auto leading-relaxed text-base">Your password has been changed.</p>
			</div>
		</section>
	</main>
	<footer class="text-gray-600 body-font">
		<div class="px-5 py-0 mx-auto flex items-center sm:flex-row flex-col">
			<!-- svelte-ignore a11y-missing-attribute -->
			<p class="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">© 2022 EffortPredictor —
				<!-- svelte-ignore a11y-invalid-attribute -->
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
	@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@700&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Raleway&display=swap');

	.shrink {
		transform: scale(0.2) translate(-7800%, 2250%);;
	}
</style>