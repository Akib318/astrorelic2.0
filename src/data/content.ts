import type { DialogueLine } from '../state/store';

export const UI = {
  tagline1: { en: 'Abandoned but Not Forgotten', bn: 'পরিত্যক্ত, কিন্তু ভোলা হয়নি' },
  tagline2: { en: 'Every machine has a mission.', bn: 'প্রতিটি যন্ত্রের একটি মিশন আছে।' },
  tagline3: { en: 'Every mission leaves a story.', bn: 'প্রতিটি মিশন রেখে যায় একটি গল্প।' },
  cta: { en: 'ENTER 3D SOLAR SYSTEM', bn: 'থ্রিডি সৌরজগতে প্রবেশ করুন' },
  ctaSub: { en: 'Explore • Discover • Remember', bn: 'অন্বেষণ • আবিষ্কার • স্মরণ' },
  loading: { en: 'CALIBRATING DEEP SPACE ARRAY…', bn: 'মহাশূন্য যন্ত্রপাতি প্রস্তুত হচ্ছে…' },
  langBtn: { en: 'বাংলা', bn: 'EN' },
  objectiveExplore: { en: 'Follow the beacon. Find the old machine.', bn: 'বিকনের আলো অনুসরণ করুন। পুরনো যন্ত্রটিকে খুঁজে বের করুন।' },
  hearStory: { en: 'HEAR MY STORY', bn: 'আমার গল্প শুনুন' },
  inspectBtn: { en: 'INSPECT MY HARDWARE', bn: 'আমার যন্ত্রাংশ দেখুন' },
  continueBtn: { en: 'CONTINUE', bn: 'এগিয়ে যান' },
  chapterComplete: { en: 'CHAPTER COMPLETE', bn: 'অধ্যায় সম্পন্ন' },
  nextChapter: { en: 'NEXT CHAPTER', bn: 'পরের অধ্যায়' },
  marsJourney: { en: 'MARS JOURNEY', bn: 'মঙ্গল যাত্রা' },
  backToSolar: { en: 'RETURN TO SOLAR SYSTEM', bn: 'সৌরজগতে ফিরে যান' },
  replay: { en: 'REPLAY CHAPTER', bn: 'আবার খেলুন' },
  locked: { en: 'LOCKED', bn: 'বন্ধ' },
  comingSoon: { en: 'Unlocks after the Mars journey', bn: 'মঙ্গল যাত্রার পর খুলবে' },
  completeFirst: { en: 'Complete the previous mission first', bn: 'আগে আগের মিশনটি সম্পন্ন করুন' },
  completed: { en: 'COMPLETED', bn: 'সম্পন্ন' },
  available: { en: 'AVAILABLE', bn: 'উপলব্ধ' },
  missionsExplored: { en: 'MISSIONS EXPLORED', bn: 'মিশন অন্বেষণ' },
  missionHub: { en: 'MISSION HUB', bn: 'মিশন হাব' },
  nextUp: { en: 'NEXT', bn: 'পরবর্তী' },
  mars: { en: 'MARS', bn: 'মঙ্গল' },
  marsDesc: { en: 'Lost explorers. Forgotten missions. Stories that survived.', bn: 'হারিয়ে যাওয়া অভিযাত্রী। ভুলে যাওয়া মিশন। টিকে থাকা গল্প।' },
  moon: { en: 'MOON', bn: 'চাঁদ' },
  moonDesc: { en: 'Machines, instruments, and forgotten hardware.', bn: 'যন্ত্র, উপকরণ, আর ভোলা যন্ত্রাংশ।' },
  twoWorlds: { en: 'Two worlds are waiting for us.', bn: 'দুটি জগৎ আমাদের জন্য অপেক্ষা করছে।' },
  chooseJourney: { en: 'CHOOSE YOUR JOURNEY', bn: 'আপনার যাত্রা বেছে নিন' },
  moveHint: { en: 'WASD / Arrow keys to walk • Drag to look around', bn: 'হাঁটতে WASD / তীর কী • চারপাশ দেখতে টেনে ঘোরান' },
  walkToRover: { en: 'Approach the rover', bn: 'রোভারের কাছে যান' },
  clickContinue: { en: 'click to continue', bn: 'এগিয়ে যেতে ক্লিক করুন' },
  storyMode: { en: 'STORY MODE', bn: 'গল্পের মোড' },
  chapter: { en: 'CHAPTER', bn: 'অধ্যায়' },
  storyProgress: { en: 'STORY PROGRESS', bn: 'গল্পের অগ্রগতি' },
  visualCue: { en: 'VISUAL CUE', bn: 'দৃশ্য সংকেত' },
  clue: { en: 'CLUE', bn: 'ইঙ্গিত' },
  interaction: { en: 'INTERACTION', bn: 'মিথস্ক্রিয়া' },
  inProgress: { en: 'IN PROGRESS', bn: 'চলমান' },
  interactionRequired: { en: 'INTERACTION REQUIRED', bn: 'মিথস্ক্রিয়া প্রয়োজন' },
  interactionComplete: { en: 'INTERACTION COMPLETE', bn: 'মিথস্ক্রিয়া সম্পন্ন' },
  chapterRestored: { en: 'This chapter is already complete.', bn: 'এই অধ্যায় ইতিমধ্যে সম্পন্ন।' },
  noInteraction: { en: 'No manual interaction is required for this chapter.', bn: 'এই অধ্যায়ে কোনো ম্যানুয়াল মিথস্ক্রিয়া প্রয়োজন নেই।' },
  tapControl: { en: 'TAP CONTROL', bn: 'নিয়ন্ত্রণে ট্যাপ করুন' },
  holdControl: { en: 'HOLD CONTROL', bn: 'নিয়ন্ত্রণ চেপে ধরুন' },
  releaseToCancel: { en: 'release early to cancel', bn: 'বাতিল করতে আগে ছেড়ে দিন' },
  dragControl: { en: 'DRAG CONTROL', bn: 'নিয়ন্ত্রণ টেনে নিন' },
  dragTarget: { en: 'TARGET', bn: 'লক্ষ্য' },
  dragHint: { en: 'Drag to the target, or use the arrow keys.', bn: 'লক্ষ্যে টেনে নিন, অথবা তীর কী ব্যবহার করুন।' },
  choiceWrong: { en: 'Not quite. Try another answer.', bn: 'ঠিক নয়। আরেকটি উত্তর চেষ্টা করুন।' },
  continueStory: { en: 'CONTINUE CHAPTER', bn: 'অধ্যায় চালিয়ে যান' },
  finishStory: { en: 'COMPLETE STORY', bn: 'গল্প শেষ করুন' },
  missionRecord: { en: 'MISSION RECORD', bn: 'মিশনের নথি' },
  chapterSaveNote: { en: 'Chapter progress is saved automatically in this browser.', bn: 'অধ্যায়ের অগ্রগতি এই ব্রাউজারে স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়।' },
  myHardware: { en: 'MY HARDWARE', bn: 'আমার যন্ত্রাংশ' },
  whatItDid: { en: 'WHAT IT DID', bn: 'এটি কী করত' },
  whyItMattered: { en: 'WHY IT MATTERED', bn: 'কেন গুরুত্বপূর্ণ ছিল' },
  missionEvent: { en: 'MISSION EVENT', bn: 'মিশনের ঘটনা' },
  hotspotHint: { en: 'Rotate the rover. Click the glowing parts.', bn: 'রোভারটি ঘোরান। জ্বলজ্বলে অংশগুলোতে ক্লিক করুন।' },
  inspectionProgress: { en: 'INSPECTION PROGRESS', bn: 'পরিদর্শন অগ্রগতি' },
  inspected: { en: 'inspected', bn: 'পরিদর্শিত' },
  remainingHardware: { en: 'Remaining hardware', bn: 'বাকি যন্ত্রাংশ' },
  inspectAllHint: { en: 'Inspect every hardware item to finish.', bn: 'শেষ করতে প্রতিটি যন্ত্রাংশ পরিদর্শন করুন।' },
  allVisited: { en: 'You know how I worked now.', bn: 'এখন আপনি জানেন আমি কীভাবে কাজ করতাম।' },
  finishInspect: { en: 'FINISH INSPECTION', bn: 'পরিদর্শন শেষ করুন' },
  mute: { en: 'SOUND', bn: 'শব্দ' },
};

