import { STORY, HOTSPOTS, type StoryChapter, type Hotspot } from './story';

export type Destination = 'moon' | 'mars';
export type ModelKind =
  | 'pathfinder' | 'mer' | 'phoenix' | 'insight' | 'ranger' | 'surveyor'
  | 'orbiter' | 'csm' | 'lm' | 'lrv';
export type LocalText = { en: string; bn: string };

export interface Mission {
  id: string;
  destination: Destination;
  name: LocalText;
  shortName: string;
  year: string;
  location: LocalText;
  description: LocalText;
  objective: LocalText;
  model: ModelKind;
  surface: boolean;
  accent: string;
  story: StoryChapter[];
  hotspots: Hotspot[];
}

const tx = (en: string, bn: string): LocalText => ({ en, bn });
const chapter = (id: string, title: LocalText, lines: LocalText[]): StoryChapter[] => [
  { id, title, camera: 'orbit', lines },
];
const spot = (
  id: string,
  label: LocalText,
  pos: [number, number, number],
  did: LocalText,
  mattered: LocalText,
  event: LocalText,
): Hotspot => ({ id, label, pos, did, mattered, event });

const lunarLanding = (
  id: string,
  name: string,
  bnName: string,
  year: string,
  location: LocalText,
  description: LocalText,
  lines: LocalText[],
  model: ModelKind = 'lm',
): Mission => ({
  id,
  destination: 'moon',
  name: tx(name, bnName),
  shortName: name,
  year,
  location,
  description,
  objective: tx('Approach the mission site, then inspect the surviving equipment.', 'মিশন স্থলে যান, তারপর থেকে যাওয়া যন্ত্রপাতি পরিদর্শন করুন।'),
  model,
  surface: true,
  accent: '#c7d3df',
  story: chapter(`${id}-story`, tx(`${name} — MISSION RECORD`, `${bnName} — মিশনের ইতিহাস`), lines),
  hotspots: [
    spot('descent', tx('Lunar Module descent stage', 'লুনার মডিউলের অবতরণ অংশ'), [0, 1.05, 0],
      tx('The descent stage carried the landing engine, propellant and surface equipment.', 'অবতরণ অংশে ছিল ল্যান্ডিং ইঞ্জিন, জ্বালানি ও পৃষ্ঠে কাজের সরঞ্জাম।'),
      tx('It served as the launch platform when the ascent stage departed.', 'আরোহণ অংশ ফিরে যাওয়ার সময় এটি উৎক্ষেপণ মঞ্চ হিসেবে কাজ করেছিল।'),
      tx(`The ${name} descent stage remained at the landing site after the crew left.`, `${name} মিশনের দল চলে যাওয়ার পর অবতরণ অংশটি চাঁদেই থেকে যায়।`)),
    spot('surface', tx('Surface science and exploration', 'পৃষ্ঠের বিজ্ঞান ও অন্বেষণ'), [1.7, 0.65, 0.6],
      tx('Crews photographed the terrain, collected samples and deployed scientific equipment.', 'নভোচারীরা ভূদৃশ্যের ছবি তুলেছিলেন, নমুনা সংগ্রহ ও বৈজ্ঞানিক যন্ত্র স্থাপন করেছিলেন।'),
      tx('Surface work turned a landing into a sustained program of lunar science.', 'পৃষ্ঠের কাজ অবতরণকে চাঁদের বিজ্ঞানের একটি ধারাবাহিক অধ্যায়ে রূপ দিয়েছিল।'),
      lines[1]),
  ],
});

