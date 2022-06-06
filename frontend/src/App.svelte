<script>
	import Selector from './components/Selector.svelte'
    import Select from 'svelte-select';
	import Icon from '@iconify/svelte'
	import { HSplitPane, VSplitPane } from 'svelte-split-pane';
	import Papa from 'papaparse';
	let blueColor = '#023185';
	let redColor = '#E3303D';
	let files;
	let returnFile;
	let calculationsOver = false;
	let issueKeyText;
	let severityText;
	let priorityText;
	let summaryText;
	let descriptionText;
	let errorMessage;
	let newFileName;

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

	//Getting token
	function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

	function uploadHelper(formData) {
		const response = fetch('http://127.0.0.1:8000/calculate/', {
				method: 'POST',
				body: formData,
				headers: {'X-CSRFToken': csrftoken}
			}).then(response => {
				if (response.ok) {
					response.text().then(function(text) {
						console.log(typeof text);
						returnFile = text;
						calculationsOver = true;
					})
				} else {
					console.error('Error:', response.statusText);
					response.text().then(function(text) {
						var obj = JSON.parse(text);
						errorMessage = obj['Error'];
					})
				}
			}).catch(error => {
				console.error('Error:', error);
				errorMessage = error;
			})
	}

	//Uploading file to backend
	function upload(name) { 
		let formData = new FormData();
		if (name == "csvSubmit") {
			console.log(files)
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
		uploadHelper(formData);
	}

	function downloadCSV() {
		var blob = new Blob([returnFile]);
		if (window.navigator.msSaveOrOpenBlob)  // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
			window.navigator.msSaveBlob(blob, nameFile + "_results.csv");
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

	function makeFalse() {
		calculationsOver = false;
	}

	$: usingForm = () => {
		return issueKeyText || severityText || priorityText || summaryText || descriptionText;
 	}

	$: completeForm = () => {
		return issueKeyText && severityText && priorityText && summaryText && descriptionText;
	} 
</script>

<div class="wrapper">
</div>

<main class="container">

	<HSplitPane leftPaneSize="32%" rightPaneSize="68%" minLeftPaneSize="50px" minRightPaneSize="50px">
		<left slot="left">
			<img src= "https://pbs.twimg.com/media/DN9_SfwV4AATQXt.png" alt="Cemex-Go"
			width="130" height="135">

			<h1 class= "appTitle">Effort Predictor</h1>
			<h3 class= "appSubT">for a given story</h3>

			<p>Results are given in total days of work. <br> <br>

			*If stories are given in a csv file,
			columns should be <br> in order exactly as shown here (Top to bottom).
			</p>
		</left>

		<right slot="right">
			<HSplitPane leftPaneSize="32%" rightPaneSize="68%" minLeftPaneSize="50px" minRightPaneSize="50px">
		 		<left slot="left">
					<section class="story-input">
						<form id="historyForm">
							<label for="IssueKey"><span class="labelFont">IssueKey</span></label>
							<input type="text" name="IssueKey" id="IssueKey" IssueKey="IssueKey" placeholder="Enter IssueKey" bind:value={issueKeyText}>
				 
			  			<div class="select-container">
	 
							<label for="Severity"><span class="labelFont">Severity</span></label>
							<Select id="Severity" items = {severityItems} bind:value={severityText}>
							</Select>
			  			</div>
	 
			  			<div class="select-container2">
							<label for="Priority"><span class="labelFont">Priority</span></label>
							<Select id="Priority" items = {priorityItems} bind:value={priorityText}>
							</Select>
			  			</div>
	 
							<label for="Summary"><span class="labelFont">Summary</span></label>
							<textarea name="Summary" id="Summary" cols="30" rows="10" placeholder="Enter story summary" bind:value={summaryText}></textarea>
	 
							<label for="Description"><span class="labelFont">Description</span></label>
							<textarea name="Description" id="Description" cols="30" rows="10" placeholder="Enter story description" bind:value={descriptionText}></textarea>
						</form>
		 			</section>
		 		</left>

				<right slot="right">
					<section class="excel-input">
						<div class="container2">
							<label for="Excel">Multiple stories in a csv file?*</label>
			
							<input on:click="{makeFalse}" type="file" bind:files
									id="fileUpload" name="file"
									accept=".csv" class="inputfile" />
							<label for="fileUpload" class="inputStyle">
								Select file
							</label>

							{#if files && files[0]}
								<p class ="fileSelected">
							{files[0].name}
								</p>
							{/if}
						</div>
						<!--
						<input type="submit" class="Predict" value="Predict Effort">
						-->
						{#if files}
							{#if usingForm()}
								<p>You can only send one story or multiple.</p>
								<button type="unavailable" on:click={upload} disabled>Submit</button>
							{:else}
								<button type="submit" on:click={() => upload("csvSubmit")}>Submit</button>
							{/if}
						{:else}
							{#if usingForm() && completeForm()}
								<button type="submit" on:click={() => upload("formSubmit")}>Submit</button>
							{:else}
								<button type="unavailable" on:click={upload} disabled>Submit</button>
							{/if}
						{/if}
						{#if errorMessage}
							<p>
								{errorMessage}
							</p>
						{/if}
					</section>
					{#if calculationsOver}
					<section class="file-download">
						<div class="iconContainer">
							<!-- svelte-ignore a11y-invalid-attribute -->
							<a on:click="{downloadCSV}" href="javascript:void(0)">
								<Icon icon="ci:download" color="#0fa958" style="font-size: 77px"/>
							</a>
						
							<a href="effort_predicted.csv" download>
			
						</div>

						<!-- svelte-ignore a11y-invalid-attribute -->
						<a class="downloadLink" href="javascript:void(0)" on:click="{downloadCSV}">
							Download csv file
						</a>

					<input type="reset" class="Clear" value="Enter new story">
					</section>
					{/if}
				</right>
			</HSplitPane>

		</right>

	</HSplitPane>

</main>
  
<div class="triangle"></div>
<div class="triangle2"></div>

<style>

	@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@700&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Raleway&display=swap');



</style>