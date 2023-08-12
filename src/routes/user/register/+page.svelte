<script lang="ts">
	import type { ActionData } from './$types.js';
	import { enhance, applyAction} from '$app/forms';

	export let form: ActionData;
</script>

<div id="main">
	<div class="rounded-xl bg-gray-100 p-5 m-2 mx-auto">
		<h1 class="font-bold text-4xl text-center mb-8">Register</h1>

		<!-- Error -->
		{#if form?.error}
			<p class="text-red-500 text-center m-6">{form.error}</p>
		{/if}

		<!-- Form -->
		<form
			method="post"
			action="?/register"
			class="flex flex-col gap-6 m-2"
			use:enhance={({formData}) => {
				return async ({ result, update }) => {
					if (result.type === 'success') {
						// Redirect to login
						window.location.href = './login';
					}

					console.log(result);
					applyAction(result);
					update();
				};
			}}
		>
			<div class="flex flex-row items-center justify-evenly gap-6">
				<h1 class="font-bold mr-auto text-2xl">Username</h1>
				<input name="username" required type="text" placeholder="Username" value={form?.data.username ?? ''} class="w-60 rounded-lg p-2 border-2 'border-gray-300 focus:border-orange-500 focus:outline-none" />
			</div>
			<div class="flex flex-row items-center justify-evenly gap-6">
				<h1 class="font-bold mr-auto text-2xl">Email</h1>
				<input name="email" required type="email" placeholder="Email" value={form?.data.email ?? ''} class="w-60 rounded-lg p-2 border-2 'border-gray-300 focus:border-orange-500 focus:outline-none" />
			</div>
			<div class="flex flex-row items-center justify-evenly gap-6">
				<h1 class="font-bold mr-auto text-2xl">Password</h1>
				<input name="password" required type="password" placeholder="Password" value={form?.data.password ?? ''} class="w-60 rounded-lg p-2 border-2 'border-gray-300 focus:border-orange-500 focus:outline-none" />
			</div>
			<div class="flex flex-row items-center justify-evenly gap-6">
				<p class="font-bold mr-auto text-2xl">Password confirm</p>
				<input name="passwordConfirm" required type="password" placeholder="Password confirm" value={form?.data.passwordConfirm ?? ''} class="w-60 rounded-lg p-2 border-2 'border-gray-300' focus:border-orange-500 focus:outline-none" />
			</div>

			<!-- Button -->
			<div class="flex flex-row justify-center gap-5">
				<button class="rounded-lg bg-orange-500 text-white p-2 w-60">Register</button>
			</div>
		</form>
	</div>
</div>
