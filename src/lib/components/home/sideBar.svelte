<script>
	var showSideBar = true;
</script>

<div class="bg-red-50 h-screen w-1/5 fixed left-0 top-0">
	<div class="flex flex-row justify-around m-5 items-baseline">
		<h1 class="font-bold text-xl">Orders</h1>
		<button on:click={() => (showSideBar = !showSideBar)} class="border-2 border-orange-500 rounded-xl p-1">{showSideBar ? 'Hide' : 'Show'}</button>
	</div>
		<div>
			<h1 class="font-bold text-xl">15. 4. 23</h1>
		</div>
        <div>
            <h1 class="font-bold text-xl">15. 4. 23</h1>
        </div>
</div>
