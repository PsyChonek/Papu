<script lang="ts">
	import { paymentData } from './payment';
	import CanvasQrCode from './canvasQrCode.svelte';
	import FunkyNumber from './animation/funkyNumber.svelte';
	import { iban } from '$lib/stores';
	import type { Participant } from './types/participant';

	export let participant: Participant;
	export let discount: number = 0;
	export let split: number = 0;

	$: participant.total = Math.ceil(participant.nonDiscountedTotal * (1 - discount / 100)) + split;
	$: qrCodeData = $iban && participant.total > 0 ? paymentData($iban, participant.total, `Payment for ${participant.name} from Papu`) : null;
</script>

<div class="flex flex-col justify-center items-center gap-2 m-2 w-[196px]">
	<h1 class="font-bold text-lg">{participant.name}</h1>
	<h1><FunkyNumber value={participant.total} /></h1>
	<input bind:value={participant.nonDiscountedTotal} type="number" placeholder="Price" class="rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none" />

	<!-- Rounded border for canvas -->
	<div class="rounded-lg border-2 border-gray-300">
		<!-- QR code on load generate -->
		<CanvasQrCode data={qrCodeData} />
	</div>
</div>
