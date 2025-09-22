<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
    import 'virtual:uno.css'; // ← これを追加
    import { page } from '$app/stores';

	let { children } = $props();

	// Game tabs (top segmented control for Codes page)
	const gameTabs = [
		{ key: 'genshin', label: 'Genshin' },
		{ key: 'hkrpg', label: 'HSR' },
		{ key: 'nap', label: 'ZZZ' }
	] as const;


	// Theme handling (light/dark)
	function applyTheme(theme: 'light' | 'dark') {
		const root = document.documentElement;
		if (theme === 'dark') root.classList.add('dark');
		else root.classList.remove('dark');
		localStorage.setItem('theme', theme);
	}

	function toggleTheme() {
		const isDark = document.documentElement.classList.contains('dark');
		applyTheme(isDark ? 'light' : 'dark');
	}

	// Initialize theme from OS or localStorage
	if (typeof window !== 'undefined') {
		const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
		if (saved) applyTheme(saved);
		else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			applyTheme('dark');
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen text-neutral-900 dark:text-neutral-100 hoyo-bg">
	<!-- Top Header -->
	<header class="sticky top-0 z-40 hoyo-header">
		<div class="container flex h-14 items-center justify-between">
			<div class="flex items-center gap-3">
				<img src={favicon} alt="Astris" class="h-6 w-6" />
	  		<span class="font-semibold tracking-tight">Astris</span>
			</div>

			<!-- Game tabs for Codes: underlined nav -->
			<nav class="hidden md:flex hoyo-tabs">
				{#each gameTabs as t}
					<a
						href={`/codes?game=${t.key}`}
						class={`hoyo-tab ${($page.url.pathname === '/codes' && (($page.url.searchParams.get('game') ?? 'hkrpg') === t.key)) ? 'hoyo-tab-active' : ''}`}
					>{t.label}</a>
				{/each}
			</nav>

			<div class="flex items-center gap-2">
				<button class="h-8 w-8 grid place-items-center rounded-md bg-neutral-100/70 dark:bg-neutral-800/60 hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 focus-ring" on:click={toggleTheme} aria-label="Toggle theme">🌓</button>
			</div>
		</div>
	</header>

	<!-- Fixed left Navigation Bar -->
		<aside class="hidden md:flex fixed top-14 bottom-0 left-0 w-[220px] p-2 bg-white/80 dark:bg-[#0b1220]/80 border-r border-neutral-200/70 dark:border-neutral-800/70 backdrop-blur">
			<nav class="flex flex-col gap-1 w-full overflow-y-auto">
				<p class="px-3 py-2 text-xs uppercase tracking-wider muted">Navigation</p>
				<a href="/" class="px-3 py-2 rounded-md hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60 transition-colors">🏠 Builds</a>
				<a href="/codes" class="px-3 py-2 rounded-md hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60 transition-colors">🔑 Code Tracker</a>
				
				<div class="my-3 divider" />
				
				<p class="px-3 py-2 text-xs uppercase tracking-wider muted">Info</p>
				<a href="#" class="px-3 py-2 rounded-md hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60 transition-colors">✉️ Contact Us</a>
				<a href="#" class="px-3 py-2 rounded-md hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60 transition-colors">⚖️ Legal</a>
			</nav>
		</aside>

	<!-- Content -->
	<div class="container py-6 md:pl-[236px]">
		<main>
			{@render children?.()}
		</main>
	</div>
</div>
