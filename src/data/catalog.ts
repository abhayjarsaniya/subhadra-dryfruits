/**
 * Editable catalog for Subhadra Dryfruits.
 * Update names, copy, weights, and indicative INR prices here.
 * Prices are confirmed with the customer on WhatsApp — this site does not take payment.
 */

export const WEIGHTS = ["100g", "250g", "500g", "1kg"] as const;
export type Weight = (typeof WEIGHTS)[number];

export type CategoryId = "dry-fruits" | "chocolates" | "coffee-tea" | "gifts" | "bundles";
export type CollectionId = CategoryId | "best-sellers";
export type Accent = "almond" | "cocoa" | "caramel" | "leaf" | "gold";

export type Product = {
  slug: string;
  name: string;
  category: CategoryId;
  group: string;
  origin: string;
  short: string;
  description: string;
  highlights: string[];
  storage: string;
  image: string;
  alt: string;
  bestseller: boolean;
  featured: number;
  prices: Partial<Record<Weight, number>>;
  includes: string[];
  festival?: string;
  giftItems?: string[];
  available?: boolean;
  availableWeights?: Weight[];
};

export type Collection = {
  id: CollectionId;
  nav: string;
  eyebrow: string;
  title: string;
  description: string;
  metaTitle: string;
  accent: Accent;
  groups: string[];
};

const storage = {
  dry: "After opening, move the pack into an airtight jar. Keep it away from sunlight, heat and moisture so the flavour stays lively.",
  chocolate:
    "Keep cool and dry, away from direct sun and strong kitchen smells. Chocolate holds its finish best below 22°C.",
  brew: "Store airtight, away from moisture, light and strong aromas. For the brightest cup, finish the pack within a few weeks of opening.",
  gift: "Keep the hamper sealed until you present it. Once opened, move dry fruits, chocolate and tea into airtight containers.",
};

type Draft = Omit<Product, "storage" | "alt" | "bestseller" | "includes"> & {
  bestseller?: boolean;
  storage: string;
  includes?: string[];
  festival?: string;
  giftItems?: string[];
  available?: boolean;
  availableWeights?: Weight[];
};

function item(draft: Draft): Product {
  return {
    ...draft,
    includes: draft.includes ?? [],
    bestseller: Boolean(draft.bestseller),
    available: draft.available ?? true,
    alt: `${draft.name}, premium ${draft.group.toLowerCase()} photographed on a clean white background`,
  };
}

