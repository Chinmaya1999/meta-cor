// GENERATED from verified Wikimedia Commons licence metadata. Do not edit credits by hand.
export type PhotoKey = "hero-sunset" | "blue-hour" | "aerial-night" | "skyline-night" | "burj-al-arab" | "aerial-downtown" | "desert-sunset" | "marina-palms" | "museum-future" | "marina-yachts" | "marina-night" | "coast-aerial" | "world-islands";

export interface Photo { src: string; srcSet: string; w: number; h: number; alt: string }
const mk = (key: PhotoKey, w: number, h: number, alt: string, widths = [640, 1100, 1920]): Photo => ({ src: `/photos/${key}-${widths[1]}.webp`, srcSet: widths.map((x) => `/photos/${key}-${x}.webp ${x}w`).join(", "), w, h, alt });

export const PHOTOS: Record<PhotoKey, Photo> = {
  "hero-sunset": mk("hero-sunset", 2560, 1709, "Burj Khalifa silhouetted against a sunset with rays breaking through the clouds over Dubai", [640, 1100, 2560]),
  "blue-hour": mk("blue-hour", 1920, 1280, "Dubai skyline and the Burj Khalifa reflected in calm water at blue hour", [640, 1100, 1920]),
  "aerial-night": mk("aerial-night", 1920, 1281, "Aerial view of Sheikh Zayed Road and Dubai's illuminated skyline at night", [640, 1100, 1920]),
  "skyline-night": mk("skyline-night", 1920, 1202, "Dubai skyline with the Burj Khalifa lit at night and reflected in the water", [640, 1100, 1920]),
  "burj-al-arab": mk("burj-al-arab", 1920, 1280, "Burj Al Arab and the Dubai skyline seen across the Arabian Gulf", [640, 1100, 1920]),
  "aerial-downtown": mk("aerial-downtown", 1920, 1280, "Aerial view of Downtown Dubai and Sheikh Zayed Road with the Burj Khalifa", [640, 1100, 1920]),
  "desert-sunset": mk("desert-sunset", 1920, 1280, "The sun setting over desert dunes outside Dubai", [640, 1100, 1920]),
  "marina-palms": mk("marina-palms", 1920, 1063, "Dubai Marina towers seen past palm trees and bougainvillea", [640, 1100, 1920]),
  "museum-future": mk("museum-future", 1920, 1440, "The Museum of the Future with its Arabic calligraphy facade beside Dubai towers", [640, 1100, 1920]),
  "marina-yachts": mk("marina-yachts", 1920, 1255, "Yachts moored in Dubai Marina beneath tall residential towers", [640, 1100, 1920]),
  "marina-night": mk("marina-night", 1920, 1280, "Dubai Marina skyline lit at night and reflected in the water", [640, 1100, 1920]),
  "coast-aerial": mk("coast-aerial", 1920, 1280, "The Dubai coastline and Burj Al Arab seen from a high-rise", [640, 1100, 1920]),
  "world-islands": mk("world-islands", 1920, 1275, "Satellite view of Palm Jumeirah and The World islands off the Dubai coast", [640, 1100, 1920]),
};

