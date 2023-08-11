<script lang="ts">
	import QRCode from 'qrcode';
	import { afterUpdate, onMount } from 'svelte';

	export let size = 200;
	export let data: string | null = null;

	let canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D;

	onMount(() => {
		ctx = canvas.getContext('2d')!;
	});

	afterUpdate(async () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (!data) return;

		// Generate QR code into variable NOT CANVAS
		const qrCodeBase64Url = await QRCode.toDataURL(data, {
			errorCorrectionLevel: 'H',
			color: {
				dark: '#000000', // Black dots
				light: '#0000' // Transparent background
			},
			width: size
		});

		const img = new Image();
		img.src = qrCodeBase64Url;
		img.onload = () => {
			ctx.drawImage(img, 0, 0);
		};
	});
</script>

<canvas bind:this={canvas} width={size} height={size} />
