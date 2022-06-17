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
		</div>
	</header>
	<main class="flex-grow">
		<section class="text-gray-600 body-font relative">
			<div class="container px-5 mx-auto text-center">
				<div class="text-center mb-10">
					<h1 class="sm:text-3xl text-2xl font-medium text-center title-font text-gray-900 mb-4">Password reset complete</h1>
					<p class="lg:w-2/3 mx-auto leading-relaxed text-base">Your password has been set. You may go ahead and log in now.</p>
                    <br>
                    <a class="text-blue-600 hover:text-blue-700 focus:text-blue-700 transition duration-200 ease-in-out mt-2" href="/accounts/login/">Log in</a>
                </div>
			</div>
		</section>
	</main>
</body>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@700&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Raleway&display=swap');

	.shrink {
		transform: scale(0.2) translate(-7800%, 2250%);;
	}
</style>