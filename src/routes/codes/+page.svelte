<script lang="ts">
  import { onMount } from 'svelte';
  import primogemUrl from '$lib/assets/primogem.png';
  import stellarjadeUrl from '$lib/assets/stellarjade.png';
  import polychromeUrl from '$lib/assets/polychrome.png';
  // ZZZ (nap) specific assets
  import dennyUrl from '$lib/assets/nap/denny.png';
  import officialLogsUrl from '$lib/assets/nap/official investigator logs.png';
  import wEngineSuppliesUrl from '$lib/assets/nap/w-engine power supplies .png';
  import bangbooAlgoUrl from '$lib/assets/nap/bangboo algorithm module.png';
  // HSR (hkrpg) specific assets
  import fuelUrl from '$lib/assets/hkrpg/Fuel.png';
  import travelersGuideUrl from "$lib/assets/hkrpg/Traveler's Guide.png";

  // Receive page data from server load and selectedGame from layout slot
  let { data, selectedGame } = $props<{ data: any; selectedGame?: string }>();


  function labelFor(game: string | undefined) {
    switch (game) {
      case 'genshin':
        return 'Genshin Impact';
      case 'hkrpg':
        return 'Honkai: Star Rail';
      case 'nap':
        return 'Zenless Zone Zero';
      default:
        return 'Codes';
    }
  }

  // Base redemption URLs per game (external)
  function redemptionBase(game: string | undefined): string {
    switch (game) {
      case 'genshin':
        return 'https://genshin.hoyoverse.com/en/gift?code=';
      case 'hkrpg':
        return 'https://hsr.hoyoverse.com/gift?code=';
      case 'nap':
        return 'https://zenless.hoyoverse.com/redemption?code=';
      default:
        return '';
    }
  }

  // Clicked codes persistence (line-through after clicked)
  let clickedCodes = new Set<string>();
  onMount(() => {
    try {
      const raw = localStorage.getItem('clickedCodes');
      if (raw) clickedCodes = new Set(JSON.parse(raw));
    } catch {}
  });
  function markClicked(code: string) {
    clickedCodes.add(code);
    try {
      localStorage.setItem('clickedCodes', JSON.stringify(Array.from(clickedCodes)));
    } catch {}
  }
  function isClicked(code: string) {
    return clickedCodes.has(code);
  }

  // Normalize incoming API data into a list for rendering
  type IconKey =
    | 'primogem'
    | 'stellarjade'
    | 'polychrome'
    | 'denny'
    | 'official_logs'
    | 'w_engine_supplies'
    | 'bangboo_algo'
    | 'fuel'
    | 'travelers_guide';

  type UiReward = { iconUrl?: string; iconKey?: IconKey; text: string };
  type UiCodeItem = { code: string; rewards: UiReward[]; addedAt?: number; description?: string };

  // Icon maps
  const iconMapEntries = [
    // Currencies
    { key: 'primogem', url: primogemUrl },
    { key: 'primogems', url: primogemUrl },
    { key: 'stellar jade', url: stellarjadeUrl },
    { key: 'stellarjade', url: stellarjadeUrl },
    { key: 'polychrome', url: polychromeUrl },
    { key: 'denny', url: dennyUrl },
    { key: 'dennies', url: dennyUrl },
    // ZZZ (nap) items
    { key: 'official investigator log', url: officialLogsUrl },
    { key: 'official investigator logs', url: officialLogsUrl },
    { key: 'w-engine power supply', url: wEngineSuppliesUrl },
    { key: 'w-engine power supplies', url: wEngineSuppliesUrl },
    { key: 'bangboo algorithm module', url: bangbooAlgoUrl },
    { key: 'bangboo algorithm modules', url: bangbooAlgoUrl },
    // HSR (hkrpg) items (keep some well-known ones as fallback)
    { key: 'fuel', url: fuelUrl },
    { key: "traveler's guide", url: travelersGuideUrl },
    { key: 'travelers guide', url: travelersGuideUrl },
    { key: 'traveller\'s guide', url: travelersGuideUrl },
    { key: 'travellers guide', url: travelersGuideUrl },
    { key: 'traveler’s guide', url: travelersGuideUrl }, // smart quote
    { key: 'travellers’ guide', url: travelersGuideUrl }
  ] as const;

  // Load all HSR (hkrpg) item icons by filename automatically
  const hsrIconFiles = import.meta.glob('$lib/assets/hkrpg/*.png', { eager: true, as: 'url' }) as Record<string, string>;
  const hsrIconByName = new Map<string, string>();
  for (const [path, url] of Object.entries(hsrIconFiles)) {
    const base = path.split('/').pop()?.replace(/\.png$/i, '') ?? '';
    if (!base) continue;
    const normalized = base.replace(/’/g, "'").trim();
    hsrIconByName.set(base, url); // exact
    hsrIconByName.set(base.toLowerCase(), url); // lowercase
    hsrIconByName.set(normalized.toLowerCase(), url); // smart quote normalized
  }

  function findHsrIconFromText(text: string): string | undefined {
    const name = rewardName(text); // clean quantity to get the item name
    if (!name) return undefined;
    const normalized = name.replace(/’/g, "'").trim();
    return (
      hsrIconByName.get(name) ||
      hsrIconByName.get(normalized) ||
      hsrIconByName.get(name.toLowerCase()) ||
      hsrIconByName.get(normalized.toLowerCase())
    );
  }

  // Load all Genshin item icons by filename automatically
  const genshinIconFiles = import.meta.glob('$lib/assets/genshin/*.png', { eager: true, as: 'url' }) as Record<string, string>;
  const genshinIconByName = new Map<string, string>();
  for (const [path, url] of Object.entries(genshinIconFiles)) {
    const base = path.split('/').pop()?.replace(/\.png$/i, '') ?? '';
    if (!base) continue;
    const normalized = base.replace(/’/g, "'").trim();
    genshinIconByName.set(base, url);
    genshinIconByName.set(base.toLowerCase(), url);
    genshinIconByName.set(normalized.toLowerCase(), url);
  }
  function findGenshinIconFromText(text: string): string | undefined {
    const raw = rewardName(text);
    if (!raw) return undefined;
    // Map shorthand/aliases to official item names for better filename matching
    const lower = raw.toLowerCase();
    let name = raw.trim();
    if (lower === 'mora') name = 'Mora';
    else if (lower.startsWith('stir')) name = 'Stir-Fried Fish Noodles';
    const normalized = name.replace(/’/g, "'").trim();
    return (
      genshinIconByName.get(name) ||
      genshinIconByName.get(normalized) ||
      genshinIconByName.get(name.toLowerCase()) ||
      genshinIconByName.get(normalized.toLowerCase())
    );
  }

  function mapIconKey(text: string | undefined): IconKey | undefined {
    if (!text) return undefined;
    const lower = text.toLowerCase();
    if (lower.includes('primogem')) return 'primogem';
    if (lower.includes('stellar jade') || lower.includes('stellarjade')) return 'stellarjade';
    if (lower.includes('polychrome')) return 'polychrome';
    if (lower.includes('denny') || lower.includes('dennies')) return 'denny';
    if (lower.includes('official investigator log')) return 'official_logs';
    if (lower.includes('w-engine power suppl')) return 'w_engine_supplies';
    if (lower.includes('bangboo algorithm module')) return 'bangboo_algo';
    if (lower.includes('fuel')) return 'fuel';
    if (lower.includes("traveler's guide") || lower.includes('travellers guide') || lower.includes("traveller's guide") || lower.includes('traveler’s guide') || lower.includes('travellers’ guide') || lower.includes('travelers guide')) return 'travelers_guide';
    return undefined;
  }

  function mapIcon(text: string | undefined): string | undefined {
    if (!text) return undefined;
    // Prefer dynamic lookup for HSR items by filename convention
    if (data?.game === 'hkrpg') {
      const byFile = findHsrIconFromText(text);
      if (byFile) return byFile;
    }
    // Try Genshin filename lookup
    if (data?.game === 'genshin') {
      const byFileG = findGenshinIconFromText(text);
      if (byFileG) return byFileG;
    }
    const lower = text.toLowerCase();
    const hit = iconMapEntries.find((c) => lower.includes(c.key));
    return hit?.url;
  }

  // Normalize ASCII 'x' used as a multiplier into the × symbol when it's between name and number
  function normalizeMultiplicationSymbols(s: string): string {
    // Replace "... x 123" or "... x123" (not inside words) with "... × 123"
    return s.replace(/(\S)\s*[xX]\s*(?=\d)/g, '$1 × ');
  }

  // Parse rewards from a free-form description text (fallback)
  function parseRewardsFromDescription(desc?: string): UiReward[] {
    if (!desc) return [];
    // Clean unwanted notes and normalize number formatting
    const cleaned = cleanDescription(desc);
    const normalized = normalizeMultiplicationSymbols(normalizeThousandSeparators(cleaned));

    // Pattern: repeated pairs like "Item Name × 30000"
    const pairRe = /(.+?)\s*×\s*([\d.,]+(?:\s*[kKmMbB])?)/g;
    const pairResults: UiReward[] = [];
    let m: RegExpExecArray | null;
    while ((m = pairRe.exec(normalized)) !== null) {
      const name = m[1].trim();
      const qty = (m[2] || '').replace(/\s+/g, '');
      const text = `${name} ×${qty}`;
      const iconKey = mapIconKey(name);
      const url = iconKey ? undefined : mapIcon(name);
      pairResults.push({ iconKey, iconUrl: url, text });
    }
    if (pairResults.length) return pairResults;

    // Fallback: split by common connectors and separators: newlines, comma, plus, slash, and words like 'and' or '&'
    const parts = normalized
      .split(/\n|\r|,|\+|\/|\band\b|\s&\s/gi)
      .map((p) => p.trim())
      .filter(Boolean);
    return parts.map((p) => {
      const iconKey = mapIconKey(p);
      const url = iconKey ? undefined : mapIcon(p);
      return { iconKey, iconUrl: url, text: p };
    });
  }

  // Map small number words to digits
  const numberWords: Record<string, number> = {
    a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20
  };

  function normalizeThousandSeparators(s: string): string {
    // Remove commas inside numbers like 6,666 -> 6666
    return s.replace(/(?<=\d),(?=\d)/g, '');
  }

  // Clean description text for parsing/display
  function cleanDescription(desc: string): string {
    let t = desc;
    // Remove the specific note "(this code works periodically)"
    t = t.replace(/\(this code works periodically\)/gi, '');
    // Collapse extra whitespace
    t = t.replace(/\s{2,}/g, ' ').trim();
    return t;
  }

  // Extract a quantity if present in the text (e.g., "100", "x50", or words like "two")
  function rewardQty(text: string): string | null {
    const cleaned = normalizeThousandSeparators(text);
    // Handle patterns like x20k, 20k, 1.5k, 2m, 3b, or plain numbers
    const m = cleaned.match(/(?:(?:x|×)\s*)?(\d+(?:\.\d+)?)\s*([kmb])?/i);
    if (m) {
      const num = parseFloat(m[1]);
      const unit = (m[2] || '').toLowerCase();
      let value = num;
      if (unit === 'k') value = num * 1_000;
      else if (unit === 'm') value = num * 1_000_000;
      else if (unit === 'b') value = num * 1_000_000_000;
      return String(Math.round(value));
    }
    // try number words at start
    const mw = cleaned.trim().toLowerCase().match(/^(a|an|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)\b/);
    if (mw) {
      const n = numberWords[mw[1]];
      if (n) return String(n);
    }
    return null;
  }

  // Get a pretty name without the quantity prefix/suffix
  function rewardName(text: string): string {
    let t = normalizeThousandSeparators(text);
    // remove xNN or NN (with optional decimal) and optional k/m/b suffix at start
    t = t.replace(/^\s*(?:x|×)?\s*\d+(?:\.\d+)?\s*[kKmMbB]?\s*/i, '');
    // remove number word at start
    t = t.replace(/^(a|an|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)\b\s*/i, '');
    // also remove trailing multiplier like "×10" or "x 20k"
    t = t.replace(/\s*(?:x|×)\s*\d+(?:\.\d+)?\s*[kKmMbB]?\s*$/i, '');
    // remove extra spaces and trailing punctuation
    return t.replace(/\s{2,}/g, ' ').replace(/[\s.,]+$/g, '').trim();
  }

  // Pretty label for display, with game-specific fixes
  function prettyRewardLabel(text: string, game?: string): string {
    const name = rewardName(text);
    if (game === 'genshin') {
      const lower = name.toLowerCase();
      if (lower === 'mora') return 'Mora';
      if (lower.startsWith('stir')) return 'Stir-Fried Fish Noodles';
    }
    return name;
  }

  function rewardsFor(item: UiCodeItem): UiReward[] {
    return item.rewards && item.rewards.length > 0
      ? item.rewards
      : parseRewardsFromDescription(item.description);
  }

  function normalizeCodes(raw: any[]): UiCodeItem[] {
    return (raw ?? [])
      .map((entry) => {
        const code: string = entry?.code ?? String(entry?.Code ?? entry?.id ?? '');
        const addedAt: number | undefined =
          typeof entry?.added_at === 'number'
            ? entry.added_at
            : typeof entry?.addedAt === 'number'
              ? entry.addedAt
              : undefined;
        let description: string | undefined = entry?.description ?? entry?.desc ?? undefined;

        let rewards: UiReward[] = [];
        const r = entry?.rewards ?? entry?.Rewards;
        if (Array.isArray(r)) {
          rewards = r.map((it: any) => {
            if (typeof it === 'string') {
              const iconKey = mapIconKey(it);
              const iconUrl = iconKey ? undefined : mapIcon(it);
              return { iconKey, iconUrl, text: it };
            }
            const name = it?.name ?? it?.item ?? it?.text ?? '';
            const amount = it?.amount ?? it?.qty ?? it?.count;
            const iconKey = mapIconKey(String(name));
            const iconFromItem = iconKey ? undefined : mapIcon(String(name));
            const iconUrl = it?.icon ?? iconFromItem ?? undefined;
            return { iconKey, iconUrl, text: amount ? `${name} ×${amount}` : String(name) };
          });
        } else if (typeof r === 'string') {
          // Some APIs provide rewards as a single free-form string.
          // Use it as description so the fallback reward table can parse it.
          if (!description) description = r;
        }

        // Clean description if present
        description = description ? cleanDescription(description) : undefined;

        return { code, rewards, addedAt, description } as UiCodeItem;
      })
      .filter((x) => x.code);
  }

  $effect(() => {
    // eslint-disable-next-line no-console
    console.debug('Loaded codes for', data?.game, data?.codes?.length ?? 0);
  });
