export const CATEGORY_NAMES = [
  "Wholesome Cartoons",
  "Fantasy & Wonders",
  "Action & Expeditions",
  "Family & Friendship",
  "Adventure Chronicles",
  "Sci-Fi & Cosmos",
  "Wholesome Tales",
  "Mystery & Legends",
  "Nature & Landscapes",
  "Retro Pixels",
  "Little Explorers",
  "Creative Canvas"
];

export const TITLES_POOL = [
  "Starlit Skyward Dreams",
  "Neon City Midnight Sketch",
  "Enchanted Forest Journey",
  "The Lost Kingdom Gates",
  "Chibi Quest & The Magic Key",
  "Cyber Legend Chronicles",
  "Magical Forest Path",
  "Little Panda Chronicles",
  "Cosmic Stardust Voyage",
  "Undersea Kingdom Secrets",
  "Skyward Balloon Escapade",
  "Winter Wonderland Magic",
  "Cozy Woodside Cottage",
  "Retro Arcade Pixels",
  "Magical Bookstore Mystery",
  "Dreamland Express Train",
  "Whimsical Garden Party",
  "Curious Fox Explorers",
  "Flying Castle Expedition",
  "Robot Buddy Adventures",
  "Paper Airplane Escapes",
  "Secret Treehouse Meeting",
  "Lighthouse Beacon Story",
  "Floating Island Oasis",
  "Ancient Rune Discoveries",
  "Colorful Canvas Dreams",
  "Sunny Meadow Hideout",
  "Pocket Dimension Quest",
  "Starlight Bridge Crossing",
  "Windmill Valley Legends"
];

export const GENRES = ["Animation", "Family Story", "Adventure", "Fantasy", "Sci-Fi", "Comedy", "Wholesome"];
export const RATINGS = ["TV-G", "TV-Y7", "TV-Y", "G"];

export const UNSPLASH_IDS = [
  "photo-1534447677768-be436bb09401", // Starlit dreams
  "photo-1607604276583-eef5d076aa5f", // Anime character
  "photo-1581833971358-2c8b550f87b3", // Retro sketch
  "photo-1518709268805-4e9042af9f23", // Lost kingdom
  "photo-1618336753974-aae8e04506aa", // Chibi quest
  "photo-1569003339405-ea396a5a8a90", // Cyber legend
  "photo-1579783900882-c0d3dad7b119", // Magical forest
  "photo-1541562232579-512a21360020", // Cute panda
  "photo-1501854140801-50d01698950b", // Iceland landscape
  "photo-1518173946687-a4c8892bbd9f", // Japan waterfall
  "photo-1421789665209-c9b2a435e3dc", // Norway mountains
  "photo-1505142468610-359e7d316be0", // New Zealand
  "photo-1441974231531-c6227db76b6e", // Canada forest
  "photo-1608889175123-8ec330b86f84", // 3D cartoon style character
  "photo-1551269901-5c5e14c25df7", // Cute 3D model
  "photo-1620428268482-cf1851a36764", // Whimsical illustration
  "photo-1617791160505-6f006e121980", // 3D background
  "photo-1618005182384-a83a8bd57fbe", // Colorful abstract
  "photo-1542838132-92c53300491e", // Fantasy valley
  "photo-1579546929518-9e396f3cc809", // Warm pastel gradient
];

export interface VideoCardData {
  id: string;
  title: string;
  image: string;
  genre: string;
  rating: string;
  duration: string;
  heightStyle: { height: string };
  widthStyle?: { width: string };
}

export interface CategoryData {
  id: string;
  name: string;
  cards: VideoCardData[];
}

export function generateWatchData(cardHeightBase = 300, cardHeightMultiplier = 80): CategoryData[] {
  const cardPool = Array.from({ length: 300 }, (_, i) => {
    const title = TITLES_POOL[i % TITLES_POOL.length];
    const imageId = UNSPLASH_IDS[i % UNSPLASH_IDS.length];
    const genre = GENRES[(i * 3) % GENRES.length];
    const rating = RATINGS[(i * 7) % RATINGS.length];
    const durationMin = 5 + (i * 4) % 25; // 5 to 29 mins
    const height = cardHeightBase + (i % 4) * cardHeightMultiplier; 

    return {
      id: `show-card-${i}`,
      title: `${title} - Episode ${Math.floor(i / TITLES_POOL.length) + 1}`,
      image: `https://images.unsplash.com/${imageId}?q=80&w=600&auto=format&fit=crop`,
      genre,
      rating,
      duration: `${durationMin} mins`,
      heightStyle: { height: `${height}px` },
      widthStyle: { width: "100%" }
    };
  });

  const chunkSize = 25;
  return CATEGORY_NAMES.map((name, catIndex) => {
    const start = catIndex * chunkSize;
    const cards = cardPool.slice(start, start + chunkSize);
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return {
      id,
      name,
      cards
    };
  });
}
