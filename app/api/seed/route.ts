import { prisma } from "@/lib/prisma"; // or wherever your prisma client is
import { NextResponse } from "next/server";


const verses = [
  { reference: "John 3:16", book: "John", chapter: 3, verse: 16, text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.", translation: "NIV" },
  { reference: "Romans 8:28", book: "Romans", chapter: 8, verse: 28, text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.", translation: "NIV" },
  { reference: "Philippians 4:13", book: "Philippians", chapter: 4, verse: 13, text: "I can do all this through him who gives me strength.", translation: "NIV" },
  { reference: "Jeremiah 29:11", book: "Jeremiah", chapter: 29, verse: 11, text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", translation: "NIV" },
  { reference: "Psalm 23:1", book: "Psalm", chapter: 23, verse: 1, text: "The Lord is my shepherd, I lack nothing.", translation: "NIV" },
  { reference: "Proverbs 3:5", book: "Proverbs", chapter: 3, verse: 5, text: "Trust in the Lord with all your heart and lean not on your own understanding.", translation: "NIV" },
  { reference: "Isaiah 40:31", book: "Isaiah", chapter: 40, verse: 31, text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.", translation: "NIV" },
  { reference: "Matthew 28:19", book: "Matthew", chapter: 28, verse: 19, text: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.", translation: "NIV" },
  { reference: "Romans 3:23", book: "Romans", chapter: 3, verse: 23, text: "For all have sinned and fall short of the glory of God.", translation: "NIV" },
  { reference: "Romans 6:23", book: "Romans", chapter: 6, verse: 23, text: "For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord.", translation: "NIV" },
  { reference: "Ephesians 2:8", book: "Ephesians", chapter: 2, verse: 8, text: "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God.", translation: "NIV" },
  { reference: "Galatians 2:20", book: "Galatians", chapter: 2, verse: 20, text: "I have been crucified with Christ and I no longer live, but Christ lives in me.", translation: "NIV" },
  { reference: "2 Timothy 3:16", book: "2 Timothy", chapter: 3, verse: 16, text: "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness.", translation: "NIV" },
  { reference: "Hebrews 11:1", book: "Hebrews", chapter: 11, verse: 1, text: "Now faith is confidence in what we hope for and assurance about what do not see.", translation: "NIV" },
  { reference: "James 1:2", book: "James", chapter: 1, verse: 2, text: "Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds.", translation: "NIV" },
  { reference: "1 John 1:9", book: "1 John", chapter: 1, verse: 9, text: "If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.", translation: "NIV" },
  { reference: "Psalm 119:105", book: "Psalm", chapter: 119, verse: 105, text: "Your word is a lamp for my feet, a light on my path.", translation: "NIV" },
  { reference: "Matthew 6:33", book: "Matthew", chapter: 6, verse: 33, text: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.", translation: "NIV" },
  { reference: "Romans 12:2", book: "Romans", chapter: 12, verse: 2, text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind.", translation: "NIV" },
  { reference: "Philippians 4:6", book: "Philippians", chapter: 4, verse: 6, text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.", translation: "NIV" },
  { reference: "Psalm 46:1", book: "Psalm", chapter: 46, verse: 1, text: "God is our refuge and strength, an ever-present help in trouble.", translation: "NIV" },
  { reference: "Isaiah 41:10", book: "Isaiah", chapter: 41, verse: 10, text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.", translation: "NIV" },
  { reference: "John 14:6", book: "John", chapter: 14, verse: 6, text: "Jesus answered, I am the way and the truth and the life. No one comes to the Father except through me.", translation: "NIV" },
  { reference: "Matthew 11:28", book: "Matthew", chapter: 11, verse: 28, text: "Come to me, all you who are weary and burdened, and I will give you rest.", translation: "NIV" },
  { reference: "1 Corinthians 13:4", book: "1 Corinthians", chapter: 13, verse: 4, text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.", translation: "NIV" },
  { reference: "Psalm 27:1", book: "Psalm", chapter: 27, verse: 1, text: "The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?", translation: "NIV" },
  { reference: "John 16:33", book: "John", chapter: 16, verse: 33, text: "I have told you these things, so that in me you may have peace. In this world you will have trouble. But take heart! I have overcome the world.", translation: "NIV" },
  { reference: "Proverbs 31:25", book: "Proverbs", chapter: 31, verse: 25, text: "She is clothed with strength and dignity; she can laugh at the days to come.", translation: "NIV" },
  { reference: "Colossians 3:23", book: "Colossians", chapter: 3, verse: 23, text: "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.", translation: "NIV" },
  { reference: "Genesis 1:1", book: "Genesis", chapter: 1, verse: 1, text: "In the beginning God created the heavens and the earth.", translation: "NIV" },
];

export async function GET() {
  try {
    for (const v of verses) {
      await prisma.verse.upsert({
        where: { reference_translation: { reference: v.reference, translation: v.translation } },
        update: {},
        create: { ...v, isSeed: true, userId: null },
      });
    }
    return NextResponse.json({ message: "Seeded successfully!" });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}