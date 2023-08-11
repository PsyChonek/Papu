<!-- Footer with version, github link and author -->
<script>
    import {version} from '$app/environment' 
</script>

<footer class="m-auto">
	<div class="flex flex-row items-center justify-center gap-10">
		<a href="https://github.com/PsyChonek/Papu" class="hover:scale-150 text-center font-bold text-orange-500">Github</a>
		<a href="authors" class="hover:scale-150 text-center font-bold text-blue-600">Authors</a> 
		<h1 class="text-center">{version}UTC</h1>
	</div>
</footer>