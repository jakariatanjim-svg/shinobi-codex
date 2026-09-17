/* Shinobi Codex v3.0 — Authored Era Timelines with Era-Specific Visuals & Two Blue Vortex Updates.
   Each entry documents a canonical form/era of a character with the Chakra
   Index it commands and its era-specific artwork URL. */

import type { CharacterVersion } from "./types";

export const VERSION_TIMELINES: Record<string, CharacterVersion[]> = {
  "Naruto Uzumaki": [
    {
      eraLabel: "Academy Student",
      ageValue: "12",
      powerIndex: 18,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/8/8b/FIRST_NARUTO.jpg",
      description:
        "The dead-last of his class. Failed the graduation exam three times and could not produce a single clean clone, but learned the Multiple Shadow Clone Technique from the Scroll of Seals in one night.",
      powerContext: "Enormous chakra pool with almost no control. One forbidden technique to his name.",
      notes: ["Multiple Shadow Clone Technique", "Kurama sealed, no access", "Ninja registration 012607"],
    },
    {
      eraLabel: "Part I — Genin",
      ageValue: "12–13",
      powerIndex: 38,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/d/d6/Naruto_Part_I.png",
      description:
        "Team 7 under Kakashi. Learns tree-walking and water-walking, taps the Nine-Tails' chakra in bursts of rage, and finishes the era by mastering the Rasengan under Jiraiya.",
      powerContext: "Rasengan complete, one-tail cloak accessible but uncontrolled.",
      notes: ["Rasengan mastered", "Wind Release affinity confirmed", "Defeated Neji, Gaara, Kabuto"],
    },
    {
      eraLabel: "Part II — Sage Mode",
      ageValue: "15–17",
      powerIndex: 74,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/d/d3/Hero_of_the_Hidden_Leaf.PNG",
      description:
        "Returns from two and a half years with Jiraiya, then trains at Mount Myōboku after Jiraiya's death. Achieves perfect Sage Mode and creates the Wind Release: Rasenshuriken — the first new jutsu he invents alone.",
      powerContext: "Senjutsu-enhanced strength, speed and perception. Rasenshuriken severs chakra pathways.",
      notes: ["Sage Mode perfected", "Wind Release: Rasenshuriken", "Defeated all Six Paths of Pain"],
    },
    {
      eraLabel: "Nine-Tails Chakra Mode",
      ageValue: "16–17",
      powerIndex: 86,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/d/dd/Naruto_Uzumaki%21%21.png",
      description:
        "Wins control of Kurama's chakra at the Falls of Truth and reconciles with the fox during the Fourth Shinobi World War, unlocking a golden cloak with vastly amplified speed and reflexes.",
      powerContext: "Reaction speed rivalling the Fourth Raikage. Chakra arms allow ranged manipulation.",
      notes: ["Kurama partnership formed", "Tailed Beast Ball", "Chakra shared with the Allied Forces"],
    },
    {
      eraLabel: "Six Paths Sage Mode",
      ageValue: "17",
      powerIndex: 97,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/a/a5/Asura_Kurama_Mode.png",
      description:
        "Granted Hagoromo Ōtsutsuki's Yang seal. Wields Truth-Seeking Balls, senses the chakra of every tailed beast and fights Kaguya Ōtsutsuki alongside Sasuke.",
      powerContext: "All nine tailed-beast chakras, flight, Six Paths Senjutsu. Peak wartime output.",
      notes: ["Truth-Seeking Balls", "Six Paths: Ultra-Big Ball Rasenshuriken", "Sealed Kaguya with Sasuke"],
    },
    {
      eraLabel: "Seventh Hokage",
      ageValue: "32+ (Boruto era)",
      powerIndex: 93,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/0/05/Delta_Vs_Naruto.png",
      description:
        "Leads Konohagakure as the Seventh Hokage. Balances village administration with fatherhood to Boruto and Himawari, and adopts Kawaki. Still the strongest active shinobi in the village.",
      powerContext: "Full Kurama link retained; combat time reduced by administrative duty.",
      notes: ["Seventh Hokage", "Father to Boruto and Himawari", "Guardian of Kawaki"],
    },
    {
      eraLabel: "Baryon Mode",
      ageValue: "Boruto era peak",
      powerIndex: 100,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/4/4e/Baryon_Mode.png",
      description:
        "A last-resort fusion that burns Naruto's and Kurama's chakra like nuclear fuel. Every strike drains the opponent's lifespan on contact — used to defeat Isshiki Ōtsutsuki at the cost of Kurama's life.",
      powerContext: "Highest recorded output of any shinobi. Consumes the user's lifespan while active.",
      notes: ["Defeated Isshiki Ōtsutsuki", "Kurama died sustaining it", "Sealed in Daikokuten during Two Blue Vortex"],
    },
  ],

  "Sasuke Uchiha": [
    {
      eraLabel: "Part I — Genin",
      ageValue: "12–13",
      powerIndex: 40,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/2/21/Sasuke_Part_1.png",
      description:
        "The last loyal Uchiha, driven by the massacre of his clan. Awakens the two-tomoe Sharingan against Haku and learns the Chidori from Kakashi before defecting to Orochimaru.",
      powerContext: "Two-tomoe Sharingan, Chidori twice per day, elite taijutsu.",
      notes: ["Sharingan awakened", "Chidori learned", "Cursed Seal of Heaven"],
    },
    {
      eraLabel: "Part II — Taka",
      ageValue: "15–16",
      powerIndex: 78,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/1/13/Sasuke_Part_2.png",
      description:
        "Kills Orochimaru, then Itachi, and learns the truth of the Uchiha massacre. Forms Taka and awakens the Mangekyō Sharingan with Amaterasu and Susanoo.",
      powerContext: "Mangekyō Sharingan — Amaterasu, Blaze Release, incomplete Susanoo, Kirin.",
      notes: ["Killed Orochimaru and Itachi", "Mangekyō awakened", "Kirin used against Itachi"],
    },
    {
      eraLabel: "Eternal Mangekyō",
      ageValue: "16–17",
      powerIndex: 88,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/7/79/Eternal_Mangeky%C5%8D_Armoured_Susanoo.png",
      description:
        "Takes Itachi's eyes to gain the Eternal Mangekyō Sharingan, removing the blindness penalty and completing the Perfect Susanoo — a full-bodied avatar with a sword and bow.",
      powerContext: "Perfect Susanoo, unlimited Mangekyō use, Blaze Release: Kagutsuchi shaping.",
      notes: ["Eternal Mangekyō Sharingan", "Perfect Susanoo", "Rejoined the Allied Forces"],
    },
    {
      eraLabel: "Rinnegan",
      ageValue: "17",
      powerIndex: 96,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/e/ec/Sasuke_Uchiha%27s_Sharingan_Legend_Wiki.png",
      description:
        "Receives Hagoromo's Yin seal and awakens the six-tomoe Rinnegan in his left eye, gaining Amenotejikara space-time swapping and the ability to seal Kaguya with Naruto.",
      powerContext: "Rinnegan + Eternal Mangekyō, Indra's Arrow, Amenotejikara, Six Paths Chakra.",
      notes: ["Amenotejikara", "Indra's Arrow", "Sealed Kaguya with Naruto"],
    },
    {
      eraLabel: "Two Blue Vortex — Rogue Master",
      ageValue: "33+ (Two Blue Vortex)",
      powerIndex: 93,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/7/74/Hidari_Fullbody.png",
      description:
        "Defies Omnipotence out of trust in his daughter Sarada, flees Konoha with Boruto and trains him in every Uchiha sword and lightning technique before sacrificing himself against Code and the Claw Grimes — spawning Hidari.",
      powerContext: "Mastered kenjutsu and single-eye Eternal Mangekyō; passed his Kusanagi sword to Boruto.",
      notes: ["Trained Boruto for 1+ year", "Slashed Code's Rinnegan", "Assimilated into a Divine Tree (Hidari)"],
    },
  ],

  "Boruto Uzumaki": [
    {
      eraLabel: "Academy Prodigy",
      ageValue: "11",
      powerIndex: 36,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/4/4f/Boruto_training_with_Naruto.png",
      description:
        "Son of the Seventh Hokage and Hinata Hyūga. Commands three nature transformations before graduating the Academy and subconsciously adds Wind Release to the Rasengan.",
      powerContext: "Shadow Clones, Lightning/Wind/Water Release, Jōgan awakening against Nue.",
      notes: ["Graduated with top marks", "Awakened Jōgan", "Trained under Sasuke Uchiha"],
    },
    {
      eraLabel: "Part I — Karma Vessel",
      ageValue: "12",
      powerIndex: 72,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/d/de/Boruto_Infobox.png",
      description:
        "Deals the finishing blow to Momoshiki Ōtsutsuki with a Parent and Child Rasengan and is branded with the Karma seal, gaining ninjutsu absorption and space-time rifts.",
      powerContext: "Karma seal Stage 1–2, Vanishing Rasengan, Compression Rasengan.",
      notes: ["Defeated Momoshiki Ōtsutsuki", "Branded with Karma", "Member of Team 7"],
    },
    {
      eraLabel: "True Ōtsutsuki Vessel",
      ageValue: "12",
      powerIndex: 86,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/1/19/Boruto_vs._Naruto.png",
      description:
        "Killed by Kawaki to stop Momoshiki and revived when Momoshiki rewrites the remaining 18% of his Karma into Boruto's organs — making Boruto 100% biologically Ōtsutsuki before Eida's Omnipotence turns the world against him.",
      powerContext: "100% Ōtsutsuki physiology, True Essence Karma, hunted worldwide after Omnipotence.",
      notes: ["100% Ōtsutsuki genetic conversion", "Left eye scarred saving Sarada", "Exiled with Sasuke"],
    },
    {
      eraLabel: "Two Blue Vortex — Shadow Defender",
      ageValue: "15 (Two Blue Vortex)",
      powerIndex: 99,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/8/8c/Rasengan_Uzuhiko.png",
      description:
        "Returns to Konoha after three years of training under Sasuke Uchiha and Kashin Koji (using Ten Directions future sight). Effortlessly overwhelms Limitless Code with Rasengan Uzuhiko and teleports across dimensions with his own Flying Thunder God variant.",
      powerContext: "Rasengan Uzuhiko (planetary rotation chakra), Flying Thunder God, Purple Lightning, Uchiha Kenjutsu.",
      notes: ["Rasengan Uzuhiko", "Flying Thunder God Technique", "Fights Jura, Hidari & Matsuri"],
    },
  ],

  Kawaki: [
    {
      eraLabel: "Kara Vessel (IX)",
      ageValue: "14",
      powerIndex: 68,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/e/ef/Kawaki_infobox.png",
      description:
        "Purchased and brutally modified by Jigen as the vessel for Isshiki Ōtsutsuki. Escapes Kara's airship, defeats Garō, and is taken in by Naruto Uzumaki as a son.",
      powerContext: "Scientific Ninja Tool body morphing, Karma seal resonance with Boruto.",
      notes: ["Adopted by Naruto Uzumaki", "Defeated Garō", "Shared Karma resonance"],
    },
    {
      eraLabel: "Two Blue Vortex — Kokugan",
      ageValue: "17 (Two Blue Vortex)",
      powerIndex: 96,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/3/33/Kawaki_Part_II.png",
      description:
        "Reawakens a weapon-only Karma constructed by Amado with Isshiki's full Kokugan dōjutsu (Sukunahikona and Daikokuten). Seals Naruto and Hinata inside Daikokuten and lives as the Hokage's son following Omnipotence.",
      powerContext: "Kokugan (8 spokes), Sukunahikona instantaneous shrinking, Daikokuten dimensional storage, flight.",
      notes: ["Sealed Naruto & Hinata in Daikokuten", "Wields Isshiki's Kokugan", "Clashes with Jura and Boruto"],
    },
  ],

  "Sarada Uchiha": [
    {
      eraLabel: "Part I — Team 7 Captain",
      ageValue: "12",
      powerIndex: 62,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/9/9a/Sarada_Infobox.png",
      description:
        "Daughter of Sasuke and Sakura. Combines Sharingan precognition with her mother's chakra-enhanced strength and masters the Chidori to destroy Boro's core.",
      powerContext: "Three-Tomoe Sharingan, Chidori, Cherry Blossom Impact, Fire Release.",
      notes: ["Destroyed Boro's regeneration core", "Promoted to team leader", "Immune to Omnipotence"],
    },
    {
      eraLabel: "Two Blue Vortex — Mangekyō",
      ageValue: "15 (Two Blue Vortex)",
      powerIndex: 89,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/2/2f/Hidari_Attacks_Sarada.png",
      description:
        "Awakens the sun-shaped Mangekyō Sharingan out of desperate resolve to save Boruto from global manhunt. Stands her ground in Konoha and Sunagakure against Hidari (her father's Shinju clone) and Ryū.",
      powerContext: "Mangekyō Sharingan, Chidori Stream, high-speed dodging of Hidari's Chidori.",
      notes: ["Awakened Mangekyō Sharingan", "Immune to Eida's Omnipotence", "Battled Hidari & Ryū"],
    },
  ],

  "Himawari Uzumaki": [
    {
      eraLabel: "Part I — Prodigy",
      ageValue: "10",
      powerIndex: 32,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/f/f7/Himawari_Part_I.png",
      description:
        "Awakened the Byakugan without prior training on the day of Naruto's Hokage inauguration, knocking both Naruto and Kurama unconscious with a single Gentle Fist strike.",
      powerContext: "Untrained Byakugan, Gentle Fist tenketsu targeting.",
      notes: ["Awakened Byakugan at age 8", "Knocked out Naruto & Kurama", "Enrolled at the Ninja Academy"],
    },
    {
      eraLabel: "Two Blue Vortex — Kurama Jinchūriki",
      ageValue: "13 (Two Blue Vortex)",
      powerIndex: 92,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/8/86/Himawari_Part_II.png",
      description:
        "Discovers that Kurama (the Nine-Tails) reincarnated directly inside her body. Enters a fused Nine-Tails Chakra Mode where her hair flows like nine tails, instantly healing Inojin's fatal chest wound and clashing with Jura.",
      powerContext: "Reincarnated Kurama link, Tailed Beast Ball, instantaneous regeneration of self and allies.",
      notes: ["Reincarnated Nine-Tails Jinchūriki", "Healed Inojin from lethal impalement", "Fought Jura 1-on-1"],
    },
  ],

  Jura: [
    {
      eraLabel: "Two Blue Vortex — Sovereign Shinju",
      ageValue: "Newly Awakened (TBV)",
      powerIndex: 100,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/d/dc/Jura_Fullbody.png",
      description:
        "The leader of the autonomous Divine Trees (Shinju) and direct embodiment of the Ten-Tails. Driven by an insatiable curiosity for human knowledge, bookstores, and Naruto Uzumaki, he infiltrates Konoha and overpowers Kawaki and Himawari.",
      powerContext: "Eye-cast Tailed Beast Balls, Wood Release, Rinnegan, Claw Marks.",
      notes: ["Direct incarnation of the Ten-Tails", "Defeated Kawaki effortlessly", "Targeted Naruto & Himawari"],
    },
  ],

  Hidari: [
    {
      eraLabel: "Two Blue Vortex — Sasuke Shinju",
      ageValue: "Newly Awakened (TBV)",
      powerIndex: 96,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/7/74/Hidari_Fullbody.png",
      description:
        "Born when Sasuke Uchiha was assimilated by a Divine Tree while protecting Boruto. Wields Sasuke's Chidori and Lightning Release alongside Rinnegan and Claw Marks, seeking to devour Sarada Uchiha to understand his own identity.",
      powerContext: "Chidori, Claw Marks, Rinnegan, Wood Release, neutralized by Boruto's Rasengan Uzuhiko.",
      notes: ["Cloned from Sasuke Uchiha", "Wields Chidori via Claw Marks", "Thorn Soul Bulb recovered"],
    },
  ],

  Eida: [
    {
      eraLabel: "Kara Inner & Konoha Resident",
      ageValue: "16",
      powerIndex: 95,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/c/c8/Ada_Artwork.png",
      description:
        "Awakened from cryostasis by Code and relocated to Konohagakure. Her Senrigan observes any event in the present or past since her birth.",
      powerContext: "Senrigan all-seeing projection, passive universal charm.",
      notes: ["Senrigan dōjutsu", "Protected by Daemon", "Moved to Konohagakure"],
    },
    {
      eraLabel: "Two Blue Vortex — Omnipotence",
      ageValue: "19 (Two Blue Vortex)",
      powerIndex: 97,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/4/4b/Ada_Using_Omnipotence.png",
      description:
        "Unleashes the Shinjutsu of Omnipotence in response to Kawaki's desperate wish, rewriting the memories of the entire planet so Kawaki is remembered as Naruto's son and Boruto as the outsider.",
      powerContext: "Omnipotence (planet-scale reality/memory rewrite), Senrigan.",
      notes: ["Rewrote global human memory", "Apologized to Boruto & Sarada", "Targeted by Mamushi"],
    },
  ],

  "Koji Kashin": [
    {
      eraLabel: "Kara Inner (II)",
      ageValue: "Adult",
      powerIndex: 88,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/f/f2/Koji.png",
      description:
        "Created by Amado from Jiraiya's cells for the sole purpose of assassinating Jigen. Forces Isshiki Ōtsutsuki to resurrect prematurely in Jigen's imperfect vessel using True Fire of Samadhi and Perfect Toad Sage Mode.",
      powerContext: "Perfect Sage Mode, True Fire of Samadhi, Ultra-Big Ball Rasengan.",
      notes: ["Clone of Jiraiya", "Forced Isshiki's resurrection", "Escaped via Reverse Summoning"],
    },
    {
      eraLabel: "Two Blue Vortex — Ten Directions",
      ageValue: "Two Blue Vortex",
      powerIndex: 94,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/e/e7/Sage_Mode_Koji.png",
      description:
        "Awakens Shibai Ōtsutsuki's Shinjutsu 'Ten Directions' (Jippō / Prescience) during his near-death clash with Isshiki. Foresees every possible future catastrophe and mentors Boruto across timelines to teach him techniques he would only invent years later.",
      powerContext: "Ten Directions future-sight Shinjutsu, Toad surveillance network, Sage Mode.",
      notes: ["Awakened Ten Directions Shinjutsu", "Mentored Boruto during the timeskip", "Guides Boruto against the Shinju"],
    },
  ],

  "Kakashi Hatake": [
    {
      eraLabel: "Child Prodigy",
      ageValue: "5–13",
      powerIndex: 48,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/2/27/Kakashi_Hatake.png",
      description:
        "Graduated the Academy at five and made Chūnin at six. Son of the White Fang, he lived by the rulebook until Obito's death taught him that abandoning comrades makes you worse than trash.",
      powerContext: "Chakra-flow tantō, early Chidori development, no Sharingan yet.",
      notes: ["Chūnin at age 6", "Jōnin at 12", "Received Obito's Sharingan at 13"],
    },
    {
      eraLabel: "Part I — Team 7 Sensei",
      ageValue: "26–27",
      powerIndex: 70,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/7/75/Eight_Man_Squad.png",
      description:
        "The Copy Ninja, credited with over a thousand techniques. Leads Team 7 through the bell test, the Land of Waves and the Chūnin Exams while hiding chronic Sharingan fatigue.",
      powerContext: "Sharingan copy, Raikiri, Summoning: Ninken tracking pack.",
      notes: ["Copied 1000+ jutsu", "Raikiri", "Anbu veteran"],
    },
    {
      eraLabel: "Part II — Mangekyō",
      ageValue: "29–31",
      powerIndex: 82,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/6/67/Allied_Forces_Jutsu.png",
      description:
        "Awakens the Mangekyō Sharingan and masters Kamui, warping targets into another dimension. Fights Pain, Obito and the Ten-Tails as a war-front division commander.",
      powerContext: "Kamui long-range and short-range, chakra-limited to a handful of uses.",
      notes: ["Kamui mastered", "Third Division commander", "Briefly Six Paths-empowered"],
    },
    {
      eraLabel: "Sixth Hokage",
      ageValue: "32+",
      powerIndex: 66,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/2/27/Kakashi_Hatake.png",
      description:
        "Takes the hat after the war, rebuilding Konoha and eventually handing leadership to Naruto. Loses both Sharingan permanently but invents Purple Lightning.",
      powerContext: "Purple Lightning, tactics and decades of Kage-level command experience.",
      notes: ["Sixth Hokage", "Invented Purple Lightning", "Advises Konoha leadership"],
    },
  ],

  "Sakura Haruno": [
    {
      eraLabel: "Part I — Genin",
      ageValue: "12–13",
      powerIndex: 22,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/9/94/Sakura_Haruno_Part_I.png",
      description:
        "Top of the class in written theory with flawless chakra control, but the weakest of Team 7 in the field. Cuts her hair during the Forest of Death to defend her teammates.",
      powerContext: "Perfect chakra control, genjutsu resistance, minimal offence.",
      notes: ["Best written scores", "Genjutsu dispelling", "Chose to train under Tsunade"],
    },
    {
      eraLabel: "Part II — Tsunade's Apprentice",
      ageValue: "15–17",
      powerIndex: 62,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/6/67/Allied_Forces_Jutsu.png",
      description:
        "Trains under the Fifth Hokage to become a medical ninja whose chakra-enhanced strength shatters the ground. Poisons and kills Sasori of the Red Sand alongside Chiyo.",
      powerContext: "Cherry Blossom Impact, Chakra Scalpel, antidote synthesis.",
      notes: ["Killed Sasori", "Medical ninjutsu mastery", "Chakra-enhanced strength"],
    },
    {
      eraLabel: "Hundred Healings & New Era",
      ageValue: "17–32+",
      powerIndex: 79,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/9/94/Sakura_Haruno_Part_I.png",
      description:
        "Releases the Strength of a Hundred Seal she spent three years storing, standing beside Naruto and Sasuke against Kaguya, and later heads Konoha Hospital in the Boruto / Two Blue Vortex era.",
      powerContext: "Byakugō regeneration, Katsuyu summoning, Head of Konoha Medical Corps.",
      notes: ["Strength of a Hundred Seal", "Head of Konoha Hospital", "Mother of Sarada Uchiha"],
    },
  ],

  Gaara: [
    {
      eraLabel: "Part I — Shukaku's Host",
      ageValue: "12–13",
      powerIndex: 58,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/0/05/Gaara_awakens.png",
      description:
        "A jinchūriki raised as a weapon and taught that he existed only to love himself. Kills without hesitation until Naruto's words during the Konoha Crush break the cycle.",
      powerContext: "Automatic sand shield, Sand Coffin, partial Shukaku transformation.",
      notes: ["Shukaku jinchūriki", "Absolute Defence", "Defeated by Naruto"],
    },
    {
      eraLabel: "Part II — Fifth Kazekage",
      ageValue: "15–17",
      powerIndex: 84,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/e/e2/Gaara_Part_II.png",
      description:
        "Becomes the youngest Kazekage in Sunagakure's history. Captured by Deidara and killed by the Akatsuki's extraction, then revived by Chiyo's life-transfer technique.",
      powerContext: "Kage-level sand control across an entire battlefield; Shukaku extracted.",
      notes: ["Fifth Kazekage", "Died and was revived", "Allied Shinobi Forces commander"],
    },
    {
      eraLabel: "Two Blue Vortex — Veteran Kazekage",
      ageValue: "32+",
      powerIndex: 87,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/0/05/Gaara_awakens.png",
      description:
        "Protects Sunagakure and his adoptive son Shinki during Matsuri and the Claw Grimes' invasion of the Hidden Sand, before Shinki seals Gaara to save his life.",
      powerContext: "Refined Magnet Release sand, decades of Kage-level command experience.",
      notes: ["Adoptive father to Shinki", "Reconciled with Shukaku", "Protected by Shinki's Iron Sand seal"],
    },
  ],

  Jiraiya: [
    {
      eraLabel: "Team Hiruzen & Sannin",
      ageValue: "6–35",
      powerIndex: 70,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/2/21/Profile_Jiraiya.PNG",
      description:
        "Earns the title Sannin after surviving Hanzō of the Salamander during the Second Shinobi World War. Trains the Ame orphans — Nagato, Yahiko and Konan — then mentors Minato Namikaze.",
      powerContext: "Full toad summoning, Rasengan taught to Minato, elite fūinjutsu.",
      notes: ["Named Sannin by Hanzō", "Taught Minato", "Trained the Ame Orphans"],
    },
    {
      eraLabel: "Toad Sage",
      ageValue: "50–54",
      powerIndex: 88,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/1/16/Jiraiya.png",
      description:
        "Travels the world gathering intelligence and writing novels while training Naruto. Enters imperfect Sage Mode with Fukasaku and Shima fused to his shoulders.",
      powerContext: "Sage Mode with the Two Great Sage Toads, Sage Art: Goemon, Needle Jizō.",
      notes: ["Sage Mode", "Naruto's godfather and master", "Genetic template for Kashin Koji"],
    },
  ],

  "Itachi Uchiha": [
    {
      eraLabel: "Anbu Captain & Massacre",
      ageValue: "7–13",
      powerIndex: 84,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/b/bb/Itachi.png",
      description:
        "Graduated the Academy at seven, made Anbu captain at thirteen, and chose the village over the clan to prevent a civil war — sparing Sasuke alone.",
      powerContext: "Mangekyō Sharingan — Tsukuyomi, Amaterasu, Susanoo.",
      notes: ["Academy graduate at 7", "Anbu captain at 13", "Joined Akatsuki as a double agent"],
    },
    {
      eraLabel: "Akatsuki & Edo Tensei",
      ageValue: "17–21",
      powerIndex: 93,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/7/79/Eternal_Mangeky%C5%8D_Armoured_Susanoo.png",
      description:
        "Wields the Totsuka Blade and Yata Mirror in his final duel with Sasuke, and later breaks Kabuto's Edo Tensei during the Fourth Shinobi World War using Izanami.",
      powerContext: "Complete Susanoo with Totsuka Blade & Yata Mirror, Izanami.",
      notes: ["Totsuka Blade & Yata Mirror", "Ended Edo Tensei", "Reconciled with Sasuke"],
    },
  ],

  "Madara Uchiha": [
    {
      eraLabel: "Warring States & Valley of the End",
      ageValue: "Adult",
      powerIndex: 92,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/2/2b/Madara_Uchiha.png",
      description:
        "Co-founds Konohagakure with Hashirama Senju and later clashes with him at the Valley of the End with a Susanoo-armoured Nine-Tails.",
      powerContext: "Eternal Mangekyō Sharingan, Perfect Susanoo, Nine-Tails control.",
      notes: ["Co-founded Konoha", "Rival of Hashirama", "Eternal Mangekyō Sharingan"],
    },
    {
      eraLabel: "Ten-Tails Jinchūriki",
      ageValue: "Peak",
      powerIndex: 100,
      imageUrl: "https://static.wikia.nocookie.net/naruto/images/7/79/Eternal_Mangeky%C5%8D_Armoured_Susanoo.png",
      description:
        "Awakens dual Rinnegan and the Rinne Sharingan as the Ten-Tails' jinchūriki, casting the Infinite Tsukuyomi across the world.",
      powerContext: "Six Paths Senjutsu, Limbo: Border Jail, Truth-Seeking Balls.",
      notes: ["Defeated all Five Kage", "Ten-Tails jinchūriki", "Cast Infinite Tsukuyomi"],
    },
  ],
};
