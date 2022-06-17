<script>
    import Tailwindcss from './Tailwindcss.svelte';
    import HelperFunctions, {getCookie} from './HelperFunctions.svelte';

    let messages;
    const csrftoken = getCookie('csrftoken');
    console.log(csrftoken);

    function upload() {
        const formData = new FormData(document.getElementById("sign_in_form"));
        fetch('http://127.0.0.1:8000/accounts/login/', {
            method: 'POST',
            body: formData,
            redirect: 'follow'
        }).then(response => {
            if (response.redirected && response.ok) {
                window.location.href = response.url;
            } else {
                if (response.ok) {
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
                else {
                    if(response.status == 403) {
                        messages = "Error 403! please check that you have allowed cookies for this site."
                    }
                }
            }
        }).catch((error) => {
            messages = error;
        })
    }
</script>

<Tailwindcss />
<section class="text-gray-600 body-font relative h-full">
	<div class="container px-5 py-24 mx-auto flex flex-wrap items-center">
		<div class="container px-5 py-24 mx-auto flex">
			<div class="lg:w-1/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
				<img src= "https://pbs.twimg.com/media/DN9_SfwV4AATQXt.png" alt="Cemex-Go" class="object-scale-down object-center h-24 mt-0 mb-4" >
				<h2 class="text-gray-900 text-lg mb-1 font-medium title-font text-center">Login</h2>
				<p class="leading-relaxed mb-5 text-gray-600 text-center">Login to access the effort prediction tool.</p>
                {#if messages}
                    <p id="error_messages" class="text-warning text-center leading-relaxed mb-5">{@html messages}</p>
                {/if}
				<form id="sign_in_form" on:submit|preventDefault={upload}>
					<input type="hidden" name="csrfmiddlewaretoken" value={csrftoken}>
					<div class="relative mb-4">
						<label for="id_username" class="leading-7 text-sm text-gray-600">Username</label>
						<!-- svelte-ignore a11y-autofocus -->
						<input type="text" name="username" autofocus autocapitalize="none" autocomplete="username" maxlength="150" required id="id_username" oninvalid="this.setCustomValidity('Username is required')" oninput="setCustomValidity('')" class="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
					</div>
					<div class="relative mb-4">
						<label for="id_password" class="leading-7 text-sm text-gray-600">Password:</label>
						<input type="password" name="password" autocomplete="current-password" required id="id_password" oninvalid="this.setCustomValidity('Password is required')" oninput="setCustomValidity('')" class="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
					</div>
					<input type="hidden" name="next" value="/">
				</form>
				<button type="submit" form="sign_in_form" class="text-white bg-[#023185] border-0 py-2 px-8 focus:outline-none hover:bg-[#02215a] rounded text-lg">Sign in</button>
				<div class="flex flex-wrap mt-4">
					<div>
						<a href="http://127.0.0.1:8000/accounts/password_reset/" class="text-blue-600 hover:text-blue-700 focus:text-blue-700 transition duration-200 ease-in-out mt-2">Forgot password?</a>
                    </div>
                    <div class="text-end flex-grow">
						<a href="http://127.0.0.1:8000/admin/" class="text-end text-blue-600 hover:text-blue-700 focus:text-blue-700 transition duration-200 ease-in-out mt-2">Admin site</a>
					</div>
				</div>
            </div>
		</div>
	</div>
</section>


<style>

	:global(body) {
		margin: 0;
		padding: 0;
		background-image: url('https://www.tendencias.mx/wp-content/uploads/2020/08/cemex.jpg');
		background-size: fill;
		background-repeat: no-repeat;
	}
</style>


