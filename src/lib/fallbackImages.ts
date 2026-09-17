/* Shinobi Codex v2.1 — supplementary artwork.
 *
 * The Dattebayo API often ships ONE image per character (or the wrong casing).
 * This map ADDS extra official-art URLs (from the Naruto Fandom archive) so
 * characters get a proper multi-image gallery. These are MERGED with whatever
 * the API returns — the API images are never thrown away — and every URL is
 * rendered through the weserv proxy so hotlink blocking cannot hide them.
 *
 * Keyed by exact character name. */

export const EXTRA_IMAGES: Record<string, string[]> = {
  Jiraiya: [
    "https://static.wikia.nocookie.net/naruto/images/2/21/Profile_Jiraiya.PNG",
    "https://static.wikia.nocookie.net/naruto/images/1/16/Jiraiya.png",
  ],
  "Naruto Uzumaki": [
    "https://static.wikia.nocookie.net/naruto/images/d/d6/Naruto_Part_I.png",
    "https://static.wikia.nocookie.net/naruto/images/7/7d/Naruto_Part_II.png",
    "https://static.wikia.nocookie.net/naruto/images/0/09/Naruto_newpic.png",
  ],
  "Sasuke Uchiha": [
    "https://static.wikia.nocookie.net/naruto/images/2/21/Sasuke_Part_1.png",
    "https://static.wikia.nocookie.net/naruto/images/1/13/Sasuke_Part_2.png",
  ],
  "Kakashi Hatake": [
    "https://static.wikia.nocookie.net/naruto/images/2/27/Kakashi_Hatake.png",
  ],
  "Sakura Haruno": [
    "https://static.wikia.nocookie.net/naruto/images/9/94/Sakura_Haruno_Part_I.png",
  ],
  "Hashirama Senju": [
    "https://static.wikia.nocookie.net/naruto/images/1/1c/Hashirama.png",
  ],
  "Tobirama Senju": [
    "https://static.wikia.nocookie.net/naruto/images/6/68/Tobirama.png",
  ],
  "Hiruzen Sarutobi": [
    "https://static.wikia.nocookie.net/naruto/images/3/3c/Hiruzen_Sarutobi.png",
  ],
  "Minato Namikaze": [
    "https://static.wikia.nocookie.net/naruto/images/9/9a/Minato_Namikaze.png",
  ],
  "Kushina Uzumaki": [
    "https://static.wikia.nocookie.net/naruto/images/8/80/Kushina_Uzumaki.png",
  ],
  Tsunade: [
    "https://static.wikia.nocookie.net/naruto/images/b/b3/Tsunade_infobox2.png",
  ],
  Orochimaru: [
    "https://static.wikia.nocookie.net/naruto/images/3/3a/Orochimaru_Infobox.png",
  ],
  "Itachi Uchiha": [
    "https://static.wikia.nocookie.net/naruto/images/b/bb/Itachi.png",
  ],
  "Madara Uchiha": [
    "https://static.wikia.nocookie.net/naruto/images/2/2b/Madara_Uchiha.png",
  ],
  "Hinata Hyūga": [
    "https://static.wikia.nocookie.net/naruto/images/6/6b/Hinata_Hyuga.png",
  ],
  Gaara: [
    "https://static.wikia.nocookie.net/naruto/images/e/e2/Gaara_Part_II.png",
  ],
  "Rock Lee": [
    "https://static.wikia.nocookie.net/naruto/images/7/7a/Rock_Lee_Part_II.png",
  ],
  "Might Guy": [
    "https://static.wikia.nocookie.net/naruto/images/c/c0/Might_Guy.png",
  ],
};

/** Legacy alias kept for existing imports. */
export const FALLBACK_IMAGES = EXTRA_IMAGES;
