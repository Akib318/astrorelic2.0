// Generated from mission_stories.js and checked into the app.
// English story text, chapter order, interaction definitions and animation cues are preserved exactly.
// Bengali translations keep the existing bilingual UI complete.
import { getMission, type Destination } from './missions';

export interface ChapterText {
  en: string;
  bn: string;
}

export interface ChapterAnimation {
  cue: string;
  draw: ChapterText;
}

export type ChapterInteraction =
  | { type: 'tap'; prompt: ChapterText }
  | { type: 'hold'; prompt: ChapterText }
  | { type: 'drag'; prompt: ChapterText }
  | { type: 'choice'; prompt: ChapterText; options: ChapterText[]; answer: number | null };

export interface MissionChapter {
  id: string;
  number: number;
  title: ChapterText;
  story: ChapterText;
  animation: ChapterAnimation;
  interaction: ChapterInteraction | null;
}

export interface MissionStory {
  sourceId: string;
  missionId: string;
  sourceTitle: string;
  years: string;
  destination: Destination;
  chapters: MissionChapter[];
}

export const MISSION_STORIES: Record<string, MissionStory> = {
  "ranger": {
    sourceId: "lunar-ranger",
    missionId: "ranger",
    sourceTitle: "Lunar Ranger",
    years: "1964-1965",
    destination: "moon",
    chapters: [
    {
      id: "ranger-ch-01",
      number: 1,
      title: { en: "Six Failures", bn: "ছয়টি ব্যর্থতা" },
      story: { en: "NASA's first Ranger probes were meant to crash into the Moon on purpose, sending photos until the end. But the first six missions failed. Rockets misfired, cameras died, and one probe missed the Moon completely.", bn: "নাসার প্রথম রেঞ্জার অনুসন্ধানযানগুলো ইচ্ছাকৃতভাবে চাঁদে আঘাত করার জন্য তৈরি হয়েছিল—শেষ পর্যন্ত ছবি পাঠাতে পাঠাতে। কিন্তু প্রথম ছয়টি মিশনই ব্যর্থ হয়। রকেট ভুল দিকে গিয়েছিল, ক্যামেরা নষ্ট হয়েছিল, আর একটি যান চাঁদকে সম্পূর্ণ এড়িয়ে গিয়েছিল।" },
      animation: { cue: "probe-miss", draw: { en: "A small probe flies toward the Moon, then drifts past it into dark space.", bn: "একটি ছোট অনুসন্ধানযান চাঁদের দিকে উড়ে যায়, তারপর চাঁদকে এড়িয়ে অন্ধকার মহাশূন্যে ভেসে যায়।" } },
      interaction: { type: "tap", prompt: { en: "Tap to try again.", bn: "আবার চেষ্টা করতে ট্যাপ করুন।" } },
    },
    {
      id: "ranger-ch-02",
      number: 2,
      title: { en: "Ranger 7 Launches", bn: "রেঞ্জার ৭ উৎক্ষেপণ" },
      story: { en: "In July 1964, Ranger 7 finally had a perfect flight. Its six cameras woke up on the way to the Moon.", bn: "১৯৬৪ সালের জুলাইয়ে রেঞ্জার ৭ অবশেষে নিখুঁতভাবে উড়েছিল। চাঁদের পথে এর ছয়টি ক্যামেরা সক্রিয় হয়।" },
      animation: { cue: "launch-and-cruise", draw: { en: "Rocket lifts off, probe separates, Earth shrinks behind it.", bn: "রকেট উৎক্ষেপণ করে, অনুসন্ধানযান আলাদা হয়, পিছনে পৃথিবী ছোট হয়ে যায়।" } },
      interaction: { type: "hold", prompt: { en: "Hold to fire the engines.", bn: "ইঞ্জিন চালু করতে চেপে ধরুন।" } },
    },
    {
      id: "ranger-ch-03",
      number: 3,
      title: { en: "The Last 17 Minutes", bn: "শেষ ১৭ মিনিট" },
      story: { en: "As Ranger 7 fell toward the surface, it sent back thousands of pictures. Each one showed the ground in more detail than any telescope on Earth ever had.", bn: "রেঞ্জার ৭ পৃষ্ঠের দিকে পড়তে পড়তে হাজার হাজার ছবি পাঠায়। প্রতিটি ছবিতে ভূমি পৃথিবীর যেকোনো টেলিস্কোপের চেয়ে বেশি বিস্তারিত দেখা যায়।" },
      animation: { cue: "zoom-descent", draw: { en: "Moon surface zooms in frame by frame, craters getting sharper.", bn: "চন্দ্রপৃষ্ঠ ফ্রেমে ফ্রেমে জুম হয়, গর্তগুলো ক্রমে স্পষ্ট হয়ে ওঠে।" } },
      interaction: { type: "tap", prompt: { en: "Tap to capture a photo.", bn: "ছবি তুলতে ট্যাপ করুন।" } },
    },
    {
      id: "ranger-ch-04",
      number: 4,
      title: { en: "Crash and Success", bn: "সংঘর্ষ এবং সাফল্য" },
      story: { en: "Ranger 7 hit the Moon on purpose, ending its mission. Rangers 8 and 9 repeated the success. The photos showed Apollo planners the Moon was safe enough to land on.", bn: "রেঞ্জার ৭ ইচ্ছাকৃতভাবে চাঁদে আঘাত করে মিশন শেষ করে। রেঞ্জার ৮ ও ৯ সেই সাফল্য পুনরাবৃত্তি করে। ছবিগুলো অ্যাপোলো পরিকল্পনাকারীদের দেখায় যে চাঁদে অবতরণের মতো নিরাপদ জমি আছে।" },
      animation: { cue: "impact-flash", draw: { en: "Final frame goes static, then a map with landing zones lights up.", bn: "শেষ ফ্রেম স্ট্যাটিকে পরিণত হয়, তারপর অবতরণ অঞ্চলসহ একটি মানচিত্র জ্বলে ওঠে।" } },
      interaction: { type: 'choice', prompt: { en: "Which flat area looks safest for landing?", bn: "অবতরণের জন্য কোন সমতল এলাকা সবচেয়ে নিরাপদ মনে হয়?" }, options: [{ en: "Smooth plain", bn: "মসৃণ সমভূমি" }, { en: "Crater rim", bn: "গর্তের কিনারা" }, { en: "Steep hill", bn: "খাড়া পাহাড়" }], answer: 0 },
    },
    ],
  },
  "surveyor": {
    sourceId: "surveyor",
    missionId: "surveyor",
    sourceTitle: "Surveyor",
    years: "1966-1968",
    destination: "moon",
    chapters: [
    {
      id: "surveyor-ch-01",
      number: 1,
      title: { en: "A Soft Landing", bn: "নরম অবতরণ" },
      story: { en: "Crashing was easy. Landing gently was hard. Surveyor 1 fired a braking rocket and touched down softly in June 1966, the first American spacecraft to do so.", bn: "আঘাত করা সহজ ছিল। নরমে নামা কঠিন। সার্ভেয়র ১ ১৯৬৬ সালের জুনে ব্রেকিং রকেট চালিয়ে নরমে পৃষ্ঠে নামে—এমনটি করা প্রথম মার্কিন মহাকাশযান।" },
      animation: { cue: "retro-rocket-landing", draw: { en: "Lander descends, rocket flame shrinks, legs touch dust softly.", bn: "ল্যান্ডার নামে, রকেটের শিখা ছোট হয়, পাগুলো ধুলোয় আলতোভাবে ছোঁয়।" } },
      interaction: { type: "hold", prompt: { en: "Hold to slow the descent, release at the right height.", bn: "অবতরণ ধীর করতে চেপে ধরুন; সঠিক উচ্চতায় ছেড়ে দিন।" } },
    },
    {
      id: "surveyor-ch-02",
      number: 2,
      title: { en: "Will It Sink?", bn: "ডুবে যাবে?" },
      story: { en: "Scientists feared the Moon's dust was so deep a lander would vanish into it. Surveyor's footpads barely sank. The ground was solid.", bn: "বিজ্ঞানীরা আশঙ্কা করেছিলেন চাঁদের ধুলো এত গভীর যে ল্যান্ডার তার মধ্যে হারিয়ে যাবে। সার্ভেয়রের প্যাড প্রায় ডুবেইনি। মাটি ছিল শক্ত।" },
      animation: { cue: "footpad-closeup", draw: { en: "Close-up of a footpad resting on shallow dust.", bn: "অগভীর ধুলোর উপর বিশ্রামরত একটি পায়ের প্যাডের নিকট দৃশ্য।" } },
      interaction: { type: "tap", prompt: { en: "Tap the ground to test it.", bn: "পরীক্ষা করতে মাটিতে ট্যাপ করুন।" } },
    },
    {
      id: "surveyor-ch-03",
      number: 3,
      title: { en: "Testing the Soil", bn: "মাটি পরীক্ষা" },
      story: { en: "Surveyor 3 dug a small trench with a scoop arm. Surveyor 5 analyzed the soil chemistry. Surveyor 6 even lifted off and hopped a few meters to a new spot.", bn: "সার্ভেয়র ৩ একটি খনন বাহু দিয়ে ছোট পরিখা খোঁড়ে। সার্ভেয়র ৫ মাটির রসায়ন বিশ্লেষণ করে। সার্ভেয়র ৬ এমনকি উঠে কয়েক মিটার লাফ দিয়ে নতুন জায়গায় নামে।" },
      animation: { cue: "scoop-arm", draw: { en: "Robot arm scoops soil, then lander lifts, hops and lands.", bn: "রোবোটিক বাহু মাটি তোলে, তারপর ল্যান্ডার উঠে লাফ দিয়ে নামে।" } },
      interaction: { type: "drag", prompt: { en: "Drag the scoop to dig.", bn: "খনন করতে স্কুপটি টেনে নিন।" } },
    },
    {
      id: "surveyor-ch-04",
      number: 4,
      title: { en: "Five Landings", bn: "পাঁচটি অবতরণ" },
      story: { en: "Five of seven Surveyors landed successfully. Together they proved the Moon was ready for humans.", bn: "সাতটি সার্ভেয়রের মধ্যে পাঁচটি সফলভাবে নামে। তারা একসঙ্গে প্রমাণ করে যে চাঁদ মানুষ পাঠানোর জন্য প্রস্তুত।" },
      animation: { cue: "map-pins", draw: { en: "Moon map with five glowing landing pins appearing one by one.", bn: "চন্দ্র মানচিত্রে পাঁচটি জ্বলজ্বলে অবতরণ পিন একের পর এক জ্বলে ওঠে।" } },
      interaction: { type: 'choice', prompt: { en: "Why did NASA send Surveyors before astronauts?", bn: "নাসা নভোচারীদের আগে সার্ভেয়র পাঠিয়েছিল কেন?" }, options: [{ en: "To test if the ground can hold a lander", bn: "ল্যান্ডার মাটি ধরে রাখতে পারে কি না পরীক্ষা করতে" }, { en: "To bring back rocks", bn: "পাথর ফিরিয়ে আনতে" }, { en: "To build a base", bn: "ঘাঁটি বানাতে" }], answer: 0 },
    },
    ],
  },
  "lunar-orbiter": {
    sourceId: "lunar-orbiter",
    missionId: "lunar-orbiter",
    sourceTitle: "Lunar Orbiter",
    years: "1966-1967",
    destination: "moon",
    chapters: [
    {
      id: "lunar-orbiter-ch-01",
      number: 1,
      title: { en: "Mapping the Moon", bn: "চাঁদের মানচিত্র" },
      story: { en: "Five Lunar Orbiters circled the Moon to photograph it. NASA needed a map to choose safe places for Apollo to land.", bn: "পাঁচটি লুনার অরবিটার চাঁদকে প্রদক্ষিণ করে ছবি তোলে। অ্যাপোলোর নিরাপদ অবতরণস্থল বাছাই করতে নাসার একটি মানচিত্র দরকার ছিল।" },
      animation: { cue: "orbit", draw: { en: "Orbiter circles the Moon, a camera beam sweeping the surface.", bn: "অরবিটার চাঁদকে প্রদক্ষিণ করে, ক্যামেরার আলোকরশ্মি পৃষ্ঠে চলে।" } },
      interaction: { type: "drag", prompt: { en: "Drag the orbiter around the Moon.", bn: "অরবিটারটিকে চাঁদের চারদিকে টেনে ঘোরান।" } },
    },
    {
      id: "lunar-orbiter-ch-02",
      number: 2,
      title: { en: "Film in Space", bn: "মহাশূন্যে ফিল্ম" },
      story: { en: "The orbiter used real film. It developed photos on board, scanned them, and beamed them to Earth line by line.", bn: "অরবিটারটি সত্যিকারের ফিল্ম ব্যবহার করত। এটি ভেতরেই ছবি ডেভেলপ করত, স্ক্যান করত এবং লাইন ধরে ধরে পৃথিবীতে পাঠাত।" },
      animation: { cue: "film-scan", draw: { en: "Film strip develops, scans, and radio waves travel to Earth.", bn: "ফিল্ম স্ট্রিপ ডেভেলপ হয়, স্ক্যান হয়, আর রেডিও তরঙ্গ পৃথিবীর দিকে যায়।" } },
      interaction: { type: "tap", prompt: { en: "Tap to scan a strip.", bn: "একটি স্ট্রিপ স্ক্যান করতে ট্যাপ করুন।" } },
    },
    {
      id: "lunar-orbiter-ch-03",
      number: 3,
      title: { en: "The First Earthrise", bn: "প্রথম পৃথিবী-উদয়" },
      story: { en: "In August 1966, Lunar Orbiter 1 took a picture of Earth rising over the Moon's horizon. People saw their home planet from far away for the first time.", bn: "১৯৬৬ সালের আগস্টে লুনার অরবিটার ১ চাঁদের দিগন্তের উপরে পৃথিবী উঠে আসার ছবি তোলে। মানুষ প্রথমবার তাদের নিজের গ্রহকে অনেক দূর থেকে দেখে।" },
      animation: { cue: "earthrise", draw: { en: "Earth slowly rises behind the gray lunar horizon.", bn: "ধূসর চন্দ্র দিগন্তের পিছনে পৃথিবী ধীরে ধীরে উঠে আসে।" } },
      interaction: { type: "hold", prompt: { en: "Hold to frame the shot.", bn: "ছবিটি ফ্রেম করতে চেপে ধরুন।" } },
    },
    {
      id: "lunar-orbiter-ch-04",
      number: 4,
      title: { en: "Choosing Landing Sites", bn: "অবতরণস্থল বাছাই" },
      story: { en: "By the end, nearly the whole Moon was mapped. The flat plains it revealed became Apollo's landing sites.", bn: "শেষে প্রায় পুরো চাঁদের মানচিত্র তৈরি হয়। এটি যে সমতল ভূমি দেখায়, সেগুলোই অ্যাপোলোর অবতরণস্থল হয়।" },
      animation: { cue: "site-highlight", draw: { en: "Map zooms out, landing sites glow green.", bn: "মানচিত্র দূরে সরে যায়, অবতরণস্থলগুলো সবুজ হয়ে জ্বলে ওঠে।" } },
      interaction: { type: 'choice', prompt: { en: "What did the orbiters give Apollo?", bn: "অরবিটারগুলো অ্যাপোলোকে কী দিয়েছিল?" }, options: [{ en: "A map of safe sites", bn: "নিরাপদ স্থানের মানচিত্র" }, { en: "Moon rocks", bn: "চাঁদের পাথর" }, { en: "Fuel", bn: "জ্বালানি" }], answer: 0 },
    },
    ],
  },
  "apollo-8": {
    sourceId: "apollo-8",
    missionId: "apollo-8",
    sourceTitle: "Apollo 8",
    years: "1968",
    destination: "moon",
    chapters: [
    {
      id: "apollo-8-ch-01",
      number: 1,
      title: { en: "A Bold Decision", bn: "একটি সাহসী সিদ্ধান্ত" },
      story: { en: "In December 1968, NASA sent three astronauts, Frank Borman, Jim Lovell and Bill Anders, around the Moon. No human had ever left Earth's orbit.", bn: "১৯৬৮ সালের ডিসেম্বরে নাসা তিন নভোচারী—ফ্র্যাঙ্ক বোরম্যান, জিম লোভেল ও বিল অ্যান্ডার্স—কে চাঁদের চারদিকে পাঠায়। এর আগে কোনো মানুষ পৃথিবীর কক্ষপথ ছাড়েনি।" },
      animation: { cue: "saturn-liftoff", draw: { en: "Saturn V launches, smoke and fire, stage separation.", bn: "স্যাটার্ন ৫ উৎক্ষেপণ করে, ধোঁয়া ও আগুন, তারপর ধাপ আলাদা হয়।" } },
      interaction: { type: "hold", prompt: { en: "Hold to launch.", bn: "উৎক্ষেপণ করতে চেপে ধরুন।" } },
    },
    {
      id: "apollo-8-ch-02",
      number: 2,
      title: { en: "Burn to the Moon", bn: "চাঁদের দিকে দহন" },
      story: { en: "Three days later the crew reached the Moon and fired their engine on the far side, out of radio contact, to be captured into orbit.", bn: "তিন দিন পর দলটি চাঁদে পৌঁছায় এবং রেডিও যোগাযোগের বাইরে চাঁদের অপর পাশে ইঞ্জিন চালিয়ে কক্ষপথে ধরা পড়ে।" },
      animation: { cue: "radio-silence", draw: { en: "Spacecraft slips behind the Moon, signal bars drop to zero.", bn: "মহাকাশযান চাঁদের পিছনে চলে যায়, সংকেতের বার শূন্যে নেমে আসে।" } },
      interaction: { type: "tap", prompt: { en: "Tap to start the engine burn.", bn: "ইঞ্জিন বার্ন শুরু করতে ট্যাপ করুন।" } },
    },
    {
      id: "apollo-8-ch-03",
      number: 3,
      title: { en: "Earthrise", bn: "পৃথিবী-উদয়" },
      story: { en: "On the fourth orbit, Anders spotted Earth rising over the lunar horizon and took one of the most famous photos in history.", bn: "চতুর্থ কক্ষপথে অ্যান্ডার্স চন্দ্র দিগন্তের উপরে পৃথিবী উঠতে দেখেন এবং ইতিহাসের অন্যতম বিখ্যাত ছবি তোলেন।" },
      animation: { cue: "earthrise-color", draw: { en: "Blue and white Earth rises over gray horizon in color.", bn: "ধূসর দিগন্তের উপরে নীল-সাদা পৃথিবী রঙিন হয়ে উঠে আসে।" } },
      interaction: { type: "tap", prompt: { en: "Tap to take the photo.", bn: "ছবি তুলতে ট্যাপ করুন।" } },
    },
    {
      id: "apollo-8-ch-04",
      number: 4,
      title: { en: "Christmas Eve", bn: "বড়দিনের সন্ধ্যা" },
      story: { en: "After ten orbits, the crew read from the Book of Genesis in a broadcast watched by millions. Then they burned the engine to head home and splashed down safely.", bn: "দশবার প্রদক্ষিণের পর দলটি বাইবেলের জেনেসিস থেকে পড়ে, যা লক্ষ লক্ষ মানুষ দেখেন। তারপর ইঞ্জিন চালিয়ে ঘরে ফেরে এবং নিরাপদে সমুদ্রে নামে।" },
      animation: { cue: "splashdown", draw: { en: "Capsule parachutes into the ocean.", bn: "ক্যাপসুল প্যারাশুটে ভেসে সমুদ্রে নামে।" } },
      interaction: { type: 'choice', prompt: { en: "What was special about Apollo 8?", bn: "অ্যাপোলো ৮-এর বিশেষত্ব কী ছিল?" }, options: [{ en: "First humans to orbit the Moon", bn: "চাঁদ প্রদক্ষিণকারী প্রথম মানুষ" }, { en: "First Moon landing", bn: "প্রথম চন্দ্র অবতরণ" }, { en: "First rover", bn: "প্রথম রোভার" }], answer: 0 },
    },
    ],
  },
  "apollo-11": {
    sourceId: "apollo-11",
    missionId: "apollo-11",
    sourceTitle: "Apollo 11",
    years: "1969",
    destination: "moon",
    chapters: [
    {
      id: "apollo-11-ch-01",
      number: 1,
      title: { en: "Three Astronauts", bn: "তিন নভোচারী" },
      story: { en: "Neil Armstrong, Buzz Aldrin and Michael Collins launched on July 16, 1969. Their goal: land on the Moon.", bn: "নিল আর্মস্ট্রং, বাজ অলড্রিন ও মাইকেল কলিন্স ১৯৬৯ সালের ১৬ জুলাই উৎক্ষেপণ করেন। তাদের লক্ষ্য: চাঁদে অবতরণ।" },
      animation: { cue: "saturn-liftoff", draw: { en: "Saturn V liftoff with crowds watching.", bn: "ভিড় দেখতে থাকা অবস্থায় স্যাটার্ন ৫ উৎক্ষেপণ করে।" } },
      interaction: { type: "hold", prompt: { en: "Hold to launch.", bn: "উৎক্ষেপণ করতে চেপে ধরুন।" } },
    },
    {
      id: "apollo-11-ch-02",
      number: 2,
      title: { en: "Eagle Descends", bn: "ঈগল নামে" },
      story: { en: "Armstrong and Aldrin took the lander Eagle down while Collins stayed in orbit. Alarms rang, and the landing site was full of boulders.", bn: "আর্মস্ট্রং ও অলড্রিন ল্যান্ডার ঈগল নিয়ে নামেন, কলিন্স কক্ষপথে থাকেন। অ্যালার্ম বাজে, আর অবতরণস্থল পাথরে ভরা।" },
      animation: { cue: "lander-descent", draw: { en: "Eagle descends, warning lights flash, boulders below.", bn: "ঈগল নামে, সতর্কতার বাতি জ্বলে, নিচে পাথর।" } },
      interaction: { type: "drag", prompt: { en: "Drag the lander to a safe patch.", bn: "নিরাপদ জায়গায় ল্যান্ডারটি টেনে নিন।" } },
    },
    {
      id: "apollo-11-ch-03",
      number: 3,
      title: { en: "Tranquility Base", bn: "ট্রাঙ্কুইলিটি বেস" },
      story: { en: "With very little fuel left, Armstrong landed. 'The Eagle has landed.'", bn: "খুব কম জ্বালানি নিয়ে আর্মস্ট্রং নামেন। 'ঈগল অবতরণ করেছে।'" },
      animation: { cue: "touchdown-dust", draw: { en: "Dust blows outward, legs settle, fuel gauge near empty.", bn: "ধুলো বাইরে ছড়ায়, পাগুলো থিতিয়ে যায়, জ্বালানির গেজ প্রায় খালি।" } },
      interaction: { type: "tap", prompt: { en: "Tap to cut the engine.", bn: "ইঞ্জিন বন্ধ করতে ট্যাপ করুন।" } },
    },
    {
      id: "apollo-11-ch-04",
      number: 4,
      title: { en: "One Small Step", bn: "একটি ছোট পদক্ষেপ" },
      story: { en: "Armstrong stepped onto the surface, followed by Aldrin. They planted a flag, set up experiments, and collected rocks.", bn: "আর্মস্ট্রং পৃষ্ঠে নামেন, তারপর অলড্রিন। তারা পতাকা পোঁতেন, পরীক্ষা স্থাপন করেন এবং পাথর সংগ্রহ করেন।" },
      animation: { cue: "first-step", draw: { en: "Boot touches dust, footprint appears.", bn: "বুট ধুলোয় পড়ে, পায়ের ছাপ দেখা যায়।" } },
      interaction: { type: "tap", prompt: { en: "Tap to take the first step.", bn: "প্রথম পদক্ষেপ নিতে ট্যাপ করুন।" } },
    },
    {
      id: "apollo-11-ch-05",
      number: 5,
      title: { en: "Home Again", bn: "আবার ঘরে" },
      story: { en: "The two lifted off to meet Collins and returned to Earth on July 24.", bn: "দুজন উঠে কলিন্সের সঙ্গে মিলিত হন এবং ২৪ জুলাই পৃথিবীতে ফেরেন।" },
      animation: { cue: "docking-return", draw: { en: "Eagle docks with Columbia, then Earth grows larger.", bn: "ঈগল কলাম্বিয়ার সঙ্গে ডক করে, তারপর পৃথিবী বড় হতে থাকে।" } },
      interaction: { type: 'choice', prompt: { en: "Who stayed in orbit?", bn: "কে কক্ষপথে ছিলেন?" }, options: [{ en: "Michael Collins", bn: "মাইকেল কলিন্স" }, { en: "Neil Armstrong", bn: "নিল আর্মস্ট্রং" }, { en: "Buzz Aldrin", bn: "বাজ অলড্রিন" }], answer: 0 },
    },
    ],
  },
  "apollo-12": {
    sourceId: "apollo-12",
    missionId: "apollo-12",
    sourceTitle: "Apollo 12",
    years: "1969",
    destination: "moon",
    chapters: [
    {
      id: "apollo-12-ch-01",
      number: 1,
      title: { en: "Struck by Lightning", bn: "বজ্রপাতে আঘাত" },
      story: { en: "Apollo 12 launched in a storm in November 1969. Lightning hit the rocket twice and knocked out power. A quick switch by the crew and ground team saved the mission.", bn: "অ্যাপোলো ১২ ১৯৬৯ সালের নভেম্বরে ঝড়ের মধ্যে উৎক্ষেপণ করে। বজ্রপাত রকেটে দুবার আঘাত করে বিদ্যুৎ বন্ধ করে দেয়। নভোচারী ও ভূমি দলের দ্রুত একটি সুইচ মিশন বাঁচায়।" },
      animation: { cue: "lightning-strike", draw: { en: "Rocket in rain, lightning flash, panel lights go dark then restart.", bn: "বৃষ্টিতে রকেট, বজ্রের ঝলক, প্যানেলের আলো নিভে গিয়ে আবার জ্বলে ওঠে।" } },
      interaction: { type: "tap", prompt: { en: "Tap the right switch to restore power.", bn: "বিদ্যুৎ ফিরিয়ে আনতে সঠিক সুইচে ট্যাপ করুন।" } },
    },
    {
      id: "apollo-12-ch-02",
      number: 2,
      title: { en: "Pinpoint Landing", bn: "নির্ভুল অবতরণ" },
      story: { en: "Pete Conrad and Alan Bean aimed for a spot right next to Surveyor 3, which had landed two and a half years earlier. They landed about 180 meters away.", bn: "পিট কনরাড ও অ্যালান বিন দুই বছর আগে নামা সার্ভেয়র ৩-এর ঠিক পাশে অবতরণের লক্ষ্য নেন। তারা প্রায় ১৮০ মিটার দূরে নামেন।" },
      animation: { cue: "precision-landing", draw: { en: "Lander steers toward a small target ring beside an old probe.", bn: "ল্যান্ডার একটি ছোট লক্ষ্য বৃত্তের দিকে এগোয়, পাশে পুরোনো অনুসন্ধানযান।" } },
      interaction: { type: "drag", prompt: { en: "Drag the lander into the target ring.", bn: "ল্যান্ডারটিকে লক্ষ্য বৃত্তে টেনে নিন।" } },
    },
    {
      id: "apollo-12-ch-03",
      number: 3,
      title: { en: "Visiting an Old Friend", bn: "পুরোনো বন্ধুর কাছে" },
      story: { en: "The astronauts walked to Surveyor 3 and removed its camera and parts to study how space had changed them.", bn: "নভোচারীরা সার্ভেয়র ৩-এর কাছে হেঁটে যান এবং মহাশূন্য তাদের কীভাবে বদলে দিয়েছে তা গবেষণার জন্য ক্যামেরা ও অংশ খুলে নেন।" },
      animation: { cue: "walk-to-surveyor", draw: { en: "Two astronauts walk across the dust to a lone probe.", bn: "দুই নভোচারী ধুলোর উপর দিয়ে একলা অনুসন্ধানযানের দিকে হাঁটেন।" } },
      interaction: { type: "tap", prompt: { en: "Tap to collect the camera.", bn: "ক্যামেরা সংগ্রহ করতে ট্যাপ করুন।" } },
    },
    {
      id: "apollo-12-ch-04",
      number: 4,
      title: { en: "Back with Samples", bn: "নমুনা নিয়ে ফেরা" },
      story: { en: "They collected rocks, then rejoined Dick Gordon in orbit and returned to Earth.", bn: "তারা পাথর সংগ্রহ করেন, তারপর কক্ষপথে ডিক গর্ডনের সঙ্গে মিলিত হয়ে পৃথিবীতে ফেরেন।" },
      animation: { cue: "sample-box", draw: { en: "Sample box closes and glows.", bn: "নমুনা বাক্স বন্ধ হয় এবং জ্বলে ওঠে।" } },
      interaction: { type: 'choice', prompt: { en: "What was special about the landing?", bn: "অবতরণের বিশেষত্ব কী ছিল?" }, options: [{ en: "It was very close to a target", bn: "এটি একটি লক্ষ্যের খুব কাছে ছিল" }, { en: "It was on the far side", bn: "এটি চাঁদের অপর পাশে ছিল" }, { en: "It was in daylight only", bn: "এটি শুধু দিনের আলোয় ছিল" }], answer: 0 },
    },
    ],
  },
  "apollo-13": {
    sourceId: "apollo-13",
    missionId: "apollo-13",
    sourceTitle: "Apollo 13",
    years: "1970",
    destination: "moon",
    chapters: [
    {
      id: "apollo-13-ch-01",
      number: 1,
      title: { en: "A Routine Flight", bn: "একটি সাধারণ উড়ান" },
      story: { en: "Jim Lovell, Jack Swigert and Fred Haise were headed for the Moon in April 1970.", bn: "জিম লোভেল, জ্যাক সুইগার্ট ও ফ্রেড হেইজ ১৯৭০ সালের এপ্রিলে চাঁদের দিকে যাচ্ছিলেন।" },
      animation: { cue: "cruise", draw: { en: "Spacecraft glides toward the Moon, Earth behind.", bn: "মহাকাশযান চাঁদের দিকে ভেসে যায়, পিছনে পৃথিবী।" } },
      interaction: { type: "tap", prompt: { en: "Tap to stir the oxygen tank.", bn: "অক্সিজেন ট্যাংক নাড়াতে ট্যাপ করুন।" } },
    },
    {
      id: "apollo-13-ch-02",
      number: 2,
      title: { en: "'Houston, We've Had a Problem'", bn: "‘হিউস্টন, আমাদের সমস্যা হয়েছে’" },
      story: { en: "An oxygen tank exploded. Power and oxygen began to run out. The Moon landing was cancelled.", bn: "একটি অক্সিজেন ট্যাংক বিস্ফোরিত হয়। বিদ্যুৎ ও অক্সিজেন ফুরিয়ে আসতে থাকে। চন্দ্র অবতরণ বাতিল হয়।" },
      animation: { cue: "explosion-venting", draw: { en: "Flash, gas venting into space, alarm lights.", bn: "ঝলক, মহাশূন্যে গ্যাস বেরিয়ে যায়, অ্যালার্মের বাতি জ্বলে।" } },
      interaction: { type: "tap", prompt: { en: "Tap the warning lights.", bn: "সতর্কতার বাতিতে ট্যাপ করুন।" } },
    },
    {
      id: "apollo-13-ch-03",
      number: 3,
      title: { en: "Lifeboat", bn: "জীবনতরী" },
      story: { en: "The crew moved into the lunar module and used it as a lifeboat. Carbon dioxide began to build up, so engineers on the ground made a way to fit square filters into round holes using tape and cardboard.", bn: "দলটি লুনার মডিউলে চলে যায় এবং সেটিকে জীবনতরী হিসেবে ব্যবহার করে। কার্বন ডাই-অক্সাইড বাড়তে থাকে, তাই ভূমির প্রকৌশলীরা টেপ ও কার্ডবোর্ড দিয়ে গোল ছিদ্রে চারকোনা ফিল্টার বসানোর উপায় বানান।" },
      animation: { cue: "filter-fix", draw: { en: "Hands connect a square filter to a round socket with tape.", bn: "হাত টেপ দিয়ে চারকোনা ফিল্টারকে গোল সকেটে যুক্ত করে।" } },
      interaction: { type: "drag", prompt: { en: "Drag the parts together to build the filter.", bn: "ফিল্টার বানাতে অংশগুলো টেনে মিলিয়ে দিন।" } },
    },
    {
      id: "apollo-13-ch-04",
      number: 4,
      title: { en: "Around the Moon", bn: "চাঁদের চারদিকে" },
      story: { en: "They swung around the Moon and used its gravity to return, a path called a free return.", bn: "তারা চাঁদের চারদিকে ঘুরে এর মাধ্যাকর্ষণ ব্যবহার করে ফেরেন—এই পথকে ফ্রি রিটার্ন বলা হয়।" },
      animation: { cue: "free-return", draw: { en: "Figure-eight path around the Moon.", bn: "চাঁদের চারদিকে আট-আকৃতির পথ।" } },
      interaction: { type: "drag", prompt: { en: "Trace the figure-eight path.", bn: "আট-আকৃতির পথটি টেনে অনুসরণ করুন।" } },
    },
    {
      id: "apollo-13-ch-05",
      number: 5,
      title: { en: "Safe Splashdown", bn: "নিরাপদ সমুদ্র অবতরণ" },
      story: { en: "After a cold, tense journey, the crew splashed down safely on April 17.", bn: "ঠান্ডা, উত্তেজনাপূর্ণ যাত্রার পর দলটি ১৭ এপ্রিল নিরাপদে সমুদ্রে নামে।" },
      animation: { cue: "splashdown", draw: { en: "Three parachutes open over the ocean.", bn: "সমুদ্রের উপরে তিনটি প্যারাশুট খুলে যায়।" } },
      interaction: { type: 'choice', prompt: { en: "What did the crew use as a lifeboat?", bn: "দলটি জীবনতরী হিসেবে কী ব্যবহার করেছিল?" }, options: [{ en: "The lunar module", bn: "লুনার মডিউল" }, { en: "A rover", bn: "একটি রোভার" }, { en: "The rocket", bn: "রকেট" }], answer: 0 },
    },
    ],
  },
  "apollo-14": {
    sourceId: "apollo-14",
    missionId: "apollo-14",
    sourceTitle: "Apollo 14",
    years: "1971",
    destination: "moon",
    chapters: [
    {
      id: "apollo-14-ch-01",
      number: 1,
      title: { en: "A Second Chance", bn: "দ্বিতীয় সুযোগ" },
      story: { en: "Apollo 14 was sent to Fra Mauro, the place Apollo 13 never reached. Alan Shepard, Edgar Mitchell and Stuart Roosa launched in January 1971.", bn: "অ্যাপোলো ১৪-কে পাঠানো হয় ফ্রা মাউরোতে, যেখানে অ্যাপোলো ১৩ পৌঁছাতে পারেনি। অ্যালান শেপার্ড, এডগার মিচেল ও স্টুয়ার্ট রুসা ১৯৭১ সালের জানুয়ারিতে উৎক্ষেপণ করেন।" },
      animation: { cue: "liftoff", draw: { en: "Launch with Apollo 13 patch fading beside Apollo 14.", bn: "উৎক্ষেপণের পাশে অ্যাপোলো ১৩-এর ব্যাজ মিলিয়ে যেতে থাকে, অ্যাপোলো ১৪ সামনে আসে।" } },
      interaction: { type: "hold", prompt: { en: "Hold to launch.", bn: "উৎক্ষেপণ করতে চেপে ধরুন।" } },
    },
    {
      id: "apollo-14-ch-02",
      number: 2,
      title: { en: "Docking Trouble", bn: "ডকিংয়ে সমস্যা" },
      story: { en: "The crew struggled to dock the lander to the command ship. After several tries, it worked.", bn: "দলটি ল্যান্ডারকে কমান্ড জাহাজের সঙ্গে ডক করতে সংগ্রাম করে। কয়েকবার চেষ্টার পর তা সফল হয়।" },
      animation: { cue: "docking-retry", draw: { en: "Two craft approach, bounce, then lock together.", bn: "দুটি যান কাছে আসে, ধাক্কা খায়, তারপর লক হয়ে যায়।" } },
      interaction: { type: "drag", prompt: { en: "Line up the two craft and dock.", bn: "দুটি যান সারিবদ্ধ করে ডক করুন।" } },
    },
    {
      id: "apollo-14-ch-03",
      number: 3,
      title: { en: "The Hill Climb", bn: "পাহাড়ে আরোহণ" },
      story: { en: "Shepard and Mitchell hauled a cart of tools across Fra Mauro and tried to reach Cone Crater. The terrain was tough and they turned back close to the rim.", bn: "শেপার্ড ও মিচেল ফ্রা মাউরো জুড়ে সরঞ্জামের ঠেলা গাড়ি টেনে নেন এবং কোন গর্তে পৌঁছানোর চেষ্টা করেন। ভূখণ্ড কঠিন ছিল, তাই কিনারার কাছেই ফিরে আসেন।" },
      animation: { cue: "hill-climb", draw: { en: "Two astronauts pull a cart up a slope, tired.", bn: "দুই নভোচারী ক্লান্ত হয়ে ঢালে ঠেলা গাড়ি টেনে তোলেন।" } },
      interaction: { type: "tap", prompt: { en: "Tap to keep climbing.", bn: "আরোহণ চালিয়ে যেতে ট্যাপ করুন।" } },
    },
    {
      id: "apollo-14-ch-04",
      number: 4,
      title: { en: "A Moon Golf Shot", bn: "চাঁদে গলফ শট" },
      story: { en: "Before leaving, Shepard hit two golf balls with a makeshift club. Mitchell threw a lunar scoop handle like a javelin.", bn: "যাওয়ার আগে শেপার্ড বানানো ক্লাব দিয়ে দুটি গলফ বল মারেন। মিচেল চন্দ্র স্কুপের হাতল বর্শার মতো ছুড়ে দেন।" },
      animation: { cue: "golf-shot", draw: { en: "A golf ball flies far in low gravity.", bn: "কম মাধ্যাকর্ষণে একটি গলফ বল অনেক দূর উড়ে যায়।" } },
      interaction: { type: "tap", prompt: { en: "Tap to swing.", bn: "সুইং করতে ট্যাপ করুন।" } },
    },
    ],
  },
  "apollo-15": {
    sourceId: "apollo-15",
    missionId: "apollo-15",
    sourceTitle: "Apollo 15",
    years: "1971",
    destination: "moon",
    chapters: [
    {
      id: "apollo-15-ch-01",
      number: 1,
      title: { en: "Mountains and a Canyon", bn: "পাহাড় ও একটি গিরিখাত" },
      story: { en: "Apollo 15 landed beside the Apennine Mountains and a winding valley called Hadley Rille in July 1971.", bn: "অ্যাপোলো ১৫ ১৯৭১ সালের জুলাইয়ে অ্যাপেনাইন পর্বতমালা ও হ্যাডলি রিল নামের আঁকাবাঁকা উপত্যকার পাশে নামে।" },
      animation: { cue: "landing-valley", draw: { en: "Lander settles between tall peaks and a canyon.", bn: "ল্যান্ডার উঁচু চূড়া ও গিরিখাতের মাঝে থিতিয়ে পড়ে।" } },
      interaction: { type: "tap", prompt: { en: "Tap to land.", bn: "নামতে ট্যাপ করুন।" } },
    },
    {
      id: "apollo-15-ch-02",
      number: 2,
      title: { en: "The Rover", bn: "রোভার" },
      story: { en: "Dave Scott and Jim Irwin brought the first lunar rover. It let them drive miles from the lander.", bn: "ডেভ স্কট ও জিম ইরউইন প্রথম লুনার রোভার আনেন। এটি তাদের ল্যান্ডার থেকে মাইল দূরে যেতে দেয়।" },
      animation: { cue: "rover-unfold", draw: { en: "Rover unfolds from the side of the lander.", bn: "ল্যান্ডারের পাশ থেকে রোভার খুলে বেরিয়ে আসে।" } },
      interaction: { type: "drag", prompt: { en: "Drag to unfold the rover.", bn: "রোভার খুলতে টেনে নিন।" } },
    },
    {
      id: "apollo-15-ch-03",
      number: 3,
      title: { en: "Hammer and Feather", bn: "হাতুড়ি ও পালক" },
      story: { en: "Scott dropped a hammer and a feather. With no air, both hit the ground at the same time.", bn: "স্কট একটি হাতুড়ি ও একটি পালক ফেলেন। বাতাস না থাকায় দুটোই একসঙ্গে মাটিতে পড়ে।" },
      animation: { cue: "drop-test", draw: { en: "Hammer and feather fall side by side.", bn: "হাতুড়ি ও পালক পাশাপাশি নিচে পড়ে।" } },
      interaction: { type: "tap", prompt: { en: "Tap to drop.", bn: "ফেলতে ট্যাপ করুন।" } },
    },
    {
      id: "apollo-15-ch-04",
      number: 4,
      title: { en: "The Genesis Rock", bn: "জেনেসিস পাথর" },
      story: { en: "They found a pale rock about four billion years old, nicknamed the Genesis Rock.", bn: "তারা প্রায় চারশ কোটি বছরের পুরোনো একটি ফ্যাকাশে পাথর খুঁজে পান, যার ডাকনাম জেনেসিস রক।" },
      animation: { cue: "rock-glow", draw: { en: "A white rock glows among gray ones.", bn: "ধূসর পাথরের মধ্যে একটি সাদা পাথর জ্বলে ওঠে।" } },
      interaction: { type: 'choice', prompt: { en: "What did the rover change?", bn: "রোভার কী বদলে দিয়েছিল?" }, options: [{ en: "How far astronauts could explore", bn: "নভোচারীরা কত দূর অন্বেষণ করতে পারবে" }, { en: "How fast rockets fly", bn: "রকেট কত দ্রুত উড়বে" }, { en: "How long they stayed in orbit", bn: "তারা কক্ষপথে কত দিন থাকবে" }], answer: 0 },
    },
    ],
  },
  "apollo-16": {
    sourceId: "apollo-16",
    missionId: "apollo-16",
    sourceTitle: "Apollo 16",
    years: "1972",
    destination: "moon",
    chapters: [
    {
      id: "apollo-16-ch-01",
      number: 1,
      title: { en: "Into the Highlands", bn: "উচ্চভূমিতে" },
      story: { en: "John Young and Charlie Duke landed in the Descartes Highlands in April 1972, the first mission to land in the Moon's rugged highlands.", bn: "জন ইয়ং ও চার্লি ডিউক ১৯৭২ সালের এপ্রিলে দেকার্ত উচ্চভূমিতে নামেন—চাঁদের রুক্ষ উচ্চভূমিতে অবতরণকারী প্রথম মিশন।" },
      animation: { cue: "highland-landing", draw: { en: "Lander descends over bright hilly terrain.", bn: "ল্যান্ডার উজ্জ্বল পাহাড়ি ভূখণ্ডের উপর দিয়ে নামে।" } },
      interaction: { type: "tap", prompt: { en: "Tap to land.", bn: "নামতে ট্যাপ করুন।" } },
    },
    {
      id: "apollo-16-ch-02",
      number: 2,
      title: { en: "Fixing a Delay", bn: "বিলম্ব মেরামত" },
      story: { en: "A fault in the command ship's engine delayed the landing for hours. Mission control decided it was safe to continue.", bn: "কমান্ড জাহাজের ইঞ্জিনের ত্রুটিতে অবতরণ কয়েক ঘণ্টা দেরি হয়। মিশন নিয়ন্ত্রণ নিরাপদ মনে করে চালিয়ে যাওয়ার সিদ্ধান্ত নেয়।" },
      animation: { cue: "engine-check", draw: { en: "Warning light flickers, then green.", bn: "সতর্কতার আলো কাঁপে, তারপর সবুজ হয়।" } },
      interaction: { type: "tap", prompt: { en: "Tap to approve the landing.", bn: "অবতরণ অনুমোদন করতে ট্যাপ করুন।" } },
    },
    {
      id: "apollo-16-ch-03",
      number: 3,
      title: { en: "Rover Races", bn: "রোভার দৌড়" },
      story: { en: "The rover was tested on the surface in a short speed run across the dust.", bn: "ধুলোর উপর দিয়ে সংক্ষিপ্ত গতির দৌড়ে রোভার পরীক্ষা করা হয়।" },
      animation: { cue: "rover-drive", draw: { en: "Rover kicks up a rooster-tail of dust.", bn: "রোভার ধুলোর লেজ তুলে ছুটে যায়।" } },
      interaction: { type: "drag", prompt: { en: "Steer the rover around craters.", bn: "গর্তগুলো এড়িয়ে রোভার চালান।" } },
    },
    {
      id: "apollo-16-ch-04",
      number: 4,
      title: { en: "Studying Old Rock", bn: "পুরোনো পাথর অধ্যয়ন" },
      story: { en: "They collected rocks that helped scientists understand how the Moon formed.", bn: "তারা এমন পাথর সংগ্রহ করেন যা বিজ্ঞানীদের চাঁদের গঠন বুঝতে সাহায্য করে।" },
      animation: { cue: "sample-collect", draw: { en: "Samples fill the bag, each glowing.", bn: "নমুনায় ব্যাগ ভরে যায়, প্রতিটি জ্বলে ওঠে।" } },
      interaction: { type: 'choice', prompt: { en: "Where did Apollo 16 land?", bn: "অ্যাপোলো ১৬ কোথায় নেমেছিল?" }, options: [{ en: "Highlands", bn: "উচ্চভূমি" }, { en: "Ocean", bn: "সমুদ্র" }, { en: "Far side", bn: "অপর পাশ" }], answer: 0 },
    },
    ],
  },
  "apollo-17": {
    sourceId: "apollo-17",
    missionId: "apollo-17",
    sourceTitle: "Apollo 17",
    years: "1972",
    destination: "moon",
    chapters: [
    {
      id: "apollo-17-ch-01",
      number: 1,
      title: { en: "A Night Launch", bn: "রাতের উৎক্ষেপণ" },
      story: { en: "Apollo 17 launched at night in December 1972, lighting up the Florida sky. It carried Gene Cernan, Ron Evans and Harrison Schmitt, a geologist.", bn: "অ্যাপোলো ১৭ ১৯৭২ সালের ডিসেম্বরে রাতে উৎক্ষেপণ করে ফ্লোরিডার আকাশ আলোকিত করে। এতে ছিলেন জিন সার্নান, রন ইভান্স ও ভূতত্ত্ববিদ হ্যারিসন শ্মিট।" },
      animation: { cue: "night-launch", draw: { en: "Rocket lights the dark sky and ocean.", bn: "রকেট অন্ধকার আকাশ ও সমুদ্র আলোকিত করে।" } },
      interaction: { type: "hold", prompt: { en: "Hold to launch.", bn: "উৎক্ষেপণ করতে চেপে ধরুন।" } },
    },
    {
      id: "apollo-17-ch-02",
      number: 2,
      title: { en: "The Blue Marble", bn: "নীল মার্বেল" },
      story: { en: "On the way, the crew photographed the whole Earth in sunlight. The picture became known as the Blue Marble.", bn: "পথে দলটি সূর্যের আলোয় পুরো পৃথিবীর ছবি তোলেন। ছবিটি ব্লু মার্বেল নামে পরিচিত হয়।" },
      animation: { cue: "blue-marble", draw: { en: "A full blue Earth, swirled with clouds.", bn: "মেঘে ঘেরা একটি সম্পূর্ণ নীল পৃথিবী।" } },
      interaction: { type: "tap", prompt: { en: "Tap to take the photo.", bn: "ছবি তুলতে ট্যাপ করুন।" } },
    },
    {
      id: "apollo-17-ch-03",
      number: 3,
      title: { en: "Orange Soil", bn: "কমলা মাটি" },
      story: { en: "Schmitt spotted bright orange soil in the valley of Taurus-Littrow. It was tiny glass beads from an ancient volcanic eruption.", bn: "শ্মিট টরাস-লিট্রো উপত্যকায় উজ্জ্বল কমলা মাটি দেখতে পান। এটি প্রাচীন আগ্নেয়গিরির বিস্ফোরণ থেকে তৈরি ক্ষুদ্র কাচের গোলক ছিল।" },
      animation: { cue: "orange-soil", draw: { en: "Orange patch glows in gray dust.", bn: "ধূসর ধুলোর মধ্যে কমলা দাগ জ্বলে ওঠে।" } },
      interaction: { type: "tap", prompt: { en: "Tap to scoop.", bn: "স্কুপ করতে ট্যাপ করুন।" } },
    },
    {
      id: "apollo-17-ch-04",
      number: 4,
      title: { en: "The Last Footsteps", bn: "শেষ পদচিহ্ন" },
      story: { en: "Cernan was the last person to walk on the Moon. He promised people would return.", bn: "সার্নান চাঁদে হাঁটা শেষ ব্যক্তি। তিনি প্রতিশ্রুতি দেন যে মানুষ আবার ফিরবে।" },
      animation: { cue: "last-step", draw: { en: "A final footprint, then the lander lifting off.", bn: "একটি শেষ পায়ের ছাপ, তারপর ল্যান্ডার উঠে যায়।" } },
      interaction: { type: 'choice', prompt: { en: "What was special about Apollo 17?", bn: "অ্যাপোলো ১৭-এর বিশেষত্ব কী ছিল?" }, options: [{ en: "Last crewed Moon landing of Apollo", bn: "অ্যাপোলোর শেষ নভোচারী চন্দ্র অবতরণ" }, { en: "First rover", bn: "প্রথম রোভার" }, { en: "First Earthrise", bn: "প্রথম পৃথিবী-উদয়" }], answer: 0 },
    },
    ],
  },
  "pathfinder": {
    sourceId: "pathfinder-sojourner",
    missionId: "pathfinder",
    sourceTitle: "Mars Pathfinder / Sojourner",
    years: "1997",
    destination: "mars",
    chapters: [
    {
      id: "pathfinder-ch-01",
      number: 1,
      title: { en: "Bouncing In", bn: "লাফিয়ে ঢোকা" },
      story: { en: "On July 4, 1997, Pathfinder hit the Martian atmosphere, opened a parachute, and bounced across the ground inside giant airbags.", bn: "১৯৯৭ সালের ৪ জুলাই পাথফাইন্ডার মঙ্গলের বায়ুমণ্ডলে ঢোকে, প্যারাশুট খোলে এবং বিশাল এয়ারব্যাগের ভেতরে লাফাতে লাফাতে মাটি পাড়ি দেয়।" },
      animation: { cue: "airbag-bounce", draw: { en: "Airbag ball bounces several times and rolls to a stop.", bn: "এয়ারব্যাগের বল কয়েকবার লাফিয়ে গড়িয়ে থামে।" } },
      interaction: { type: "tap", prompt: { en: "Tap to bounce.", bn: "লাফ দিতে ট্যাপ করুন।" } },
    },
    {
      id: "pathfinder-ch-02",
      number: 2,
      title: { en: "Petals Open", bn: "পাপড়ি খোলে" },
      story: { en: "The airbags deflated and the lander opened like a flower. A tiny rover waited inside.", bn: "এয়ারব্যাগগুলো চুপসে যায় এবং ল্যান্ডার ফুলের মতো খুলে যায়। ভেতরে একটি ছোট্ট রোভার অপেক্ষা করছিল।" },
      animation: { cue: "petals-open", draw: { en: "Three metal petals fold open, a small rover inside.", bn: "তিনটি ধাতব পাপড়ি খুলে যায়, ভেতরে ছোট রোভার।" } },
      interaction: { type: "tap", prompt: { en: "Tap to open the petals.", bn: "পাপড়ি খুলতে ট্যাপ করুন।" } },
    },
    {
      id: "pathfinder-ch-03",
      number: 3,
      title: { en: "Meet Sojourner", bn: "সোজার্নারের সঙ্গে দেখা" },
      story: { en: "Sojourner, about the size of a microwave oven, drove onto Mars. It tested rocks with a special instrument.", bn: "মাইক্রোওয়েভ ওভেনের মাপের সোজার্নার মঙ্গলে গড়িয়ে নামে। এটি বিশেষ যন্ত্র দিয়ে পাথর পরীক্ষা করে।" },
      animation: { cue: "rover-ramp", draw: { en: "Small six-wheeled rover rolls down a ramp.", bn: "ছয় চাকার ছোট রোভার র্যাম্প দিয়ে গড়িয়ে নামে।" } },
      interaction: { type: "drag", prompt: { en: "Drag Sojourner toward a rock.", bn: "সোজার্নারকে একটি পাথরের দিকে টেনে নিন।" } },
    },
    {
      id: "pathfinder-ch-04",
      number: 4,
      title: { en: "Beyond Expectations", bn: "প্রত্যাশার বাইরে" },
      story: { en: "The mission was planned for about a week but lasted nearly three months. It proved small rovers could work.", bn: "মিশনটি প্রায় এক সপ্তাহের জন্য পরিকল্পনা করা হয়েছিল, কিন্তু প্রায় তিন মাস চলেছিল। এটি প্রমাণ করে ছোট রোভারও কাজ করতে পারে।" },
      animation: { cue: "sol-counter", draw: { en: "Day counter rises past the planned limit.", bn: "দিনের কাউন্টার পরিকল্পিত সীমা ছাড়িয়ে ওঠে।" } },
      interaction: { type: 'choice', prompt: { en: "What was special about Sojourner?", bn: "সোজার্নারের বিশেষত্ব কী ছিল?" }, options: [{ en: "First rover on Mars", bn: "মঙ্গলে প্রথম রোভার" }, { en: "First human on Mars", bn: "মঙ্গলে প্রথম মানুষ" }, { en: "First Mars orbiter", bn: "প্রথম মঙ্গল অরবিটার" }], answer: 0 },
    },
    ],
  },
  "spirit": {
    sourceId: "spirit",
    missionId: "spirit",
    sourceTitle: "Mars Exploration Rover Spirit",
    years: "2004",
    destination: "mars",
    chapters: [
    {
      id: "spirit-ch-01",
      number: 1,
      title: { en: "Landing in a Lake Bed?", bn: "হ্রদের তলায় অবতরণ?" },
      story: { en: "Spirit landed in January 2004 in Gusev Crater, a place that might once have held water.", bn: "স্পিরিট ২০০৪ সালের জানুয়ারিতে গুসেভ গর্তে নামে—এমন জায়গা যেখানে একসময় পানি থাকতে পারে।" },
      animation: { cue: "airbag-landing", draw: { en: "Rover cocoon bounces to rest on red plain.", bn: "রোভারের কোকুন লাল সমভূমিতে লাফিয়ে থেমে যায়।" } },
      interaction: { type: "tap", prompt: { en: "Tap to land.", bn: "নামতে ট্যাপ করুন।" } },
    },
    {
      id: "spirit-ch-02",
      number: 2,
      title: { en: "A Computer Glitch", bn: "কম্পিউটার ত্রুটি" },
      story: { en: "Weeks in, Spirit stopped sending useful data because of a memory problem. Engineers on Earth fixed it by reformatting its memory remotely.", bn: "কয়েক সপ্তাহ পরে মেমোরি সমস্যার কারণে স্পিরিট কাজের তথ্য পাঠানো বন্ধ করে। পৃথিবীর প্রকৌশলীরা দূর থেকে মেমোরি ফরম্যাট করে তা ঠিক করেন।" },
      animation: { cue: "glitch-fix", draw: { en: "Static, then a reboot bar fills.", bn: "স্ট্যাটিক, তারপর রিবুট বার ভরে ওঠে।" } },
      interaction: { type: "tap", prompt: { en: "Tap to send the fix.", bn: "সমাধান পাঠাতে ট্যাপ করুন।" } },
    },
    {
      id: "spirit-ch-03",
      number: 3,
      title: { en: "Climbing the Hills", bn: "পাহাড়ে ওঠা" },
      story: { en: "Spirit drove to the Columbia Hills, farther than planned, and found rocks changed by water.", bn: "স্পিরিট পরিকল্পনার চেয়ে দূরে কলাম্বিয়া পাহাড়ে গিয়ে পানি দ্বারা বদলে যাওয়া পাথর খুঁজে পায়।" },
      animation: { cue: "hill-drive", draw: { en: "Rover tracks wind toward distant hills.", bn: "রোভারের চাকার দাগ দূরের পাহাড়ের দিকে বাঁক নেয়।" } },
      interaction: { type: "drag", prompt: { en: "Drag Spirit up the slope.", bn: "স্পিরিটকে ঢালে টেনে তুলুন।" } },
    },
    {
      id: "spirit-ch-04",
      number: 4,
      title: { en: "Stuck in Sand", bn: "বালিতে আটকা" },
      story: { en: "In 2009 one wheel broke through a sandy patch and Spirit could not escape. It kept working as a stationary station until 2010.", bn: "২০০৯ সালে একটি চাকা বালুচর ভেদ করে ঢুকে যায় এবং স্পিরিট বেরোতে পারে না। এটি ২০১০ পর্যন্ত স্থির স্টেশন হিসেবে কাজ করে।" },
      animation: { cue: "stuck-wheel", draw: { en: "Rover wheel sinks, then the rover goes quiet.", bn: "রোভারের চাকা ডুবে যায়, তারপর রোভার নীরব হয়ে যায়।" } },
      interaction: { type: 'choice', prompt: { en: "What stopped Spirit?", bn: "স্পিরিটকে কী থামিয়েছিল?" }, options: [{ en: "Soft sand", bn: "নরম বালি" }, { en: "A rockslide", bn: "পাথরের ধস" }, { en: "A dust devil", bn: "ধুলোর ঘূর্ণি" }], answer: 0 },
    },
    ],
  },
  "opportunity": {
    sourceId: "opportunity",
    missionId: "opportunity",
    sourceTitle: "Mars Exploration Rover Opportunity",
    years: "2004",
    destination: "mars",
    chapters: [
    {
      id: "opportunity-ch-01",
      number: 1,
      title: { en: "A Hole-in-One", bn: "হোল-ইন-ওয়ান" },
      story: { en: "Opportunity landed in January 2004 and rolled right into a small crater. Rock layers were already visible right beside it.", bn: "অপরচুনিটি ২০০৪ সালের জানুয়ারিতে নামে এবং সোজা একটি ছোট গর্তে গড়িয়ে পড়ে। পাশেই পাথরের স্তর দেখা যাচ্ছিল।" },
      animation: { cue: "crater-landing", draw: { en: "Rover rolls to rest inside a small bowl.", bn: "রোভার একটি ছোট বাটির ভেতরে গড়িয়ে থামে।" } },
      interaction: { type: "tap", prompt: { en: "Tap to land.", bn: "নামতে ট্যাপ করুন।" } },
    },
    {
      id: "opportunity-ch-02",
      number: 2,
      title: { en: "Blueberries", bn: "ব্লুবেরি" },
      story: { en: "Tiny round pebbles nicknamed blueberries were scattered across the ground. They formed in water.", bn: "ব্লুবেরি নামে পরিচিত ছোট গোলাকার নুড়ি মাটিতে ছড়িয়ে ছিল। এগুলো পানির মধ্যে তৈরি হয়েছিল।" },
      animation: { cue: "blueberries", draw: { en: "Close-up of small gray-blue spheres in soil.", bn: "মাটির মধ্যে ছোট ধূসর-নীল গোলকের নিকট দৃশ্য।" } },
      interaction: { type: "tap", prompt: { en: "Tap to zoom in on the pebbles.", bn: "নুড়িগুলো জুম করতে ট্যাপ করুন।" } },
    },
    {
      id: "opportunity-ch-03",
      number: 3,
      title: { en: "A Marathon Machine", bn: "ম্যারাথন যন্ত্র" },
      story: { en: "Planned for 90 days, Opportunity kept driving for about 14 years and covered over 45 kilometers.", bn: "৯০ দিনের জন্য পরিকল্পিত অপরচুনিটি প্রায় ১৪ বছর ধরে চলেছিল এবং ৪৫ কিলোমিটারের বেশি পথ পাড়ি দিয়েছিল।" },
      animation: { cue: "odometer", draw: { en: "Odometer climbs, rover tracks stretch across the plain.", bn: "ওডোমিটার বাড়ে, রোভারের চাকার দাগ সমভূমি জুড়ে ছড়ায়।" } },
      interaction: { type: "drag", prompt: { en: "Drag the rover along its long path.", bn: "রোভারকে তার দীর্ঘ পথ ধরে টেনে নিন।" } },
    },
    {
      id: "opportunity-ch-04",
      number: 4,
      title: { en: "The Great Dust Storm", bn: "মহা ধূলিঝড়" },
      story: { en: "In 2018 a giant dust storm blocked the sunlight that powered the rover. Opportunity went silent. Its last message is remembered as saying its battery was low and it was getting dark.", bn: "২০১৮ সালে বিশাল ধূলিঝড় রোভারকে শক্তি দেওয়া সূর্যের আলো আটকে দেয়। অপরচুনিটি নীরব হয়ে যায়। এর শেষ বার্তা মনে রাখা হয়—ব্যাটারি কম, অন্ধকার বাড়ছে।" },
      animation: { cue: "dust-storm", draw: { en: "Sky turns dark orange, rover panels lose light, a final heartbeat.", bn: "আকাশ গাঢ় কমলা হয়, রোভারের প্যানেল আলো হারায়, শেষ হৃদস্পন্দন।" } },
      interaction: { type: "hold", prompt: { en: "Hold to send a final call to Opportunity.", bn: "অপরচুনিটিকে শেষ বার্তা পাঠাতে চেপে ধরুন।" } },
    },
    ],
  },
  "phoenix": {
    sourceId: "phoenix",
    missionId: "phoenix",
    sourceTitle: "Phoenix Mars Lander",
    years: "2008",
    destination: "mars",
    chapters: [
    {
      id: "phoenix-ch-01",
      number: 1,
      title: { en: "Seven Minutes of Terror", bn: "সাত মিনিটের আতঙ্ক" },
      story: { en: "On May 25, 2008, Phoenix had to slow from thousands of km/h to a soft landing in about seven minutes, all on its own.", bn: "২০০৮ সালের ২৫ মে ফিনিক্সকে হাজার হাজার কিমি/ঘণ্টা থেকে প্রায় সাত মিনিটে নরমে নামতে হয়েছিল—সম্পূর্ণ নিজে নিজে।" },
      animation: { cue: "edl", draw: { en: "Heat shield glows, parachute opens, thrusters fire.", bn: "তাপ ঢাল জ্বলে ওঠে, প্যারাশুট খোলে, থ্রাস্টার চালু হয়।" } },
      interaction: { type: "tap", prompt: { en: "Tap to deploy the parachute.", bn: "প্যারাশুট খুলতে ট্যাপ করুন।" } },
    },
    {
      id: "phoenix-ch-02",
      number: 2,
      title: { en: "Digging North", bn: "উত্তরে খনন" },
      story: { en: "Phoenix landed near the north pole where ice might hide just below the surface. Its robotic arm began to dig.", bn: "ফিনিক্স উত্তর মেরুর কাছে নামে যেখানে পৃষ্ঠের ঠিক নিচে বরফ লুকিয়ে থাকতে পারে। এর রোবোটিক বাহু খুঁড়তে শুরু করে।" },
      animation: { cue: "arm-dig", draw: { en: "Robotic arm scoops soil into a trench.", bn: "রোবোটিক বাহু মাটি তুলে পরিখায় ফেলে।" } },
      interaction: { type: "drag", prompt: { en: "Drag the arm to dig.", bn: "বাহুটি টেনে খনন করুন।" } },
    },
    {
      id: "phoenix-ch-03",
      number: 3,
      title: { en: "White Chunks", bn: "সাদা টুকরা" },
      story: { en: "Bright white chunks in the trench vanished a few days later. They were water ice, evaporating in the thin air.", bn: "পরিখার উজ্জ্বল সাদা টুকরা কয়েক দিন পর উধাও হয়ে যায়। সেগুলো ছিল পানির বরফ, যা পাতলা বাতাসে বাষ্প হয়ে যায়।" },
      animation: { cue: "ice-vanish", draw: { en: "White chunks in the trench fade away frame by frame.", bn: "পরিখার সাদা টুকরা ফ্রেমে ফ্রেমে মিলিয়ে যায়।" } },
      interaction: { type: "tap", prompt: { en: "Tap to check the trench again.", bn: "পরিখা আবার পরীক্ষা করতে ট্যাপ করুন।" } },
    },
    {
      id: "phoenix-ch-04",
      number: 4,
      title: { en: "Winter Comes", bn: "শীত আসে" },
      story: { en: "As the Martian winter came, sunlight faded and Phoenix lost power in November 2008.", bn: "মঙ্গলের শীত আসার সঙ্গে সূর্যের আলো কমে যায় এবং ফিনিক্স ২০০৮ সালের নভেম্বরে শক্তি হারায়।" },
      animation: { cue: "sun-fade", draw: { en: "Sun sinks, frost forms on the lander.", bn: "সূর্য ডুবে যায়, ল্যান্ডারে তুষার জমে।" } },
      interaction: { type: 'choice', prompt: { en: "What did Phoenix confirm?", bn: "ফিনিক্স কী নিশ্চিত করেছিল?" }, options: [{ en: "Water ice below the surface", bn: "পৃষ্ঠের নিচে পানির বরফ" }, { en: "Living plants", bn: "জীবন্ত গাছ" }, { en: "A hidden city", bn: "লুকানো শহর" }], answer: 0 },
    },
    ],
  },
  "insight": {
    sourceId: "insight",
    missionId: "insight",
    sourceTitle: "InSight Mars Lander",
    years: "2018",
    destination: "mars",
    chapters: [
    {
      id: "insight-ch-01",
      number: 1,
      title: { en: "A Listening Station", bn: "শোনার স্টেশন" },
      story: { en: "InSight landed in November 2018. Instead of driving, it stayed still to listen to the planet from the inside.", bn: "ইনসাইট ২০১৮ সালের নভেম্বরে নামে। চলাফেরা না করে এটি স্থির থেকে গ্রহের ভেতরের কথা শোনে।" },
      animation: { cue: "landing-flat", draw: { en: "Lander settles on a flat plain.", bn: "ল্যান্ডার সমতল ভূমিতে থিতিয়ে পড়ে।" } },
      interaction: { type: "tap", prompt: { en: "Tap to land.", bn: "নামতে ট্যাপ করুন।" } },
    },
    {
      id: "insight-ch-02",
      number: 2,
      title: { en: "Placing the Seismometer", bn: "সিসমোমিটার স্থাপন" },
      story: { en: "A robotic arm lifted a seismometer, an instrument that detects quakes, and set it gently on the ground.", bn: "রোবোটিক বাহু একটি সিসমোমিটার—ভূকম্প শনাক্তকারী যন্ত্র—উঠিয়ে আলতোভাবে মাটিতে রাখে।" },
      animation: { cue: "arm-place", draw: { en: "Arm lowers a dome onto the surface.", bn: "বাহু একটি গম্বুজ পৃষ্ঠে নামিয়ে দেয়।" } },
      interaction: { type: "drag", prompt: { en: "Drag the seismometer into place.", bn: "সিসমোমিটারটি জায়গায় টেনে বসান।" } },
    },
    {
      id: "insight-ch-03",
      number: 3,
      title: { en: "Marsquakes", bn: "মঙ্গলকম্প" },
      story: { en: "InSight detected hundreds of marsquakes. Their waves showed Mars's crust, mantle and core.", bn: "ইনসাইট শত শত মঙ্গলকম্প শনাক্ত করে। তাদের তরঙ্গ মঙ্গলের ভূত্বক, ম্যান্টল ও কেন্দ্র দেখায়।" },
      animation: { cue: "seismic-waves", draw: { en: "Waves travel through a cutaway of Mars.", bn: "তরঙ্গ মঙ্গলের কর্তিত অংশের মধ্য দিয়ে যায়।" } },
      interaction: { type: "tap", prompt: { en: "Tap to feel the quake.", bn: "কম্পন অনুভব করতে ট্যাপ করুন।" } },
    },
    {
      id: "insight-ch-04",
      number: 4,
      title: { en: "The Mole's Struggle", bn: "মোলের সংগ্রাম" },
      story: { en: "A digging probe called the mole could not get deep enough into the soil. Engineers tried many fixes, but it never fully worked.", bn: "মোল নামের খনন অনুসন্ধানযান মাটির যথেষ্ট গভীরে যেতে পারেনি। প্রকৌশলীরা অনেক উপায় চেষ্টা করেন, কিন্তু এটি পুরোপুরি কাজ করেনি।" },
      animation: { cue: "mole-stuck", draw: { en: "Mole pokes out of the ground at an angle.", bn: "মোল কোণ করে মাটি থেকে বেরিয়ে থাকে।" } },
      interaction: { type: "tap", prompt: { en: "Tap to hammer.", bn: "হাতুড়ি চালাতে ট্যাপ করুন।" } },
    },
    {
      id: "insight-ch-05",
      number: 5,
      title: { en: "The Final Signal", bn: "শেষ সংকেত" },
      story: { en: "Dust built up on InSight's panels. In December 2022 the mission ended after four years of listening to Mars.", bn: "ইনসাইটের প্যানেলে ধুলো জমে। ২০২২ সালের ডিসেম্বরে চার বছর মঙ্গল শোনার পর মিশন শেষ হয়।" },
      animation: { cue: "dust-settle", draw: { en: "Dust covers panels, signal lines fade.", bn: "ধুলো প্যানেল ঢেকে দেয়, সংকেতের রেখা মিলিয়ে যায়।" } },
      interaction: { type: 'choice', prompt: { en: "What did InSight listen for?", bn: "ইনসাইট কী শুনেছিল?" }, options: [{ en: "Marsquakes", bn: "মঙ্গলকম্প" }, { en: "Alien voices", bn: "ভিনগ্রহের কণ্ঠ" }, { en: "Wind music", bn: "বাতাসের সংগীত" }], answer: 0 },
    },
    ],
  },
};