export const products: Product[] = [
  item({
    slug: "california-almonds",
    name: "California Almonds",
    category: "dry-fruits",
    group: "Nuts",
    origin: "California",
    short: "Clean, buttery almonds with a naturally sweet crunch.",
    description:
      "Whole natural almonds chosen for even size and a mellow, buttery bite. A daily handful, a dessert finish, or the start of a generous gift box.",
    highlights: ["Whole natural kernels", "Even size and colour", "Ideal for snacking and gifting"],
    storage: storage.dry,
    image: "/images/california-almonds.jpg",
    bestseller: true,
    featured: 1,
    prices: { "100g": 180, "250g": 420, "500g": 780, "1kg": 1480 },
  }),
  item({
    slug: "premium-cashews",
    name: "Premium Cashews",
    category: "dry-fruits",
    group: "Nuts",
    origin: "India",
    short: "Large ivory cashews with a soft, milky crunch.",
    description:
      "Whole cashews graded for a plump shape and a gentle sweetness. Excellent on their own, and just as welcome beside evening tea.",
    highlights: ["Whole ivory kernels", "Soft, milky crunch", "A house favourite for guests"],
    storage: storage.dry,
    image: "/images/premium-cashews.jpg",
    bestseller: true,
    featured: 2,
    prices: { "100g": 220, "250g": 520, "500g": 980, "1kg": 1850 },
  }),
  item({
    slug: "iranian-pistachios",
    name: "Iranian Pistachios",
    category: "dry-fruits",
    group: "Nuts",
    origin: "Iran",
    short: "Naturally open shells with vivid green kernels.",
    description:
      "Pistachios with a bright, savoury-sweet flavour and shells that open cleanly. A festive bowl that feels considered rather than extravagant.",
    highlights: ["Open-shell selection", "Vivid green kernels", "Beautiful for festive serving"],
    storage: storage.dry,
    image: "/images/iranian-pistachios.jpg",
    bestseller: true,
    featured: 3,
    prices: { "100g": 320, "250g": 760, "500g": 1450, "1kg": 2750 },
  }),
  item({
    slug: "medjool-dates",
    name: "Medjool Dates",
    category: "dry-fruits",
    group: "Dates & Figs",
    origin: "Middle East",
    short: "Large, caramel-soft dates with a honeyed centre.",
    description:
      "Plump Medjool dates with a deep caramel flavour and a soft, almost fudge-like bite. Wonderful after meals, or tucked into a gift hamper.",
    highlights: ["Large plump fruit", "Soft caramel centre", "Naturally sweet, no added sugar"],
    storage: storage.dry,
    image: "/images/medjool-dates.jpg",
    bestseller: true,
    featured: 4,
    prices: { "100g": 220, "250g": 520, "500g": 980, "1kg": 1850 },
  }),
  item({
    slug: "mamra-almonds",
    name: "Mamra Almonds",
    category: "dry-fruits",
    group: "Nuts",
    origin: "Iran",
    short: "Rare curved almonds with a richer, oilier bite.",
    description:
      "Mamra almonds are smaller, more curved and distinctly richer than everyday almonds. A limited style for people who notice the difference.",
    highlights: ["Traditional Mamra shape", "Richer, oilier kernel", "A premium gifting nut"],
    storage: storage.dry,
    image: "/images/mamra-almonds.jpg",
    bestseller: true,
    featured: 5,
    prices: { "100g": 450, "250g": 1050, "500g": 1980, "1kg": 3800 },
  }),
  item({
    slug: "walnut-kernels",
    name: "Walnut Kernels",
    category: "dry-fruits",
    group: "Nuts",
    origin: "Kashmir",
    short: "Light golden halves with a clean, mellow flavour.",
    description:
      "Walnut halves selected for a pale colour and a fresh, creamy bite. Lovely over breakfast, or packed for someone who likes a quieter luxury.",
    highlights: ["Light golden halves", "Clean, mellow flavour", "Sorted for fewer broken bits"],
    storage: storage.dry,
    image: "/images/walnut-kernels.jpg",
    bestseller: true,
    featured: 6,
    prices: { "100g": 280, "250g": 650, "500g": 1220, "1kg": 2300 },
  }),
  item({
    slug: "anjeer",
    name: "Anjeer",
    category: "dry-fruits",
    group: "Dates & Figs",
    origin: "Afghanistan",
    short: "Soft dried figs with a seedy, honeyed chew.",
    description:
      "Afghan anjeer sliced to show their amber centres and tiny seeds. Naturally sweet, gently floral, and very much at home in Indian gifting.",
    highlights: ["Soft sliced figs", "Honeyed, seedy bite", "A classic Indian gift fruit"],
    storage: storage.dry,
    image: "/images/anjeer.jpg",
    bestseller: true,
    featured: 7,
    prices: { "100g": 200, "250g": 470, "500g": 880, "1kg": 1650 },
  }),
  item({
    slug: "mixed-dry-fruits",
    name: "Mixed Dry Fruits",
    category: "dry-fruits",
    group: "Mixes",
    origin: "Assorted",
    short: "A balanced mix of nuts, raisins and a little sweetness.",
    description:
      "Almonds, cashews, pistachios, walnuts and raisins put together so no one note shouts. The easiest way to keep a beautiful bowl ready.",
    highlights: ["Balanced nut and fruit mix", "Ready to serve or gift", "A house blend, not a leftover mix"],
    storage: storage.dry,
    image: "/images/mixed-dry-fruits.jpg",
    bestseller: true,
    featured: 8,
    prices: { "100g": 200, "250g": 470, "500g": 880, "1kg": 1650 },
  }),
  item({
    slug: "w320-cashews",
    name: "W320 Cashews",
    category: "dry-fruits",
    group: "Nuts",
    origin: "India",
    short: "Uniform whole cashews from a trusted export grade.",
    description:
      "W320 cashews are chosen for consistency: whole kernels, a tidy size and a clean flavour. A smart pick when the box needs to look as good as it tastes.",
    highlights: ["Export-style W320 grade", "Uniform whole kernels", "Clean, lightly sweet flavour"],
    storage: storage.dry,
    image: "/images/w320-cashews.jpg",
    featured: 9,
    prices: { "100g": 260, "250g": 610, "500g": 1150, "1kg": 2180 },
  }),
  item({
    slug: "roasted-pistachios",
    name: "Roasted Pistachios",
    category: "dry-fruits",
    group: "Nuts",
    origin: "Iran",
    short: "Gently roasted pistachios with a warm, savoury finish.",
    description:
      "Open pistachios roasted just enough to deepen the flavour without hiding the green kernel. Made for unhurried evenings and full bowls.",
    highlights: ["Lightly roasted", "Open shells", "Warm, savoury finish"],
    storage: storage.dry,
    image: "/images/roasted-pistachios.jpg",
    featured: 10,
    prices: { "100g": 280, "250g": 660, "500g": 1250, "1kg": 2380 },
  }),
  item({
    slug: "walnuts",
    name: "Walnuts",
    category: "dry-fruits",
    group: "Nuts",
    origin: "Kashmir",
    short: "In-shell walnuts with deeply wrinkled, fresh shells.",
    description:
      "Whole walnuts in the shell, the kind you crack when you want the ceremony of it. A traditional addition to winter gifting and festive thalis.",
    highlights: ["Whole in-shell walnuts", "Traditional festive pick", "Crack fresh, as you eat"],
    storage: storage.dry,
    image: "/images/walnuts.jpg",
    featured: 11,
    prices: { "100g": 240, "250g": 560, "500g": 1050, "1kg": 1980 },
  }),
  item({
    slug: "premium-dates",
    name: "Premium Dates",
    category: "dry-fruits",
    group: "Dates & Figs",
    origin: "Middle East",
    short: "Glossy dark dates with a rich, molasses-like sweetness.",
    description:
      "Soft dark dates with a deep, rounded sweetness. A dependable everyday luxury for the table, the tiffin, or a simple gift.",
    highlights: ["Soft dark fruit", "Rich natural sweetness", "Lovely for everyday serving"],
    storage: storage.dry,
    image: "/images/premium-dates.jpg",
    featured: 12,
    prices: { "100g": 90, "250g": 200, "500g": 360, "1kg": 680 },
  }),
  item({
    slug: "black-raisins",
    name: "Black Raisins",
    category: "dry-fruits",
    group: "Raisins & Berries",
    origin: "India",
    short: "Dark, chewy raisins with a bold natural sweetness.",
    description:
      "Black raisins dried to keep a deep colour and a satisfying chew. Stir them into sweets, or keep a small jar within reach.",
    highlights: ["Deep colour", "Chewy, not sticky-hard", "Naturally sweet"],
    storage: storage.dry,
    image: "/images/black-raisins.jpg",
    featured: 13,
    prices: { "100g": 80, "250g": 180, "500g": 330, "1kg": 620 },
  }),
  item({
    slug: "golden-raisins",
    name: "Golden Raisins",
    category: "dry-fruits",
    group: "Raisins & Berries",
    origin: "India",
    short: "Plump golden raisins with a lighter, fruitier note.",
    description:
      "Golden raisins that stay plump and gently tangy. They brighten a dry-fruit mix and look beautiful in a gift tray.",
    highlights: ["Plump golden fruit", "Lighter, fruitier sweetness", "A bright mix-in"],
    storage: storage.dry,
    image: "/images/golden-raisins.jpg",
    featured: 14,
    prices: { "100g": 70, "250g": 160, "500g": 300, "1kg": 560 },
  }),
  item({
    slug: "dried-cranberries",
    name: "Dried Cranberries",
    category: "dry-fruits",
    group: "Raisins & Berries",
    origin: "Imported",
    short: "Ruby cranberries with a tart-sweet snap.",
    description:
      "Dried cranberries that keep a little tartness under the sweetness. A modern addition to mixes, baking and cheese boards.",
    highlights: ["Ruby colour", "Tart-sweet balance", "Lovely in mixes and baking"],
    storage: storage.dry,
    image: "/images/dried-cranberries.jpg",
    featured: 15,
    prices: { "100g": 140, "250g": 320, "500g": 600, "1kg": 1120 },
  }),
  item({
    slug: "dried-figs",
    name: "Dried Figs",
    category: "dry-fruits",
    group: "Dates & Figs",
    origin: "Turkey",
    short: "Whole dried figs with a soft, jammy centre.",
    description:
      "Whole Turkish figs, dusky on the outside and soft within. A quieter companion to anjeer, wonderful with walnuts or on a festive platter.",
    highlights: ["Whole fruit", "Soft, jammy centre", "Pairs beautifully with walnuts"],
    storage: storage.dry,
    image: "/images/dried-figs.jpg",
    featured: 16,
    prices: { "100g": 170, "250g": 390, "500g": 740, "1kg": 1380 },
  }),
  item({
    slug: "pumpkin-seeds",
    name: "Pumpkin Seeds",
    category: "dry-fruits",
    group: "Seeds",
    origin: "India",
    short: "Green pepitas with a clean, nutty crunch.",
    description:
      "Hulled pumpkin seeds in a fresh green tone, ready for snacking or scattering over breakfast. Light, tidy and quietly moreish.",
    highlights: ["Hulled green pepitas", "Clean nutty crunch", "Easy everyday handful"],
    storage: storage.dry,
    image: "/images/pumpkin-seeds.jpg",
    featured: 17,
    prices: { "100g": 90, "250g": 200, "500g": 370, "1kg": 690 },
  }),
  item({
    slug: "sunflower-seeds",
    name: "Sunflower Seeds",
    category: "dry-fruits",
    group: "Seeds",
    origin: "India",
    short: "Mild hulled seeds for snacking and sprinkling.",
    description:
      "Hulled sunflower seeds with a gentle flavour that never overpowers a mix. Useful in the kitchen, pleasant by the handful.",
    highlights: ["Hulled kernels", "Mild flavour", "Good in mixes and baking"],
    storage: storage.dry,
    image: "/images/sunflower-seeds.jpg",
    featured: 18,
    prices: { "100g": 60, "250g": 140, "500g": 250, "1kg": 460 },
  }),
  item({
    slug: "chia-seeds",
    name: "Chia Seeds",
    category: "dry-fruits",
    group: "Seeds",
    origin: "Imported",
    short: "Tiny speckled seeds for puddings, drinks and breakfasts.",
    description:
      "Chia seeds with the familiar speckled look and a neutral taste that disappears into yoghurt, milk or overnight bowls.",
    highlights: ["Speckled black and grey seeds", "Neutral flavour", "Made for breakfast bowls"],
    storage: storage.dry,
    image: "/images/chia-seeds.jpg",
    featured: 19,
    prices: { "100g": 80, "250g": 180, "500g": 330, "1kg": 610 },
  }),
  item({
    slug: "makhana",
    name: "Makhana",
    category: "dry-fruits",
    group: "Seeds",
    origin: "Bihar",
    short: "Light fox nuts, airy and quietly roasted in character.",
    description:
      "Phool makhana from the lotus seed, pale and crisp. A very Indian nibble that feels light even when the bowl keeps getting refilled.",
    highlights: ["Lotus seed pops", "Light and airy", "A beloved Indian nibble"],
    storage: storage.dry,
    image: "/images/makhana.jpg",
    bestseller: true,
    featured: 20,
    prices: { "100g": 120, "250g": 280, "500g": 520, "1kg": 980 },
  }),
  item({
    slug: "sea-salt-dark",
    name: "Sea Salt Dark 70%",
    category: "chocolates",
    group: "Dark",
    origin: "Bean to bar style",
    short: "A clean 70% dark bar finished with a little sea salt.",
    description:
      "Deep cocoa, a dry snap, and just enough salt to keep the next square inevitable. For people who like chocolate to taste of chocolate.",
    highlights: ["70% cocoa", "Clean snap", "A pinch of sea salt"],
    storage: storage.chocolate,
    image: "/images/dark-chocolate.jpg",
    bestseller: true,
    featured: 1,
    prices: { "100g": 240, "250g": 560, "500g": 1040 },
  }),
  item({
    slug: "almond-milk-chocolate",
    name: "Almond Milk Chocolate",
    category: "chocolates",
    group: "Milk",
    origin: "House recipe",
    short: "Creamy milk chocolate studded with whole almonds.",
    description:
      "A softer, creamier bar with almonds you can actually see. Sweet enough for gifting, restrained enough to eat slowly.",
    highlights: ["Creamy milk chocolate", "Whole almonds", "An easy gift"],
    storage: storage.chocolate,
    image: "/images/milk-almond-chocolate.jpg",
    bestseller: true,
    featured: 2,
    prices: { "100g": 220, "250g": 510, "500g": 960 },
  }),
  item({
    slug: "hazelnut-praline",
    name: "Hazelnut Praline",
    category: "chocolates",
    group: "Milk",
    origin: "House recipe",
    short: "Glossy pralines with a toasted hazelnut heart.",
    description:
      "Round chocolates with a smooth praline centre and a whole hazelnut waiting inside. A small box goes a long way after dinner.",
    highlights: ["Toasted hazelnut centre", "Smooth praline", "Lovely after dinner"],
    storage: storage.chocolate,
    image: "/images/hazelnut-praline.jpg",
    featured: 3,
    prices: { "100g": 320, "250g": 740, "500g": 1380 },
  }),
  item({
    slug: "rose-pistachio-chocolate",
    name: "Rose Pistachio Chocolate",
    category: "chocolates",
    group: "Milk",
    origin: "House recipe",
    short: "Pale chocolate with pistachio and a whisper of rose.",
    description:
      "A floral, nutty piece that feels festive without being heavy. Pistachio for crunch, rose for perfume, chocolate to hold it together.",
    highlights: ["Pistachio crunch", "Soft rose note", "Festive but light"],
    storage: storage.chocolate,
    image: "/images/pistachio-chocolate.jpg",
    featured: 4,
    prices: { "100g": 340, "250g": 790, "500g": 1480 },
  }),
  item({
    slug: "assorted-truffles",
    name: "Assorted Truffle Box",
    category: "chocolates",
    group: "Assorted",
    origin: "House selection",
    short: "A small box of dark and milk truffles, ready to gift.",
    description:
      "An assortment of truffles in a cream box — some darker, some softer, all meant to be shared. Ask us if you need a note tucked in.",
    highlights: ["Dark and milk mix", "Gift-ready box", "Easy to personalise on request"],
    storage: storage.chocolate,
    image: "/images/truffle-box.jpg",
    bestseller: true,
    featured: 5,
    prices: { "250g": 890, "500g": 1680 },
  }),
  item({
    slug: "cocoa-nib-bark",
    name: "Cocoa Nib Bark",
    category: "chocolates",
    group: "Dark",
    origin: "House recipe",
    short: "Dark chocolate shards with cocoa nibs and almond.",
    description:
      "Broken bark with a rustic edge and a serious cocoa flavour. Nibs add bitterness, almond adds crunch, and the bar stays grown-up.",
    highlights: ["Dark chocolate bark", "Cocoa nib crunch", "A less sweet square"],
    storage: storage.chocolate,
    image: "/images/cocoa-bark.jpg",
    featured: 6,
    prices: { "100g": 260, "250g": 600, "500g": 1120 },
  }),
  item({
    slug: "arabica-filter-coffee",
    name: "Arabica Filter Coffee",
    category: "coffee-tea",
    group: "Coffee",
    origin: "Chikmagalur",
    short: "Medium-roast arabica with cocoa and a soft citrus finish.",
    description:
      "Whole arabica beans roasted for filter and pour-over. Expect cocoa, a little sweetness, and a clean cup that does not shout.",
    highlights: ["Whole arabica beans", "Medium roast", "Cocoa and soft citrus"],
    storage: storage.brew,
    image: "/images/arabica-coffee.jpg",
    featured: 1,
    prices: { "100g": 180, "250g": 420, "500g": 780, "1kg": 1460 },
  }),
  item({
    slug: "south-indian-filter-coffee",
    name: "South Indian Filter Coffee",
    category: "coffee-tea",
    group: "Coffee",
    origin: "Coorg & chicory blend",
    short: "A dark, aromatic blend for the traditional filter.",
    description:
      "Dark roasted coffee with a measured touch of chicory, made for the South Indian filter and a tumbler of hot milk. Bold, familiar, comforting.",
    highlights: ["Dark roast", "Traditional filter style", "Aromatic with chicory"],
    storage: storage.brew,
    image: "/images/filter-coffee.jpg",
    bestseller: true,
    featured: 2,
    prices: { "100g": 150, "250g": 340, "500g": 640, "1kg": 1180 },
  }),
  item({
    slug: "cold-brew-blend",
    name: "Velvet Cold Brew Blend",
    category: "coffee-tea",
    group: "Coffee",
    origin: "Indian arabica",
    short: "A coarser grind that stays smooth over ice.",
    description:
      "Ground for a long steep and a chocolatey, low-acid cup. Steep overnight, pour over ice, and keep the afternoon unhurried.",
    highlights: ["Cold-brew grind", "Smooth and chocolatey", "Made for slow steeping"],
    storage: storage.brew,
    image: "/images/cold-brew.jpg",
    featured: 3,
    prices: { "100g": 190, "250g": 440, "500g": 820, "1kg": 1540 },
  }),
  item({
    slug: "darjeeling-first-flush",
    name: "Darjeeling First Flush",
    category: "coffee-tea",
    group: "Tea",
    origin: "Darjeeling",
    short: "A light, floral black tea with a muscatel lift.",
    description:
      "First-flush leaves that brew pale and fragrant. Best taken plain, in a thin cup, when you actually have a moment.",
    highlights: ["First flush leaves", "Floral and light", "Best without milk"],
    storage: storage.brew,
    image: "/images/darjeeling-tea.jpg",
    bestseller: true,
    featured: 4,
    prices: { "100g": 280, "250g": 660, "500g": 1240 },
  }),
  item({
    slug: "assam-golden-tips",
    name: "Assam Golden Tips",
    category: "coffee-tea",
    group: "Tea",
    origin: "Assam",
    short: "Malty Assam leaves with bright golden tips.",
    description:
      "A full-bodied Assam that stands up to milk and a quiet morning. Coppery liquor, malt sweetness, and a very reliable second cup.",
    highlights: ["Golden tips", "Malty and full", "Excellent with milk"],
    storage: storage.brew,
    image: "/images/assam-tea.jpg",
    featured: 5,
    prices: { "100g": 160, "250g": 370, "500g": 690, "1kg": 1280 },
  }),
  item({
    slug: "kashmiri-kahwa",
    name: "Kashmiri Kahwa",
    category: "coffee-tea",
    group: "Tea",
    origin: "Kashmir",
    short: "Saffron, cardamom, cinnamon and almond over green tea.",
    description:
      "A fragrant kahwa blend for slow evenings and guests who stay. Saffron threads, whole spices and a few almonds in every scoop.",
    highlights: ["Saffron and whole spices", "Almond pieces", "A ceremonial cup"],
    storage: storage.brew,
    image: "/images/kahwa.jpg",
    bestseller: true,
    featured: 6,
    prices: { "100g": 240, "250g": 560, "500g": 1040 },
  }),
  item({
    slug: "house-masala-chai",
    name: "House Masala Chai",
    category: "coffee-tea",
    group: "Tea",
    origin: "House blend",
    short: "Black tea with cardamom, cinnamon, clove and ginger.",
    description:
      "Our everyday masala, balanced so the spice perfumes the cup without turning it dusty. Brew strong, add milk, pour generously.",
    highlights: ["Whole spice blend", "Ginger warmth", "Made for milk chai"],
    storage: storage.brew,
    image: "/images/masala-chai.jpg",
    featured: 7,
    prices: { "100g": 120, "250g": 270, "500g": 490, "1kg": 920 },
  }),
  item({
    slug: "himalayan-green-tea",
    name: "Himalayan Green Tea",
    category: "coffee-tea",
    group: "Tea",
    origin: "Himachal",
    short: "Fresh green leaves with a grassy, clean finish.",
    description:
      "A straightforward green tea with a spring-leaf aroma. Steep it gently and it stays sweet rather than sharp.",
    highlights: ["Whole green leaves", "Grassy and clean", "Gentle if you do not oversteep"],
    storage: storage.brew,
    image: "/images/green-tea.jpg",
    featured: 8,
    prices: { "100g": 140, "250g": 320, "500g": 590, "1kg": 1080 },
  }),
  item({
    slug: "celebration-dry-fruit-box",
    name: "Celebration Dry Fruit Box",
    category: "gifts",
    group: "Hampers",
    origin: "Subhadra selection",
    short: "Almonds, cashews, pistachios and dates in a cream box.",
    description:
      "A ready hamper of the nuts and dates people actually finish. Tell us the occasion on WhatsApp and we will help you choose the size.",
    highlights: ["Four-part dry fruit selection", "Gift-ready presentation", "Sizes confirmed on WhatsApp"],
    storage: storage.gift,
    image: "/images/gift-celebration.jpg",
    bestseller: true,
    featured: 1,
    prices: { "500g": 1450, "1kg": 2680 },
  }),
  item({
    slug: "chocolate-nut-hamper",
    name: "Chocolate & Nut Hamper",
    category: "gifts",
    group: "Hampers",
    origin: "Subhadra selection",
    short: "Dark chocolate with cashews and almonds, packed to share.",
    description:
      "For the person who wants both the nut bowl and something sweeter. A balanced hamper that feels generous without being fussy.",
    highlights: ["Chocolate and nuts together", "Made for sharing", "A polished festive gift"],
    storage: storage.gift,
    image: "/images/gift-chocolate.jpg",
    featured: 2,
    prices: { "500g": 1680, "1kg": 3120 },
  }),
  item({
    slug: "morning-ritual-box",
    name: "Morning Ritual Box",
    category: "gifts",
    group: "Hampers",
    origin: "Subhadra selection",
    short: "Coffee, tea and a few fine nuts for unhurried mornings.",
    description:
      "A small ritual in a box: beans or a favourite tea, plus almonds and pistachios. Ask us to swap the brew if you know their cup.",
    highlights: ["Coffee and tea pairing", "A handful of fine nuts", "Easy to personalise"],
    storage: storage.gift,
    image: "/images/gift-ritual.jpg",
    featured: 3,
    prices: { "500g": 1520, "1kg": 2860 },
  }),
  item({
    slug: "diwali-celebration-box",
    name: "Diwali Celebration Box",
    category: "bundles",
    group: "Diwali",
    origin: "Subhadra selection",
    short: "Dry fruits, chocolates, tea and a surprise gift for the festival of lights.",
    description:
      "A celebration box arranged for Diwali visits and family tables. The mix is generous, giftable, and easy to send as one inquiry.",
    highlights: ["Festival-ready hamper", "One box counts as one inquiry item", "Surprise gift included"],
    includes: ["California Almonds", "Premium Cashews", "Iranian Pistachios", "Premium Chocolates", "Special Tea", "Surprise Gift"],
    festival: "Diwali",
    giftItems: ["Festive Diya & Brass Token"],
    storage: storage.gift,
    image: "/images/diwali-box.jpg",
    bestseller: true,
    featured: 1,
    prices: { "500g": 1890, "1kg": 3490 },
  }),
  item({
    slug: "raksha-bandhan-box",
    name: "Raksha Bandhan Box",
    category: "bundles",
    group: "Raksha Bandhan",
    origin: "Subhadra selection",
    short: "Premium dry fruits, chocolates and a special surprise for the sibling you mean it for.",
    description:
      "A warm box for Raksha Bandhan. Nuts and chocolate do the talking, and a small surprise finishes the gesture.",
    highlights: ["Made for gifting", "Dry fruits and chocolate", "Special surprise included"],
    includes: ["Premium Almonds", "Premium Cashews", "Premium Chocolates", "Special Surprise"],
    festival: "Raksha Bandhan",
    giftItems: ["Handmade Rakhis & Roli Chawal"],
    storage: storage.gift,
    image: "/images/raksha-box.jpg",
    featured: 2,
    prices: { "500g": 1690, "1kg": 3190 },
  }),
  item({
    slug: "wedding-celebration-box",
    name: "Wedding Celebration Box",
    category: "bundles",
    group: "Wedding",
    origin: "Subhadra selection",
    short: "Premium dry fruits, chocolates and coffee or tea for a wedding celebration.",
    description:
      "A polished box for weddings and the dinners around them. Ask us in the note if you need several boxes in the same style.",
    highlights: ["Wedding gifting", "Dry fruits, chocolate and a brew", "Easy to order in multiples"],
    includes: ["Premium Dry Fruits", "Premium Chocolates", "Coffee or Tea"],
    festival: "Wedding",
    giftItems: ["Golden Keepsake Box & Wedding Card"],
    storage: storage.gift,
    image: "/images/wedding-box.jpg",
    featured: 3,
    prices: { "500g": 2490, "1kg": 4690 },
  }),
  item({
    slug: "corporate-gift-box",
    name: "Corporate Gift Box",
    category: "bundles",
    group: "Corporate Gifting",
    origin: "Subhadra selection",
    short: "Premium dry fruits, chocolates, coffee and an elegant presentation.",
    description:
      "A restrained corporate hamper that still feels generous. Share the quantity you need and we will confirm packing on WhatsApp.",
    highlights: ["Office and client gifting", "Elegant presentation", "Quantity confirmed on WhatsApp"],
    includes: ["Premium Dry Fruits", "Premium Chocolates", "Coffee", "Elegant Gift Finish"],
    festival: "Corporate Gifting",
    giftItems: ["Corporate Ribbon & Custom Card"],
    storage: storage.gift,
    image: "/images/corporate-box.jpg",
    featured: 4,
    prices: { "500g": 2190, "1kg": 3990 },
  }),
  item({
    slug: "festive-family-box",
    name: "Festive Family Box",
    category: "bundles",
    group: "Festive",
    origin: "Subhadra selection",
    short: "Mixed dry fruits, chocolates, tea and a surprise gift for the whole table.",
    description:
      "A family-sized festive box when the occasion is happy but not tied to one festival. Useful all year, especially when guests are expected.",
    highlights: ["For the family table", "Mixed dry fruits and tea", "Surprise gift included"],
    includes: ["Mixed Dry Fruits", "Premium Chocolates", "Special Tea", "Surprise Gift"],
    festival: "Festive",
    giftItems: ["Festive Table Keepsake"],
    storage: storage.gift,
    image: "/images/festive-family-box.jpg",
    featured: 5,
    prices: { "500g": 1990, "1kg": 3690 },
  }),
  item({
    slug: "premium-celebration-box",
    name: "Premium Celebration Box",
    category: "bundles",
    group: "Festive",
    origin: "Subhadra selection",
    short: "Luxury dry fruits, chocolates, coffee, tea and a surprise gift.",
    description:
      "The fullest box in the house. Dry fruits, chocolate and both a coffee and a tea, finished with a surprise for the person who notices details.",
    highlights: ["Our fullest hamper", "Coffee and tea together", "Surprise gift included"],
    includes: ["Luxury Dry Fruits", "Premium Chocolates", "Coffee", "Tea", "Surprise Gift"],
    storage: storage.gift,
    image: "/images/premium-celebration-box.jpg",
    bestseller: true,
    featured: 6,
    prices: { "500g": 2890, "1kg": 5290 },
  }),
  item({
    slug: "birthday-celebration-box",
    name: "Birthday Celebration Box",
    category: "bundles",
    group: "Birthday",
    origin: "Subhadra selection",
    short: "Dry fruits, chocolates and a small surprise for a birthday worth marking.",
    description:
      "A birthday box that feels considered rather than loud. Add a note with their name and we will keep the packing personal.",
    highlights: ["Birthday gifting", "Dry fruits and chocolate", "Room for a personal note"],
    includes: ["Premium Dry Fruits", "Premium Chocolates", "Surprise Gift"],
    festival: "Birthday",
    giftItems: ["Surprise Birthday Keepsake"],
    storage: storage.gift,
    image: "/images/birthday-box.jpg",
    featured: 7,
    prices: { "500g": 1790, "1kg": 3290 },
  }),
  item({
    slug: "anniversary-celebration-box",
    name: "Anniversary Celebration Box",
    category: "bundles",
    group: "Anniversary",
    origin: "Subhadra selection",
    short: "Handcrafted dry fruits, artisanal chocolates, and an aromatic tea blend for milestone moments.",
    description:
      "Curated to honour cherished milestones and golden anniversaries. Combines rich California almonds, creamy cashews, luxury pralines and aromatic Darjeeling tea in a signature festive box.",
    highlights: ["Anniversary milestone gifting", "Artisanal dry fruit & praline pairing", "Signature luxury keepsake box"],
    includes: ["California Almonds", "Premium Cashews", "Luxury Pralines", "Aromatic Darjeeling Tea", "Anniversary Blessing Note"],
    festival: "Anniversary",
    giftItems: ["Celebration Keepsake"],
    storage: storage.gift,
    image: "/images/wedding-box.jpg",
    featured: 8,
    prices: { "500g": 2350, "1kg": 4390 },
  }),
  item({
    slug: "custom-celebration-box",
    name: "Custom Celebration Box",
    category: "bundles",
    group: "Custom Gift Boxes",
    origin: "Subhadra selection",
    short: "Your bespoke choice of dry fruits, chocolates, coffees and teas tailored for your occasion.",
    description:
      "Tell us your theme, guest count, and favourite flavours. We thoughtfully assemble your bespoke box with customised assortments, ribbon presentation and personalized greeting cards.",
    highlights: ["Tailored to your preferences", "Corporate & family events", "Flexible sizes & configurations"],
    includes: ["Custom Dry Fruits Assortment", "Artisanal Chocolates", "Choice of Brew", "Personalized Message Card"],
    festival: "Custom Gift Boxes",
    giftItems: ["Custom Ribbon & Presentation Card"],
    storage: storage.gift,
    image: "/images/gift-celebration.jpg",
    featured: 9,
    prices: { "500g": 1950, "1kg": 3650 },
  }),
];

