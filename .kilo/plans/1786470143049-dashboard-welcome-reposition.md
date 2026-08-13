# Plan: Reposition Welcome Message in Siswa Dashboard Banner

## Goal
Adjust the welcome header banner in `resources/js/pages/Siswa/Dashboard.tsx` so the "Selamat datang, {nama}" text sits on the right side, vertically centered, with comfortable spacing from the right edge.

## Current State
- Banner uses `relative` container with `space-y-2` inner div
- All content (badge, welcome heading, description) is stacked on the left
- No horizontal layout separation

## Target Layout
- **Desktop:** badge "Portal Digital Al Bayan" on the left; welcome heading + description stacked on the right side, vertically centered within the banner, with right margin so it doesn't touch the edge.
- **Mobile:** badge on top, welcome + description below, left-aligned or centered as space allows.

## Changes Required

### File: `resources/js/pages/Siswa/Dashboard.tsx`
Replace the inner banner content structure (lines 68–79):

**From:**
```tsx
<div className="relative z-10 space-y-2">
    <div className="inline-flex ...">Portal Digital Al Bayan</div>
    <h2>Selamat datang, {userName}</h2>
    <p className="max-w-2xl ...">Kelola program...</p>
</div>
```

**To:**
```tsx
<div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium text-white/90 backdrop-blur-md shrink-0">
        <Sparkles className="size-3.5 text-amber-300" />
        Portal Digital Al Bayan
    </div>
    <div className="text-right max-w-xl sm:mr-6">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Selamat datang, {userName}
        </h2>
        <p className="text-sm leading-relaxed text-white/80 sm:text-base">
            Kelola program, pembayaran, dan informasi asrama Anda dalam satu portal terpadu.
        </p>
    </div>
</div>
```

## Validation
- `npm run build` succeeds
- Visual check: welcome text is on the right, vertically centered on desktop, with margin from right edge
- Mobile view stacks cleanly without overflow
