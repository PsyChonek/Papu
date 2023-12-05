<script lang="ts">
	import { enhance } from '$app/forms';
	import { validateLoginForm, validateRegisterForm } from '$lib/validations/userValidation';
	import type { ActionData } from './$types';
	import type { LoginForm, RegisterForm } from './+page';

	export let form: ActionData;

	var loginInputForm: LoginForm = form?.data as LoginForm ?? {
		username: '',
		password: ''
	};

	var registerInputForm: RegisterForm = form?.data as RegisterForm ?? {
		username: '',
		email: '',
		password: '',
		passwordConfirm: ''
	};

	var showRegister = true;

	$: loginValidation = validateLoginForm(loginInputForm);
	$: registerValidation = validateRegisterForm(registerInputForm);
</script>

<div class="flex flex-row justify-center m-0">
	<div>
		<div class="m-8 mx-auto text-center">
			<a href="/" class="text-center font-bold text-5xl">Papu</a>
		</div>
		<div class="rounded-xl bg-gray-100 p-5 m-2 mx-auto">
			<h1 class="font-bold text-4xl text-center mb-8">Login</h1>

			<!-- Form -->
			<form method="post" action="?/login" class="flex flex-col gap-6 m-2" use:enhance>
				<div class="flex flex-row items-center justify-evenly gap-6">
					<h1 class="font-bold mr-auto text-2xl">Username or Email</h1>
					<input name="username" required type="text" placeholder="Username" bind:value={loginInputForm.username} class="w-60 rounded-lg p-2 border-2 {loginValidation.errors.some((obj) => obj.type === 'username' || obj.type === 'email') ? 'border-red-500' : 'border-gray-300'} focus:border-orange-500 focus:outline-none" />
				</div>
				<div class="flex flex-row items-center justify-evenly gap-6">
					<h1 class="font-bold mr-auto text-2xl">Password</h1>
					<input name="password" required type="password" placeholder="Password" bind:value={loginInputForm.password} class="w-60 rounded-lg p-2 border-2 {loginValidation.errors.some((obj) => obj.type === 'password') ? 'border-red-500' : 'border-gray-300'} focus:border-orange-500 focus:outline-none" />
				</div>

				<!-- Error -->
				<div>
					{#if loginValidation}
						{#each loginValidation.errors as error}
							<p class="text-red-500 text-center m-0">{error.text}</p>
						{/each}
					{/if}
					{#if form?.loginErrors}
						{#each form.loginErrors as error}
							<p class="text-red-500 text-center m-0">{error.text}</p>
						{/each}
					{/if}
				</div>

				<!-- Button -->
				<div class="flex flex-row justify-center gap-5">
					<button disabled={!loginValidation.isValid} class="rounded-lg bg-orange-500 text-white p-2 w-60 disabled:bg-orange-200">Login</button>
				</div>
			</form>
		</div>

		{#if showRegister}
		<div class="rounded-xl bg-gray-100 p-5 m-2 mx-auto">
			<h1 class="font-bold text-4xl text-center mb-8">Register</h1>

			<!-- Form -->
			<form method="post" action="?/register" class="flex flex-col gap-6 m-2" use:enhance>
				<div class="flex flex-row items-center justify-evenly gap-6">
					<h1 class="font-bold mr-auto text-2xl">Username</h1>
					<input name="username" required type="text" placeholder="Username" bind:value={registerInputForm.username} class="w-60 rounded-lg p-2 border-2 {registerValidation.errors.some((obj) => obj.type === 'username') ? 'border-red-500' : 'border-gray-300'} focus:border-orange-500 focus:outline-none" />
				</div>
				<div class="flex flex-row items-center justify-evenly gap-6">
					<h1 class="font-bold mr-auto text-2xl">Email</h1>
					<input name="email" required type="email" placeholder="Email" bind:value={registerInputForm.email} class="w-60 rounded-lg p-2 border-2 {registerValidation.errors.some((obj) => obj.type === 'email') ? 'border-red-500' : 'border-gray-300'} focus:border-orange-500 focus:outline-none" />
				</div>
				<div class="flex flex-row items-center justify-evenly gap-6">
					<h1 class="font-bold mr-auto text-2xl">Password</h1>
					<input name="password" required type="password" placeholder="Password" bind:value={registerInputForm.password} class="w-60 rounded-lg p-2 border-2 {registerValidation.errors.some((obj) => obj.type === 'password') ? 'border-red-500' : 'border-gray-300'} focus:border-orange-500 focus:outline-none" />
				</div>
				<div class="flex flex-row items-center justify-evenly gap-6">
					<p class="font-bold mr-auto text-2xl">Password confirm</p>
					<input name="passwordConfirm" required type="password" placeholder="Password confirm" bind:value={registerInputForm.passwordConfirm} class="w-60 rounded-lg p-2 border-2 {registerValidation.errors.some((obj) => obj.type === 'passwordMatch') ? 'border-red-500' : 'border-gray-300'} focus:border-orange-500 focus:outline-none" />
				</div>

				<!-- Error -->
				<div>
					{#if registerValidation}
						{#each registerValidation.errors as error}
							<p class="text-red-500 text-center m-0">{error.text}</p>
						{/each}
					{/if}
					{#if form?.registerErrors}
						{#each form.registerErrors as error}
							<p class="text-red-500 text-center m-0">{error.text}</p>
						{/each}
					{/if}
				</div>

				<!-- Button -->
				<div class="flex flex-row justify-center gap-5">
					<button disabled={!registerValidation.isValid} class="rounded-lg bg-orange-500 text-white p-2 w-60 disabled:bg-orange-200">Register</button>
				</div>
			</form>
		</div>
		{/if}
	</div>
</div>
