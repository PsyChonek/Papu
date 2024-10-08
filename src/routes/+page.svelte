<script lang="ts">
	import { generateQRCode } from '$lib/slackImage';
	import type { Participant } from '$lib/types/participant';
	import { iban, orders, orderKeyStore } from '$lib/stores';
	import ParticipantInfo from '../lib/components/participantInfo.svelte';
	import MutantTransition from '$lib/animation/mutantTransition.svelte';
	import FunkyNumber from '$lib/animation/funkyNumber.svelte';
	import { arraySum } from '$lib';
	import type { Order } from '$lib/types/order';
	import type { ObjectId } from 'mongodb';
	import { generateVS } from '$lib/keys';

	let newParticipantName = '';

	$: activeOrder = $orders.find((order) => order.key === $orderKeyStore) as Order;

	$: split = activeOrder.other / activeOrder.participants.length;

	// update total
	$: total = arraySum(activeOrder.participants.map((participant) => participant.total));
	$: rawTotal = arraySum(activeOrder.participants.map((participant) => participant.nonDiscountedTotal));

	const addParticipant = () => {
		if (!newParticipantName) return;

		const participant: Participant = {
			_id: crypto.randomUUID(),
			variableSymbol: generateVS(),
			name: newParticipantName,
			total: 0,
			nonDiscountedTotal: 0,
			user: null,
			items: [],
			isToImageExport: true
		};

		activeOrder.participants = [...activeOrder.participants, participant];

		// Clear input field
		newParticipantName = '';

		$orders = [...$orders];
	};

	const removeParticipant = (_id: string | ObjectId) => {
		activeOrder.participants = activeOrder.participants.filter((participant) => participant._id !== _id);

		$orders = [...$orders];
	};

	// Format input, remove spaces, uppercase and trim. Then update input value
	const formatIban = (event: any) => {
		const value = event.target.value.replace(/\s/g, '').toUpperCase().trim();
		event.target.value = value;
		iban.set(value);
	};

	$: slackImage = generateQRCode(activeOrder.participants, $iban || '');

	// Function to convert data URL to Blob
	function dataURLToBlob(dataURL: string): Blob {
		var byteString = atob(dataURL.split(',')[1]);
		var mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		var blob = new Blob([ab], { type: mimeString });
		return blob;
	}
</script>

<div class="justify-between min-h-full">
	<div class="flex flex-col gap-5 basis-full justify-between min-h-full flex-grow-1">
		<div class="flex flex-col gap-1 basis-full m-3">
			<div id="settings" class="rounded-xl bg-gray-100 p-2 m-2 mx-auto flex flex-wrap flex-col">
				<div class="flex flex-row items-center justify-start gap-6 m-2 no-wrap">
					<h1 class="font-bold w-[100px] flex-shrink-0 text-1xl">IBAN</h1>
					<input type="text" placeholder="IBAN" bind:value={$iban} on:input={formatIban} class="w-full text-center rounded-lg p-1 border-2 {$iban?.length == 24 ? 'border-gray-300' : 'border-red-500'} focus:border-[#fb923c] focus:outline-none" />
				</div>
				<div class="flex flex-row items-center justify-evenly gap-6 flex-wrap sm:flex-nowrap">
					<div class="flex flex-col gap-6 m-2 w-full sm:w-1/2">
						<div class="flex flex-row items-center justify-evenly gap-6 no-wrap">
							<h1 class="font-bold w-[100px] flex-shrink-0 mr-auto text-1xl">Discount</h1>
							<input
								type="number"
								placeholder="Discount"
								bind:value={activeOrder.discount}
								on:input={() => {
									$orders = [...$orders];
								}}
								class="text-center min-w-[100px] w-full rounded-lg p-1 border-2 border-gray-300 focus:border-[#fb923c] focus:outline-none"
							/>
						</div>
						<div class="flex flex-row items-center justify-evenly gap-6 no-wrap">
							<h1 class="font-bold mr-auto w-[100px] flex-shrink-0 text-1xl">Other</h1>
							<input
								type="number"
								placeholder="Other"
								bind:value={activeOrder.other}
								on:input={() => {
									$orders = [...$orders];
								}}
								class="text-center min-w-[100px] w-full rounded-lg p-1 border-2 border-gray-300 focus:border-[#fb923c] focus:outline-none"
							/>
						</div>
					</div>
				
					<div class="flex flex-col gap-6 m-2 w-full sm:w-1/2">
						<div class="flex flex-row items-center justify-evenly gap-6 no-wrap">
							<p class="font-bold mr-auto w-[100px] flex-shrink-0 text-1xl">Total</p>
							<div class="text-center w-full rounded-lg p-1 border-2 border-gray-300 focus:border-[#fb923c] focus:outline-none">
								<FunkyNumber value={total} />
							</div>
						</div>
						<div class="flex flex-row items-center justify-evenly gap-6 no-wrap">
							<p class="font-bold mr-auto w-[100px] flex-shrink-0 text-1xl">Raw</p>
							<div class="text-center w-full rounded-lg p-1 border-2 border-gray-300 focus:border-[#fb923c] focus:outline-none">
								<FunkyNumber value={rawTotal} />
							</div>
						</div>
					</div>
				</div>
				
			</div>
			<div id="participants" class="rounded-xl bg-gray-100 p-2 m-2 flex flex-wrap flex-col w-max self-center max-w-fit">
				<div class="flex flex-row justify-center gap-5 m-2 flex-wrap" style="display:{activeOrder.participants.length > 0 ? 'flex' : 'none'}">
					{#each activeOrder.participants as participant (participant._id)}
						<MutantTransition>
							<ParticipantInfo bind:participant {split} {removeParticipant} discount={activeOrder.discount} />
						</MutantTransition>
					{/each}
				</div>

				<div class="m-auto flex flex-col gap-2 max-w-[200px] items-center">
					<input
						type="text"
						placeholder="Participant name"
						class="rounded-lg p-2 border-2 border-gray-300 focus:border-[#fb923c] focus:outline-none"
						bind:value={newParticipantName}
						on:keypress={(e) => {
							if (e.key === 'Enter') addParticipant();
						}}
					/>

					<button 
					disabled={newParticipantName.length === 0 || $iban?.length !== 24}
					on:click={() => addParticipant()} 
					class="rounded-lg bg-[#fb923c] text-white p-2 disabled:bg-[#ffc697]">
					Add participant
					</button>

					{#if activeOrder.participants.filter((participant) => participant.isToImageExport).length > 0}
						{#await slackImage}
							<button class="rounded-lg bg-[#fb923c] text-white p-2">Copy Image to clipboard </button>
						{:then generatedImage}
							<button
								on:click={() => {
									var blob = dataURLToBlob(generatedImage);
									const item = new ClipboardItem({ 'image/png': blob });
									navigator.clipboard.write([item]);
								}}
								class="rounded-lg bg-[#fb923c] text-white p-2"
								>Copy QR's to clipboard
							</button>
						{:catch error}
							<p>Error: {error.message}</p>
						{/await}
					{:else}
						<button class="rounded-lg bg-[#fb923c] disabled:bg-[#ffc697] text-white p-2" disabled>No QR's to copy</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
