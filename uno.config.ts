import { defineConfig, presetUno } from 'unocss';

export default defineConfig({
  presets: [presetUno()],
  theme: {
    colors: {
      brand: {
        primary: '#8b5cf6',
        secondary: '#06b6d4'
      },
      blueprint: {
        primary: '#1e6bff',
        accent: '#4da3ff'
      },
      hoyo: {
        blue: '#2b5bd9',
        blueDark: '#1f3fb3',
        link: '#2a6cf1',
        bg: '#f5f7fb'
      }
    }
  },
  shortcuts: {
    // Layout helpers
    'container': 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8',

    // UI atoms
    'btn': 'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-medium bg-brand-primary text-white hover:bg-violet-600 active:bg-violet-700 transition-colors',
    'btn-gradient': 'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-medium text-white bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 hover:brightness-110 active:brightness-95 transition-all shadow-sm',
    'btn-ghost': 'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 transition-colors',
    'btn-hoyo': 'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-semibold text-white bg-[var(--hoyo-blue,#2b5bd9)] hover:bg-[var(--hoyo-blue-dark,#1f3fb3)] active:bg-[var(--hoyo-blue-dark,#1f3fb3)] transition-colors',
    'card': 'rounded-xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/70 dark:bg-neutral-900/60 shadow-sm',

    // Modern look & feel
    'glass': 'backdrop-blur-md bg-white/60 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60',
    'pill': 'rounded-full border border-neutral-200/70 dark:border-neutral-700/70',
    'focus-ring': 'outline-none ring-2 ring-brand-primary/40 ring-offset-2 ring-offset-white dark:ring-offset-neutral-950',
    'card-float': 'transition-transform transition-colors duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md',
    'soft-shadow': 'shadow-[0_8px_30px_rgb(0_0_0_/_0.08)]',
    'card-aurora': 'rounded-2xl p-[1px] bg-gradient-to-br from-violet-500/35 via-fuchsia-500/25 to-cyan-400/25',
    'surface': 'rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/70 dark:bg-neutral-900/60',
    'text-gradient': 'bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent',
    'muted': 'text-neutral-600 dark:text-neutral-300',
    'divider': 'border-t border-neutral-200/70 dark:border-neutral-800/70',

    // Blueprint style helpers (kept for previous pages)
    'bp-grid-bg': 'relative bg-[radial-gradient(40rem_40rem_at_120%_-20%,rgba(30,107,255,0.06),transparent),radial-gradient(30rem_30rem_at_-10%_10%,rgba(77,163,255,0.06),transparent)] dark:bg-[radial-gradient(40rem_40rem_at_120%_-20%,rgba(30,107,255,0.10),transparent),radial-gradient(30rem_30rem_at_-10%_10%,rgba(77,163,255,0.12),transparent)] before:content-\'\' before:absolute before:inset-0 before:pointer-events-none before:opacity-[0.08] dark:before:opacity-[0.12] before:[background-image:linear-gradient(rgba(0,0,0,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.55)_1px,transparent_1px)] dark:before:[background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] before:bg-[length:22px_22px] before:-z-10',
    'bp-surface': 'rounded-2xl border border-[rgba(30,80,200,0.15)] dark:border-[rgba(120,160,255,0.18)] bg-white/92 dark:bg-[#0b1020]/72 backdrop-blur-sm shadow-[0_8px_28px_rgba(20,40,120,0.08)]',
    'bp-chevron-btn': 'relative inline-flex items-center justify-center gap-2 h-11 px-5 font-semibold text-white bg-[rgb(30,107,255)] hover:bg-[rgb(23,87,204)] active:bg-[rgb(19,73,170)] transition-all shadow-sm [clip-path:polygon(14px_0,100%_0,calc(100%-14px)_100%,0_100%)]',
    'bp-watermark': 'pointer-events-none select-none absolute right-1 md:right-2 top-24 rotate-90 origin-top-right text-[8rem] md:text-[10rem] lg:text-[12rem] font-extrabold tracking-widest text-[rgb(10,40,100)]/6 dark:text-white/5',

    // HoyoLab-like helpers
    'hoyo-bg': 'bg-[#f5f7fb] dark:bg-[#0a0f1f]',
    'hoyo-header': 'bg-white/95 dark:bg-[#0b1220]/95 backdrop-blur border-b border-neutral-200/70 dark:border-neutral-800/70',
    'hoyo-tabs': 'flex items-center gap-4',
    'hoyo-tab': 'inline-flex items-center h-10 -mb-px px-1 border-b-2 border-transparent text-neutral-600 dark:text-neutral-300 hover:text-[var(--hoyo-blue,#2b5bd9)] hover:border-[var(--hoyo-blue,#2b5bd9)] transition-colors',
    'hoyo-tab-active': 'text-[var(--hoyo-blue,#2b5bd9)] border-[var(--hoyo-blue,#2b5bd9)] font-semibold',
    'hoyo-card': 'rounded-xl bg-white dark:bg-[#0d1428] border border-neutral-200/70 dark:border-neutral-800/70 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
  }
});
