<script lang="ts">
	import { paymentData } from '../payment';
	import CanvasQrCode from './canvasQrCode.svelte';
	import FunkyNumber from '../animation/funkyNumber.svelte';
	import { iban, orders } from '$lib/stores';
	import type { Participant, ParticipantItem } from '../types/participant';
	import { arraySum } from '$lib';
	import MutantTransition from '../animation/mutantTransition.svelte';
	import type { ObjectId } from 'mongodb';
	import Fa from 'svelte-fa';
	import { faTrash, faPrint } from '@fortawesome/free-solid-svg-icons';

	export let participant: Participant;
	export let discount: number = 0;
	export let split: number = 0;

	export let removeParticipant: (id: string | ObjectId) => void;

	const createItem = (): ParticipantItem => ({ _id: crypto.randomUUID() });
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
	$: qrCodeData = $iban && participant.total > 0 ? paymentData($iban, participant.total, `Payment for ${participant.name} from Papu`, participant.variableSymbol) : null;
</script>

<div class="flex flex-col justify-center items-center gap-2 m-2 w-[196px]">
	<div class="flex items-center w-full relative">
		<h1 class="font-bold text-lg text-center w-full">{participant.name}</h1>
		<div class="absolute left-0 flex gap-2">
			<Fa icon={faPrint} color="{participant.isToImageExport ? '#006550' : '#f04b4b'}" />
		</div>
		<div class="absolute right-0 flex gap-2">
			<button on:click={() => removeParticipant(participant._id)}>
				<Fa icon={faTrash} color="#f04b4b" />
			</button>
		</div>
	</div>
	<!-- Rounded border for canvas -->
	<div class="outline {participant.isToImageExport ? 'outline-[#006550]' : 'outline-[#f04b4b]'} outline-offset-0 rounded-xl" role="button" tabindex="0" on:click={() => participant.isToImageExport = !participant.isToImageExport} on:keydown={(e) => e.key === 'Enter' && (participant.isToImageExport = !participant.isToImageExport)}>
		<!-- QR code on load generate -->
		<CanvasQrCode data={qrCodeData} />
	</div>
	<h1 class="font-bold text-lg"><FunkyNumber value={participant.total} /> Kč</h1>
	{#each items as { _id, price } (_id)}
		<MutantTransition>
			<input
				bind:value={price}
				on:input={() => {
					$orders = [...$orders];
				}}
				type="number"
				placeholder="Price"
				class="rounded-lg p-2 border-2 border-gray-300 focus:border-[#4a577e] focus:outline-none"
			/>
		</MutantTransition>
	{/each}
</div>
