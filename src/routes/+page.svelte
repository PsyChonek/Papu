<script lang="ts">
	import type { Participant } from '$lib/types/participant';
	import { iban } from '$lib/stores';
	import ParticipantInfo from '$lib/participantInfo.svelte';
	import MutantTransition from '$lib/animation/mutantTransition.svelte';
	import FunkyNumber from '$lib/animation/funkyNumber.svelte';

	let discount = 0; // In 0-100%
	let other = 0;

	let newParticipantName = '';
	let participants: Participant[] = [];

	// update participants total
	$: {
		const split = other / participants.length;
		participants = participants.map((participant) => ({
			...participant,
			// Floor discount
			total: Math.ceil(participant.nonDiscountedTotal * (1 - discount / 100)) + split
		}));
	}

	// update total
	const sum = (a: number, b: number) => a + b;
	$: total = participants.map((participant) => participant.total).reduce(sum, 0);
	$: rawTotal = participants.map((participant) => participant.nonDiscountedTotal).reduce(sum, 0);

	const addParticipant = () => {
		if (!newParticipantName) return;

		const participant: Participant = {
			id: crypto.randomUUID(),
			name: newParticipantName,
			total: 0,
			nonDiscountedTotal: 0,
			user: null
		};
		participants = [...participants, participant];

		// Clear input field
		newParticipantName = '';
	};
</script>

<div id="settings" class="rounded-xl bg-gray-100 p-10 m-2 max-w-[460px] mx-auto">
	<!-- Payment info  -->
	<!-- IBAN input -->
	<div class="flex flex-col gap-6 m-2">
		<div class="flex flex-row items-center justify-evenly gap-6">
			<h1 class="font-bold mr-auto text-2xl">IBAN</h1>
			<input type="text" placeholder="IBAN" bind:value={$iban} class="text-center w-60 rounded-lg p-2 border-2 {$iban?.length == 24 ? 'border-gray-300' : 'border-red-500'}  focus:border-orange-500 focus:outline-none" />
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
		{#each participants as { id, name, total, nonDiscountedTotal } (id)}
			<MutantTransition>
				<ParticipantInfo {name} {total} bind:nonDiscountedTotal />
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
