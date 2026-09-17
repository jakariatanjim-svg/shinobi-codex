/* Shinobi Codex v3.0 — Boruto: Two Blue Vortex (TBV) Manga Canon Update & Character Enrichments */

import type { Character } from "./types";

/**
 * Brand-new canon manga characters from Boruto: Naruto Next Generations &
 * Boruto: Two Blue Vortex (TBV) that are either missing from the base API or
 * introduced in the Two Blue Vortex manga arc.
 */
export const TBV_NEW_CHARACTERS: Character[] = [
  {
    id: 90001,
    name: "Jura",
    images: [
      "https://static.wikia.nocookie.net/naruto/images/d/dc/Jura_Fullbody.png",
      "https://static.wikia.nocookie.net/naruto/images/3/3f/Jura_Infobox.png",
      "https://static.wikia.nocookie.net/naruto/images/2/23/Jura%27s_Tailed_Beast_Ball.png",
      "https://static.wikia.nocookie.net/naruto/images/2/24/Jura%27s_Wood_Release.png",
      "https://static.wikia.nocookie.net/naruto/images/b/b5/Jura_Defeats_Kawaki.png",
      "https://static.wikia.nocookie.net/naruto/images/c/c5/Jura_Kicks_Boruto.png",
    ],
    debut: {
      manga: "Boruto: Two Blue Vortex Chapter 4",
      appearsIn: "Manga (Two Blue Vortex)",
    },
    jutsu: [
      "Tailed Beast Ball",
      "Eye Tailed Beast Ball",
      "Wood Release: Wood Style Jutsu",
      "Claw Marks (Shinjutsu)",
      "Six Paths Levitation",
      "Divine Tree Assimilation",
    ],
    natureType: ["Wood Release", "Earth Release", "Water Release", "Yin–Yang Release"],
    uniqueTraits: [
      "Direct incarnation of the Ten-Tails' core consciousness",
      "Capable of firing compressed Tailed Beast Balls directly from his Rinnegan gaze",
      "Immense regeneration and Claw Mark spatial travel",
    ],
    personal: {
      species: "Divine Tree (Shinju)",
      status: "Alive",
      kekkeiGenkai: ["Rinnegan", "Wood Release"],
      classification: ["S-rank", "Sage", "Sensor Type", "Two Blue Vortex"],
      affiliation: ["Shinju", "Kara"],
      occupation: ["Leader of the Sentient Divine Trees"],
      titles: ["十羅", "Incarnation of the Ten-Tails", " Sovereign of the Shinju"],
    },
    rank: {
      ninjaRank: { "Two Blue Vortex": "Kage" },
    },
  },
  {
    id: 90002,
    name: "Hidari",
    images: [
      "https://static.wikia.nocookie.net/naruto/images/7/74/Hidari_Fullbody.png",
      "https://static.wikia.nocookie.net/naruto/images/c/cf/Hidari_Infobox.png",
      "https://static.wikia.nocookie.net/naruto/images/6/66/Hidari%27s_Chidori.png",
      "https://static.wikia.nocookie.net/naruto/images/2/2f/Hidari_Attacks_Sarada.png",
      "https://static.wikia.nocookie.net/naruto/images/6/6b/Hidari_Vs_Konohamaru.png",
    ],
    debut: {
      manga: "Boruto: Two Blue Vortex Chapter 4",
      appearsIn: "Manga (Two Blue Vortex)",
    },
    family: {
      "Genetic / Chakra Template": "Sasuke Uchiha",
    },
    jutsu: [
      "Chidori",
      "Lightning Release: Chidori Spear",
      "Claw Marks (Shinjutsu)",
      "Fire Release: Great Fireball Technique",
      "Wood Release: Thorn Bind",
      "Six Paths Levitation",
    ],
    natureType: ["Lightning Release", "Fire Release", "Wood Release", "Yin Release"],
    uniqueTraits: [
      "Evolved from the Divine Tree that assimilated Sasuke Uchiha",
      "Inherits Sasuke's chakra signature and Chidori, yet lacks the Sharingan precognition",
    ],
    personal: {
      species: "Divine Tree (Shinju)",
      status: "Alive",
      clan: "Uchiha",
      kekkeiGenkai: ["Rinnegan", "Wood Release"],
      classification: ["S-rank", "Two Blue Vortex"],
      affiliation: ["Shinju", "Konohagakure"],
      titles: ["左", "Sasuke Shinju Clone", "Divine Tree Hidari"],
    },
    rank: {
      ninjaRank: { "Two Blue Vortex": "Kage" },
    },
  },
  {
    id: 90003,
    name: "Matsuri (Shinju)",
    images: [
      "https://static.wikia.nocookie.net/naruto/images/d/d4/Matsuri_Chapter18_Fullbody.png",
      "https://static.wikia.nocookie.net/naruto/images/0/0e/Matsuri.png",
      "https://static.wikia.nocookie.net/naruto/images/2/24/Jura%27s_Wood_Release.png",
    ],
    debut: {
      manga: "Boruto: Two Blue Vortex Chapter 4",
      appearsIn: "Manga (Two Blue Vortex)",
    },
    family: {
      "Genetic / Chakra Template": "Moegi Kazamatsuri",
    },
    jutsu: [
      "Wood Release: Verdant Fang",
      "Wood Release: Great Forest Crumble",
      "Claw Marks (Shinjutsu)",
      "Earth Release",
      "Water Release",
    ],
    natureType: ["Wood Release", "Earth Release", "Water Release"],
    uniqueTraits: [
      "Sentient Divine Tree evolved from Moegi Kazamatsuri's absorbed chakra",
      "Targets Konohamaru Sarutobi due to Moegi's lingering emotional memories",
    ],
    personal: {
      species: "Divine Tree (Shinju)",
      status: "Alive",
      kekkeiGenkai: ["Rinnegan", "Wood Release"],
      classification: ["S-rank", "Two Blue Vortex"],
      affiliation: ["Shinju"],
      titles: ["祭", "Moegi Shinju Clone", "Divine Tree Matsuri"],
    },
    rank: {
      ninjaRank: { "Two Blue Vortex": "Kage" },
    },
  },
  {
    id: 90004,
    name: "Ryū (Shinju)",
    images: [
      "https://static.wikia.nocookie.net/naruto/images/7/7d/Ry%C5%AB_Infobox.png",
      "https://static.wikia.nocookie.net/naruto/images/4/42/Ry%C5%AB_Using_Iron_Sand.png",
      "https://static.wikia.nocookie.net/naruto/images/2/2c/Ry%C5%AB_Captures_Code.png",
    ],
    debut: {
      manga: "Boruto: Two Blue Vortex Chapter 13",
      appearsIn: "Manga (Two Blue Vortex)",
    },
    family: {
      "Genetic / Chakra Template": "Shinki",
    },
    jutsu: [
      "Magnet Release: Iron Sand Tsunami",
      "Iron Sand: Black Iron Wings",
      "Claw Marks (Shinjutsu)",
      "Wood Release",
    ],
    natureType: ["Magnet Release", "Wind Release", "Earth Release", "Lightning Release"],
    uniqueTraits: [
      "Born from the Thorn Soul Bulb created when Shinki sealed Gaara and was assimilated in Sunagakure",
      "Combines Shinki's Magnet Release Iron Sand with Ten-Tails Rinnegan and Claw Marks",
    ],
    personal: {
      species: "Divine Tree (Shinju)",
      status: "Alive",
      kekkeiGenkai: ["Rinnegan", "Magnet Release", "Wood Release"],
      classification: ["S-rank", "Two Blue Vortex"],
      affiliation: ["Shinju", "Sunagakure"],
      titles: ["粒", "Iron Sand Shinju", "Shinki Shinju Clone"],
    },
    rank: {
      ninjaRank: { "Two Blue Vortex": "Kage" },
    },
  },
  {
    id: 90005,
    name: "Mamushi",
    images: [
      "https://static.wikia.nocookie.net/naruto/images/8/84/Mamushis_Color_TBV.png",
      "https://static.wikia.nocookie.net/naruto/images/8/8e/Mamushi_Infobox.png",
      "https://static.wikia.nocookie.net/naruto/images/7/76/Mamushi_Attacks_Boruto.png",
      "https://static.wikia.nocookie.net/naruto/images/8/8f/Mamushi_Multiplying.png",
    ],
    debut: {
      manga: "Boruto: Two Blue Vortex Chapter 4",
      appearsIn: "Manga (Two Blue Vortex)",
    },
    family: {
      "Genetic / Chakra Template": "Bug",
    },
    jutsu: [
      "Shinju Self-Division",
      "Claw Marks (Shinjutsu)",
      "Wood Release: Subterranean Roots",
      "Rinnegan Shared Vision",
    ],
    natureType: ["Wood Release", "Earth Release"],
    uniqueTraits: [
      "Evolved from Bug after he was devoured by a Claw Grime in Kara's hideout",
      "Target of obsession is Eida (Ada); capable of autonomous body division",
    ],
    personal: {
      species: "Divine Tree (Shinju)",
      status: "Alive",
      kekkeiGenkai: ["Rinnegan", "Wood Release"],
      classification: ["S-rank", "Two Blue Vortex"],
      affiliation: ["Shinju", "Kara"],
      titles: ["マムシ", "Divine Tree Mamushi"],
    },
    rank: {
      ninjaRank: { "Two Blue Vortex": "Kage" },
    },
  },
  {
    id: 90006,
    name: "Eida",
    images: [
      "https://static.wikia.nocookie.net/naruto/images/c/c8/Ada_Artwork.png",
      "https://static.wikia.nocookie.net/naruto/images/4/4b/Ada_Using_Omnipotence.png",
      "https://static.wikia.nocookie.net/naruto/images/f/f6/Ada_Infobox_Image.png",
      "https://static.wikia.nocookie.net/naruto/images/e/ee/Ada_%26_Daemon.png",
      "https://static.wikia.nocookie.net/naruto/images/3/34/Ada_Enters_Konoha.png",
    ],
    debut: {
      manga: "Boruto Chapter 56",
      anime: "Boruto Episode 287",
      appearsIn: "Anime, Manga (Two Blue Vortex)",
    },
    family: {
      "Younger Brother": "Daemon",
      "Genetic Donor": "Shibai Ōtsutsuki",
      "Creator / Modifier": "Amado Sanzu",
    },
    jutsu: [
      "Omnipotence (Shinjutsu)",
      "SenriganClairvoyance (Past & Present Projection)",
      "Universal Infatuation Charm",
      "Levitation",
    ],
    uniqueTraits: [
      "Transplanted with the DNA of Shibai Ōtsutsuki by Amado",
      "Senrigan can observe any event currently happening anywhere in the world or dimensions, and any event in the past up to her birth",
      "Omnipotence rewrote the memories of humanity, swapping Boruto Uzumaki and Kawaki's lives",
    ],
    personal: {
      sex: "Female",
      age: { "Part I": "16", "Two Blue Vortex": "19" },
      status: "Alive",
      kekkeiGenkai: ["Senrigan"],
      classification: ["S-rank", "Sensor Type", "Two Blue Vortex"],
      affiliation: ["Kara", "Konohagakure"],
      partner: ["Daemon", "Code"],
      titles: ["エイダ", "All-Knowing Cyborg", "Wielder of Omnipotence"],
    },
    rank: {
      ninjaRank: { "Two Blue Vortex": "Kage" },
    },
  },
  {
    id: 90007,
    name: "Daemon",
    images: [
      "https://static.wikia.nocookie.net/naruto/images/2/25/Daemon_infobox.png",
      "https://static.wikia.nocookie.net/naruto/images/e/ee/Ada_%26_Daemon.png",
      "https://static.wikia.nocookie.net/naruto/images/a/a8/Ada_Holding_Daemon.png",
    ],
    debut: {
      manga: "Boruto Chapter 59",
      anime: "Boruto Episode 291",
      appearsIn: "Anime, Manga (Two Blue Vortex)",
    },
    family: {
      "Older Sister": "Eida",
      "Genetic Donor": "Shibai Ōtsutsuki",
      "Creator / Modifier": "Amado Sanzu",
    },
    jutsu: [
      "Intent Reflection (Shinjutsu)",
      "Supreme Taijutsu",
      "Sensory Perception",
    ],
    uniqueTraits: [
      "Instantly and automatically reflects any attack or killing intent back onto the attacker when his palms touch another person",
      "Surpasses Jigen and Limitless Code in raw hand-to-hand speed and physical force",
    ],
    personal: {
      sex: "Male",
      age: { "Part I": "9", "Two Blue Vortex": "12" },
      status: "Alive",
      classification: ["S-rank", "Two Blue Vortex"],
      affiliation: ["Kara", "Konohagakure"],
      partner: ["Eida"],
      titles: ["デイモン", "Guardian of Eida", "Shinjutsu Reflector"],
    },
    rank: {
      ninjaRank: { "Two Blue Vortex": "Kage" },
    },
  },
  {
    id: 90008,
    name: "Shibai Ōtsutsuki",
    images: [
      "https://static.wikia.nocookie.net/naruto/images/f/fd/Shibai_%C5%8Ctsutsuki.png",
      "https://static.wikia.nocookie.net/naruto/images/4/4b/Ada_Using_Omnipotence.png",
    ],
    debut: {
      manga: "Boruto Chapter 75",
      anime: "Boruto Episode 288",
      appearsIn: "Anime, Manga (Two Blue Vortex)",
    },
    jutsu: [
      "Omnipotence (Shinjutsu)",
      "Senrigan (Shinjutsu)",
      "Claw Marks (Shinjutsu)",
      "Intent Reflection (Shinjutsu)",
      "Ten Directions / Prescience (Shinjutsu)",
      "Dimensional Ascension",
    ],
    natureType: [
      "Wind Release",
      "Lightning Release",
      "Fire Release",
      "Water Release",
      "Earth Release",
      "Yin–Yang Release",
    ],
    uniqueTraits: [
      "Consumed countless Chakra Fruits across millennia and resurrected repeatedly through Karma",
      "Ascended to a higher dimension where a physical body is no longer required",
      "His discarded mortal remains were used by Amado to grant Shinjutsu to Eida, Daemon, Code, and Kashin Koji",
    ],
    personal: {
      species: "Celestial Being (Ōtsutsuki God)",
      status: "Ascended",
      clan: "Ōtsutsuki",
      kekkeiGenkai: ["Byakugan", "Rinnegan", "Senrigan"],
      classification: ["Sage", "S-rank", "Two Blue Vortex"],
      affiliation: ["Ōtsutsuki Clan"],
      titles: ["大筒木シバイ", "God of the Ōtsutsuki", "Progenitor of Shinjutsu"],
    },
    rank: {
      ninjaRank: { "Two Blue Vortex": "Kage" },
    },
  },
];