export const collections: Record<CollectionId, Collection> = {
  "dry-fruits": {
    id: "dry-fruits",
    nav: "Dry Fruits",
    eyebrow: "Nature's Finest",
    title: "Premium Dry Fruits, Picked for Every Occasion.",
    description:
      "Almonds, cashews, pistachios, dates, figs, raisins and seeds — chosen for flavour, texture and the way they look on a table.",
    metaTitle: "Premium Dry Fruits",
    accent: "almond",
    groups: ["Nuts", "Dates & Figs", "Raisins & Berries", "Seeds", "Mixes"],
  },
  chocolates: {
    id: "chocolates",
    nav: "Chocolates",
    eyebrow: "A Little More Indulgence",
    title: "Chocolate Made for Sweet Moments.",
    description:
      "Dark bars, creamy milk, pralines and gift boxes with a quieter kind of richness. Sweet, but never careless.",
    metaTitle: "Premium Chocolates",
    accent: "cocoa",
    groups: ["Dark", "Milk", "Assorted"],
  },
  "coffee-tea": {
    id: "coffee-tea",
    nav: "Coffee & Tea",
    eyebrow: "Slow Down & Sip",
    title: "Beautiful Brews for Better Moments.",
    description:
      "Indian coffees and teas for the filter, the kettle and the long afternoon. Freshness matters, so tell us when you need it.",
    metaTitle: "Coffee & Tea",
    accent: "caramel",
    groups: ["Coffee", "Tea"],
  },
  "best-sellers": {
    id: "best-sellers",
    nav: "Best Sellers",
    eyebrow: "Loved Again & Again",
    title: "The Products Everyone Keeps Coming Back For.",
    description:
      "The jars, bars and blends people reorder. If you are new here, this is the most delicious place to begin.",
    metaTitle: "Best Sellers",
    accent: "gold",
    groups: ["Nuts", "Dates & Figs", "Seeds", "Mixes", "Dark", "Milk", "Assorted", "Coffee", "Tea", "Hampers", "Diwali", "Wedding", "Corporate", "Festive"],
  },
  gifts: {
    id: "gifts",
    nav: "Gifts",
    eyebrow: "Wrapped with Care",
    title: "Make Every Moment a Little More Special.",
    description:
      "Ready hampers of dry fruits, chocolate, coffee and tea. For something more personal, send us a WhatsApp note and we will build it with you.",
    metaTitle: "Gift Collection",
    accent: "gold",
    groups: ["Hampers"],
  },
  bundles: {
    id: "bundles",
    nav: "Celebration Boxes",
    eyebrow: "MADE FOR MOMENTS THAT MATTER",
    title: "Celebrate With a Box They'll Remember.",
    description:
      "Bring together premium dry fruits, chocolates, coffee, tea and thoughtful surprises in beautifully curated celebration boxes.",
    metaTitle: "Celebration Boxes & Festive Bundles",
    accent: "gold",
    groups: [
      "Diwali",
      "Raksha Bandhan",
      "Wedding",
      "Birthday",
      "Anniversary",
      "Corporate Gifting",
      "Festive",
      "Custom Gift Boxes",
    ],
  },
};

