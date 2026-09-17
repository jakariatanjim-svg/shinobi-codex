/* Shinobi Codex v2.0 — authored era timelines.
   Each entry documents a canonical form/era of a character with the Chakra
   Index it commands, so the Versions view can chart real growth deltas. */

import type { CharacterVersion } from "./types";

export const VERSION_TIMELINES: Record<string, CharacterVersion[]> = {
  "Naruto Uzumaki": [
    {
      eraLabel: "Academy Student",
      ageValue: "12",
      powerIndex: 18,
      description:
        "The dead-last of his class. Failed the graduation exam three times and could not produce a single clean clone, but learned the Multiple Shadow Clone Technique from the Scroll of Seals in one night.",
      powerContext: "Enormous chakra pool with almost no control. One forbidden technique to his name.",
      notes: ["Multiple Shadow Clone Technique", "Kurama sealed, no access", "Ninja registration 012607"],
    },
    {
      eraLabel: "Part I — Genin",
      ageValue: "12–13",
      powerIndex: 38,
      description:
        "Team 7 under Kakashi. Learns tree-walking and water-walking, taps the Nine-Tails' chakra in bursts of rage, and finishes the era by mastering the Rasengan under Jiraiya.",
      powerContext: "Rasengan complete, one-tail cloak accessible but uncontrolled.",
      notes: ["Rasengan mastered", "Wind Release affinity confirmed", "Defeated Neji, Gaara, Kabuto"],
    },
    {
      eraLabel: "Part II — Sage Mode",
      ageValue: "15–17",
      powerIndex: 74,
      description:
        "Returns from two and a half years with Jiraiya, then trains at Mount Myōboku after Jiraiya's death. Achieves perfect Sage Mode and creates the Wind Release: Rasenshuriken — the first new jutsu he invents alone.",
      powerContext: "Senjutsu-enhanced strength, speed and perception. Rasenshuriken severs chakra pathways.",
      notes: ["Sage Mode perfected", "Wind Release: Rasenshuriken", "Defeated all Six Paths of Pain"],
    },
    {
      eraLabel: "Nine-Tails Chakra Mode",
      ageValue: "16–17",
      powerIndex: 86,
      description:
        "Wins control of Kurama's chakra at the Falls of Truth and reconciles with the fox during the Fourth Shinobi World War, unlocking a golden cloak with vastly amplified speed and reflexes.",
      powerContext: "Reaction speed rivalling the Fourth Raikage. Chakra arms allow ranged manipulation.",
      notes: ["Kurama partnership formed", "Tailed Beast Ball", "Chakra shared with the Allied Forces"],
    },
    {
      eraLabel: "Six Paths Sage Mode",
      ageValue: "17",
      powerIndex: 97,
      description:
        "Granted Hagoromo Ōtsutsuki's Yang seal. Wields Truth-Seeking Balls, senses the chakra of every tailed beast and fights Kaguya Ōtsutsuki alongside Sasuke.",
      powerContext: "All nine tailed-beast chakras, flight, Six Paths Senjutsu. Peak wartime output.",
      notes: ["Truth-Seeking Balls", "Six Paths: Ultra-Big Ball Rasenshuriken", "Sealed Kaguya with Sasuke"],
    },
    {
      eraLabel: "Seventh Hokage",
      ageValue: "32+ (Boruto era)",
      powerIndex: 93,
      description:
        "Leads Konohagakure as the Seventh Hokage. Balances village administration with fatherhood to Boruto and Himawari, and adopts Kawaki. Still the strongest active shinobi in the village.",
      powerContext: "Full Kurama link retained; combat time reduced by administrative duty.",
      notes: ["Seventh Hokage", "Father to Boruto and Himawari", "Guardian of Kawaki"],
    },
    {
      eraLabel: "Baryon Mode",
      ageValue: "Boruto era peak",
      powerIndex: 100,
      description:
        "A last-resort fusion that burns Naruto's and Kurama's chakra like nuclear fuel. Every strike drains the opponent's lifespan on contact — used to defeat Isshiki Ōtsutsuki at the cost of Kurama's life.",
      powerContext: "Highest recorded output of any shinobi. Consumes the user's lifespan while active.",
      notes: ["Defeated Isshiki Ōtsutsuki", "Kurama died sustaining it", "Cannot be used again"],
    },
  ],

  "Sasuke Uchiha": [
    {
      eraLabel: "Part I — Genin",
      ageValue: "12–13",
      powerIndex: 40,
      description:
        "The last loyal Uchiha, driven by the massacre of his clan. Awakens the two-tomoe Sharingan against Haku and learns the Chidori from Kakashi before defecting to Orochimaru.",
      powerContext: "Two-tomoe Sharingan, Chidori twice per day, elite taijutsu.",
      notes: ["Sharingan awakened", "Chidori learned", "Cursed Seal of Heaven"],
    },
    {
      eraLabel: "Part II — Taka",
      ageValue: "15–16",
      powerIndex: 78,
      description:
        "Kills Orochimaru, then Itachi, and learns the truth of the Uchiha massacre. Forms Taka and awakens the Mangekyō Sharingan with Amaterasu and Susanoo.",
      powerContext: "Mangekyō Sharingan — Amaterasu, Blaze Release, incomplete Susanoo, Kirin.",
      notes: ["Killed Orochimaru and Itachi", "Mangekyō awakened", "Kirin used against Itachi"],
    },
    {
      eraLabel: "Eternal Mangekyō",
      ageValue: "16–17",
      powerIndex: 88,
      description:
        "Takes Itachi's eyes to gain the Eternal Mangekyō Sharingan, removing the blindness penalty and completing the Perfect Susanoo — a full-bodied avatar with a sword and bow.",
      powerContext: "Perfect Susanoo, unlimited Mangekyō use, Blaze Release: Kagutsuchi shaping.",
      notes: ["Eternal Mangekyō Sharingan", "Perfect Susanoo", "Rejoined the Allied Forces"],
    },
    {
      eraLabel: "Rinnegan",
      ageValue: "17",
      powerIndex: 96,
      description:
        "Receives Hagoromo's Yin seal and awakens the six-tomoe Rinnegan in his left eye, gaining Amenotejikara space-time swapping and the ability to seal Kaguya with Naruto.",
      powerContext: "Rinnegan + Eternal Mangekyō, Indra's Arrow, Amenotejikara, Six Paths Chakra.",
      notes: ["Amenotejikara", "Indra's Arrow", "Sealed Kaguya with Naruto"],
    },
    {
      eraLabel: "Wandering Shadow",
      ageValue: "32+ (Boruto era)",
      powerIndex: 91,
      description:
        "Operates outside the village as Konoha's shadow, investigating Ōtsutsuki threats. Mentors Boruto, and later loses the Rinnegan to Momoshiki's influence.",
      powerContext: "Rinnegan (until lost), Eternal Mangekyō, decades of accumulated technique.",
      notes: ["Boruto's mentor", "Married to Sakura", "Father of Sarada"],
    },
  ],

  "Kakashi Hatake": [
    {
      eraLabel: "Child Prodigy",
      ageValue: "5–13",
      powerIndex: 48,
      description:
        "Graduated the Academy at five and made Chūnin at six. Son of the White Fang, he lived by the rulebook until Obito's death taught him that abandoning comrades makes you worse than trash.",
      powerContext: "Chakra-flow tantō, early Chidori development, no Sharingan yet.",
      notes: ["Chūnin at age 6", "Jōnin at 12", "Received Obito's Sharingan at 13"],
    },
    {
      eraLabel: "Part I — Team 7 Sensei",
      ageValue: "26–27",
      powerIndex: 70,
      description:
        "The Copy Ninja, credited with over a thousand techniques. Leads Team 7 through the bell test, the Land of Waves and the Chūnin Exams while hiding chronic Sharingan fatigue.",
      powerContext: "Sharingan copy, Raikiri, Summoning: Ninken tracking pack.",
      notes: ["Copied 1000+ jutsu", "Raikiri", "Anbu veteran"],
    },
    {
      eraLabel: "Part II — Mangekyō",
      ageValue: "29–31",
      powerIndex: 82,
      description:
        "Awakens the Mangekyō Sharingan and masters Kamui, warping targets into another dimension. Fights Pain, Obito and the Ten-Tails as a war-front division commander.",
      powerContext: "Kamui long-range and short-range, chakra-limited to a handful of uses.",
      notes: ["Kamui mastered", "Third Division commander", "Briefly Six Paths-empowered"],
    },
    {
      eraLabel: "Sixth Hokage",
      ageValue: "32+",
      powerIndex: 66,
      description:
        "Takes the hat after the war, rebuilding Konoha and eventually handing leadership to Naruto. Loses both Sharingan permanently but remains one of the village's sharpest tacticians.",
      powerContext: "No dōjutsu; pure Lightning Release, tactics and decades of experience.",
      notes: ["Sixth Hokage", "Sharingan lost", "Retired to advise Naruto"],
    },
  ],

  "Sakura Haruno": [
    {
      eraLabel: "Part I — Genin",
      ageValue: "12–13",
      powerIndex: 22,
      description:
        "Top of the class in written theory with flawless chakra control, but the weakest of Team 7 in the field. Cuts her hair during the Forest of Death to defend her teammates.",
      powerContext: "Perfect chakra control, genjutsu resistance, minimal offence.",
      notes: ["Best written scores", "Genjutsu dispelling", "Chose to train under Tsunade"],
    },
    {
      eraLabel: "Part II — Tsunade's Apprentice",
      ageValue: "15–17",
      powerIndex: 62,
      description:
        "Trains under the Fifth Hokage to become a medical ninja whose chakra-enhanced strength shatters the ground. Poisons and kills Sasori of the Red Sand alongside Chiyo.",
      powerContext: "Cherry Blossom Impact, Chakra Scalpel, antidote synthesis.",
      notes: ["Killed Sasori", "Medical ninjutsu mastery", "Chakra-enhanced strength"],
    },
    {
      eraLabel: "Hundred Healings",
      ageValue: "17",
      powerIndex: 79,
      description:
        "Releases the Strength of a Hundred Seal she spent three years storing, healing herself continuously and standing beside Naruto and Sasuke against Kaguya as an equal.",
      powerContext: "Byakugō regeneration, Katsuyu summoning, village-wide healing support.",
      notes: ["Strength of a Hundred Seal", "Healed the Allied Forces", "Fought Kaguya directly"],
    },
    {
      eraLabel: "Boruto Era",
      ageValue: "32+",
      powerIndex: 76,
      description:
        "Heads Konoha Hospital and founds a children's mental-health clinic. Still capable of shattering an Ōtsutsuki-class opponent's guard with a single reinforced strike.",
      powerContext: "Byakugō retained, world-class medical authority.",
      notes: ["Head of Konoha Hospital", "Mother of Sarada", "Founded the children's clinic"],
    },
  ],

  Gaara: [
    {
      eraLabel: "Part I — Shukaku's Host",
      ageValue: "12–13",
      powerIndex: 58,
      description:
        "A jinchūriki raised as a weapon and taught that he existed only to love himself. Kills without hesitation until Naruto's words during the Konoha Crush break the cycle.",
      powerContext: "Automatic sand shield, Sand Coffin, partial Shukaku transformation.",
      notes: ["Shukaku jinchūriki", "Absolute Defence", "Defeated by Naruto"],
    },
    {
      eraLabel: "Part II — Fifth Kazekage",
      ageValue: "15–17",
      powerIndex: 84,
      description:
        "Becomes the youngest Kazekage in Sunagakure's history. Captured by Deidara and killed by the Akatsuki's extraction, then revived by Chiyo's life-transfer technique.",
      powerContext: "Kage-level sand control across an entire battlefield; Shukaku extracted.",
      notes: ["Fifth Kazekage", "Died and was revived", "Allied Shinobi Forces commander"],
    },
    {
      eraLabel: "Boruto Era",
      ageValue: "32+",
      powerIndex: 87,
      description:
        "A veteran Kazekage and one of Naruto's closest allies. Adopts Shinki and re-establishes contact with Shukaku on peaceful terms.",
      powerContext: "Refined Magnet Release sand, decades of Kage-level command experience.",
      notes: ["Adoptive father to Shinki", "Reconciled with Shukaku", "Longest-serving Kazekage"],
    },
  ],

  Jiraiya: [
    {
      eraLabel: "Team Hiruzen",
      ageValue: "6–20",
      powerIndex: 44,
      description:
        "The clumsiest of Hiruzen's three students, obsessed with impressing Tsunade. Summoned to Mount Myōboku by Gamamaru, who prophesied he would mentor the child who reshapes the world.",
      powerContext: "Early toad summoning, Rasengan not yet inherited.",
      notes: ["Student of the Third Hokage", "Prophecy of the Child", "Teammate to Orochimaru and Tsunade"],
    },
    {
      eraLabel: "One of the Sannin",
      ageValue: "23–35",
      powerIndex: 70,
      description:
        "Earns the title Sannin after surviving Hanzō of the Salamander during the Second Shinobi World War. Trains the Ame orphans — Nagato, Yahiko and Konan — then mentors Minato Namikaze.",
      powerContext: "Full toad summoning, Rasengan taught to Minato, elite fūinjutsu.",
      notes: ["Named Sannin by Hanzō", "Taught Minato", "Trained the Ame Orphans"],
    },
    {
      eraLabel: "Toad Sage",
      ageValue: "50–54",
      powerIndex: 88,
      description:
        "Travels the world gathering intelligence and writing novels while training Naruto. Enters imperfect Sage Mode with Fukasaku and Shima fused to his shoulders.",
      powerContext: "Sage Mode with the Two Great Sage Toads, Sage Art: Goemon, Needle Jizō.",
      notes: ["Sage Mode", "Naruto's godfather and master", "Killed by the Six Paths of Pain"],
    },
  ],

  "Itachi Uchiha": [
    {
      eraLabel: "Child Prodigy",
      ageValue: "7–12",
      powerIndex: 62,
      description:
        "Graduated the Academy at seven, awakened the Sharingan at eight and made Chūnin at ten. Traumatised by the Third Shinobi World War, he became a pacifist inside a clan preparing for a coup.",
      powerContext: "Three-tomoe Sharingan at ten, Anbu-level stealth and speed.",
      notes: ["Academy graduate at 7", "Anbu captain at 13", "Witnessed the Third War"],
    },
    {
      eraLabel: "The Massacre",
      ageValue: "13",
      powerIndex: 84,
      description:
        "Chooses the village over the clan and eliminates the Uchiha in a single night, sparing Sasuke alone. Awakens the Mangekyō Sharingan and becomes a missing-nin carrying the blame.",
      powerContext: "Mangekyō awakened — Tsukuyomi, Amaterasu, Susanoo.",
      notes: ["Tsukuyomi", "Spared Sasuke", "Joined Akatsuki as a double agent"],
    },
    {
      eraLabel: "Akatsuki",
      ageValue: "17–21",
      powerIndex: 90,
      description:
        "Partners with Kisame while secretly protecting Konoha from the inside. Terminally ill and slowly going blind, he engineers his own death at Sasuke's hands.",
      powerContext: "Complete Susanoo with the Totsuka Blade and Yata Mirror, Izanami.",
      notes: ["Totsuka Blade", "Yata Mirror", "Died fighting Sasuke by design"],
    },
    {
      eraLabel: "Edo Tensei",
      ageValue: "Reanimated",
      powerIndex: 93,
      description:
        "Reanimated by Kabuto during the war, he breaks free of the summoner's control, reveals the truth to Sasuke and ends Edo Tensei with Izanami.",
      powerContext: "Infinite chakra from reanimation plus full Mangekyō arsenal.",
      notes: ["Broke Kabuto's control", "Ended Edo Tensei", "Reconciled with Sasuke"],
    },
  ],

  "Madara Uchiha": [
    {
      eraLabel: "Warring States",
      ageValue: "Teens–20s",
      powerIndex: 84,
      description:
        "Head of the Uchiha during the Warring States period and rival to Hashirama Senju. Awakens the Mangekyō Sharingan after his brother Izuna's death and co-founds Konohagakure.",
      powerContext: "Eternal Mangekyō from Izuna's eyes, Kurama controlled via Sharingan.",
      notes: ["Co-founded Konoha", "Rival of Hashirama", "Eternal Mangekyō Sharingan"],
    },
    {
      eraLabel: "Valley of the End",
      ageValue: "Adult",
      powerIndex: 92,
      description:
        "Leaves the village convinced the Senju will subjugate the Uchiha, seizes Kurama and fights Hashirama to a standstill at the Valley of the End before falling.",
      powerContext: "Complete Susanoo fused with Kurama — a small mountain of chakra.",
      notes: ["Kurama controlled", "Fought Hashirama", "Faked his death"],
    },
    {
      eraLabel: "Reanimated Madara",
      ageValue: "Reanimated",
      powerIndex: 98,
      description:
        "Returns via Edo Tensei during the Fourth Shinobi World War, defeats the Five Kage simultaneously, then releases himself from the reanimation and awakens the Rinnegan.",
      powerContext: "Rinnegan, Wood Release from Hashirama's cells, Limbo shadow clones.",
      notes: ["Defeated all Five Kage", "Awakened the Rinnegan", "Limbo: Border Jail"],
    },
    {
      eraLabel: "Ten-Tails Jinchūriki",
      ageValue: "Peak",
      powerIndex: 100,
      description:
        "Becomes the Ten-Tails' jinchūriki, casts the Infinite Tsukuyomi across the world and is betrayed by Black Zetsu, who uses his body to revive Kaguya Ōtsutsuki.",
      powerContext: "Six Paths chakra, Truth-Seeking Balls, Infinite Tsukuyomi cast worldwide.",
      notes: ["Ten-Tails jinchūriki", "Infinite Tsukuyomi", "Betrayed by Black Zetsu"],
    },
  ],

  "Hinata Hyūga": [
    {
      eraLabel: "Part I — Genin",
      ageValue: "12–13",
      powerIndex: 26,
      description:
        "Disinherited in spirit by her own clan for being too gentle. Stands up to Neji in the Chūnin Exams and refuses to fall, inspired by watching Naruto refuse to give up.",
      powerContext: "Byakugan, incomplete Gentle Fist, chronic self-doubt.",
      notes: ["Byakugan", "Fought Neji", "Heiress of the Hyūga main house"],
    },
    {
      eraLabel: "Part II — Twin Lion Fists",
      ageValue: "15–17",
      powerIndex: 58,
      description:
        "Develops the Gentle Step Twin Lion Fists and steps between Naruto and Pain, confessing her feelings while fully expecting to die for it.",
      powerContext: "Twin Lion Fists, Eight Trigrams Sixty-Four Palms, protective barrier rotation.",
      notes: ["Twin Lion Fists", "Stood against Pain", "Byakugan Princess"],
    },
    {
      eraLabel: "Boruto Era",
      ageValue: "32+",
      powerIndex: 60,
      description:
        "Marries Naruto and raises Boruto and Himawari. Retired from active duty but retains full Byakugan mastery and remains a pillar of the Hyūga clan.",
      powerContext: "Full Byakugan range; combat role largely retired.",
      notes: ["Married Naruto", "Mother of Boruto and Himawari", "Hyūga clan elder"],
    },
  ],

  "Rock Lee": [
    {
      eraLabel: "Academy Reject",
      ageValue: "12",
      powerIndex: 20,
      description:
        "Born unable to mould chakra for ninjutsu or genjutsu. Written off by every instructor until Might Guy took him on and proved a shinobi could be built on taijutsu alone.",
      powerContext: "No ninjutsu, no genjutsu. Pure Strong Fist and relentless conditioning.",
      notes: ["Cannot use ninjutsu or genjutsu", "Taken in by Might Guy", "Member of Team Guy"],
    },
    {
      eraLabel: "Part I — Chūnin Exams",
      ageValue: "13",
      powerIndex: 52,
      description:
        "Removes his leg weights against Gaara and opens five of the Eight Gates, unleashing the Front Lotus and Reverse Lotus. Gaara's sand crushes his arm and leg, nearly ending his career.",
      powerContext: "Five Gates, Front and Reverse Lotus, speed beyond Sharingan tracking.",
      notes: ["Removed the leg weights", "Primary and Reverse Lotus", "Career-threatening injuries"],
    },
    {
      eraLabel: "Part II — Recovered",
      ageValue: "15–17",
      powerIndex: 68,
      description:
        "Returns to duty after Tsunade's surgery. Fights across the Fourth Shinobi World War beside Guy, holding his own against reanimated Kage-level opponents.",
      powerContext: "Six Gates, Leaf Whirlwind chain, Drunken Fist under the influence.",
      notes: ["Surgery by Tsunade", "Sixth Gate opened", "Allied Shinobi Forces"],
    },
    {
      eraLabel: "Boruto Era",
      ageValue: "32+",
      powerIndex: 74,
      description:
        "A jōnin instructor passing Guy's philosophy to a new generation, and father to Metal Lee. Still trains with the same absurd self-imposed penalties.",
      powerContext: "Seven Gates accessible; Konoha's foremost taijutsu instructor.",
      notes: ["Jōnin instructor", "Father of Metal Lee", "Carries on the Green Beast legacy"],
    },
  ],

  "Hashirama Senju": [
    {
      eraLabel: "Warring States Child",
      ageValue: "Child",
      powerIndex: 70,
      description:
        "Grows up on battlefields, losing two brothers before adulthood. Secretly befriends Madara Uchiha by a river, neither knowing the other is the heir of their rival clan.",
      powerContext: "Early Wood Release manifestation, extraordinary natural vitality.",
      notes: ["Met Madara as a child", "Lost brothers Kawarama and Itama", "Senju clan heir"],
    },
    {
      eraLabel: "Clan Head",
      ageValue: "Adult",
      powerIndex: 92,
      description:
        "Leads the Senju against the Uchiha, then negotiates the peace that founds Konohagakure. Offers Madara the village's leadership and is refused.",
      powerContext: "Wood Release mastery, Wood Clone Technique, tailed-beast suppression.",
      notes: ["Founded Konohagakure", "First Hokage", "Distributed the tailed beasts"],
    },
    {
      eraLabel: "God of Shinobi",
      ageValue: "Peak",
      powerIndex: 99,
      description:
        "Defeats Madara and a Kurama-clad Susanoo at the Valley of the End. His Sage Mode and Wood Release combination earns him the title God of Shinobi — the benchmark every later Kage is measured against.",
      powerContext: "Sage Mode, Wood Release: Shinsūsenju, True Several Thousand Hands.",
      notes: ["Defeated Madara", "Sage Mode + Wood Release", "Called the God of Shinobi"],
    },
    {
      eraLabel: "Edo Tensei",
      ageValue: "Reanimated",
      powerIndex: 97,
      description:
        "Reanimated during the Fourth Shinobi World War, he fights alongside the other Hokage, shares his cells' regenerative power with the Allied Forces and faces Madara one final time.",
      powerContext: "Infinite reanimation chakra with the full Wood Release arsenal.",
      notes: ["Fought beside all four Hokage", "Confronted Madara again", "Sage Art: Gate of the Great God"],
    },
  ],

  "Tobirama Senju": [
    {
      eraLabel: "Warring States",
      ageValue: "Young adult",
      powerIndex: 74,
      description:
        "Hashirama's younger brother and sharpest strategist. Deeply distrustful of the Uchiha, he pushes for structure and hard rules where his brother pushes for trust.",
      powerContext: "Water Release without a nearby source, elite sensory perception.",
      notes: ["Senju co-founder of Konoha", "Distrusted the Uchiha", "Master sensor"],
    },
    {
      eraLabel: "Second Hokage",
      ageValue: "Adult",
      powerIndex: 90,
      description:
        "Builds the institutions that define the village — the Academy, the Anbu, the police force staffed by the Uchiha, and the chūnin exam system. Invents Edo Tensei, Flying Thunder God and the Shadow Clone Technique.",
      powerContext: "Flying Thunder God teleportation, Water Release: Water Dragon, Edo Tensei.",
      notes: ["Second Hokage", "Created Edo Tensei", "Invented Flying Thunder God"],
    },
    {
      eraLabel: "Final Stand",
      ageValue: "Adult",
      powerIndex: 88,
      description:
        "Sacrifices himself to the Kinkaku Force so his squad — including a young Hiruzen Sarutobi — can escape, naming Hiruzen the Third Hokage with his last order.",
      powerContext: "Fought twenty elite Kumo shinobi alone to buy his team an exit.",
      notes: ["Named Hiruzen his successor", "Died against the Kinkaku Force", "Sacrificed for his squad"],
    },
    {
      eraLabel: "Edo Tensei",
      ageValue: "Reanimated",
      powerIndex: 91,
      description:
        "Summoned back during the war, he teleports the Allied Forces across the battlefield and finally admits the depth of his misjudgement of the Uchiha.",
      powerContext: "Unlimited chakra, battlefield-wide Flying Thunder God relay.",
      notes: ["Teleported the Allied Forces", "Acknowledged his failures", "Fought beside Naruto"],
    },
  ],

  "Hiruzen Sarutobi": [
    {
      eraLabel: "Student of the Hokage",
      ageValue: "Child–Teen",
      powerIndex: 62,
      description:
        "Trained directly by Hashirama and Tobirama, he absorbed every technique in the village's library and earned the title God of Shinobi in his own right.",
      powerContext: "All five nature transformations, Adamantine Sealing Chains, Enma summoning.",
      notes: ["Taught by the First and Second Hokage", "Chosen by Tobirama", "Partner: Enma"],
    },
    {
      eraLabel: "Third Hokage — Prime",
      ageValue: "Adult",
      powerIndex: 94,
      description:
        "Called the Professor for mastering every jutsu in Konoha. Leads the village through the Second and Third Shinobi World Wars and trains the Sannin.",
      powerContext: "Every Konoha technique, Enma's Adamantine Staff, all five natures.",
      notes: ["Taught Jiraiya, Tsunade and Orochimaru", "Led through two world wars", "Called the Professor"],
    },
    {
      eraLabel: "Part I — Elder Hokage",
      ageValue: "68–69",
      powerIndex: 76,
      description:
        "Returns to the hat after Minato's death and quietly protects Naruto for twelve years. Age has cost him speed but none of his technique library.",
      powerContext: "Diminished stamina; complete technical knowledge intact.",
      notes: ["Protected Naruto in secret", "Reinstated after Minato", "Village elder statesman"],
    },
    {
      eraLabel: "Konoha Crush",
      ageValue: "69",
      powerIndex: 82,
      description:
        "Faces Orochimaru and the reanimated First and Second Hokage alone. Uses the Dead Demon Consuming Seal to tear the soul from Orochimaru's arms, dying to save the village.",
      powerContext: "Dead Demon Consuming Seal — a suicide technique invoking the Shinigami.",
      notes: ["Sealed Orochimaru's arms", "Died defending Konoha", "Dead Demon Consuming Seal"],
    },
  ],

  "Minato Namikaze": [
    {
      eraLabel: "Team Jiraiya",
      ageValue: "Teen",
      powerIndex: 58,
      description:
        "A genin under Jiraiya alongside his future wife Kushina Uzumaki. Rescues her from Kumo kidnappers by recognising strands of her hair, and pledges to become Hokage.",
      powerContext: "Prodigious speed and sealing aptitude; Rasengan still years away.",
      notes: ["Student of Jiraiya", "Rescued Kushina", "Uzumaki sealing knowledge"],
    },
    {
      eraLabel: "Yellow Flash",
      ageValue: "Adult",
      powerIndex: 93,
      description:
        "Refines Tobirama's Flying Thunder God into an instantaneous strike that ends the Third Shinobi World War. Iwagakure issues standing orders to flee on sight.",
      powerContext: "Flying Thunder God Level 2, Rasengan created after three years of work.",
      notes: ["Created the Rasengan", "Flee-on-sight order from Iwa", "Ended the Third War"],
    },
    {
      eraLabel: "Fourth Hokage",
      ageValue: "Adult",
      powerIndex: 96,
      description:
        "Takes the hat and leads Konoha until the Nine-Tails attack. Fights a masked Obito, reclaims Kurama and seals its halves into himself and his newborn son, dying with Kushina to shield Naruto.",
      powerContext: "Peak Flying Thunder God with Kurama's Yin half sealed into himself.",
      notes: ["Fourth Hokage", "Fought Obito", "Sealed Kurama into Naruto"],
    },
    {
      eraLabel: "Edo Tensei",
      ageValue: "Reanimated",
      powerIndex: 95,
      description:
        "Reanimated for the war, he finally meets his grown son on the battlefield, gives Naruto Kurama's Yin half and fights beside all four Hokage against Madara and Obito.",
      powerContext: "Unlimited chakra, Kurama's Yin half, instant battlefield relocation.",
      notes: ["Met Naruto as an adult", "Gave Naruto the Yin half", "Fought Obito and Madara"],
    },
  ],

  Tsunade: [
    {
      eraLabel: "Team Hiruzen",
      ageValue: "Teen",
      powerIndex: 50,
      description:
        "Granddaughter of Hashirama Senju and grand-niece of Tobirama. Studies medicine while fighting through the Second Shinobi World War beside Jiraiya and Orochimaru.",
      powerContext: "Inherited Senju vitality, superhuman strength, early medical ninjutsu.",
      notes: ["Granddaughter of the First Hokage", "Named Sannin by Hanzō", "Wore her grandfather's necklace"],
    },
    {
      eraLabel: "The Wandering Years",
      ageValue: "Adult",
      powerIndex: 72,
      description:
        "Loses her brother Nawaki and her love Dan Katō, develops haemophobia and abandons the village to gamble and drink her way across the country for decades.",
      powerContext: "Legendary strength intact, crippled by the sight of blood.",
      notes: ["Developed haemophobia", "Left Konoha", "Called the Legendary Sucker"],
    },
    {
      eraLabel: "Fifth Hokage",
      ageValue: "51–54",
      powerIndex: 89,
      description:
        "Persuaded back by Naruto, she takes the hat, overcomes her fear of blood and rebuilds the village's medical corps — mandating a medic on every squad.",
      powerContext: "Strength of a Hundred Seal, Creation Rebirth, Katsuyu summoning.",
      notes: ["Fifth Hokage", "Trained Sakura and Shizune", "Reformed the medical corps"],
    },
    {
      eraLabel: "Pain's Assault",
      ageValue: "54",
      powerIndex: 85,
      description:
        "Releases Byakugō to shield every civilian in Konoha from Pain's Shinra Tensei simultaneously, burning through her lifetime chakra reserve and ageing instantly.",
      powerContext: "Katsuyu divided across the entire village to heal in parallel.",
      notes: ["Shielded all of Konoha", "Exhausted Byakugō", "Fell into a coma"],
    },
  ],

  Orochimaru: [
    {
      eraLabel: "Team Hiruzen",
      ageValue: "Teen",
      powerIndex: 56,
      description:
        "Hiruzen's most gifted student by a wide margin. The death of his parents sets him on a lifelong search for a way to defeat death itself.",
      powerContext: "Prodigal talent across every discipline; snake summoning contract.",
      notes: ["Hiruzen's favoured student", "Lost his parents young", "Named Sannin by Hanzō"],
    },
    {
      eraLabel: "Defection",
      ageValue: "Adult",
      powerIndex: 84,
      description:
        "Caught performing lethal experiments on Konoha citizens. Hiruzen cannot bring himself to execute his student and lets him escape; Orochimaru later founds Otogakure.",
      powerContext: "Living Corpse Reincarnation, Cursed Seals, Edo Tensei recovered from Tobirama.",
      notes: ["Fled Konoha", "Founded Otogakure", "Joined and left Akatsuki"],
    },
    {
      eraLabel: "Part I — Konoha Crush",
      ageValue: "50–51",
      powerIndex: 88,
      description:
        "Kills the Fourth Kazekage, invades Konoha and duels Hiruzen. Loses the use of both arms to the Dead Demon Consuming Seal and marks Sasuke with the Cursed Seal of Heaven.",
      powerContext: "Edo Tensei of the First and Second Hokage; arms sealed permanently.",
      notes: ["Killed the Third Hokage", "Arms sealed", "Cursed Seal placed on Sasuke"],
    },
    {
      eraLabel: "Boruto Era",
      ageValue: "60+",
      powerIndex: 90,
      description:
        "Rehabilitated as a wary ally of the Leaf. Runs his laboratory openly, produces Mitsuki, and provides Konoha with intelligence no one else can supply.",
      powerContext: "Body-transfer immortality, complete research apparatus, unrestricted knowledge.",
      notes: ["Parent of Mitsuki", "Uneasy Konoha ally", "Still functionally immortal"],
    },
  ],

  "Might Guy": [
    {
      eraLabel: "Part I — Green Beast",
      ageValue: "29",
      powerIndex: 72,
      description:
        "Konoha's taijutsu specialist and Kakashi's self-declared eternal rival. Teaches Rock Lee that hard work beats natural genius.",
      powerContext: "Six of the Eight Gates, Front Lotus, Strong Fist mastery.",
      notes: ["Eternal rival to Kakashi", "Teacher of Team Guy", "Sixth Gate opened"],
    },
    {
      eraLabel: "Part II — Seventh Gate",
      ageValue: "31",
      powerIndex: 86,
      description:
        "Opens the Gate of Wonder to fight Kisame Hoshigaki and later Madara, pushing his body far past the point most shinobi survive.",
      powerContext: "Seventh Gate — Morning Peacock, Daytime Tiger.",
      notes: ["Defeated Kisame", "Daytime Tiger", "War-front taijutsu commander"],
    },
    {
      eraLabel: "Eighth Gate — Night Guy",
      ageValue: "31",
      powerIndex: 99,
      description:
        "Opens the Gate of Death against Madara Uchiha, becoming — by Madara's own admission — the strongest taijutsu user alive. The technique costs him the use of his leg for life.",
      powerContext: "Evening Elephant and Night Guy; speed exceeding Six Paths perception.",
      notes: ["Night Guy", "Praised by Madara", "Permanently crippled his leg"],
    },
  ],
};
