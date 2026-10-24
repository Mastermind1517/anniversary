export interface Memory {
  id: number;
  photo: string;
  date: string;
  title: string;
  caption: string;
}

export interface SiteConfig {
  partner: { name: string };
  opening: {
    line1: string;
    line2: string;
    enterText: string;
  };
  memories: Memory[];
  loveLetter: { text: string };
  finale: {
    line1: string;
    line2: string;
    closing: string;
  };
  audio: { src: string };
}

export const siteConfig: SiteConfig = {
  partner: { name: 'Krishangi' },

  opening: {
    line1: 'ONE YEAR.',
    line2: 'An entire world, in a thousand little moments.',
    enterText: 'Enter',
  },

  memories: [
    {
      id: 1,
      photo: '/photos/memory-01.jpg',
      date: '2025-10-24',
      title: 'The Beginning',
      caption: 'Where it all started.',
    },
    {
      id: 2,
      photo: '/photos/memory-02.jpg',
      date: '2025-12-25',
      title: 'First Winter',
      caption: 'Our first winter together.',
    },
    {
      id: 3,
      photo: '/photos/memory-03.jpg',
      date: '2026-02-14',
      title: 'Valentine\'s Day',
      caption: 'A day that felt like a lifetime.',
    },
    {
      id: 4,
      photo: '/photos/memory-04.jpg',
      date: '2026-04-15',
      title: 'Spring',
      caption: 'Everything in bloom.',
    },
    {
      id: 5,
      photo: '/photos/memory-05.jpg',
      date: '2026-07-20',
      title: 'Summer Days',
      caption: 'Long days, warm nights.',
    },
    {
      id: 6,
      photo: '/photos/memory-06.jpg',
      date: '2026-09-10',
      title: 'Almost There',
      caption: 'Counting down to us.',
    },
  ],

  loveLetter: {
    text: `My dearest Krishangi,

One year. It sounds so simple when you say it — just two small words. But inside those words lives an entire universe of moments that changed me.

I remember the way ordinary things became extraordinary with you. How a quiet evening could feel like the most important night in the world. How your laugh could turn a difficult day into something I was grateful for.

You taught me that love isn't always the grand gestures. It's the small ones — the ones no one else sees. The way you remember the little things. The way you make space for me to be exactly who I am.

This year gave me something I didn't know I was missing. It gave me you.

And I want you to know — every single moment was worth it. Every one.

Here's to everything that's still waiting for us.

With all my love, always.`,
  },

  finale: {
    line1: 'One year behind us.',
    line2: 'And so much life still waiting for us.',
    closing: 'Happy First Anniversary.',
  },

  audio: { src: '/audio/ambient.mp3' },
};
