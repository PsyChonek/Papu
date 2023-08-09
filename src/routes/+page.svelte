<script lang="ts">
	import QRCode from 'qrcode';
	import { onMount } from 'svelte';
	import Error from './+error.svelte';

	var iban: string = '';
	var newUserName: string = '';
	let users: User[] = [];

	interface User {
		uniqueId: number;
		name: string;
		total: number;
		nonDiscountedTotal: number;
	}

	onMount(() => {
		loadIban();
	});

	const loadIban = () => {
		// Load iban from localStorage
		if (localStorage.getItem('iban')) {
			iban = localStorage.getItem('iban') as string;
			console.log('iban loaded from localStorage');

			// Update input value
			(document.querySelector('input') as HTMLInputElement).value = iban;
		}
	};

	// Input enter
	const updateAmount = (e: any, user: any) => {
		if (e.key === 'Enter') {
			if (e.target.value === '') {
				return;
			}

			// Add price to total
			user.nonDiscountedTotal += Math.ceil(parseFloat(e.target.value));

			// Clear input
			e.target.value = '';

			// Update users
			updateUsers();
		}
	};

	// Set IBAN
	const setIban = (e: any) => {
		iban = e.target.value;

		// Save iban to localStorage
		localStorage.setItem('iban', iban);
		console.log('iban saved to localStorage');
	};

	const setUserName = (e: any) => {
		newUserName = e.target.value;
	};

	// Generate payment
	const generateQr = (user: any) => {
		// https://en.wikipedia.org/wiki/Short_Payment_Descriptor

		// Generate QR code content
		const qr = `SPD*1.0*ACC:${iban}*AM:${user.total}*CC:CZK*MSG:Payment for ${user.name} from Papu`;

		// Log QR code content
		console.log(qr);

		var canvas = document.getElementById('canvas-' + user.uniqueId.toString()) as HTMLCanvasElement;

		// Check if canvas exists
		if (!canvas) {
			console.log('canvas not found');
			return;
		}

		// Clear canvas
		var ctx = canvas.getContext('2d');
		ctx?.clearRect(0, 0, canvas.width, canvas.height);

		// Generate QR code into variable NOT CANVAS
		var qrCode = QRCode.toDataURL(qr, {
			errorCorrectionLevel: 'H',
			color: {
				dark: '#000000', // Black dots
				light: '#0000' // Transparent background
			},
			width: 200
		});

		// Set QR code to canvas
		qrCode.then((url) => {
			var img = new Image();
			img.src = url;
			img.onload = () => {
				var ctx = canvas.getContext('2d');
				ctx?.drawImage(img, 0, 0);
			};
		});
	};

	const addUser = (name: string) => {
		var user = { name: name, total: 0, uniqueId: Math.floor(Math.random() * 1000000), nonDiscountedTotal: 0 };

		users.push(user);

		// Clear input field
		(document.getElementById('user-name') as HTMLInputElement).value = '';

		updateUsers();
	};

	var total = 0;

	const updateTotal = () => {
		total = 0;

		users.forEach((user) => {
			total += user.total;
		});
	};

	const setDiscount = (e: any) => {
		discount = e.target.value;
		updateUsers();
	};

	// In 0-100%
	var discount = 0;

	// Update users total with discount
	const applyDiscount = () => {
		users.forEach((user) => {
			// Floor discount
			user.total = Math.ceil(user.nonDiscountedTotal - (user.nonDiscountedTotal / 100) * discount);
		});
	};

	const setOther = (e: any) => {
		other = e.target.value;
		updateUsers();
	};

	var other = 0;

	// Update users total with other
	const applyOther = () => {
		users.forEach((user) => {
			var split = other / users.length;
			user.total += split;
		});
	};

	// Update users
	const updateUsers = () => {
		applyDiscount();
		applyOther();
		updateTotal();

		users.forEach((user) => {
			generateQr(user);
		});

		users = [...users];
	};
</script>

<div class="rounded-xl bg-gray-100 p-10 m-2 max-w-[460px] mx-auto">
	<!-- Payment info  -->
	<!-- IBAN input -->
	<div class="flex flex-col gap-6 m-2">
		<div class="flex flex-row items-center justify-evenly gap-6">
			<h1 class="font-bold mr-auto text-2xl">IBAN</h1>
			<input type="text" placeholder="IBAN" on:change={setIban} class="text-center w-60 rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none" />
		</div>
		<div class="flex flex-row items-center justify-evenly gap-6">
			<h1 class="font-bold mr-auto text-2xl">Discount</h1>
			<input type="number" placeholder="Discount" on:change={setDiscount} class="text-center w-60 rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none" />
		</div>
		<div class="flex flex-row items-center justify-evenly gap-6">
			<h1 class="font-bold mr-auto text-2xl">Other</h1>
			<input type="number" placeholder="Other" on:change={setOther} class="text-center w-60 rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none" />
		</div>
		<div class="flex flex-row items-center justify-evenly gap-6">
			<p class="font-bold mr-auto text-2xl">Total</p>
			<input id="input-total" type="text" disabled placeholder="Total" value={total} class="text-center w-60 rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none" />
		</div>
		<div class="flex flex-row items-center justify-evenly gap-6">
			<p class="font-bold mr-auto text-2xl">Raw</p>
			<input id="input-total" type="text" disabled placeholder="Total" value={total / ((100 - discount)/100)} class="text-center w-60 rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none" />
		</div>
	</div>
</div>

<div class="rounded-xl bg-gray-100 min-w-[460px] p-5 m-5">
	<!-- Horizontal list of users -->
	<div class="flex flex-row justify-center gap-5 m-2">
		{#each users as user}
			<div class="flex flex-col justify-center items-center gap-2 m-2 w-[196px]">
				<h1 class="font-bold text-lg">{user.name}</h1>
				<h1>{user.total}</h1>
				<input
					type="number"
					placeholder="Price"
					on:keypress={(e) => {
						updateAmount(e, user);
					}}
					class="rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none"
				/>

				<!-- Rounded border for canvas -->
				<div class="rounded-lg border-2 border-gray-300">
					<!-- QR code on load generate -->
					<canvas width="200" height="200" id="canvas-{user.uniqueId.toString()}" />
				</div>
			</div>
		{/each}
	</div>

	<div class="m-auto flex flex-col gap-2 max-w-[200px]">
		<!-- User name input -->
		<input
			id="user-name"
			on:change={setUserName}
			on:keypress={(e) => {
				if (e.key === 'Enter') {
					setUserName(e);
					addUser(newUserName);
				}
			}}
			type="text"
			placeholder="User name"
			class="rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none"
		/>

		<!-- Add user button -->
		<button
			on:click={() => {
				addUser(newUserName);
			}}
			class="rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none">Add user</button
		>
	</div>
</div>