export const MOON_MISSIONS: Mission[] = [
  {
    id: 'ranger', destination: 'moon', name: tx('LUNAR RANGER', 'লুনার রেঞ্জার'), shortName: 'Lunar Ranger', year: '1964–1965',
    location: tx('Lunar approach trajectories', 'চাঁদের দিকে অভিযাত্রার পথ'),
    description: tx('Television eyes on the final approach to an unknown surface.', 'অজানা পৃষ্ঠের দিকে শেষ অভিযানে টেলিভিশনের চোখ।'),
    objective: tx('Orbit the Ranger spacecraft and inspect its imaging systems.', 'রেঞ্জার মহাকাশযানটি ঘুরে দেখুন ও এর ইমেজিং ব্যবস্থা পরিদর্শন করুন।'),
    model: 'ranger', surface: false, accent: '#b9c8d8',
    story: chapter('ranger-story', tx('BEFORE THE LANDINGS', 'অবতরণের আগে'), [
      tx('Ranger probes were designed to transmit close-up television images as they approached the Moon, then impact its surface.', 'রেঞ্জার অনুসন্ধানযানগুলো চাঁদের কাছে পৌঁছে নিকট দৃশ্যের টেলিভিশন ছবি পাঠানোর জন্য তৈরি হয়েছিল; শেষে সেগুলো পৃষ্ঠে আঘাত করত।'),
      tx('Ranger 7 succeeded in July 1964, returning more than 4,300 images before impact.', '১৯৬৪ সালের জুলাইয়ে রেঞ্জার ৭ সফল হয়, আঘাতের আগে ৪,৩০০-এর বেশি ছবি পাঠায়।'),
      tx('Rangers 8 and 9 extended that reconnaissance. They were impact probes, not rovers or soft landers.', 'রেঞ্জার ৮ ও ৯ সেই পর্যবেক্ষণ এগিয়ে নিয়েছিল। এগুলো ছিল আঘাতকারী অনুসন্ধানযান, রোভার বা নরম অবতরণযান নয়।'),
    ]),
    hotspots: [
      spot('cameras', tx('Television camera bay', 'টেলিভিশন ক্যামেরা বিভাগ'), [0, 0.25, 0.6], tx('Six cameras on the successful Block III spacecraft photographed the approach.', 'সফল ব্লক-৩ যানের ছয়টি ক্যামেরা অভিযাত্রার দৃশ্য ধারণ করেছিল।'), tx('The images revealed craters within craters and terrain details invisible from Earth.', 'ছবিগুলোতে গর্তের মধ্যে গর্ত ও পৃথিবী থেকে অদৃশ্য ভূখণ্ডের বিবরণ ধরা পড়েছিল।'), tx('Ranger 7 returned its images during the final minutes before impact.', 'রেঞ্জার ৭ আঘাতের ঠিক আগের শেষ কয়েক মিনিটে ছবিগুলো পাঠিয়েছিল।')),
      spot('panels', tx('Solar panels and high-gain antenna', 'সৌরপ্যানেল ও উচ্চ-লাভ অ্যান্টেনা'), [1.45, 0.35, 0], tx('Solar arrays powered the spacecraft while its antenna returned image data.', 'সৌরপ্যানেল যানকে শক্তি দিত, আর অ্যান্টেনা ছবির তথ্য পাঠাত।'), tx('Stable power and communications were essential during the brief imaging sequence.', 'স্বল্প সময়ের ইমেজিংয়ের জন্য স্থিতিশীল শক্তি ও যোগাযোগ অপরিহার্য ছিল।'), tx('The successful Rangers demonstrated systems later used by other planetary spacecraft.', 'সফল রেঞ্জারগুলো পরবর্তী অন্যান্য গ্রহীয় মহাকাশযানের ব্যবস্থার পথ দেখিয়েছিল।')),
    ],
  },
  {
    id: 'surveyor', destination: 'moon', name: tx('SURVEYOR', 'সার্ভেয়র'), shortName: 'Surveyor', year: '1966–1968',
    location: tx('Five successful lunar landing sites', 'চাঁদে পাঁচটি সফল অবতরণস্থল'),
    description: tx('Robotic soft landers tested the ground before Apollo.', 'অ্যাপোলোর আগে রোবোটিক যান নরম অবতরণ ও ভূমি পরীক্ষা করেছিল।'),
    objective: tx('Find the stationary Surveyor lander and inspect its surface instruments.', 'স্থির সার্ভেয়র ল্যান্ডারটি খুঁজুন ও এর যন্ত্র পরিদর্শন করুন।'),
    model: 'surveyor', surface: true, accent: '#d8d0b8',
    story: chapter('surveyor-story', tx('A GENTLE TOUCHDOWN', 'নরম অবতরণ'), [
      tx('Surveyor 1 made the first successful American soft landing on the Moon in June 1966.', '১৯৬৬ সালের জুনে সার্ভেয়র ১ চাঁদে প্রথম সফল মার্কিন নরম অবতরণ সম্পন্ন করে।'),
      tx('Five Surveyors succeeded. They returned close-up images and investigated the mechanical and chemical properties of lunar soil.', 'পাঁচটি সার্ভেয়র সফল হয়। সেগুলো নিকট দৃশ্যের ছবি ও চাঁদের মাটির যান্ত্রিক ও রাসায়নিক বৈশিষ্ট্যের তথ্য দেয়।'),
      tx('Their results showed that the surface could support landers and helped prepare for Apollo.', 'ফলাফল দেখায় পৃষ্ঠ ল্যান্ডারের ওজন সহ্য করতে পারে এবং অ্যাপোলোর প্রস্তুতিতে সাহায্য করে।'),
    ]),
    hotspots: [
      spot('legs', tx('Three-legged landing system', 'তিন পায়ের অবতরণ ব্যবস্থা'), [-0.8, 0.45, 0.5], tx('Three shock-absorbing legs supported the stationary lander.', 'তিনটি কম্পন-শোষণকারী পা স্থির ল্যান্ডারটিকে ধরে রাখত।'), tx('A controlled soft landing allowed instruments to operate for weeks on the surface.', 'নিয়ন্ত্রিত নরম অবতরণের ফলে যন্ত্রগুলো সপ্তাহ ধরে পৃষ্ঠে কাজ করেছিল।'), tx('Surveyor 3 was later visited by the Apollo 12 crew.', 'পরে অ্যাপোলো ১২-এর নভোচারীরা সার্ভেয়র ৩-এর কাছে গিয়েছিলেন।')),
      spot('soil', tx('Soil experiments and television camera', 'মাটি পরীক্ষা ও টেলিভিশন ক্যামেরা'), [0.65, 1.15, 0.3], tx('Later Surveyors carried a scoop or an alpha-scattering instrument; all carried imaging equipment.', 'পরবর্তী সার্ভেয়রে ছিল খননযন্ত্র বা আলফা-বিক্ষেপণ যন্ত্র; সবগুলোতেই ছিল ইমেজিং সরঞ্জাম।'), tx('Soil measurements helped engineers judge bearing strength and surface behavior.', 'মাটির পরিমাপ প্রকৌশলীদের ভারসহন ও পৃষ্ঠের আচরণ বুঝতে সাহায্য করেছিল।'), tx('The program returned almost 90,000 images from five sites.', 'এই কর্মসূচি পাঁচটি স্থান থেকে প্রায় ৯০,০০০ ছবি পাঠিয়েছিল।')),
    ],
  },
  {
    id: 'lunar-orbiter', destination: 'moon', name: tx('LUNAR ORBITER', 'লুনার অরবিটার'), shortName: 'Lunar Orbiter', year: '1966–1967',
    location: tx('Lunar orbit', 'চন্দ্র কক্ষপথ'),
    description: tx('Five orbiting cameras mapped potential Apollo landing regions.', 'কক্ষপথের পাঁচটি ক্যামেরা সম্ভাব্য অ্যাপোলো অবতরণস্থলের মানচিত্র তৈরি করেছিল।'),
    objective: tx('Inspect the orbiter without descending to the surface.', 'পৃষ্ঠে না নেমে অরবিটারটি পরিদর্শন করুন।'),
    model: 'orbiter', surface: false, accent: '#b7c9e0',
    story: chapter('orbiter-story', tx('MAPPING FROM ORBIT', 'কক্ষপথ থেকে মানচিত্র'), [
      tx('Five Lunar Orbiters photographed the Moon from orbit in 1966 and 1967.', '১৯৬৬ ও ১৯৬৭ সালে পাঁচটি লুনার অরবিটার কক্ষপথ থেকে চাঁদের ছবি তোলে।'),
      tx('Their cameras exposed film onboard, processed it, and scanned the images for radio transmission to Earth.', 'ক্যামেরাগুলো যানের ভেতরে ফিল্ম ধারণ ও প্রক্রিয়া করত, তারপর পৃথিবীতে পাঠানোর জন্য ছবি স্ক্যান করত।'),
      tx('The mapping coverage helped planners evaluate Apollo landing sites. These spacecraft remained in orbit; they never drove on the surface.', 'মানচিত্র অ্যাপোলোর অবতরণস্থল বাছাইয়ে সাহায্য করেছিল। যানগুলো কক্ষপথেই ছিল, পৃষ্ঠে চলেনি।'),
    ]),
    hotspots: [
      spot('camera', tx('Dual-lens photographic system', 'দুই লেন্সের আলোকচিত্র ব্যবস্থা'), [0, 0.35, 0.65], tx('Wide-angle and telephoto images were recorded on film.', 'প্রশস্ত ও দূরবীক্ষণ দৃশ্য ফিল্মে ধারণ করা হতো।'), tx('Different scales provided both regional context and surface detail.', 'ভিন্ন মাপের ছবি আঞ্চলিক প্রেক্ষাপট ও পৃষ্ঠের বিবরণ—দুটোই দিয়েছিল।'), tx('The exposed film was developed and scanned aboard the spacecraft.', 'ধারণকৃত ফিল্ম মহাকাশযানের ভেতরেই প্রক্রিয়া ও স্ক্যান করা হতো।')),
      spot('arrays', tx('Power and communications', 'শক্তি ও যোগাযোগ'), [1.45, 0.4, 0], tx('Four solar array sections supplied power; antennas maintained the link with Earth.', 'সৌরপ্যানেলের চারটি অংশ শক্তি দিত; অ্যান্টেনা পৃথিবীর সঙ্গে যোগাযোগ রাখত।'), tx('Long-duration orbital operations made a systematic photographic survey possible.', 'দীর্ঘ কক্ষীয় কার্যক্রম পদ্ধতিগত আলোকচিত্র জরিপ সম্ভব করেছিল।'), tx('All five missions succeeded in returning useful imagery.', 'পাঁচটি মিশনই সফলভাবে গুরুত্বপূর্ণ ছবি পাঠিয়েছিল।')),
    ],
  },
  {
    id: 'apollo-8', destination: 'moon', name: tx('APOLLO 8', 'অ্যাপোলো ৮'), shortName: 'Apollo 8', year: '1968',
    location: tx('Crewed lunar orbit', 'নভোচারীসহ চন্দ্র কক্ষপথ'),
    description: tx('The first crewed voyage around the Moon.', 'চাঁদের চারদিকে প্রথম নভোচারীসহ অভিযাত্রা।'),
    objective: tx('Inspect the Command and Service Modules in lunar orbit.', 'চন্দ্র কক্ষপথে কমান্ড ও সার্ভিস মডিউল পরিদর্শন করুন।'),
    model: 'csm', surface: false, accent: '#e0d6c2',
    story: chapter('apollo8-story', tx('AROUND THE MOON', 'চাঁদের চারদিকে'), [
      tx('In December 1968, Frank Borman, James Lovell and William Anders flew Apollo 8 around the Moon.', '১৯৬৮ সালের ডিসেম্বরে ফ্র্যাঙ্ক বোরম্যান, জেমস লোভেল ও উইলিয়াম অ্যান্ডার্স অ্যাপোলো ৮-এ চাঁদ প্রদক্ষিণ করেন।'),
      tx('The crew completed ten lunar orbits and returned views of the lunar far side and Earthrise.', 'দল দশবার চাঁদ প্রদক্ষিণ করে এবং চাঁদের অপর পৃষ্ঠ ও পৃথিবীর উদয়ের দৃশ্য পাঠায়।'),
      tx('Apollo 8 tested deep-space navigation and operations. It did not carry a lunar module and did not land.', 'অ্যাপোলো ৮ গভীর মহাশূন্যের পরিচালনা ও কার্যক্রম পরীক্ষা করেছিল। এতে লুনার মডিউল ছিল না এবং এটি অবতরণ করেনি।'),
    ]),
    hotspots: [
      spot('command', tx('Command Module', 'কমান্ড মডিউল'), [0, 0.35, 0.7], tx('The conical cabin carried the three astronauts and protected them during Earth re-entry.', 'শঙ্কু আকৃতির ক্যাবিন তিন নভোচারীকে বহন ও পৃথিবীতে প্রবেশের সময় সুরক্ষা দিয়েছিল।'), tx('It was the only Apollo spacecraft section designed to return through the atmosphere.', 'বায়ুমণ্ডল দিয়ে ফেরার জন্য অ্যাপোলোর একমাত্র এই অংশটি তৈরি হয়েছিল।'), tx('The crew splashed down safely in the Pacific on December 27, 1968.', '১৯৬৮ সালের ২৭ ডিসেম্বর দল প্রশান্ত মহাসাগরে নিরাপদে অবতরণ করে।')),
      spot('service', tx('Service Propulsion System', 'সার্ভিস প্রপালশন সিস্টেম'), [0, 0.35, -1.1], tx('The service module engine performed major maneuvers, including entry into and departure from lunar orbit.', 'সার্ভিস মডিউলের ইঞ্জিন চন্দ্র কক্ষপথে প্রবেশ ও ত্যাগসহ প্রধান কার্যসম্পাদন করেছিল।'), tx('Reliable propulsion was essential far from Earth and during passes behind the Moon.', 'পৃথিবী থেকে দূরে ও চাঁদের আড়ালে যাওয়ার সময় নির্ভরযোগ্য প্রণোদন অপরিহার্য ছিল।'), tx('The service module was jettisoned before re-entry.', 'পৃথিবীর বায়ুমণ্ডলে প্রবেশের আগে সার্ভিস মডিউলটি ছেড়ে দেওয়া হয়েছিল।')),
    ],
  },
  lunarLanding('apollo-11', 'Apollo 11', 'অ্যাপোলো ১১', '1969', tx('Mare Tranquillitatis — Tranquility Base', 'মারে ট্রাঙ্কুইলিটাটিস — ট্রাঙ্কুইলিটি বেস'), tx('Explore Eagle’s descent stage and the first crewed lunar landing site.', 'ইগলের অবতরণ অংশ ও প্রথম নভোচারীসহ চন্দ্র অবতরণস্থল অন্বেষণ করুন।'), [
    tx('On July 20, 1969, Neil Armstrong and Buzz Aldrin landed Eagle in the Sea of Tranquility while Michael Collins orbited in Columbia.', '১৯৬৯ সালের ২০ জুলাই নীল আর্মস্ট্রং ও বাজ অলড্রিন ইগল নিয়ে ট্রাঙ্কুইলিটি সাগরে নামেন; মাইকেল কলিন্স কলাম্বিয়ায় কক্ষপথে ছিলেন।'),
    tx('The crew deployed experiments, photographed the site and collected samples during a single surface EVA.', 'দল পৃষ্ঠের এক অভিযাত্রায় যন্ত্র স্থাপন, ছবি সংগ্রহ ও নমুনা সংগ্রহ করেছিলেন।'),
    tx('Eagle’s ascent stage later returned to orbit. The descent stage stayed behind at Tranquility Base.', 'পরে ইগলের আরোহণ অংশ কক্ষপথে ফেরে। অবতরণ অংশটি ট্রাঙ্কুইলিটি বেসে থেকে যায়।'),
  ]),
  lunarLanding('apollo-12', 'Apollo 12', 'অ্যাপোলো ১২', '1969', tx('Oceanus Procellarum — near Surveyor 3', 'ওশেনাস প্রোসেলারাম — সার্ভেয়র ৩-এর কাছে'), tx('Visit Intrepid’s landing region and the earlier Surveyor 3 site.', 'ইনট্রেপিডের অবতরণ অঞ্চল ও পুরোনো সার্ভেয়র ৩ স্থল দেখুন।'), [
    tx('In November 1969, Charles Conrad and Alan Bean landed Intrepid near the robotic Surveyor 3 spacecraft.', '১৯৬৯ সালের নভেম্বরে চার্লস কনরাড ও অ্যালান বিন ইনট্রেপিড নিয়ে সার্ভেয়র ৩-এর কাছে নামেন।'),
    tx('They performed two moonwalks, deployed the first full ALSEP science station and examined Surveyor 3.', 'তাঁরা দুইবার চাঁদে হাঁটেন, প্রথম পূর্ণ আলসেপ বিজ্ঞান স্টেশন স্থাপন ও সার্ভেয়র ৩ পরীক্ষা করেন।'),
    tx('The visit demonstrated precision landing and connected two eras of lunar exploration.', 'এই ভ্রমণ নির্ভুল অবতরণ প্রমাণ করে এবং চাঁদের অন্বেষণের দুই যুগকে যুক্ত করেছিল।'),
  ]),
  {
    id: 'apollo-13', destination: 'moon', name: tx('APOLLO 13', 'অ্যাপোলো ১৩'), shortName: 'Apollo 13', year: '1970',
    location: tx('Free-return trajectory around the Moon', 'চাঁদের চারদিকে ফ্রি-রিটার্ন গতিপথ'),
    description: tx('A lunar landing aborted; a crew brought safely home.', 'চন্দ্র অবতরণ বাতিল; নভোচারীদের নিরাপদ প্রত্যাবর্তন।'),
    objective: tx('Inspect the Apollo spacecraft and learn why no landing occurred.', 'অ্যাপোলো যানটি পরিদর্শন করুন এবং অবতরণ না হওয়ার কারণ জানুন।'),
    model: 'csm', surface: false, accent: '#e0b58d',
    story: chapter('apollo13-story', tx('THE MISSION THAT CAME HOME', 'যে মিশন ফিরে এসেছিল'), [
      tx('Apollo 13 launched in April 1970 with James Lovell, Jack Swigert and Fred Haise.', '১৯৭০ সালের এপ্রিলে জেমস লোভেল, জ্যাক সুইগার্ট ও ফ্রেড হেইজকে নিয়ে অ্যাপোলো ১৩ যাত্রা শুরু করে।'),
      tx('An oxygen tank explosion in the service module forced NASA to abort the lunar landing.', 'সার্ভিস মডিউলের অক্সিজেন ট্যাংকের বিস্ফোরণে চন্দ্র অবতরণ বাতিল করতে বাধ্য হয় নাসা।'),
      tx('The crew used the lunar module as a lifeboat, looped around the Moon and returned safely. No Apollo 13 hardware was landed on the surface.', 'দল লুনার মডিউলকে জীবনরক্ষাকারী যান হিসেবে ব্যবহার করে, চাঁদ প্রদক্ষিণ করে নিরাপদে ফেরে। অ্যাপোলো ১৩-এর কোনো যান পৃষ্ঠে অবতরণ করেনি।'),
    ]),
    hotspots: [
      spot('service', tx('Damaged Service Module', 'ক্ষতিগ্রস্ত সার্ভিস মডিউল'), [0, 0.35, -1.1], tx('The explosion damaged oxygen and electrical systems needed for the mission.', 'বিস্ফোরণে মিশনের জন্য প্রয়োজনীয় অক্সিজেন ও বৈদ্যুতিক ব্যবস্থা ক্ষতিগ্রস্ত হয়েছিল।'), tx('The landing objective was abandoned so limited resources could support the return journey.', 'সীমিত সম্পদ দিয়ে ফেরার যাত্রা সুরক্ষিত করতে অবতরণের লক্ষ্য ত্যাগ করা হয়েছিল।'), tx('The service module was photographed after separation shortly before re-entry.', 'পৃথিবীতে প্রবেশের কিছু আগে বিচ্ছিন্ন করার পর সার্ভিস মডিউলের ছবি তোলা হয়েছিল।')),
      spot('lifeboat', tx('Lunar Module lifeboat', 'জীবনরক্ষাকারী লুনার মডিউল'), [0.9, 0.55, 0.25], tx('Aquarius supplied life support and propulsion for much of the return journey.', 'ফিরতি পথের বড় অংশে অ্যাকোয়ারিয়াস জীবনরক্ষা ও প্রণোদন সরবরাহ করেছিল।'), tx('Its systems were used in ways far beyond the original landing plan.', 'মূল অবতরণ পরিকল্পনার বাইরেও এর ব্যবস্থাগুলো ব্যবহার করতে হয়েছিল।'), tx('The lunar module was jettisoned before Earth re-entry; it did not land on the Moon.', 'পৃথিবীতে প্রবেশের আগে লুনার মডিউলটি ছেড়ে দেওয়া হয়; এটি চাঁদে নামেনি।')),
    ],
  },
  lunarLanding('apollo-14', 'Apollo 14', 'অ্যাপোলো ১৪', '1971', tx('Fra Mauro formation', 'ফ্রা মাউরো ভূখণ্ড'), tx('Explore Antares and the modular equipment transporter.', 'অ্যান্টারেস ও মডিউলার সরঞ্জাম পরিবাহক অন্বেষণ করুন।'), [
    tx('In February 1971, Alan Shepard and Edgar Mitchell landed Antares at Fra Mauro.', '১৯৭১ সালের ফেব্রুয়ারিতে অ্যালান শেপার্ড ও এডগার মিচেল অ্যান্টারেস নিয়ে ফ্রা মাউরোতে নামেন।'),
    tx('They conducted two EVAs, deployed scientific instruments and used a hand-pulled equipment transporter.', 'তাঁরা দুইবার বাইরের কাজ করেন, বৈজ্ঞানিক যন্ত্র স্থাপন ও হাতে টানা সরঞ্জাম পরিবাহক ব্যবহার করেন।'),
    tx('The mission reached the region originally targeted by Apollo 13.', 'এই মিশন অ্যাপোলো ১৩-এর নির্ধারিত অঞ্চলে পৌঁছেছিল।'),
  ]),
  lunarLanding('apollo-15', 'Apollo 15', 'অ্যাপোলো ১৫', '1971', tx('Hadley–Apennine', 'হ্যাডলি–অ্যাপেনাইন'), tx('Investigate Falcon and the first Lunar Roving Vehicle.', 'ফ্যালকন ও প্রথম লুনার রোভিং যান অন্বেষণ করুন।'), [
    tx('Apollo 15 landed near Hadley Rille and the Apennine mountains in July 1971.', '১৯৭১ সালের জুলাইয়ে অ্যাপোলো ১৫ হ্যাডলি রিল ও অ্যাপেনাইন পর্বতের কাছে নামে।'),
    tx('David Scott and James Irwin used the first Lunar Roving Vehicle to travel farther from the lunar module.', 'ডেভিড স্কট ও জেমস ইরউইন প্রথম লুনার রোভিং যান ব্যবহার করে মডিউল থেকে আরও দূরে যান।'),
    tx('Three EVAs expanded the range and diversity of geological exploration.', 'তিনটি বাইরের অভিযাত্রা ভূতাত্ত্বিক অন্বেষণের পরিসর ও বৈচিত্র্য বাড়িয়েছিল।'),
  ], 'lrv'),
  lunarLanding('apollo-16', 'Apollo 16', 'অ্যাপোলো ১৬', '1972', tx('Descartes Highlands', 'দেকার্ত উচ্চভূমি'), tx('Explore Orion and a second rover-supported field expedition.', 'ওরায়ন ও দ্বিতীয় রোভার-সহ ভূতাত্ত্বিক অভিযাত্রা অন্বেষণ করুন।'), [
    tx('John Young and Charles Duke landed Orion in the Descartes Highlands in April 1972.', '১৯৭২ সালের এপ্রিলে জন ইয়ং ও চার্লস ডিউক ওরায়ন নিয়ে দেকার্ত উচ্চভূমিতে নামেন।'),
    tx('Using the rover, they investigated highland geology and collected samples across three EVAs.', 'রোভার ব্যবহার করে তাঁরা তিনটি বাইরের অভিযাত্রায় উচ্চভূমির ভূতত্ত্ব ও নমুনা অন্বেষণ করেন।'),
    tx('The mission tested ideas about the Moon’s highlands with direct field observations.', 'সরাসরি পর্যবেক্ষণের মাধ্যমে মিশনটি চাঁদের উচ্চভূমি সম্পর্কিত ধারণা যাচাই করেছিল।'),
  ], 'lrv'),
  lunarLanding('apollo-17', 'Apollo 17', 'অ্যাপোলো ১৭', '1972', tx('Taurus–Littrow valley', 'টরাস–লিট্রো উপত্যকা'), tx('Explore Challenger and the final Apollo surface expedition.', 'চ্যালেঞ্জার ও অ্যাপোলোর শেষ পৃষ্ঠ অভিযাত্রা অন্বেষণ করুন।'), [
    tx('Apollo 17 landed at Taurus–Littrow in December 1972 with Eugene Cernan and Harrison Schmitt.', '১৯৭২ সালের ডিসেম্বরে ইউজিন সার্নান ও হ্যারিসন শ্মিটকে নিয়ে অ্যাপোলো ১৭ টরাস–লিট্রোতে নামে।'),
    tx('Schmitt was the first professional geologist to walk on the Moon. The crew conducted three rover-supported EVAs.', 'শ্মিট ছিলেন চাঁদে হাঁটা প্রথম পেশাদার ভূতাত্ত্বিক। দল রোভারসহ তিনটি বাইরের অভিযাত্রা সম্পন্ন করেন।'),
    tx('Their field work included observations of orange soil at Shorty Crater and extensive sample collection.', 'শর্টি গর্তে কমলা মাটির পর্যবেক্ষণ ও ব্যাপক নমুনা সংগ্রহ ছিল এই কাজের অংশ।'),
  ], 'lrv'),
];

