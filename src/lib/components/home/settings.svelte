<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    let iban = '';

    function closeModal() {
        dispatch('close');
    }

    function saveSettings() {
        // Add your save logic here
        console.log('IBAN:', iban);
        closeModal();
    }
</script>

<div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">Settings</h2>
        <div class="mb-4">
            <label for="iban" class="block text-sm font-medium text-gray-700">IBAN</label>
            <input
                type="text"
                id="iban"
                bind:value={iban}
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
        </div>
        <div class="flex justify-end">
            <button
                on:click={closeModal}
                class="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
            >
                Cancel
            </button>
            <button
                on:click={saveSettings}
                class="bg-indigo-600 text-white px-4 py-2 rounded-md"
            >
                Save
            </button>
        </div>
    </div>
</div>