<script lang="ts">
	import { paymentData } from './payment';
	import CanvasQrCode from './canvasQrCode.svelte';
	import FunkyNumber from './animation/funkyNumber.svelte';
	import { iban } from '$lib/stores';
	import type { Participant, ParticipantItem } from './types/participant';
	import { arraySum } from '$lib';
	import MutantTransition from './animation/mutantTransition.svelte';

	export let participant: Participant;
	export let discount: number = 0;
	export let split: number = 0;

	const createItem = (): ParticipantItem => ({ id: crypto.randomUUID() });
	let defaultItem: ParticipantItem = createItem();

	// add new item
	$: if (defaultItem.price) {
		participant.items.push(defaultItem);
		defaultItem = createItem();
	}

	// remove item
	$: participant.items = participant.items.filter((item) => !!item.price);

	// input items
	$: items = [...participant.items, defaultItem];

	// update nonDiscountedTotal from items
	$: participant.nonDiscountedTotal = arraySum(participant.items.map((item) => item.price ?? 0));
	// update total from nonDiscountedTotal, discount and split
	$: participant.total = Math.ceil(participant.nonDiscountedTotal * (1 - discount / 100) + split);
	// update qrCode from total
	$: qrCodeData = $iban && participant.total > 0 ? paymentData($iban, participant.total, `Payment for ${participant.name} from Papu`) : null;
</script>

<div class="flex flex-col justify-center items-center gap-2 m-2 w-[196px]">
	<h1 class="font-bold text-lg">{participant.name}</h1>
	<h1><FunkyNumber value={participant.total} /></h1>
	{#each items as { id, price } (id)}
		<MutantTransition>
			<input bind:value={price} type="number" placeholder="Price" class="rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none" />
		</MutantTransition>
	{/each}

	<!-- Rounded border for canvas -->
	<div class="outline outline-orange-200 outline-offset-0 rounded-xl">
		<!-- QR code on load generate -->
		<CanvasQrCode data={qrCodeData} />
	</div>
</div>