/**
 * Enrichments merged onto existing API characters so that Boruto, Kawaki,
 * Sarada, Himawari, Koji Kashin, Code, Mitsuki, Naruto, and Sasuke include all
 * of their Two Blue Vortex (TBV) jutsu, classifications, ranks, and ages.
 */
export const TBV_CHARACTER_UPDATES: Record<
  string,
  {
    extraJutsu?: string[];
    extraNatures?: string[];
    extraKekkei?: string[];
    extraClassifications?: string[];
    extraTraits?: string[];
    extraTools?: string[];
    ageUpdate?: Record<string, string>;
    rankUpdate?: Record<string, string>;
    titlesUpdate?: string[];
  }
> = {
  "Boruto Uzumaki": {
    extraJutsu: [
      "Rasengan Uzuhiko",
      "Flying Thunder God Technique (Boruto Variant)",
      "Lightning Release: Purple Lightning",
      "Uchiha Style Kenjutsu",
      "Wind Release: Breakthrough",
      "Vanishing Rasengan",
      "Compression Rasengan",
      "Karma Rift (Space–Time Ninjutsu)",
    ],
    extraNatures: ["Lightning Release", "Wind Release", "Water Release"],
    extraKekkei: ["Jōgan", "Byakugan (Karma)"],
    extraClassifications: ["S-rank", "Missing-nin", "Two Blue Vortex"],
    extraTraits: [
      "Trained for two years by Sasuke Uchiha and subsequently by Kashin Koji using Ten Directions foresight",
      "Channels the planetary rotation of the Earth itself into Rasengan Uzuhiko for permanent equilibrium disruption",
      "Teleports across dimensions and battlefields via custom metal badges marked with Flying Thunder God formulae",
    ],
    extraTools: ["Sasuke's Kusanagi Sword", "Flying Thunder God Metal Badges", "Sasuke's Cloak"],
    ageUpdate: { "Academy Graduate": "11", "Part I": "12", "Two Blue Vortex": "15" },
    rankUpdate: { "Part I": "Genin", "Two Blue Vortex": "Kage" },
    titlesUpdate: ["うずまきボルト", "Shadow Defender of Konoha", "Wielder of Rasengan Uzuhiko"],
  },
  Kawaki: {
    extraJutsu: [
      "Sukunahikona (Shinjutsu)",
      "Daikokuten (Shinjutsu)",
      "Karma Blast",
      "Black Receiver Rods",
      "Six Paths Flight",
      "Fire Release: Searing Migraine",
    ],
    extraKekkei: ["Kokugan"],
    extraClassifications: ["S-rank", "Two Blue Vortex"],
    extraTraits: [
      "Full vessel of Isshiki Ōtsutsuki's genetic data and Kokugan dōjutsu",
      "Sealed Naruto Uzumaki and Hinata Hyūga inside the timeless Daikokuten dimension to protect Naruto from the Ōtsutsuki",
    ],
    ageUpdate: { "Part I": "14", "Two Blue Vortex": "17" },
    rankUpdate: { "Two Blue Vortex": "Kage" },
  },
  "Sarada Uchiha": {
    extraJutsu: [
      "Mangekyō Sharingan",
      "Chidori",
      "Lightning Release: Chidori Stream",
      "Fire Release: Great Fireball Technique",
      "Cherry Blossom Impact",
      "Lightning Ball",
    ],
    extraKekkei: ["Sharingan", "Mangekyō Sharingan"],
    extraClassifications: ["Two Blue Vortex"],
    extraTraits: [
      "Immune to Eida's Omnipotence rewrite alongside Sumire Kakei",
      "Awakened the Mangekyō Sharingan out of fierce resolve to save Boruto Uzumaki from global persecution",
    ],
    ageUpdate: { "Part I": "12", "Two Blue Vortex": "15" },
    rankUpdate: { "Part I": "Genin", "Two Blue Vortex": "Jōnin" },
  },
  "Himawari Uzumaki": {
    extraJutsu: [
      "Nine-Tails Chakra Mode (Reincarnated Kurama)",
      "Tailed Beast Ball",
      "Instantaneous Bijū Regeneration",
      "Gentle Fist: Lock-On",
      "Eight Trigrams Palm",
    ],
    extraKekkei: ["Byakugan"],
    extraClassifications: ["Jinchūriki", "Two Blue Vortex"],
    extraTraits: [
      "Reincarnated host of Kurama (Nine-Tails), with higher chakra affinity than any prior jinchūriki due to her Uzumaki and Hyūga lineage",
      "Can heal fatal injuries on others (such as Inojin Yamanaka) and clash directly with Jura's Tailed Beast Balls",
    ],
    ageUpdate: { "Part I": "10", "Two Blue Vortex": "13" },
    rankUpdate: { "Two Blue Vortex": "Jōnin" },
  },
  "Koji Kashin": {
    extraJutsu: [
      "Ten Directions / Prescience (Shinjutsu)",
      "Sage Mode (Perfect Toad Sage)",
      "True Fire of Samadhi",
      "Ultra-Big Ball Rasengan",
      "Summoning: Steam Toad",
    ],
    extraClassifications: ["Sage", "S-rank", "Two Blue Vortex"],
    extraTraits: [
      "Genetic clone of Jiraiya created by Amado Sanzu",
      "Awakened Shibai Ōtsutsuki's Shinjutsu 'Ten Directions' (Jippō) during his near-death battle with Isshiki, allowing him to perceive all possible future timelines",
    ],
    rankUpdate: { "Two Blue Vortex": "Kage" },
  },
  Code: {
    extraJutsu: [
      "Claw Marks (Shinjutsu)",
      "White Karma Augmentation",
      "Claw Grime Army Creation",
    ],
    extraClassifications: ["S-rank", "Two Blue Vortex"],
    extraTraits: [
      "Had his combat limiters removed by Amado, pushing his base power past Jigen",
      "Inadvertently triggered the evolution of the Ten-Tails into the sentient Divine Trees (Jura, Hidari, Matsuri, Ryū, Mamushi)",
    ],
    rankUpdate: { "Two Blue Vortex": "Kage" },
  },
  Mitsuki: {
    extraJutsu: [
      "Sage Mode (Snake Sage Transformation)",
      "Sage Art: Great Snake Lightning",
      "Lightning Release: Snake Lightning",
      "Wind Release: Breakthrough",
    ],
    extraClassifications: ["Sage", "Two Blue Vortex"],
    ageUpdate: { "Part I": "12", "Two Blue Vortex": "15" },
    rankUpdate: { "Two Blue Vortex": "Jōnin" },
  },
};