const accentClass: Record<Accent, string> = {
  almond: "text-almond",
  cocoa: "text-cocoa",
  caramel: "text-caramel",
  leaf: "text-leaf",
  gold: "text-gold",
};

export function accentText(accent: Accent) {
  return accentClass[accent];
}

export function isCollectionId(value: string): value is CollectionId {
  return value in collections;
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function weightsOf(product: Product): Weight[] {
  return WEIGHTS.filter((weight) => product.prices[weight] != null);
}

export function defaultWeight(product: Product): Weight {
  const weights = weightsOf(product);
  if (weights.includes("250g")) return "250g";
  return weights[0];
}

export function priceFor(product: Product, weight: string) {
  const value = product.prices[weight as Weight];
  if (value == null) return product.prices[defaultWeight(product)] ?? 0;
  return value;
}

export function lowestPrice(product: Product) {
  return Math.min(...weightsOf(product).map((weight) => product.prices[weight] ?? 0));
}

export function productPath(product: Product) {
  return `/${product.category}/${product.slug}`;
}

export function productsFor(id: CollectionId) {
  const list = id === "best-sellers" ? products.filter((product) => product.bestseller) : products.filter((product) => product.category === id);
  return list.slice().sort((a, b) => a.featured - b.featured);
}

export function relatedProducts(product: Product, count = 4) {
  const sameGroup = products.filter(
    (item) => item.slug !== product.slug && item.category === product.category && item.group === product.group,
  );
  const sameCategory = products.filter(
    (item) => item.slug !== product.slug && item.category === product.category && item.group !== product.group,
  );
  return [...sameGroup, ...sameCategory].slice(0, count);
}

export function searchProducts(query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  return products.filter((product) => {
    const haystack = [
      product.name,
      product.short,
      product.description,
      product.group,
      product.origin,
      product.category,
      product.includes.join(" "),
      collections[product.category].nav,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}
