<script lang="ts">
	import QRCode from 'qrcode';
	import { onMount } from 'svelte';

	var iban: string = '';
	var newUserName: string = '';
	let users: User[] = [];

	interface User {
		name: string;
		total: number;
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
			// Add price to total
			user.total += parseInt(e.target.value);

			// Clear input
			e.target.value = '';

			// Update users
			users = [...users];

			generateQr(user);
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

		var canvas = document.getElementById(user.name);

		QRCode.toCanvas(canvas, qr, function (error: any) {
			if (error) console.error(error);
			console.log('success!');
		});
	};

	const addUser = (name: string) => {
		var user = { name: name, total: 0 };

		users.push(user);
		users = [...users];
	};
</script>

<div class="rounded-xl bg-gray-100 p-10 m-5">
	<!-- Payment info  -->
	<!-- IBAN input -->
	<div class="flex flex-row justify-center items-center gap-10 m-2">
		<h1 class="text-center font-bold text-2xl">IBAN</h1>
		<input type="text" placeholder="IBAN" on:keypress={setIban} class="text-center w-60 rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none" />
	</div>
</div>

<div class="rounded-xl bg-gray-100 p-5 m-5">
	<!-- Horizontal list of users -->
	<div class="flex flex-row justify-center gap-5 m-2">
		{#each users as user}
			<div class="flex flex-col justify-center items-center gap-2 m-2 w-[196px]">
				<h1>{user.name}</h1>
				<h1>{user.total}</h1>
				<input
					type="number"
					placeholder="Price"
					on:load={() => {
						generateQr(user);
					}}
					on:keypress={(e) => {
						updateAmount(e, user);
					}}
					class="rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none"
				/>

				<!-- QR code -->
				<canvas class="h-[180px] w-[180px]" id={user.name} />
			</div>
		{/each}
	</div>

	<div class="m-auto flex flex-col gap-2 max-w-[200px]">
		<!-- User name input -->
		<input on:change={setUserName} type="text" placeholder="User name" class="rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none" />

		<!-- Add user button -->
		<button
			on:click={() => {
				addUser(newUserName);
			}}
			class="rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none">Add user</button
		>
	</div>
</div>