const LEGACY_CACHE = new Map<string, MissionChapter[]>();

export const chaptersFor = (missionId: string): MissionChapter[] => {
  const canonical = MISSION_STORIES[missionId];
  if (canonical) return canonical.chapters;

  // Backward-compatible fallback for any mission added without a chapter file.
  // Cached so the array identity stays stable across renders.
  const cached = LEGACY_CACHE.get(missionId);
  if (cached) return cached;
  const mission = getMission(missionId);
  const legacy = mission.story.map((chapter, index) => ({
    id: `${mission.id}-legacy-${String(index + 1).padStart(2, '0')}`,
    number: index + 1,
    title: chapter.title,
    story: {
      en: chapter.lines.map((line) => line.en).join('\n\n'),
      bn: chapter.lines.map((line) => line.bn).join('\n\n'),
    },
    animation: {
      cue: 'cruise',
      draw: {
        en: 'A quiet establishing view of the recovered spacecraft.',
        bn: 'উদ্ধার করা মহাকাশযানের একটি শান্ত প্রতিষ্ঠাকারী দৃশ্য।',
      },
    },
    interaction: null,
  }));
  LEGACY_CACHE.set(missionId, legacy);
  return legacy;
};

export const chapterIdsFor = (missionId: string): string[] => chaptersFor(missionId).map((chapter) => chapter.id);
export const missionStoryFor = (missionId: string): MissionStory | null => MISSION_STORIES[missionId] ?? null;
