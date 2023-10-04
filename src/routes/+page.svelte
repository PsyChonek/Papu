<script lang="ts">
	import type { Participant } from '$lib/types/participant';
	import { iban } from '$lib/stores';
	import ParticipantInfo from '$lib/participantInfo.svelte';
	import MutantTransition from '$lib/animation/mutantTransition.svelte';
	import FunkyNumber from '$lib/animation/funkyNumber.svelte';
	import { arraySum } from '$lib';

	let discount = 0; // In 0-100%
	let other = 0;

	let newParticipantName = '';
	let participants: Participant[] = [];

	$: split = other / participants.length;

	// update total
	$: total = arraySum(participants.map((participant) => participant.total));
	$: rawTotal = arraySum(participants.map((participant) => participant.nonDiscountedTotal));

	const addParticipant = () => {
		if (!newParticipantName) return;

		const participant: Participant = {
			id: crypto.randomUUID(),
			name: newParticipantName,
			total: 0,
			nonDiscountedTotal: 0,
			user: null,
			items: []
		};
		participants = [...participants, participant];

		// Clear input field
		newParticipantName = '';
	};

	// Format input, remove spaces, uppercase and trim. Then update input value
	const formatIban = (event: any) => {
		const value = event.target.value.replace(/\s/g, '').toUpperCase().trim();
		event.target.value = value;
		iban.set(value);
	};
</script>

<div id="settings" class="rounded-xl bg-gray-100 p-10 m-2 max-w-[460px] mx-auto">
	<!-- Payment info  -->
	<!-- IBAN input -->
	<div class="flex flex-col gap-6 m-2">
		<div class="flex flex-row items-center justify-evenly gap-6">
			<h1 class="font-bold mr-auto text-2xl">IBAN</h1>
			<input type="text" placeholder="IBAN" bind:value={$iban} on:input={formatIban} class="text-center w-60 rounded-lg p-2 border-2 {$iban?.length == 24 ? 'border-gray-300' : 'border-red-500'}  focus:border-orange-500 focus:outline-none" />
		</div>
		<div class="flex flex-row items-center justify-evenly gap-6">
			<h1 class="font-bold mr-auto text-2xl">Discount</h1>
			<input type="number" min="0" max="100" placeholder="Discount" bind:value={discount} class="text-center w-60 rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none" />
		</div>
		<div class="flex flex-row items-center justify-evenly gap-6">
			<h1 class="font-bold mr-auto text-2xl">Other</h1>
			<input type="number" placeholder="Other" bind:value={other} class="text-center w-60 rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none" />
		</div>
		<div class="flex flex-row items-center justify-evenly gap-6">
			<p class="font-bold mr-auto text-2xl">Total</p>
			<div class="text-center w-60 rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none">
				<FunkyNumber value={total} />
			</div>
		</div>
		<div class="flex flex-row items-center justify-evenly gap-6">
			<p class="font-bold mr-auto text-2xl">Raw</p>
			<div class="text-center w-60 rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none">
				<FunkyNumber value={rawTotal} />
			</div>
		</div>
	</div>
</div>

<div id="participants" class="rounded-xl bg-gray-100 p-5 m-2 min-w-[460px] mx-auto">
	<div class="flex flex-row justify-center gap-5 m-2">
		{#each participants as participant (participant.id)}
			<MutantTransition>
				<ParticipantInfo bind:participant {discount} {split} />
			</MutantTransition>
		{/each}
	</div>

	<div class="m-auto flex flex-col gap-2 max-w-[200px]">
		<!-- Participant name input -->
		<input
			type="text"
			placeholder="Participant name"
			class="rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none"
			bind:value={newParticipantName}
			on:keypress={(e) => {
				if (e.key === 'Enter') addParticipant();
			}}
		/>

		<!-- Add participant button -->
		<button disabled={newParticipantName.length === 0} on:click={() => addParticipant()} class="rounded-lg bg-orange-500 text-white p-2 disabled:bg-orange-200">Add participant</button>
	</div>
</div>
