<script lang="ts">
	import { paymentData } from './payment';
	import CanvasQrCode from './canvasQrCode.svelte';
	import FunkyNumber from './animation/funkyNumber.svelte';

	export let iban: string;
	export let name: string;

	export let nonDiscountedTotal: number;
	export let total: number;

	$: qrCodeData = iban && total > 0 ? paymentData(iban, total, `Payment for ${name} from Papu`) : null;
</script>

<div class="flex flex-col justify-center items-center gap-2 m-2 w-[196px]">
	<h1 class="font-bold text-lg">{name}</h1>
	<h1><FunkyNumber value={total} /></h1>
	<input bind:value={nonDiscountedTotal} type="number" placeholder="Price" class="rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none" />

	<!-- Rounded border for canvas -->
	<div class="rounded-lg border-2 border-gray-300">
		<!-- QR code on load generate -->
		<CanvasQrCode data={qrCodeData} />
	</div>
</div>