// ---------- Nova tutorial (solar system) ----------
export const NOVA_INTRO: DialogueLine[] = [
  { speaker: 'nova', en: "Hi! I'm Nova.", bn: 'হাই! আমি নোভা।' },
  { speaker: 'nova', en: "I'll be your guide out here.", bn: 'এখানে আমি আপনার গাইড।' },
  { speaker: 'nova', en: 'Try moving your mouse.', bn: 'মাউসটি একটু নাড়িয়ে দেখুন।' },
];

export const NOVA_AFTER_MOVE: DialogueLine[] = [
  { speaker: 'nova', en: 'Great! Now drag to rotate the Solar System.', bn: 'দারুণ! এবার টেনে সৌরজগৎটাকে ঘোরান।' },
];

export const NOVA_AFTER_ROTATE: DialogueLine[] = [
  { speaker: 'nova', en: 'Nicely done. Scroll to zoom in and out.', bn: 'চমৎকার। এবার স্ক্রল করে জুম ইন-আউট করুন।' },
];

export const NOVA_POINT_MARS: DialogueLine[] = [
  { speaker: 'nova', en: 'See that red planet?', bn: 'ওই লাল গ্রহটা দেখছেন?' },
  { speaker: 'nova', en: "That's Mars.", bn: 'ওটা মঙ্গল।' },
  { speaker: 'nova', en: "And the small grey one beside Earth — that's the Moon.", bn: 'আর পৃথিবীর পাশের ছোট্ট ধূসরটা — সেটা চাঁদ।' },
  { speaker: 'nova', en: 'Click Mars or the Moon when you are ready.', bn: 'প্রস্তুত হলে মঙ্গল বা চাঁদের ওপর ক্লিক করুন।' },
];

