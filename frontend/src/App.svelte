<script>
	import Selector from './components/Selector.svelte'
	import Tailwindcss from './Tailwindcss.svelte';
	import HelperFunctions, {getCookie} from './HelperFunctions.svelte';
    import Select from 'svelte-select';
	import Icon from '@iconify/svelte'
	import { HSplitPane, VSplitPane } from 'svelte-split-pane';
	import Papa from 'papaparse';
	let blueColor = '#023185';
	let redColor = '#E3303D';
	let files;
	let returnFile;
	let calculationsOver = false;
	let calculating = false;
	let issueKeyText;
	let severityText;
	let priorityText;
	let summaryText;
	let descriptionText;
	let errorMessage;
	let newFileName;
	let resultOneStory;
	let tempVar;

	let severityItems = [
		{value: 'Minor', label: 'Minor'},
    	{value: 'Trivial', label: 'Trivial'},
    	{value: 'Major', label: 'Major'}
	];

	let priorityItems = [
		{value: 'Lowest', label: 'Lowest'},
    	{value: 'Low', label: 'Low'},
    	{value: 'Medium', label: 'Medium'},
		{value: 'High', label: 'High'}
	];

    const csrftoken = getCookie('csrftoken');
	console.log(csrftoken);

	function uploadHelper(formData, name) {
		const response = fetch('http://127.0.0.1:8000/calculate/', {
				method: 'POST',
				body: formData,
				headers: {'X-CSRFToken': csrftoken}
			}).then(response => {
				if (response.ok) {
					if (name != "csvSubmit") {
						response.json().then(function(estimation) {
							resultOneStory = estimation['Prediction'];
							calculationsOver = true;
							calculating = false;
						})
					} else{
						response.text().then(function(text) {
							console.log(typeof text);
							returnFile = text;
							calculationsOver = true;
							calculating = false;
					})
					}
				} else {
					console.error('Error:', response.statusText);
					response.text().then(function(text) {
						var obj = JSON.parse(text);
						calculating= false;
						errorMessage = obj['Error'];
					})
				}
			}).catch(error => {
				console.error('Error:', error);
				calculating= false;
				errorMessage = error;
			})
	}

	//Uploading file to backend
	function upload(name) { 
		calculating = true;
		returnFile = undefined;
		resultOneStory = undefined;
		errorMessage = undefined;
		console.log("Hola")
		let formData = new FormData();
		if (name == "csvSubmit") {
			newFileName = files[0].name.substring(0, files[0].name.lastIndexOf('.')) + "_results.csv";
			formData.append('dataFile', files[0]);
			formData.append('fileName', newFileName);			
		} else {
			formData.append('IssueKey', issueKeyText);
			formData.append('Severity', severityText.value);
			formData.append('Priority', priorityText.value);
			formData.append('Summary', summaryText);
			formData.append('Description', descriptionText);
		}
		formData.append('damName', name);
		uploadHelper(formData, name);
	}

	function downloadCSV() {
		var blob = new Blob([returnFile]);
		if (window.navigator.msSaveOrOpenBlob)  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
			window.navigator.msSaveBlob(blob, newFileName);
		else
		{
			var a = window.document.createElement("a");
			a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
			a.download = newFileName;
			document.body.appendChild(a);
			a.click();  // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
			document.body.removeChild(a);
		}
	}

	const onFileSelected =(e)=>{
		calculationsOver = false;
		if(!e.target.files[0]) {
			console.log("Something");
			files = undefined;

		} else {
			files = e.target.files;
			returnFile = undefined;
		}
	}

	$: usingForm = () => {
		return issueKeyText || severityText || priorityText || summaryText || descriptionText;
 	}

	$: completeForm = () => {
		return issueKeyText && severityText && priorityText && summaryText && descriptionText;
	} 

	function clearFields() {
		issueKeyText = undefined;
		severityText = undefined;
		priorityText = undefined;
		summaryText = undefined;
		descriptionText = undefined;
	}

	const clearFile =(e)=>{
		files = undefined;
		returnFile = undefined;
		tempVar.value = '';
	}

</script>

