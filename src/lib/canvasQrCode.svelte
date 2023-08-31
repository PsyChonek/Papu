<script lang="ts">
	import QRCode from 'qrcode';
	import { afterUpdate, onMount } from 'svelte';

	export let size = 200;
	export let data: string | null;

	let canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D;

	onMount(() => {
		ctx = canvas.getContext('2d')!;
	});

	const clear = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

	afterUpdate(async () => {
		if (!data) {
			clear();
			return;
		}

		// Generate QR code into variable NOT CANVAS
		const qrCodeBase64Url = await QRCode.toDataURL(data, {
			errorCorrectionLevel: 'H',
			color: {
				dark: '#000000', // Black dots
				light: '#f3f4f6' // Transparent background
			},
			width: size
		});

		const img = new Image();
		img.src = qrCodeBase64Url;
		img.onload = () => {
			// clear just before redraw to prevent image flashing
			clear();
			ctx.drawImage(img, 0, 0);
		};
	});
</script>

<canvas bind:this={canvas} width={size} height={size} />