export const NOVA_TWO_WORLDS: DialogueLine[] = [
  { speaker: 'nova', en: 'Two worlds are waiting for us.', bn: 'দুটি জগৎ আমাদের জন্য অপেক্ষা করছে।' },
  { speaker: 'nova', en: 'Where do we begin?', bn: 'কোথা থেকে শুরু করব?' },
];

export const NOVA_WELCOME_MARS: DialogueLine[] = [
  { speaker: 'nova', en: 'Welcome to Mars.', bn: 'মঙ্গলে স্বাগতম।' },
  { speaker: 'nova', en: "We're not here just to explore Mars.", bn: 'আমরা শুধু মঙ্গল ঘুরতে আসিনি।' },
  { speaker: 'nova', en: "We're here to remember the machines that explored it for us.", bn: 'আমরা এসেছি সেই যন্ত্রগুলোকে মনে করতে, যারা আমাদের হয়ে এই গ্রহ ঘুরেছিল।' },
  { speaker: 'nova', en: 'Come on. Follow the beacon.', bn: 'চলুন। বিকনের আলো অনুসরণ করুন।' },
];

export const NOVA_NEAR_SITE: DialogueLine[] = [
  { speaker: 'nova', en: 'Before the explorers you know today…', bn: 'আজকের পরিচিত অভিযাত্রীদের আগে…' },
  { speaker: 'nova', en: '…a little rover was already exploring Mars.', bn: '…একটি ছোট্ট রোভার তখনই মঙ্গল ঘুরে বেড়াচ্ছিল।' },
];

export const SOJOURNER_WAKE: DialogueLine[] = [
  { speaker: 'sojourner', en: "Hi… I'm Sojourner.", bn: 'হাই… আমি সোজার্নার।' },
  { speaker: 'sojourner', en: 'Nobody has visited me in a very long time.', bn: 'অনেক দিন কেউ আমার কাছে আসেনি।' },
  { speaker: 'sojourner', en: 'Would you like to know my story?', bn: 'আমার গল্পটা জানতে চান?' },
];

export const SOJOURNER_AFTER_STORY: DialogueLine[] = [
  { speaker: 'sojourner', en: 'You know my story now.', bn: 'এখন আপনি আমার গল্প জানেন।' },
  { speaker: 'sojourner', en: 'But Mars still has more stories.', bn: 'কিন্তু মঙ্গলের আরও অনেক গল্প আছে।' },
];

export const NOVA_AFTER_FLAGS: DialogueLine[] = [
  { speaker: 'nova', en: 'Mars has told us many stories.', bn: 'মঙ্গল আমাদের অনেক গল্প শুনিয়েছে।' },
  { speaker: 'nova', en: 'But another world is waiting.', bn: 'কিন্তু আরেকটি জগৎ অপেক্ষা করছে।' },
];

// ---------- Cinematic captions ----------
export const CINEMATIC_BEATS = [
  { en: 'MARS APPROACH', bn: 'মঙ্গলের দিকে এগিয়ে', at: 0.5 },
  { en: 'SPACECRAFT JOURNEY · 7 MONTHS', bn: 'মহাকাশযানের যাত্রা · ৭ মাস', at: 3.5 },
  { en: 'ATMOSPHERIC ENTRY', bn: 'বায়ুমণ্ডলে প্রবেশ', at: 7.0 },
  { en: 'LANDING', bn: 'অবতরণ', at: 10.5 },
];

// ---------- Journey map missions ----------
export const MISSIONS = [
  { id: 'pathfinder', name: 'MARS PATHFINDER / SOJOURNER', bn: 'মার্স পাথফাইন্ডার / সোজার্নার' },
  { id: 'opportunity', name: 'OPPORTUNITY', bn: 'অপরচুনিটি' },
  { id: 'spirit', name: 'SPIRIT', bn: 'স্পিরিট' },
  { id: 'phoenix', name: 'PHOENIX', bn: 'ফিনিক্স' },
  { id: 'insight', name: 'INSIGHT', bn: 'ইনসাইট' },
];
