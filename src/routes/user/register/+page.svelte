<script lang="ts">
	import type { ActionData } from './$types.js';
	import { enhance } from '$app/forms';
	import type { RegisterForm } from './+page.js';
	import { validateRegisterForm } from '$lib/validations/userValidation';

	export let form: ActionData;

	var inputForm: RegisterForm = form?.data ?? {
		username: '',
		email: '',
		password: '',
		passwordConfirm: ''
	};

	$: validation = validateRegisterForm(inputForm);
</script>

<div id="main">
	<div class="rounded-xl bg-gray-100 p-5 m-2 mx-auto">
		<h1 class="font-bold text-4xl text-center mb-8">Register</h1>

		<!-- Form -->
		<form method="post" action="?/register" class="flex flex-col gap-6 m-2" use:enhance>
			<div class="flex flex-row items-center justify-evenly gap-6">
				<h1 class="font-bold mr-auto text-2xl">Username</h1>
				<input name="username" required type="text" placeholder="Username" bind:value={inputForm.username} class="w-60 rounded-lg p-2 border-2 {validation.errors.some((obj) => obj.type === 'username') ? 'border-red-500' : 'border-gray-300'} focus:border-orange-500 focus:outline-none" />
			</div>
			<div class="flex flex-row items-center justify-evenly gap-6">
				<h1 class="font-bold mr-auto text-2xl">Email</h1>
				<input name="email" required type="email" placeholder="Email" bind:value={inputForm.email} class="w-60 rounded-lg p-2 border-2 {validation.errors.some((obj) => obj.type === 'email') ? 'border-red-500' : 'border-gray-300'} focus:border-orange-500 focus:outline-none" />
			</div>
			<div class="flex flex-row items-center justify-evenly gap-6">
				<h1 class="font-bold mr-auto text-2xl">Password</h1>
				<input name="password" required type="password" placeholder="Password" bind:value={inputForm.password} class="w-60 rounded-lg p-2 border-2 {validation.errors.some((obj) => obj.type === 'password') ? 'border-red-500' : 'border-gray-300'} focus:border-orange-500 focus:outline-none" />
			</div>
			<div class="flex flex-row items-center justify-evenly gap-6">
				<p class="font-bold mr-auto text-2xl">Password confirm</p>
				<input name="passwordConfirm" required type="password" placeholder="Password confirm" bind:value={inputForm.passwordConfirm} class="w-60 rounded-lg p-2 border-2 {validation.errors.some((obj) => obj.type === 'passwordMatch') ? 'border-red-500' : 'border-gray-300'} focus:border-orange-500 focus:outline-none" />
			</div>

			<!-- Error -->
			<div>
				{#if validation}
					{#each validation.errors as error}
						<p class="text-red-500 text-center m-0">{error.text}</p>
					{/each}
				{/if}
			</div>

			<!-- Button -->
			<div class="flex flex-row justify-center gap-5">
				<button disabled={!validation.isValid} class="rounded-lg bg-orange-500 text-white p-2 w-60 disabled:bg-orange-200">Register</button>
			</div>
		</form>
	</div>
</div>