export const PHOTO_CREDITS: { key: PhotoKey; title: string; author: string; license: string; licenseUrl: string; source: string }[] = [
 {
  "key": "hero-sunset",
  "title": "Burj Khalifa (worlds tallest building) and the Dubai skyline (25781049892).jpg",
  "author": "imran shahabuddin",
  "license": "CC BY 2.0",
  "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
  "source": "https://commons.wikimedia.org/wiki/File:Burj_Khalifa_(worlds_tallest_building)_and_the_Dubai_skyline_(25781049892).jpg"
 },
 {
  "key": "blue-hour",
  "title": "Dubai skyline unsplash.jpg",
  "author": "Robert Bock",
  "license": "CC0",
  "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
  "source": "https://commons.wikimedia.org/wiki/File:Dubai_skyline_unsplash.jpg"
 },
 {
  "key": "aerial-night",
  "title": "Downtown, Dubai (36714617205).jpg",
  "author": "bulletrain743 (Pixabay)",
  "license": "CC0",
  "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
  "source": "https://commons.wikimedia.org/wiki/File:Downtown,_Dubai_(36714617205).jpg"
 },
 {
  "key": "skyline-night",
  "title": "Dubai skyscrapers at night 2011.jpg",
  "author": "Michaelbibin (Pixabay)",
  "license": "CC0",
  "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
  "source": "https://commons.wikimedia.org/wiki/File:Dubai_skyscrapers_at_night_2011.jpg"
 },
 {
  "key": "burj-al-arab",
  "title": "Dubai skylines (Pixabay 1536496).jpg",
  "author": "Ronald Sagarino (Pixabay)",
  "license": "CC0",
  "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
  "source": "https://commons.wikimedia.org/wiki/File:Dubai_skylines_(Pixabay_1536496).jpg"
 },
 {
  "key": "aerial-downtown",
  "title": "Dubai Skyline mit Burj Khalifa (18241030269).jpg",
  "author": "Tim Reckmann from Hamm, Deutschland",
  "license": "CC BY 2.0",
  "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
  "source": "https://commons.wikimedia.org/wiki/File:Dubai_Skyline_mit_Burj_Khalifa_(18241030269).jpg"
 },
 {
  "key": "desert-sunset",
  "title": "Sunset captured on Dubai Dunes (Wide Angle).jpg",
  "author": "iMahesh",
  "license": "CC BY-SA 4.0",
  "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
  "source": "https://commons.wikimedia.org/wiki/File:Sunset_captured_on_Dubai_Dunes_(Wide_Angle).jpg"
 },
 {
  "key": "marina-palms",
  "title": "Dubai Marina (New Dubai).jpg",
  "author": "Clément Bardot",
  "license": "CC BY-SA 4.0",
  "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
  "source": "https://commons.wikimedia.org/wiki/File:Dubai_Marina_(New_Dubai).jpg"
 },
 {
  "key": "museum-future",
  "title": "Museum of the Future 9.jpg",
  "author": "EditQ",
  "license": "CC0",
  "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
  "source": "https://commons.wikimedia.org/wiki/File:Museum_of_the_Future_9.jpg"
 },
 {
  "key": "marina-yachts",
  "title": "Dubai Marina (12627723853).jpg",
  "author": "Francisco Anzola",
  "license": "CC BY 2.0",
  "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
  "source": "https://commons.wikimedia.org/wiki/File:Dubai_Marina_(12627723853).jpg"
 },
 {
  "key": "marina-night",
  "title": "Dubai downtown, United Arab Emirates (49786413631).jpg",
  "author": "Like My Travel from Peru",
  "license": "CC BY 2.0",
  "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
  "source": "https://commons.wikimedia.org/wiki/File:Dubai_downtown,_United_Arab_Emirates_(49786413631).jpg"
 },
 {
  "key": "coast-aerial",
  "title": "Dubai skyscrapers, coastline and Burj Al-Arab.jpg",
  "author": "Ahmad Ardity",
  "license": "CC0",
  "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
  "source": "https://commons.wikimedia.org/wiki/File:Dubai_skyscrapers,_coastline_and_Burj_Al-Arab.jpg"
 },
 {
  "key": "world-islands",
  "title": "Artificial Archipelagos, Dubai, United Arab Emirates ISS022-E-024940 lrg.jpg",
  "author": "NASA, International Space Station Expedition 22 crew",
  "license": "Public domain",
  "licenseUrl": "",
  "source": "https://commons.wikimedia.org/wiki/File:Artificial_Archipelagos,_Dubai,_United_Arab_Emirates_ISS022-E-024940_lrg.jpg"
 }
];

export const VARIANT_PHOTO: Record<string, PhotoKey> = { skyline: "hero-sunset", towers: "aerial-night", arches: "museum-future", waves: "desert-sunset", horizon: "marina-night", grid: "aerial-downtown" };
export const SERVICE_PHOTO: Record<string, PhotoKey> = { "financial-planning": "marina-palms", "investment-advisory": "aerial-night", "wealth-management": "burj-al-arab", "retirement-planning": "desert-sunset", "tax-planning": "aerial-downtown", "estate-planning": "museum-future", "risk-management": "marina-yachts" };
const ARTICLE_POOL: PhotoKey[] = ["aerial-downtown", "coast-aerial", "world-islands", "blue-hour", "skyline-night", "marina-yachts"];
// Distinct image for each starter article; new articles fall back to a stable hash of the slug.
const ARTICLE_FIXED: Record<string, PhotoKey> = {
  "why-a-written-financial-plan-matters": "aerial-downtown",
  "understanding-risk-tolerance-and-risk-capacity": "coast-aerial",
  "retirement-planning-across-borders": "world-islands",
  "the-role-of-tax-in-wealth-planning": "blue-hour",
  "starting-the-estate-planning-conversation": "skyline-night",
  "diversification-in-plain-language": "marina-yachts",
};
export const articlePhoto = (slug: string): PhotoKey => ARTICLE_FIXED[slug] ?? ARTICLE_POOL[[...slug].reduce((a, c) => a + c.charCodeAt(0), 0) % ARTICLE_POOL.length];