<Tailwindcss />
<body class="flex flex-col h-full">
	<header class="text-gray-600 body-font z-20 relative">
		<div class=" mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center z-30">
			<div class="w-0 h-0 right-0 top-0 border-t-0 border-l-0 border-r-[250px] border-b-[250px] border-solid border-r-cemex-red border-y-transparent border-l-transparent absolute z-0">
			</div>
			<!-- svelte-ignore a11y-missing-attribute -->
			<a class="flex title-font font-bold items-center text-gray-900 mb-4 md:mb-0 z-20">
				<svg width="200.94008" height="54.687969" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-14 h-14 text-white p-2 bg-cemex-red rounded-full" viewBox="0 0 24 24">	
					<g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(471.61508,-127.2739)">
					  	<path class="shrink" style="fill:#FFFFFF;fill-opacity:1" d="m -399.69329,127.2779 20.14157,-0.004 -0.12532,0.16378 -45.78858,54.41665 -19.78427,0.0346 45.5566,-54.61115 z" id="path2884" sodipodi:nodetypes="cccccccccccscccccscccccccccccccccccccccscccsscccccscccsccccccccccsssssccccccccccsccccccccccssssscccccsssssccccccccccssscccccccccscccccccsssssccccccccscccccccccccccccccccccccccccccc"/>
						<path class="shrink" style="fill:#FFFFFF;fill-opacity:1" d="m -471.6055,181.84225 45.4664,-54.49499 20.16591,0 -0.17379,0.18798 -45.80667,54.42663 -9.87711,0 c -9.4002,0 -9.87217,-0.006 -9.77474,-0.11962 z" id="path2884-1" sodipodi:nodetypes="ccccccc"/>
					</g>
				</svg>
				<a class="ml-3 text-xl text-gray-900 hover:text-gray-900" href="http://127.0.0.1:8000/">EffortPredictor</a>
			</a>
			<nav class="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400 z-20 flex flex-wrap items-center text-base justify-center">
				<!-- svelte-ignore a11y-missing-attribute -->
				<a class="mr-5 hover:text-gray-900 text-gray-900" href="http://127.0.0.1:8000/history/">History</a>
				<!-- svelte-ignore a11y-missing-attribute -->
				<a class="mr-5 hover:text-gray-900 text-gray-900" href="http://127.0.0.1:8000/account/">Account</a>
			</nav>
			<button type="button" onclick="location.href='http://127.0.0.1:8000/accounts/logout'" class="z-20 inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Log Out
				<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
					<path d="M7 6a1 1 0 0 0 0-2H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h2a1 1 0 0 0 0-2H6V6z"/>
					<path d="M20.82 11.42l-2.82-4a1 1 0 0 0-1.39-.24 1 1 0 0 0-.24 1.4L18.09 11H10a1 1 0 0 0 0 2h8l-1.8 2.4a1 1 0 0 0 .2 1.4 1 1 0 0 0 .6.2 1 1 0 0 0 .8-.4l3-4a1 1 0 0 0 .02-1.18z"/>
				</svg>
			</button>
		</div>
	</header>
	<main class="flex-grow z-20">
		<div class="flex flex-wrap">
			<div class="px-6 md:w-1/3">
					<div class="flex flex-col items-center">
						<div>
							<h1 class= "appTitle">Effort Predictor</h1>
							<h3 class= "appSubT">for a given story</h3>

							<p>Results are given in total days of work. <br> <br>

							*If stories are given in a csv file,
							columns should be <br> in order exactly as shown here (Top to bottom).
							</p>
						</div>
						<div class="mt-10 w-40">
							<img src= "https://pbs.twimg.com/media/DN9_SfwV4AATQXt.png" alt="Cemex-Go"
							width="130" height="135" class="object-fill w-auto">
						</div>
					</div>
				<!--</left>-->
			</div>
			<div class="mt-4 w-2/3">
				<div>
					<div class="flex flex-wrap">
						<div class="md:w-2/5  mt-16 px-6">
							<section class="">
								<form id="historyForm">
									<label for="IssueKey" class="form-label inline-block mb-1 text-gray-700">IssueKey</label>
									<input
									type="text"
									class="
										form-control
										block
										w-full
										px-3
										py-1.5
										text-base
										font-normal
										text-gray-700
										bg-white bg-clip-padding
										border border-solid border-gray-300
										rounded
										transition
										ease-in-out
										m-0
										mb-5
										focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
									name="IssueKey"
									id="IssueKey"
									placeholder="Enter IssueKey"
									bind:value={issueKeyText}/>

									<div class="mb-0">
										<label for="Severity" class="form-label inline-block mb-1 text-gray-700">Severity</label>
										<div class="select-container">
											<Select id="Severity" items = {severityItems} bind:value={severityText}>
											</Select>
										</div>
									</div>
				
									<div>
										<label for="Priority" class="form-label inline-block mb-1 text-gray-700">Priority</label>
										<div class="select-container">
											<Select id="Priority" items = {priorityItems} bind:value={priorityText}>
											</Select>
										</div>
									</div>
									

									<label for="Summary" class="form-label inline-block mb-1 text-gray-700">Summary</label>
									<textarea
										class="
											form-control
											block
											w-full
											px-3
											py-1.5
											text-base
											font-normal
											text-gray-700
											bg-white bg-clip-padding
											border border-solid border-gray-300
											rounded
											transition
											ease-in-out
											m-0
											mb-5
											focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
										name="Summary"
										id="Summary"
										cols="30" rows="5"
										placeholder="Enter story summary" bind:value={summaryText}></textarea>
									
									<label for="Description" class="form-label inline-block mb-1 text-gray-700">Description</label>
									<textarea
										class="
											form-control
											block
											w-full
											px-3
											py-1.5
											text-base
											font-normal
											text-gray-700
											bg-white bg-clip-padding
											border border-solid border-gray-300
											rounded
											transition
											ease-in-out
											m-0
											focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
										name="Description"
										id="Description"
										cols="30" rows="5"
										placeholder="Enter story description" bind:value={descriptionText}></textarea>
								</form>
								{#if usingForm()}
									<div class="text-center mt-5">
										<button type="button" on:click={clearFields} class="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out">Clear fields</button>
									</div>
								{/if}
							</section>
						</div>
						<div class="px-52 sm:px-6 w-3/5">
							<section class="flex items-center justify-center">
								<div class="flex-col flex justify-center items-center mt-44">
									<div>
										<div class="flex flex-row items-center">
											<label for="fileUpload" class="form-label inline-block mb-1 text-gray-700">Multiple stories in a csv file?*</label>
											{#if files}
												<button type="button" on:click={(e)=>clearFile(e)} class="mb-1 ml-2 inline-block px-1 py-1 bg-gray-800 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out">X</button>
											{/if}
										</div>
										<input class="form-control
											block
											w-fit
											px-3
											py-1.5
											text-base
											font-normal
											text-gray-700
											bg-white bg-clip-padding
											border border-solid border-gray-300
											rounded
											transition
											ease-in-out
											m-0
											focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" on:change={(e)=>onFileSelected(e)} type="file" id="fileUpload" name="file" accept=".csv" bind:this={tempVar}/>
									</div>

									{#if files && !calculating}
										{#if usingForm()}
											<p>You can only send one story or multiple.</p>
											<button disabled type="button" class="mt-16 mx-auto inline-block px-20 py-5 bg-[#023185] text-white text-lg leading-snug uppercase rounded shadow-md focus:outline-none focus:ring-0 transition duration-150 ease-in-out pointer-events-none opacity-60">Predict Effort</button>
										{:else}
											<button on:click={() => upload("csvSubmit")} type="button" class="mt-16 mx-auto inline-block px-20 py-5 bg-[#023185] text-white text-lg leading-snug uppercase rounded shadow-md hover:bg-[#02215a] hover:shadow-lg focus:bg-[#02215a] focus:shadow-lg focus:outline-none focus:ring-0 transition duration-150 ease-in-out">Predict Effort</button>
										{/if}
									{:else}
										{#if usingForm() && completeForm() && !calculating}
											<button on:click={() => upload("formSubmit")} type="button" class="mt-16 mx-auto inline-block px-20 py-5 bg-[#023185] text-white text-lg leading-snug uppercase rounded shadow-md hover:bg-[#02215a] hover:shadow-lg focus:bg-[#02215a] focus:shadow-lg focus:outline-none focus:ring-0 transition duration-150 ease-in-out">Predict Effort</button>
										{:else}
											<button type="button" class="mt-16 mx-auto inline-block px-20 py-5 bg-[#023185] text-white text-lg leading-snug uppercase rounded shadow-md focus:outline-none focus:ring-0 transition duration-150 ease-in-out pointer-events-none opacity-60" disabled>Predict Effort</button>
										{/if}
									{/if}
									{#if errorMessage}
										<p class="text-warning text-center text-xl text-bold mt-10">
											{errorMessage}
										</p>
									{/if}
									{#if calculating}
										<div class="mt-10 spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
											<span class="visually-hidden">Loading...</span>
										</div>
									{/if}
									{#if calculationsOver && returnFile}
										<div class="flex flex-col text-center justify-center items-center">
											<!-- svelte-ignore a11y-invalid-attribute -->
											<div class="mt-10"><a on:click="{downloadCSV}" href="javascript:void(0)">
												<Icon icon="ci:download" color="#0fa958" style="font-size: 77px"/>
											</a></div>
											<!-- svelte-ignore a11y-invalid-attribute -->
											<div><a class="text-xl text-[#12A64D]" href="javascript:void(0)" on:click="{downloadCSV}">
												Download csv file
											</a></div>
										</div>
									{:else if calculationsOver && resultOneStory}
										<div class="text-center mt-10">
											<h5 class="text-2xl font-black text-[#023185] leading-tight mb-2">{resultOneStory} days</h5>
										</div>
									{/if}
								</div>
							</section>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
	<footer class="text-gray-600 body-font relative z-20">
		<div class="px-7 py-0 mx-auto flex items-center sm:flex-row flex-col z-50">
			<div class="w-0 h-0 left-0 bottom-0 border-t-0 border-l-0 border-r-[250px] border-b-[250px] border-solid border-b-[#023185] border-x-transparent border-t-transparent absolute z-0">
			</div>
			<!-- svelte-ignore a11y-missing-attribute -->
			<p class="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4 z-20">© 2022 EffortPredictor —
				<!-- svelte-ignore a11y-invalid-attribute -->
				<a href="javascript:void(0)" class="text-gray-600 ml-1" rel="noopener noreferrer" target="_blank">@DedicatedCoders</a>
			</p>
			<span class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start z-20">
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