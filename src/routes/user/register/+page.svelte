<script lang="ts">
	import type { Form } from './+page';
	let formInput = {} as Form;
</script>

<div id="main">
	<div class="rounded-xl bg-gray-100 p-5 m-2 mx-auto">
		<h1 class="font-bold text-4xl text-center mb-8">Register</h1>

        {#if formInput?.passwordConfirm}<p class="error">The email field is required</p>{/if}

		<!-- Form -->
		<form method="post" action="?/register" class="flex flex-col gap-6 m-2">
			<div class="flex flex-row items-center justify-evenly gap-6">
				<h1 class="font-bold mr-auto text-2xl">Username</h1>
				<input required type="text" placeholder="Username" value={formInput?.username ?? ''} class="w-60 rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none" />
			</div>
			<div class="flex flex-row items-center justify-evenly gap-6">
				<h1 class="font-bold mr-auto text-2xl">Email</h1>
				<input required type="email" placeholder="Email" value={formInput.email ?? ''} class="w-60 rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none" />
			</div>
			<div class="flex flex-row items-center justify-evenly gap-6">
				<h1 class="font-bold mr-auto text-2xl">Password</h1>
				<input required type="password" placeholder="Password" value={formInput.password ?? ''} class="w-60 rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none" />
			</div>
			<div class="flex flex-row items-center justify-evenly gap-6">
				<p class="font-bold mr-auto text-2xl">Password confirm</p>
				<input required type="password" placeholder="Password confirm" value={formInput.passwordConfirm ?? ''} class="w-60 rounded-lg p-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none" />
			</div>
            <!-- Button -->
            <div class="flex flex-row justify-center gap-5">
                <button formaction="?/register" class="rounded-lg bg-orange-500 text-white p-2 w-60">Register</button>
            </div>
		</form>

	</div>
</div>
