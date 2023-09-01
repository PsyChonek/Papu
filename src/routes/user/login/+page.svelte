<script lang="ts">
	import { enhance } from '$app/forms';
	import { validateLoginForm } from '$lib/validations/userValidation';
    import type { ActionData } from './$types';
	import type { LoginForm } from './+page';
    
	export let form: ActionData;

    var inputForm: LoginForm = form?.data ?? {
		username: '',
        password: ''
	};

    $: validation = validateLoginForm(inputForm);

</script>


<div id="main">
	<div class="rounded-xl bg-gray-100 p-5 m-2 mx-auto">
		<h1 class="font-bold text-4xl text-center mb-8">Login</h1>

		<!-- Form -->
		<form method="post" action="?/register" class="flex flex-col gap-6 m-2" use:enhance>
			<div class="flex flex-row items-center justify-evenly gap-6">
				<h1 class="font-bold mr-auto text-2xl">Username or Email</h1>
				<input name="username" required type="text" placeholder="Username" bind:value={inputForm.username} class="w-60 rounded-lg p-2 border-2 {validation.errors.some((obj) => obj.type === 'username' || 'email') ? 'border-red-500' : 'border-gray-300'} focus:border-orange-500 focus:outline-none" />
			</div>
			<div class="flex flex-row items-center justify-evenly gap-6">
				<h1 class="font-bold mr-auto text-2xl">Password</h1>
				<input name="password" required type="password" placeholder="Password" bind:value={inputForm.password} class="w-60 rounded-lg p-2 border-2 {validation.errors.some((obj) => obj.type === 'password') ? 'border-red-500' : 'border-gray-300'} focus:border-orange-500 focus:outline-none" />
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
				<button disabled={!validation.isValid} class="rounded-lg bg-orange-500 text-white p-2 w-60 disabled:bg-orange-200">Login</button>
			</div>
		</form>
	</div>
</div>
