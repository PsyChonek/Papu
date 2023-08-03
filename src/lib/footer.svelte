<!-- Footer with version, github link and author -->
<script>
    import {version} from '$app/environment' 

</script>

<footer class="absolute bottom-0 w-full">
	<div class="flex flex-row items-center justify-center gap-10 mb-5 h-2">
		<a href="https://github.com/PsyChonek/Papu" class="hover:scale-150 text-center font-bold text-orange-500"> Github </a>
		<a href="https://vazacdaniel.com/" class="hover:scale-150 text-center font-bold">Daniel Vazač</a> 
		<h1 class="text-center">{version}</h1>
	</div>
</footer>