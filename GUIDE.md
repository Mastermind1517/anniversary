# Customization & Deployment Guide

This guide details how to customize all personal content and deploy Krishangi's anniversary experience to Vercel.

---

## 1. Adding Real Photographs (Memory Gallery)

The 3D gallery features 6 fine-art framed photographs.

1. Place your 6 relationship photos inside:
   ```
   public/photos/
   ├── memory-01.jpg
   ├── memory-02.jpg
   ├── memory-03.jpg
   ├── memory-04.jpg
   ├── memory-05.jpg
   └── memory-06.jpg
   ```
   *(JPEG or WebP with 4:3 or 3:2 landscape orientation works best).*

2. Update dates, titles, and captions in [`src/config/content.ts`](file:///d:/downloads/college/gf/src/config/content.ts):
   ```typescript
   memories: [
     {
       id: 1,
       photo: '/photos/memory-01.jpg',
       date: '2025-10-24',
       title: 'The Day We Met',
       caption: 'Your personal memory caption here...',
     },
     // ...
   ]
   ```

---

## 2. Personalizing the Love Letter

Open [`src/config/content.ts`](file:///d:/downloads/college/gf/src/config/content.ts) and edit the `loveLetter.text` property:

```typescript
loveLetter: {
  text: `My dearest Krishangi,

[Your letter text here...]

With all my love, always.`
}
```

The letter modal preserves paragraph spacing and renders in Cormorant Garamond with luxury editorial margins.

---

## 3. Adding Ambient Background Music

1. Obtain a soft, gentle royalty-free piano or cello track (MP3 format).
2. Save it to:
   ```
   public/audio/ambient.mp3
   ```
3. The subtle speaker icon in the bottom-right corner will automatically enable ambient playback when tapped. (If no file is present, the toggle hides gracefully without errors).

---

## 4. Running Locally

To run the experience on your local computer:

```bash
npm run dev
```

Open `http://localhost:4321` in your browser.

---

## 5. Deploying to Vercel

### Option A: Via GitHub (Recommended)
1. Push this repository to your GitHub account:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/anniversary.git
   git push -u origin master
   ```
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import the repository. Vercel automatically detects Astro and deploys it in under a minute!

### Option B: Via Vercel CLI
Run in your terminal:
```bash
npx vercel
```
Follow the prompts (accept default settings) to receive a live production URL instantly.