export const MARS_MISSIONS: Mission[] = [
  {
    id: 'pathfinder', destination: 'mars', name: tx('MARS PATHFINDER / SOJOURNER', 'মার্স পাথফাইন্ডার / সোজার্নার'), shortName: 'Mars Pathfinder', year: '1997',
    location: tx('Ares Vallis', 'এরেস ভ্যালিস'), description: tx('The preserved Pathfinder and Sojourner experience.', 'পাথফাইন্ডার ও সোজার্নারের মূল অভিজ্ঞতা।'),
    objective: tx('Follow the beacon. Find Sojourner beside the Pathfinder lander.', 'বিকন অনুসরণ করুন। পাথফাইন্ডার ল্যান্ডারের পাশে সোজার্নারকে খুঁজুন।'),
    model: 'pathfinder', surface: true, accent: '#d97a54', story: STORY, hotspots: HOTSPOTS,
  },
  {
    id: 'spirit', destination: 'mars', name: tx('MARS EXPLORATION ROVER SPIRIT', 'মার্স এক্সপ্লোরেশন রোভার স্পিরিট'), shortName: 'Spirit', year: '2004',
    location: tx('Gusev Crater', 'গুসেভ গর্ত'), description: tx('A robotic field geologist investigating a crater and its hills.', 'গর্ত ও পার্শ্ববর্তী পাহাড় অন্বেষণকারী রোবোটিক ভূতাত্ত্বিক।'),
    objective: tx('Drive toward the beacon and inspect Spirit’s field equipment.', 'বিকনের দিকে এগিয়ে স্পিরিটের সরঞ্জাম পরিদর্শন করুন।'), model: 'mer', surface: true, accent: '#d48555',
    story: chapter('spirit-story', tx('SPIRIT — GUSEV CRATER', 'স্পিরিট — গুসেভ গর্ত'), [
      tx('Spirit landed in Gusev Crater on January 4, 2004, using an airbag-cushioned landing system.', '২০০৪ সালের ৪ জানুয়ারি স্পিরিট এয়ারব্যাগ-সুরক্ষিত ব্যবস্থায় গুসেভ গর্তে নামে।'),
      tx('The rover investigated volcanic rocks and later explored the Columbia Hills, finding evidence of water-altered materials.', 'রোভারটি আগ্নেয় পাথর পরীক্ষা করে এবং পরে কলাম্বিয়া পাহাড়ে পানির প্রভাবে বদলে যাওয়া পদার্থের প্রমাণ পায়।'),
      tx('Spirit’s mission far exceeded its planned 90-sol primary mission before communications ended in 2010.', 'পরিকল্পিত ৯০ সলের প্রাথমিক মিশনের চেয়ে অনেক বেশি কাজ করার পর ২০১০ সালে স্পিরিটের যোগাযোগ শেষ হয়।'),
    ]),
    hotspots: [
      spot('mast', tx('Mast cameras and spectrometers', 'মাস্ট ক্যামেরা ও স্পেক্ট্রোমিটার'), [0, 1.65, 0.35], tx('Remote-sensing instruments surveyed terrain and helped select scientific targets.', 'দূর-সংবেদী যন্ত্র ভূখণ্ড পর্যবেক্ষণ ও বৈজ্ঞানিক লক্ষ্য বাছাইয়ে সাহায্য করত।'), tx('The instruments linked landscape-scale views with close-up geology.', 'বড় দৃশ্য ও নিকট ভূতাত্ত্বিক পর্যবেক্ষণকে যুক্ত করত এই যন্ত্র।'), tx('Spirit used these observations to navigate from the plains into the Columbia Hills.', 'সমভূমি থেকে কলাম্বিয়া পাহাড়ে যেতে এই পর্যবেক্ষণ ব্যবহার করেছিল স্পিরিট।')),
      spot('arm', tx('Instrument deployment arm', 'যন্ত্র স্থাপনের যান্ত্রিক বাহু'), [0.85, 0.75, 0.4], tx('The robotic arm positioned tools and spectrometers against rocks and soil.', 'যান্ত্রিক বাহু পাথর ও মাটির কাছে যন্ত্র নিয়ে যেত।'), tx('Close measurements revealed mineral composition and rock textures.', 'নিকট পরিমাপে খনিজ গঠন ও পাথরের গঠন জানা গিয়েছিল।'), tx('Its findings strengthened evidence that water had altered some Gusev materials.', 'গুসেভের কিছু পদার্থে পানির প্রভাবের প্রমাণ দৃঢ় করেছিল এর ফলাফল।')),
    ],
  },
  {
    id: 'opportunity', destination: 'mars', name: tx('MARS EXPLORATION ROVER OPPORTUNITY', 'মার্স এক্সপ্লোরেশন রোভার অপরচুনিটি'), shortName: 'Opportunity', year: '2004',
    location: tx('Meridiani Planum', 'মেরিদিয়ানি প্ল্যানাম'), description: tx('A long-lived rover examining evidence of ancient water.', 'প্রাচীন পানির প্রমাণ অন্বেষণকারী দীর্ঘজীবী রোভার।'),
    objective: tx('Find Opportunity among the sulfate-rich plains and inspect its instruments.', 'সালফেটসমৃদ্ধ সমভূমিতে অপরচুনিটি খুঁজে এর যন্ত্র দেখুন।'), model: 'mer', surface: true, accent: '#cf9c66',
    story: chapter('opportunity-story', tx('OPPORTUNITY — MERIDIANI PLANUM', 'অপরচুনিটি — মেরিদিয়ানি প্ল্যানাম'), [
      tx('Opportunity landed on Meridiani Planum on January 25, 2004, three weeks after Spirit.', '২০০৪ সালের ২৫ জানুয়ারি, স্পিরিটের তিন সপ্তাহ পর, অপরচুনিটি মেরিদিয়ানি প্ল্যানামে নামে।'),
      tx('Its instruments found geological and mineral evidence that liquid water had once affected the landing region.', 'এর যন্ত্র ভূতাত্ত্বিক ও খনিজ প্রমাণ পায় যে একসময় তরল পানি এই অঞ্চলে প্রভাব ফেলেছিল।'),
      tx('Opportunity drove 45.16 kilometres before a global dust storm ended communications in 2018.', '২০১৮ সালে বৈশ্বিক ধূলিঝড়ের পর যোগাযোগ শেষ হওয়ার আগে অপরচুনিটি ৪৫.১৬ কিলোমিটার চলেছিল।'),
    ]),
    hotspots: [
      spot('wheels', tx('Rocker-bogie mobility system', 'রকার-বগি চলন ব্যবস্থা'), [-0.65, 0.45, 0.3], tx('Six driven wheels and a rocker-bogie suspension helped the rover cross rocky ground.', 'ছয়টি চালিত চাকা ও রকার-বগি সাসপেনশন পাথুরে ভূমি পাড়ি দিতে সাহায্য করত।'), tx('Mobility allowed Opportunity to compare many geological sites over years.', 'বহু বছর ধরে নানা ভূতাত্ত্বিক স্থান তুলনা করতে এই চলনক্ষমতা সাহায্য করেছিল।'), tx('The rover ultimately travelled 45.16 kilometres.', 'রোভারটি মোট ৪৫.১৬ কিলোমিটার পথ গিয়েছিল।')),
      spot('arm', tx('Rock abrasion and microscopic investigation', 'পাথর ঘষা ও অণুবীক্ষণ'), [0.85, 0.75, 0.4], tx('The arm carried a grinder, microscopic imager and spectrometers.', 'বাহুতে ছিল পাথর ঘষার যন্ত্র, অণুবীক্ষণ ক্যামেরা ও স্পেক্ট্রোমিটার।'), tx('Exposing fresh interiors let scientists examine minerals below weathered surfaces.', 'ভেতরের নতুন পৃষ্ঠ উন্মুক্ত করে আবহাওয়ার নিচের খনিজ পরীক্ষা করা গিয়েছিল।'), tx('These tools contributed to evidence for ancient liquid water at Meridiani.', 'মেরিদিয়ানিতে প্রাচীন তরল পানির প্রমাণে এই যন্ত্রগুলো অবদান রেখেছিল।')),
    ],
  },
  {
    id: 'phoenix', destination: 'mars', name: tx('PHOENIX MARS LANDER', 'ফিনিক্স মার্স ল্যান্ডার'), shortName: 'Phoenix', year: '2008',
    location: tx('Vastitas Borealis — northern plains', 'ভাস্তিতাস বোরিয়ালিস — উত্তর সমভূমি'), description: tx('A stationary arctic laboratory studying ice and soil.', 'বরফ ও মাটি পরীক্ষাকারী স্থির উত্তর-মেরু অঞ্চলের গবেষণাগার।'),
    objective: tx('Approach the stationary Phoenix lander and inspect its sampling systems.', 'স্থির ফিনিক্স ল্যান্ডারে যান এবং এর নমুনা ব্যবস্থা দেখুন।'), model: 'phoenix', surface: true, accent: '#d7c9ad',
    story: chapter('phoenix-story', tx('PHOENIX — THE NORTHERN PLAINS', 'ফিনিক্স — উত্তর সমভূমি'), [
      tx('Phoenix landed in the northern plains of Mars on May 25, 2008.', '২০০৮ সালের ২৫ মে ফিনিক্স মঙ্গলের উত্তর সমভূমিতে অবতরণ করে।'),
      tx('The stationary lander used a robotic arm to dig trenches and deliver icy soil to onboard instruments.', 'স্থির ল্যান্ডারটি যান্ত্রিক বাহু দিয়ে খনন এবং বরফমিশ্রিত মাটি যানের যন্ত্রে পৌঁছে দিত।'),
      tx('Phoenix confirmed water ice at the landing site and studied the local soil, atmosphere and seasonal conditions.', 'ফিনিক্স অবতরণস্থলে পানির বরফ নিশ্চিত করে এবং স্থানীয় মাটি, বায়ুমণ্ডল ও ঋতু পরীক্ষা করেছিল।'),
    ]),
    hotspots: [
      spot('arm', tx('Robotic Arm and scoop', 'যান্ত্রিক বাহু ও খননযন্ত্র'), [1.2, 0.8, 0.4], tx('The arm excavated soil and delivered samples to analysis instruments.', 'বাহু মাটি খুঁড়ে বিশ্লেষণ যন্ত্রে নমুনা দিত।'), tx('Reaching subsurface material was essential to the mission’s ice investigation.', 'বরফ অন্বেষণের জন্য পৃষ্ঠের নিচের পদার্থে পৌঁছানো জরুরি ছিল।'), tx('Images showed bright material in trenches that behaved as expected for exposed ice.', 'খননস্থলে উজ্জ্বল পদার্থের ছবি উন্মুক্ত বরফের প্রত্যাশিত আচরণ দেখিয়েছিল।')),
      spot('deck', tx('Onboard science laboratory', 'যানের বিজ্ঞান গবেষণাগার'), [0, 1.25, 0], tx('Phoenix carried microscopy, electrochemistry and thermal-analysis instruments.', 'ফিনিক্সে ছিল অণুবীক্ষণ, তড়িৎ-রসায়ন ও তাপীয় বিশ্লেষণ যন্ত্র।'), tx('These instruments characterized soil chemistry and properties relevant to habitability.', 'মাটির রসায়ন ও বসবাস-উপযোগিতার সঙ্গে সম্পর্কিত বৈশিষ্ট্য পরীক্ষা করা হয়েছিল।'), tx('Phoenix was a fixed lander, not a mobile rover.', 'ফিনিক্স ছিল স্থির ল্যান্ডার, চলমান রোভার নয়।')),
    ],
  },
  {
    id: 'insight', destination: 'mars', name: tx('INSIGHT MARS LANDER', 'ইনসাইট মার্স ল্যান্ডার'), shortName: 'InSight', year: '2018',
    location: tx('Elysium Planitia', 'এলিসিয়াম প্ল্যানিটিয়া'), description: tx('A geophysical observatory listening to the interior of Mars.', 'মঙ্গলের অভ্যন্তর পর্যবেক্ষণকারী ভূপদার্থবিদ্যা মানমন্দির।'),
    objective: tx('Find InSight and inspect the instruments deployed around it.', 'ইনসাইট খুঁজুন এবং এর চারপাশে স্থাপিত যন্ত্র দেখুন।'), model: 'insight', surface: true, accent: '#d5b383',
    story: chapter('insight-story', tx('INSIGHT — THE INTERIOR OF MARS', 'ইনসাইট — মঙ্গলের অভ্যন্তর'), [
      tx('InSight landed at Elysium Planitia on November 26, 2018.', '২০১৮ সালের ২৬ নভেম্বর ইনসাইট এলিসিয়াম প্ল্যানিটিয়ায় অবতরণ করে।'),
      tx('Its robotic arm placed a seismometer directly on the surface to detect marsquakes.', 'এর যান্ত্রিক বাহু মঙ্গলকম্প পরিমাপের জন্য সরাসরি পৃষ্ঠে সিসমোমিটার স্থাপন করেছিল।'),
      tx('The mission investigated the planet’s interior through seismology, heat flow and radio science.', 'ভূকম্পন, তাপপ্রবাহ ও রেডিও বিজ্ঞানের মাধ্যমে মিশনটি গ্রহের অভ্যন্তর অন্বেষণ করেছিল।'),
    ]),
    hotspots: [
      spot('seis', tx('SEIS seismometer', 'সিস সিসমোমিটার'), [1.65, 0.35, 0.75], tx('The seismometer detected ground motion from marsquakes and other sources.', 'সিসমোমিটার মঙ্গলকম্প ও অন্যান্য উৎসের ভূকম্পন শনাক্ত করত।'), tx('Seismic waves provided evidence about layers deep beneath the surface.', 'ভূকম্পনীয় তরঙ্গ পৃষ্ঠের গভীরের স্তর সম্পর্কে প্রমাণ দিয়েছিল।'), tx('A robotic arm placed the instrument on the ground and covered it with a wind and thermal shield.', 'যান্ত্রিক বাহু যন্ত্রটি মাটিতে নামিয়ে বাতাস ও তাপরোধী আচ্ছাদন দিয়েছিল।')),
      spot('panels', tx('Solar arrays and heat-flow investigation', 'সৌরপ্যানেল ও তাপপ্রবাহ অনুসন্ধান'), [-1.7, 1.1, 0], tx('Two circular arrays powered the stationary observatory.', 'দুটি বৃত্তাকার প্যানেল স্থির মানমন্দিরকে শক্তি দিত।'), tx('Long-term measurements required a stable platform and sustained power.', 'দীর্ঘমেয়াদি পর্যবেক্ষণের জন্য স্থির ভিত্তি ও নিয়মিত শক্তি দরকার ছিল।'), tx('The mission also attempted deep heat-flow measurements with its self-hammering probe.', 'স্বয়ংক্রিয় হ্যামারিং অনুসন্ধানযান দিয়ে গভীর তাপপ্রবাহ মাপারও চেষ্টা করেছিল মিশনটি।')),
    ],
  },
];

export const ALL_MISSIONS = [...MOON_MISSIONS, ...MARS_MISSIONS];
export const missionsFor = (destination: Destination) => destination === 'moon' ? MOON_MISSIONS : MARS_MISSIONS;
export const getMission = (id: string): Mission => ALL_MISSIONS.find((m) => m.id === id) || MARS_MISSIONS[0];
export const nextMission = (id: string): Mission | null => {
  const current = getMission(id);
  const list = missionsFor(current.destination);
  return list[list.findIndex((m) => m.id === id) + 1] || null;
};
