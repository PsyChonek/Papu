<script lang="ts">
	import CanvasQrCode from '$lib/canvasQrCode.svelte';
	import { paymentData } from '$lib/payment';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	interface User {
		name: string;
		total: number;
		nonDiscountedTotal: number;
		qrCodeData: string | null;
	}

	let iban = '';
	let ibanLoaded = false;
	// In 0-100%
	let discount = 0;
	let other = 0;

	let newUserName = '';
	let users: User[] = [];

	// update users total
	$: {
		const split = other / users.length;
		users = users.map((user) => ({
			...user,
			// Floor discount
			total: Math.ceil(user.nonDiscountedTotal * (1 - discount / 100)) + split
		}));
	}

	// update total
	const sum = (a: number, b: number) => a + b;
	$: total = users.map((user) => user.total).reduce(sum, 0);
	$: rawTotal = users.map((user) => user.nonDiscountedTotal).reduce(sum, 0);

	// update users qrCode
	$: {
		users = users.map((user) => ({
			...user,
			qrCodeData: iban && user.total > 0 ? paymentData(iban, user.total, `Payment for ${user.name} from Papu`) : null
		}));
	}

	// update iban in localStorage
	$: if (browser && ibanLoaded) {
		localStorage.setItem('iban', iban);
	}

	onMount(() => {
		loadIban();
	});

	const loadIban = () => {
		// Load iban from localStorage
		if (localStorage.getItem('iban')) {
			iban = localStorage.getItem('iban') as string;
			ibanLoaded = true;
			console.log('iban loaded from localStorage', iban);
		}
	};

	const addUser = () => {
		if (!newUserName) return;

		const user = { name: newUserName, total: 0, nonDiscountedTotal: 0, qrCodeData: null };
		users = [...users, user];

		// Clear input field
		newUserName = '';
	};
</script>

<div id="settings" class="rounded-xl bg-gray-100 p-10 m-2 max-w-[460px] mx-auto">
	<!-- Payment info  -->
	<!-- IBAN input -->
	<div class="flex flex-col gap-6 m-2">
		<div class="flex flex-row items-center justify-evenly gap-6">
			<h1 class="font-bold mr-auto text-2xl">IBAN</h1>
			<input type="text" placeholder="IBAN" bind:value={iban} class="text-center w-60 rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none" />
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
			<input type="text" disabled placeholder="Total" value={total} class="text-center w-60 rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none" />
		</div>
		<div class="flex flex-row items-center justify-evenly gap-6">
			<p class="font-bold mr-auto text-2xl">Raw</p>
			<input type="text" disabled placeholder="Total" value={rawTotal} class="text-center w-60 rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none" />
		</div>
	</div>
</div>

<div id="users" class="rounded-xl bg-gray-100 p-5 m-2 min-w-[460px] mx-auto">
	<div class="flex flex-row justify-center gap-5 m-2">
		{#each users as user}
			<div class="flex flex-col justify-center items-center gap-2 m-2 w-[196px]">
				<h1 class="font-bold text-lg">{user.name}</h1>
				<h1>{user.total}</h1>
				<input bind:value={user.nonDiscountedTotal} type="number" placeholder="Price" class="rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none" />

				<!-- Rounded border for canvas -->
				<div class="rounded-lg border-2 border-gray-300">
					<!-- QR code on load generate -->
					<CanvasQrCode data={user.qrCodeData} />
				</div>
			</div>
		{/each}
	</div>

	<div class="m-auto flex flex-col gap-2 max-w-[200px]">
		<!-- User name input -->
		<input
			type="text"
			placeholder="User name"
			class="rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none"
			bind:value={newUserName}
			on:keypress={(e) => {
				if (e.key === 'Enter') addUser();
			}}
		/>

		<!-- Add user button -->
		<button on:click={() => addUser()} class="rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none">Add user</button>
	</div>
</div>