</script>

<section class="relative space-y-6">
  <header class="space-y-2">
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold tracking-tight">{labelFor(data?.game)} — Code Collection</h1>
        <p class="text-sm muted mt-1">Active Codes via API</p>
      </div>

    </div>
  </header>


  {#if data?.error}
    <div class="card p-4 text-sm text-red-600 dark:text-red-400">
      API Error: {data.error}
    </div>
  {/if}

  {#if (data?.codes ?? []).length === 0}
    <p class="muted">No active codes found.</p>
  {:else}
    {#key data.game}
      <div class="grid gap-6 md:grid-cols-1 xl:grid-cols-2">
        {#each normalizeCodes(data.codes) as item, i}
          <!-- Modern, elegant card -->
          <article class="overflow-hidden">
            <div class="hoyo-card card-float overflow-hidden relative">
            <!-- Accent bar on the left -->
            <div class="absolute left-0 top-0 h-full w-1.5 bg-[rgb(30,107,255)]/90 dark:bg-[rgb(77,163,255)]/80"></div>

            <!-- Header: code + NEW + actions -->
            <div class="flex items-center justify-between pl-6 pr-4 py-3 border-b border-[rgba(30,80,200,0.15)] dark:border-[rgba(120,160,255,0.18)] bg-[rgba(30,107,255,0.05)] dark:bg-[rgba(30,107,255,0.08)]">
              <div class="flex items-center gap-2 min-w-0">
                {#if item.code}
                  <a
                    href={`${redemptionBase(data?.game)}${encodeURIComponent(item.code)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    class={`font-semibold tracking-wide text-sm truncate hover:underline transition-colors ${isClicked(item.code) ? 'line-through text-neutral-500 dark:text-neutral-400' : ''}`}
                    on:click={() => markClicked(item.code)}
                    title="Redeem this code"
                  >{item.code}</a>
                {/if}
                {#if item.addedAt && item.addedAt > Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60}
                  <span class="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-brand-primary/15 text-brand-primary">NEW</span>
                {/if}
              </div>
              <a
                href={`${redemptionBase(data?.game)}${encodeURIComponent(item.code)}`}
                target="_blank"
                rel="noopener noreferrer"
                class="h-7 w-7 grid place-items-center rounded-md text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 text-sm"
                on:click={() => { navigator.clipboard?.writeText(item.code); markClicked(item.code); }}
                title="Open redemption page"
                aria-label="Open redemption page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M15 3h6v6"></path>
                  <path d="M10 14L21 3"></path>
                  <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                </svg>
              </a>
            </div>

            <!-- Description (optional) -->
            {#if item.description}
              <div class="px-6 py-3 text-sm text-neutral-700 dark:text-neutral-300 bg-neutral-50/60 dark:bg-neutral-900/40">
                {item.description}
              </div>
            {/if}

            <!-- Rewards -->
            {#if rewardsFor(item)?.length}
              <div class="overflow-x-auto">
                <table class="w-full text-sm border-collapse">
                  <thead>
                    <tr class="bg-neutral-100/60 dark:bg-neutral-800/40">
                      <th class="text-left px-6 py-3 font-medium">Reward</th>
                      <th class="text-right px-4 py-3 font-medium">Qty</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-neutral-200/70 dark:divide-neutral-800/70">
                    {#each rewardsFor(item) as r}
                      <tr>
                        <td class="px-6 py-3">
                          <div class="flex items-center gap-3">
                            {#if r.iconKey === 'primogem'}
                              <img data-sveltekit-srcset src={primogemUrl} alt="Primogem" loading="lazy" decoding="async" class="w-6 h-6 rounded-full shadow" width="24" height="24" />
                            {:else if r.iconKey === 'stellarjade'}
                              <img data-sveltekit-srcset src={stellarjadeUrl} alt="Stellar Jade" loading="lazy" decoding="async" class="w-6 h-6 rounded-full shadow" width="24" height="24" />
                            {:else if r.iconKey === 'polychrome'}
                              <img data-sveltekit-srcset src={polychromeUrl} alt="Polychrome" loading="lazy" decoding="async" class="w-6 h-6 rounded-full shadow" width="24" height="24" />
                            {:else if r.iconKey === 'denny'}
                              <img data-sveltekit-srcset src={dennyUrl} alt="Denny" loading="lazy" decoding="async" class="w-6 h-6 rounded-full shadow" width="24" height="24" />
                            {:else if r.iconKey === 'official_logs'}
                              <img data-sveltekit-srcset src={officialLogsUrl} alt="Official Investigator Logs" loading="lazy" decoding="async" class="w-6 h-6 rounded-full shadow" width="24" height="24" />
                            {:else if r.iconKey === 'w_engine_supplies'}
                              <img data-sveltekit-srcset src={wEngineSuppliesUrl} alt="W-Engine Power Supplies" loading="lazy" decoding="async" class="w-6 h-6 rounded-full shadow" width="24" height="24" />
                            {:else if r.iconKey === 'bangboo_algo'}
                              <img data-sveltekit-srcset src={bangbooAlgoUrl} alt="Bangboo Algorithm Module" loading="lazy" decoding="async" class="w-6 h-6 rounded-full shadow" width="24" height="24" />
                            {:else if r.iconKey === 'fuel'}
                              <img data-sveltekit-srcset src={fuelUrl} alt="Fuel" loading="lazy" decoding="async" class="w-6 h-6 rounded-full shadow" width="24" height="24" />
                            {:else if r.iconKey === 'travelers_guide'}
                              <img data-sveltekit-srcset src={travelersGuideUrl} alt="Traveler's Guide" loading="lazy" decoding="async" class="w-6 h-6 rounded-full shadow" width="24" height="24" />
                            {:else if r.iconUrl}
                              <img src={r.iconUrl} alt="reward" loading="lazy" decoding="async" class="w-6 h-6 rounded-full shadow" width="24" height="24" />
                            {:else}
                              <span class="w-6 h-6 grid place-items-center">🎁</span>
                            {/if}
                            <span>{prettyRewardLabel(r.text, data?.game)}</span>
                          </div>
                        </td>
                        <td class="px-4 py-3 text-right tabular-nums">{rewardQty(r.text) ?? '-'}</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            {:else}
              <div class="px-5 py-3 text-sm muted">{item.description ?? 'No details available'}</div>
            {/if}
          </div>
          </article>
        {/each}
      </div>
    {/key}
  {/if}
</section>
