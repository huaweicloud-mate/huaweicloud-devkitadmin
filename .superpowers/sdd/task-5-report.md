# Task 5 Report: 前端顶栏展示自动刷新信息 + 卸载清理

## Status: DONE

## What was implemented

Modified `src/pages/dashboard/index.vue` (only file touched):

1. **Step 1 — 顶栏文案**: replaced the realtime template line so that when `isRealtime` is active the top-bar badge shows「· 每 {{ store.refreshIntervalMinutes }} 分钟自动刷新」after the「计算于」suffix. Old line:
   `<template v-if="isRealtime">⚡ 当天实时{{ store.computedAt ? `（计算于 ${store.computedAt}）` : '' }}</template>`
   New line (verbatim from brief):
   `<template v-if="isRealtime">⚡ 当天实时{{ store.computedAt ? `（计算于 ${store.computedAt}）` : '' }} · 每 {{ store.refreshIntervalMinutes }} 分钟自动刷新</template>`

2. **Step 2 — 卸载清理**:
   - Added `onUnmounted` to the vue import: `import { ref, computed, nextTick, watch, onMounted, onBeforeUnmount, onUnmounted } from 'vue'`
   - Appended right after `const store = useDashboardStore()`:
     ```ts
     /** 组件卸载时停止实时自动刷新定时器，避免泄漏 */
     onUnmounted(() => {
       store.stopAutoRefresh()
     })
     ```

Verified preconditions before editing: the realtime template line (line 43) and the `computed` import line (line 358) matched the brief's assumptions exactly. Store API (`refreshIntervalMinutes`, `startAutoRefresh`, `stopAutoRefresh`) confirmed present in `src/store/dashboard.ts` (Task 4).

Self-review findings:
- Diff is minimal and exactly matches the brief text (7 insertions, 2 deletions).
- `onUnmounted` lifecycle hook is correctly registered inside `<script setup>` so Vue calls `store.stopAutoRefresh()` on route switch / unmount, clearing the interval set up by Task 4's `setDateRange`.
- No access to `store.refreshIntervalMinutes` when `isRealtime` is false (template guards with `v-if`), so no display change on the T-1 view.
- No package.json / package-lock.json changes; no `npm install` needed.

## Verification results

### `npx vue-tsc --noEmit`
- Exit code: 0, no output (passed).

### `npm run build`
- Exit code 0, build succeeded: `✓ 672 modules transformed ... ✓ built in 12.63s`
- Output `dist/` produced (index.html + assets).
- Only pre-existing warnings, no errors:
  - Dart Sass legacy JS API + `@import` deprecation warnings (pre-existing in `src/styles/index.scss`).
  - Chunk size warning (>500 kB, pre-existing echarts bundle).

## Files changed
- `src/pages/dashboard/index.vue` (modified)

## Commit
- `6c5be96` feat: show auto-refresh interval and cleanup timer on unmount (issue-30)
- Branch: `feat/issue-30-auto-refresh` (now 3 commits ahead of `origin/develop`: fdc8f84, e00f20d, 6c5be96)

## Notes / concerns
- None blocking. The frontend single-file realtime top-bar was the only UI change; the 「每 N 分钟」 label reads from Task 4's `refreshIntervalMinutes` state and updates live if the interval is changed mid-session.

---

## Fix: epoch-guard auto-refresh timer against in-flight/switch-away/unmount leaks; re-arm on mount (whole-branch review findings)

### What changed

**1. `src/store/dashboard.ts` — epoch counter closes both lifecycle leaks**
- Added store-scoped `let autoRefreshEpoch = 0` next to `autoRefreshTimer` (dashboard.ts:281).
- `stopAutoRefresh()` (dashboard.ts:285-291) now increments `autoRefreshEpoch` before clearing the interval. Any in-flight `startAutoRefresh()` awaiting the config GET now has its epoch invalidated — including on switch-away to T-1 and on unmount (`onUnmounted` → `stopAutoRefresh`).
- `startAutoRefresh()` (dashboard.ts:294-312) captures `const epoch = autoRefreshEpoch` immediately after its `stopAutoRefresh()` call, and after the await bails — does NOT arm — unless `autoRefreshEpoch === epoch && dateRange.value === 'realtime'`. This kills leak 1 (orphaned re-arm after switch-away/unmount) and leak 2 (concurrent re-arm double-hold: overlapping config GETs can no longer have a stale coroutine arm after a newer one overwrote `autoRefreshTimer`).

**2. `src/pages/dashboard/index.vue` — re-arm on mount when still in realtime** (index.vue:497-502)
- `onMounted` now calls `if (store.dateRange === 'realtime') await store.startAutoRefresh()` after `loadBusinessMetrics()`. Without this, navigate-away-and-back while still in realtime showed「每 N 分钟自动刷新」but the timer stayed dead (killed by `onUnmounted`). Re-arm relies on the shared single Pinia instance persisting `store.dateRange` across navigations (plain route, no keep-alive) — same instance, so it works.

### Verification results

- `npx vue-tsc --noEmit` — exit 0, passed.
- `npm run build` — exit 0, `✓ 672 modules transformed ... ✓ built in 15.06s`; only pre-existing Dart-Sass deprecation and chunk-size warnings.

### Commit
- `720ee09` fix: epoch-guard auto-refresh timer against in-flight/switch-away/unmount leaks; re-arm on mount (issue-30) — 2 files, +8/-3.