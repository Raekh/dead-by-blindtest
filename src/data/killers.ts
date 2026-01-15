// Dead by Daylight Killers Database

export interface AudioRange {
  start: number;
  end: number | null;
  label: "far" | "mid" | "close" | "chase";
}

export interface TerrorRadius {
  themes: string[];
}

export interface Lullaby {
  id: string;
  name: string;
}

export interface KillerAudio {
  terrorRadius: TerrorRadius | null;
  lullabies: Lullaby[];
}

export interface Killer {
  id: string;
  name: string;
  aliases: string[];
  audio: KillerAudio;
}

export interface KillerNameEntry {
  display: string;
  id: string;
  isAlias: boolean;
  killerName?: string;
}

export const KILLERS: Killer[] = [
  // ===========================================
  // CHAPTER 1 - Launch (June 2016)
  // ===========================================
  {
    id: "trapper",
    name: "The Trapper",
    aliases: ["trapper", "evan", "evan macmillan"],
    audio: {
      terrorRadius: {
        themes: [
          "TerrorRadius_Theme01",
          "TerrorRadius_Theme02",
          "TerrorRadius_Theme03",
          "TerrorRadius_Theme04",
          "TerrorRadius_Theme05",
          "TerrorRadius_Theme06",
        ],
      },
      lullabies: [],
    },
  },
  {
    id: "wraith",
    name: "The Wraith",
    aliases: ["wraith", "philip", "philip ojomo", "bing bong"],
    audio: {
      terrorRadius: {
        themes: [
          "TerrorRadius_Theme01",
          "TerrorRadius_Theme02",
          "TerrorRadius_Theme03",
          "TerrorRadius_Theme04",
          "TerrorRadius_Theme05",
          "TerrorRadius_Theme06",
        ],
      },
      lullabies: [],
    },
  },
  {
    id: "hillbilly",
    name: "The Hillbilly",
    aliases: ["hillbilly", "billy", "max thompson"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Hillbilly"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 2 - The Last Breath (August 2016)
  // ===========================================
  {
    id: "nurse",
    name: "The Nurse",
    aliases: ["nurse", "sally", "sally smithson"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Nurse"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // The Halloween Chapter (October 2016)
  // ===========================================
  {
    id: "shape",
    name: "The Shape",
    aliases: ["shape", "michael", "michael myers", "myers"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Shape"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 3 - Of Flesh and Mud (December 2016)
  // ===========================================
  {
    id: "hag",
    name: "The Hag",
    aliases: ["hag", "lisa", "lisa sherwood"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Hag"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 4 - Spark of Madness (May 2017)
  // ===========================================
  {
    id: "doctor",
    name: "The Doctor",
    aliases: ["doctor", "herman", "herman carter", "doc"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Doctor"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 5 - A Lullaby for the Dark (July 2017)
  // ===========================================
  {
    id: "huntress",
    name: "The Huntress",
    aliases: ["huntress", "anna"],
    audio: {
      terrorRadius: {
        themes: [
          "TerrorRadius_Theme01",
          "TerrorRadius_Theme02",
          "TerrorRadius_Theme03",
          "TerrorRadius_Theme04",
          "TerrorRadius_Theme05",
          "TerrorRadius_Theme06",
        ],
      },
      lullabies: [
        {
          id: "Huntress_Lullaby_1",
          name: "Huntress Lullaby",
        },
      ],
    },
  },

  // ===========================================
  // Leatherface Chapter (September 2017)
  // ===========================================
  {
    id: "cannibal",
    name: "The Cannibal",
    aliases: ["cannibal", "bubba", "leatherface", "bubba sawyer"],
    audio: {
      terrorRadius: {
        themes: [
          "TerrorRadius_Theme01",
          "TerrorRadius_Theme02",
          "TerrorRadius_Theme03",
          "TerrorRadius_Theme04",
          "TerrorRadius_Theme05",
          "TerrorRadius_Theme06",
        ],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 6 - A Nightmare on Elm Street (October 2017)
  // ===========================================
  {
    id: "nightmare",
    name: "The Nightmare",
    aliases: ["nightmare", "freddy", "freddy krueger"],
    audio: {
      terrorRadius: {
        themes: [
          "TerrorRadius_Theme01",
          "TerrorRadius_Theme02",
          "TerrorRadius_Theme03",
          "TerrorRadius_Theme04",
          "TerrorRadius_Theme05",
          "TerrorRadius_Theme06",
        ],
      },
      lullabies: [
        {
          id: "Nightmare_Lullaby_1",
          name: "Freddy's Nursery Rhyme",
        },
      ],
    },
  },

  // ===========================================
  // CHAPTER 7 - The SAW Chapter (January 2018)
  // ===========================================
  {
    id: "pig",
    name: "The Pig",
    aliases: ["pig", "amanda", "amanda young"],
    audio: {
      terrorRadius: {
        themes: [
          "TerrorRadius_Theme01",
          "TerrorRadius_Theme02",
          "TerrorRadius_Theme03",
          "TerrorRadius_Theme04",
          "TerrorRadius_Theme05",
          "TerrorRadius_Theme06",
        ],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 8 - Curtain Call (June 2018)
  // ===========================================
  {
    id: "clown",
    name: "The Clown",
    aliases: ["clown", "kenneth", "kenneth chase", "jeffrey hawk"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Clown"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 9 - Shattered Bloodline (September 2018)
  // ===========================================
  {
    id: "spirit",
    name: "The Spirit",
    aliases: ["spirit", "rin", "rin yamaoka"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Spirit"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 10 - Darkness Among Us (December 2018)
  // ===========================================
  {
    id: "legion",
    name: "The Legion",
    aliases: ["legion", "frank", "julie", "susie", "joey"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Legion"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 11 - Demise of the Faithful (March 2019)
  // ===========================================
  {
    id: "plague",
    name: "The Plague",
    aliases: ["plague", "adiris", "vommy mommy"],
    audio: {
      terrorRadius: {
        themes: [
          "TerrorRadius_Theme01",
          "TerrorRadius_Theme02",
          "TerrorRadius_Theme03",
          "TerrorRadius_Theme04",
          "TerrorRadius_Theme05",
          "TerrorRadius_Theme06",
        ],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 12 - Ghost Face (June 2019)
  // ===========================================
  {
    id: "ghostface",
    name: "The Ghost Face",
    aliases: ["ghostface", "ghost face", "danny", "danny johnson", "jed olsen"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Ghost_Face"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 13 - Stranger Things (September 2019)
  // ===========================================
  {
    id: "demogorgon",
    name: "The Demogorgon",
    aliases: ["demogorgon", "demo", "demodog"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Demogorgon"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 14 - Cursed Legacy (December 2019)
  // ===========================================
  {
    id: "oni",
    name: "The Oni",
    aliases: ["oni", "kazan", "kazan yamaoka"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Oni"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 15 - Chains of Hate (March 2020)
  // ===========================================
  {
    id: "deathslinger",
    name: "The Deathslinger",
    aliases: ["deathslinger", "caleb", "caleb quinn", "slinger"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Deathslinger"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 16 - Silent Hill (June 2020)
  // ===========================================
  {
    id: "executioner",
    name: "The Executioner",
    aliases: ["executioner", "pyramid head", "pyramid", "ph"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Executioner"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 17 - Descend Beyond (September 2020)
  // ===========================================
  {
    id: "blight",
    name: "The Blight",
    aliases: ["blight", "talbot", "talbot grimes"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Blight"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 18 - A Binding of Kin (December 2020)
  // ===========================================
  {
    id: "twins",
    name: "The Twins",
    aliases: ["twins", "charlotte", "victor", "charlotte deshayes"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Twins"],
      },
      lullabies: [
        { id: "Twins_Lullaby_1", name: "Victor's Lullaby 1" },
        { id: "Twins_Lullaby_2", name: "Victor's Lullaby 2" },
        { id: "Twins_Lullaby_3", name: "Victor's Lullaby 3" },
      ],
    },
  },

  // ===========================================
  // CHAPTER 19 - All-Kill (March 2021)
  // ===========================================
  {
    id: "trickster",
    name: "The Trickster",
    aliases: ["trickster", "ji-woon", "ji-woon hak"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Trickster"],
      },
      lullabies: [{ id: "Trickster_Lullaby_1", name: "Trickster's Melody" }],
    },
  },

  // ===========================================
  // CHAPTER 20 - Resident Evil (June 2021)
  // ===========================================
  {
    id: "nemesis",
    name: "The Nemesis",
    aliases: ["nemesis", "nemi", "tyrant"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Nemesis"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 21 - Hellraiser (September 2021)
  // ===========================================
  {
    id: "cenobite",
    name: "The Cenobite",
    aliases: ["cenobite", "pinhead", "elliot", "elliot spencer"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Cenobite"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 22 - Portrait of a Murder (November 2021)
  // ===========================================
  {
    id: "artist",
    name: "The Artist",
    aliases: ["artist", "carmina", "carmina mora"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Artist"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 23 - Sadako Rising (March 2022)
  // ===========================================
  {
    id: "onryo",
    name: "The Onryo",
    aliases: ["onryo", "sadako", "sadako yamamura", "ring"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Onryō"],
      },
      lullabies: [{ id: "Onryō_Lullaby_1", name: "Onryo's Whispers" }],
    },
  },

  // ===========================================
  // CHAPTER 24 - Roots of Dread (June 2022)
  // ===========================================
  {
    id: "dredge",
    name: "The Dredge",
    aliases: ["dredge", "maurice"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Dredge"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 25 - Resident Evil: PROJECT W (August 2022)
  // ===========================================
  {
    id: "mastermind",
    name: "The Mastermind",
    aliases: ["mastermind", "wesker", "albert wesker", "albert"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Mastermind"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 26 - Forged in Fog (November 2022)
  // ===========================================
  {
    id: "knight",
    name: "The Knight",
    aliases: ["knight", "tarhos", "tarhos kovacs"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Knight"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 27 - Tools of Torment (March 2023)
  // ===========================================
  {
    id: "skull_merchant",
    name: "The Skull Merchant",
    aliases: ["skull merchant", "adriana", "adriana imai", "sm"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Skull_Merchant"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 28 - End Transmission (June 2023)
  // ===========================================
  {
    id: "singularity",
    name: "The Singularity",
    aliases: ["singularity", "hux", "hux-a7-13"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Singularity"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 29 - Alien (August 2023)
  // ===========================================
  {
    id: "xenomorph",
    name: "The Xenomorph",
    aliases: ["xenomorph", "xeno", "alien"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Xenomorph"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 30 - Chucky (November 2023)
  // ===========================================
  {
    id: "good_guy",
    name: "The Good Guy",
    aliases: ["good guy", "chucky", "charles lee ray"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Good_Guy"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 31 - All Things Wicked (March 2024)
  // ===========================================
  {
    id: "unknown",
    name: "The Unknown",
    aliases: ["unknown", "hallucination"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Unknown"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 32 - Dungeons & Dragons (June 2024)
  // ===========================================
  {
    id: "lich",
    name: "The Lich",
    aliases: ["lich", "vecna"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Lich"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 33 - Castlevania (August 2024)
  // ===========================================
  {
    id: "dark_lord",
    name: "The Dark Lord",
    aliases: ["dark lord", "dracula"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Dark_Lord"],
      },
      lullabies: [{ id: "Dark_Lord_Lullaby_1", name: "Dracula's Lullaby" }],
    },
  },

  // ===========================================
  // CHAPTER 34 - Houndmaster (November 2024)
  // ===========================================
  {
    id: "houndmaster",
    name: "The Houndmaster",
    aliases: ["houndmaster", "portia"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Houndmaster"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 35 - Ghoul
  // ===========================================
  {
    id: "ghoul",
    name: "The Ghoul",
    aliases: ["ghoul"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Ghoul"],
      },
      lullabies: [],
    },
  },

  // ===========================================
  // CHAPTER 36 - Animatronic
  // ===========================================
  {
    id: "animatronic",
    name: "The Animatronic",
    aliases: ["animatronic"],
    audio: {
      terrorRadius: {
        themes: ["TerrorRadius_Animatronic"],
      },
      lullabies: [],
    },
  },
];

// Theme metadata
export const THEMES: Record<string, { name: string; description: string }> = {
  TerrorRadius_Theme01: { name: "Theme 01", description: "Generic theme 1" },
  TerrorRadius_Theme02: { name: "Theme 02", description: "Generic theme 2" },
  TerrorRadius_Theme03: { name: "Theme 03", description: "Generic theme 3" },
  TerrorRadius_Theme04: { name: "Theme 04", description: "Generic theme 4" },
  TerrorRadius_Theme05: { name: "Theme 05", description: "Generic theme 5" },
  TerrorRadius_Theme06: { name: "Theme 06", description: "Generic theme 6" },
  TerrorRadius_Hillbilly: {
    name: "Hillbilly",
    description: "Hillbilly unique theme",
  },
  TerrorRadius_Nurse: { name: "Nurse", description: "Nurse unique theme" },
  TerrorRadius_Shape: {
    name: "Shape",
    description: "Shape/Myers unique theme",
  },
  TerrorRadius_Hag: { name: "Hag", description: "Hag unique theme" },
  TerrorRadius_Doctor: { name: "Doctor", description: "Doctor unique theme" },
  TerrorRadius_Clown: { name: "Clown", description: "Clown unique theme" },
  TerrorRadius_Spirit: { name: "Spirit", description: "Spirit unique theme" },
  TerrorRadius_Legion: { name: "Legion", description: "Legion unique theme" },
  TerrorRadius_Ghost_Face: {
    name: "Ghost Face",
    description: "Ghost Face unique theme",
  },
  TerrorRadius_Demogorgon: {
    name: "Demogorgon",
    description: "Demogorgon unique theme",
  },
  TerrorRadius_Oni: { name: "Oni", description: "Oni unique theme" },
  TerrorRadius_Deathslinger: {
    name: "Deathslinger",
    description: "Deathslinger unique theme",
  },
  TerrorRadius_Executioner: {
    name: "Executioner",
    description: "Executioner/Pyramid Head unique theme",
  },
  TerrorRadius_Blight: { name: "Blight", description: "Blight unique theme" },
  TerrorRadius_Twins: { name: "Twins", description: "Twins unique theme" },
  TerrorRadius_Trickster: {
    name: "Trickster",
    description: "Trickster unique theme",
  },
  TerrorRadius_Nemesis: {
    name: "Nemesis",
    description: "Nemesis unique theme",
  },
  TerrorRadius_Cenobite: {
    name: "Cenobite",
    description: "Cenobite/Pinhead unique theme",
  },
  TerrorRadius_Artist: { name: "Artist", description: "Artist unique theme" },
  TerrorRadius_Onryō: {
    name: "Onryo",
    description: "Onryo/Sadako unique theme",
  },
  TerrorRadius_Dredge: { name: "Dredge", description: "Dredge unique theme" },
  TerrorRadius_Mastermind: {
    name: "Mastermind",
    description: "Mastermind/Wesker unique theme",
  },
  TerrorRadius_Knight: { name: "Knight", description: "Knight unique theme" },
  TerrorRadius_Skull_Merchant: {
    name: "Skull Merchant",
    description: "Skull Merchant unique theme",
  },
  TerrorRadius_Singularity: {
    name: "Singularity",
    description: "Singularity unique theme",
  },
  TerrorRadius_Xenomorph: {
    name: "Xenomorph",
    description: "Xenomorph unique theme",
  },
  TerrorRadius_Good_Guy: {
    name: "Good Guy",
    description: "Good Guy/Chucky unique theme",
  },
  TerrorRadius_Unknown: {
    name: "Unknown",
    description: "Unknown unique theme",
  },
  TerrorRadius_Lich: { name: "Lich", description: "Lich/Vecna unique theme" },
  TerrorRadius_Dark_Lord: {
    name: "Dark Lord",
    description: "Dark Lord/Dracula unique theme",
  },
  TerrorRadius_Houndmaster: {
    name: "Houndmaster",
    description: "Houndmaster unique theme",
  },
  TerrorRadius_Animatronic: {
    name: "Animatronic",
    description: "Animatronic unique theme",
  },
  TerrorRadius_Ghoul: { name: "Ghoul", description: "Ghoul unique theme" },
};

// Lullaby metadata
export const LULLABY_TYPES: Record<
  string,
  { name: string; description: string }
> = {
  Huntress_Lullaby_1: {
    name: "Huntress Lullaby",
    description: "Humming lullaby",
  },
  Nightmare_Lullaby_1: {
    name: "Freddy's Nursery Rhyme",
    description: "One, two, Freddy's coming for you...",
  },
  Trickster_Lullaby_1: {
    name: "Trickster's Melody",
    description: "K-pop melody",
  },
  Onryō_Lullaby_1: { name: "Onryo's Whispers", description: "Eerie whispers" },
  Twins_Lullaby_1: { name: "Victor's Lullaby 1", description: "Victor's cry" },
  Twins_Lullaby_2: { name: "Victor's Lullaby 2", description: "Victor's cry" },
  Twins_Lullaby_3: { name: "Victor's Lullaby 3", description: "Victor's cry" },
  Dark_Lord_Lullaby_1: {
    name: "Dracula's Lullaby",
    description: "Haunting melody",
  },
};

// Theme ranges based on actual audio file durations (duration / 4 for each section)
export const THEME_RANGES: Record<string, AudioRange[]> = {
  // Generic themes (used by untagged killers)
  TerrorRadius_Theme01: [
    { start: 0, end: 22, label: "far" },
    { start: 22, end: 45, label: "mid" },
    { start: 45, end: 67, label: "close" },
    { start: 67, end: null, label: "chase" },
  ],
  TerrorRadius_Theme02: [
    { start: 0, end: 22, label: "far" },
    { start: 22, end: 44, label: "mid" },
    { start: 44, end: 66, label: "close" },
    { start: 66, end: null, label: "chase" },
  ],
  TerrorRadius_Theme03: [
    { start: 0, end: 26, label: "far" },
    { start: 26, end: 53, label: "mid" },
    { start: 53, end: 80, label: "close" },
    { start: 80, end: null, label: "chase" },
  ],
  TerrorRadius_Theme04: [
    { start: 0, end: 19, label: "far" },
    { start: 19, end: 39, label: "mid" },
    { start: 39, end: 58, label: "close" },
    { start: 58, end: null, label: "chase" },
  ],
  TerrorRadius_Theme05: [
    { start: 0, end: 25, label: "far" },
    { start: 25, end: 50, label: "mid" },
    { start: 50, end: 76, label: "close" },
    { start: 76, end: null, label: "chase" },
  ],
  TerrorRadius_Theme06: [
    { start: 0, end: 24, label: "far" },
    { start: 24, end: 48, label: "mid" },
    { start: 48, end: 72, label: "close" },
    { start: 72, end: null, label: "chase" },
  ],
  // Unique themes (included for completeness, though tagged killers have their own ranges)
  TerrorRadius_Hillbilly: [
    { start: 0, end: 24, label: "far" },
    { start: 24, end: 48, label: "mid" },
    { start: 48, end: 72, label: "close" },
    { start: 72, end: null, label: "chase" },
  ],
  TerrorRadius_Nurse: [
    { start: 0, end: 30, label: "far" },
    { start: 30, end: 60, label: "mid" },
    { start: 60, end: 90, label: "close" },
    { start: 90, end: null, label: "chase" },
  ],
  TerrorRadius_Shape: [
    { start: 0, end: 21, label: "far" },
    { start: 21, end: 42, label: "mid" },
    { start: 42, end: 64, label: "close" },
    { start: 64, end: null, label: "chase" },
  ],
  TerrorRadius_Hag: [
    { start: 0, end: 32, label: "far" },
    { start: 32, end: 64, label: "mid" },
    { start: 64, end: 96, label: "close" },
    { start: 96, end: null, label: "chase" },
  ],
  TerrorRadius_Doctor: [
    { start: 0, end: 26, label: "far" },
    { start: 26, end: 52, label: "mid" },
    { start: 52, end: 78, label: "close" },
    { start: 78, end: null, label: "chase" },
  ],
  TerrorRadius_Clown: [
    { start: 0, end: 26, label: "far" },
    { start: 26, end: 52, label: "mid" },
    { start: 52, end: 79, label: "close" },
    { start: 79, end: null, label: "chase" },
  ],
  TerrorRadius_Spirit: [
    { start: 0, end: 33, label: "far" },
    { start: 33, end: 67, label: "mid" },
    { start: 67, end: 101, label: "close" },
    { start: 101, end: null, label: "chase" },
  ],
  TerrorRadius_Legion: [
    { start: 0, end: 28, label: "far" },
    { start: 28, end: 57, label: "mid" },
    { start: 57, end: 86, label: "close" },
    { start: 86, end: null, label: "chase" },
  ],
  TerrorRadius_Ghost_Face: [
    { start: 0, end: 28, label: "far" },
    { start: 28, end: 57, label: "mid" },
    { start: 57, end: 86, label: "close" },
    { start: 86, end: null, label: "chase" },
  ],
  TerrorRadius_Demogorgon: [
    { start: 0, end: 27, label: "far" },
    { start: 27, end: 54, label: "mid" },
    { start: 54, end: 81, label: "close" },
    { start: 81, end: null, label: "chase" },
  ],
  TerrorRadius_Oni: [
    { start: 0, end: 27, label: "far" },
    { start: 27, end: 54, label: "mid" },
    { start: 54, end: 82, label: "close" },
    { start: 82, end: null, label: "chase" },
  ],
  TerrorRadius_Deathslinger: [
    { start: 0, end: 30, label: "far" },
    { start: 30, end: 60, label: "mid" },
    { start: 60, end: 90, label: "close" },
    { start: 90, end: null, label: "chase" },
  ],
  TerrorRadius_Executioner: [
    { start: 0, end: 32, label: "far" },
    { start: 32, end: 64, label: "mid" },
    { start: 64, end: 96, label: "close" },
    { start: 96, end: null, label: "chase" },
  ],
  TerrorRadius_Blight: [
    { start: 0, end: 24, label: "far" },
    { start: 24, end: 48, label: "mid" },
    { start: 48, end: 72, label: "close" },
    { start: 72, end: null, label: "chase" },
  ],
  TerrorRadius_Twins: [
    { start: 0, end: 29, label: "far" },
    { start: 29, end: 59, label: "mid" },
    { start: 59, end: 88, label: "close" },
    { start: 88, end: null, label: "chase" },
  ],
  TerrorRadius_Trickster: [
    { start: 0, end: 25, label: "far" },
    { start: 25, end: 50, label: "mid" },
    { start: 50, end: 75, label: "close" },
    { start: 75, end: null, label: "chase" },
  ],
  TerrorRadius_Nemesis: [
    { start: 0, end: 58, label: "far" },
    { start: 58, end: 116, label: "mid" },
    { start: 116, end: 174, label: "close" },
    { start: 174, end: null, label: "chase" },
  ],
  TerrorRadius_Cenobite: [
    { start: 0, end: 30, label: "far" },
    { start: 30, end: 60, label: "mid" },
    { start: 60, end: 90, label: "close" },
    { start: 90, end: null, label: "chase" },
  ],
  TerrorRadius_Artist: [
    { start: 0, end: 37, label: "far" },
    { start: 37, end: 75, label: "mid" },
    { start: 75, end: 112, label: "close" },
    { start: 112, end: null, label: "chase" },
  ],
  TerrorRadius_Onryō: [
    { start: 0, end: 30, label: "far" },
    { start: 30, end: 60, label: "mid" },
    { start: 60, end: 90, label: "close" },
    { start: 90, end: null, label: "chase" },
  ],
  TerrorRadius_Dredge: [
    { start: 0, end: 29, label: "far" },
    { start: 29, end: 58, label: "mid" },
    { start: 58, end: 88, label: "close" },
    { start: 88, end: null, label: "chase" },
  ],
  TerrorRadius_Mastermind: [
    { start: 0, end: 30, label: "far" },
    { start: 30, end: 60, label: "mid" },
    { start: 60, end: 90, label: "close" },
    { start: 90, end: null, label: "chase" },
  ],
  TerrorRadius_Knight: [
    { start: 0, end: 30, label: "far" },
    { start: 30, end: 60, label: "mid" },
    { start: 60, end: 90, label: "close" },
    { start: 90, end: null, label: "chase" },
  ],
  TerrorRadius_Skull_Merchant: [
    { start: 0, end: 28, label: "far" },
    { start: 28, end: 56, label: "mid" },
    { start: 56, end: 84, label: "close" },
    { start: 84, end: null, label: "chase" },
  ],
  TerrorRadius_Singularity: [
    { start: 0, end: 29, label: "far" },
    { start: 29, end: 59, label: "mid" },
    { start: 59, end: 88, label: "close" },
    { start: 88, end: null, label: "chase" },
  ],
  TerrorRadius_Xenomorph: [
    { start: 0, end: 30, label: "far" },
    { start: 30, end: 60, label: "mid" },
    { start: 60, end: 90, label: "close" },
    { start: 90, end: null, label: "chase" },
  ],
  TerrorRadius_Good_Guy: [
    { start: 0, end: 32, label: "far" },
    { start: 32, end: 64, label: "mid" },
    { start: 64, end: 96, label: "close" },
    { start: 96, end: null, label: "chase" },
  ],
  TerrorRadius_Unknown: [
    { start: 0, end: 30, label: "far" },
    { start: 30, end: 60, label: "mid" },
    { start: 60, end: 90, label: "close" },
    { start: 90, end: null, label: "chase" },
  ],
  TerrorRadius_Lich: [
    { start: 0, end: 33, label: "far" },
    { start: 33, end: 66, label: "mid" },
    { start: 66, end: 99, label: "close" },
    { start: 99, end: null, label: "chase" },
  ],
  TerrorRadius_Dark_Lord: [
    { start: 0, end: 30, label: "far" },
    { start: 30, end: 60, label: "mid" },
    { start: 60, end: 90, label: "close" },
    { start: 90, end: null, label: "chase" },
  ],
  TerrorRadius_Houndmaster: [
    { start: 0, end: 28, label: "far" },
    { start: 28, end: 57, label: "mid" },
    { start: 57, end: 85, label: "close" },
    { start: 85, end: null, label: "chase" },
  ],
  TerrorRadius_Animatronic: [
    { start: 0, end: 28, label: "far" },
    { start: 28, end: 56, label: "mid" },
    { start: 56, end: 84, label: "close" },
    { start: 84, end: null, label: "chase" },
  ],
  TerrorRadius_Ghoul: [
    { start: 0, end: 29, label: "far" },
    { start: 29, end: 58, label: "mid" },
    { start: 58, end: 87, label: "close" },
    { start: 87, end: null, label: "chase" },
  ],
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Format time in seconds to MM:SS
export function formatTime(seconds: number | null): string {
  if (seconds === null) return "end";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Format a range object to string
export function formatRange(range: AudioRange): string {
  return `${formatTime(range.start)}-${formatTime(range.end)}`;
}

// Get all killer names for autocomplete (includes aliases)
export function getAllKillerNames(): KillerNameEntry[] {
  const names: KillerNameEntry[] = [];
  KILLERS.forEach((killer) => {
    names.push({ display: killer.name, id: killer.id, isAlias: false });
    killer.aliases.forEach((alias) => {
      if (alias.toLowerCase() !== killer.name.toLowerCase()) {
        names.push({
          display: alias,
          id: killer.id,
          isAlias: true,
          killerName: killer.name,
        });
      }
    });
  });
  return names;
}

// Find killer by name or alias (case-insensitive)
export function findKiller(input: string): Killer | undefined {
  const normalizedInput = input.toLowerCase().trim();
  return KILLERS.find(
    (killer) =>
      killer.name.toLowerCase() === normalizedInput ||
      killer.aliases.some((alias) => alias.toLowerCase() === normalizedInput),
  );
}

// Get killer by ID
export function getKillerById(id: string): Killer | undefined {
  return KILLERS.find((killer) => killer.id === id);
}

// Get audio ranges for a theme
export function getRangesForTheme(theme: string): AudioRange[] | undefined {
  return THEME_RANGES[theme];
}

// Get audio ranges for a killer (using first theme if multiple)
export function getRangesForKiller(killer: Killer, theme?: string): AudioRange[] | undefined {
  const themes = killer.audio.terrorRadius?.themes;
  if (!themes || themes.length === 0) return undefined;
  
  const targetTheme = theme || themes[0];
  return THEME_RANGES[targetTheme];
}

// Generic theme IDs
export const GENERIC_THEMES = [
  "TerrorRadius_Theme01",
  "TerrorRadius_Theme02",
  "TerrorRadius_Theme03",
  "TerrorRadius_Theme04",
  "TerrorRadius_Theme05",
  "TerrorRadius_Theme06",
];

// Check if a theme is generic
export function isGenericTheme(theme: string): boolean {
  return GENERIC_THEMES.includes(theme);
}

// Get all killers that use generic themes
export function getGenericThemeKillers(): Killer[] {
  return KILLERS.filter(killer => 
    killer.audio.terrorRadius?.themes.some(theme => GENERIC_THEMES.includes(theme))
  );
}

// Get killer names that use generic themes (for display)
export function getGenericThemeKillerNames(): string[] {
  return getGenericThemeKillers().map(k => k.name);
}
