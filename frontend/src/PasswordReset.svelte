<script>
	import Tailwindcss from './Tailwindcss.svelte';
	import HelperFunctions, {getCookie} from './HelperFunctions.svelte';
	let messages;
	
    const csrftoken = getCookie('csrftoken');
    console.log(csrftoken);

	function resetPassword() {
        const formData = new FormData(document.getElementById("reset_password_form"));
        fetch('http://127.0.0.1:8000/accounts/password_reset/', {
            method: 'POST',
            body: formData,
            redirect: 'follow'
        }).then(response => {
			console.log(response)
            if (response.redirected && response.ok) {
                window.location.href = response.url;
            } else {
                response.text().then(function(text) {
                    console.log(text)
                    var obj = JSON.parse(text);
                    var newText = "";
                    for (let i in obj) {
                        newText += " - " + obj[i] + "<br>";
                    } 
                    messages = newText;
                })
            }
        }).catch((error) => {
            messages = error;
        })
    }
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
					<h1 class="sm:text-3xl text-2xl font-medium text-center title-font text-gray-900 mb-4">Password reset</h1>
					<p class="lg:w-2/3 mx-auto leading-relaxed text-base">Forgotten your password? Enter your email address below, and we'll email instructions for setting a new one.</p>
					{#if messages}
						<p id="error_messages" class="text-warning text-center leading-relaxed my-5">{@html messages}</p>
					{/if}
			  	</div>
				<form id="reset_password_form" on:submit|preventDefault={resetPassword}>
					<input type="hidden" name="csrfmiddlewaretoken" value={csrftoken}>
					<div class="lg:w-1/2 md:w-2/3 mx-auto">
						<div class="relative">
							<label for="id_email" class="text-center leading-7 text-sm text-gray-600">Email:</label>
							<input type="email" name="email" autocomplete="email" required id="id_email" max_lenght="254" class="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
						</div>
					</div>
				</form>
				<button type="submit" form="reset_password_form" class="mt-10 text-white bg-[#023185] border-0 py-2 px-8 focus:outline-none hover:bg-[#02215a] rounded text-lg">Change Password</button>
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