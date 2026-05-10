const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://ksjgsvtrfbhlgrvxrahu.supabase.co",
  "sb_publishable_psrC_0AljrrXBKOYg3gHRA_qmGkIeY9"
);

const products = [
  {
    name: "Pathrii Mukti",
    description: "Helps break down kidney stones naturally. Supports smooth urine flow and reduces burning sensation. Aids in flushing out toxins from kidneys. 60 Capsules - Dietary Supplement.",
    price: 979,
    original_price: 1399,
    badge: "Best Seller",
    image_url: "/images/pathrii-mukti.jpg",
    category: "kidney",
    in_stock: true,
  },
  {
    name: "Ear Veda",
    description: "Helps Relieve Ear Pain Naturally. Reduces Ear Discharge and Inflammation. Supports Better Hearing and Ear Health. 60 Capsules - Dietary Supplement.",
    price: 1119,
    original_price: 1599,
    badge: "New",
    image_url: "/images/ear-veda.jpg",
    category: "ear health",
    in_stock: true,
  },
  {
    name: "Brain Booster",
    description: "Useful for Brain Health, Memory and Focus. Powered by traditional Ayurvedic herbs including Brahmi, Ashwagandha and Shankhpushpi. Enhances concentration and cognitive clarity.",
    price: 799,
    original_price: 1599,
    badge: "Sale",
    image_url: "/images/brain-booster.jpg",
    category: "brain",
    in_stock: true,
  },
  {
    name: "Hair Growth",
    description: "Reduces Hair Fall. Strengthens Hair Roots. Promotes Hair Regrowth. Improves Scalp Health. Nourishes Hair from within. 100% Herbal, Ayurvedic Formula, No Chemicals - Dietary Supplement.",
    price: 1049,
    original_price: 1499,
    badge: "Popular",
    image_url: "/images/hair-growth.jpg",
    category: "hair",
    in_stock: true,
  },
  {
    name: "Pathri Mukti",
    description: "Pathri ko todkar bahar nikale. Dard aur jalan mein aram de. Kidney ki sehat ka khayal rakhe. Pathri ko dobara banne se roke. 100% Ayurvedic Formula.",
    price: 979,
    original_price: 1399,
    badge: "Best Seller",
    image_url: "/images/pathri-mukti-hindi.jpg",
    category: "kidney",
    in_stock: true,
  },
  {
    name: "Sugar Control",
    description: "Supports Healthy Blood Sugar Levels. Formulated with powerful Ayurvedic herbs like Karela, Jamun and Methi. 60 Vegetarian Capsules - 100% Natural, No Side Effects.",
    price: 1119,
    original_price: 1599,
    badge: "New",
    image_url: "/images/sugar-control.jpg",
    category: "diabetes",
    in_stock: true,
  },
  {
    name: "Kidney Stone",
    description: "Dissolves Kidney Stones. Reduces Pain and Discomfort. Supports Kidney Health. Prevents Stone Formation. Key ingredients: Varuna 200mg, Golshura 160mg, Pashanbhed 150mg. 100% Herbal.",
    price: 979,
    original_price: 1399,
    badge: "Best Seller",
    image_url: "/images/kidney-stone.jpg",
    category: "kidney",
    in_stock: true,
  },
  {
    name: "BP Mukti",
    description: "Supports Healthy Blood Pressure Levels. Formulated with powerful herbs for cardiovascular wellness. 122 Veggie Capsules - Vegan, 100% Herbal, No Chemicals. Ayurvedic Formula.",
    price: 1119,
    original_price: 1599,
    badge: "Popular",
    image_url: "/images/bp-mukti.jpg",
    category: "blood pressure",
    in_stock: true,
  },
  {
    name: "Weight Loss",
    description: "Boosts Metabolism. Suppresses Appetite. Burns Fat Naturally. Promotes Healthy Weight. 100% Herbal, Ayurvedic Formula, No Chemicals. Dietary Supplement.",
    price: 799,
    original_price: 1599,
    badge: "Sale",
    image_url: "/images/weight-loss.jpg",
    category: "weight management",
    in_stock: true,
  },
];

async function seed() {
  console.log("Starting Ayurved Life product seed...");

  const { error: delError } = await supabase
    .from("products")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (delError) {
    console.log("Delete note:", delError.message);
  } else {
    console.log("Cleared existing products");
  }

  let success = 0;
  for (const p of products) {
    const { data, error } = await supabase.from("products").insert(p).select();
    if (error) {
      console.error("Error inserting " + p.name + ":", error.message);
    } else {
      const disc = Math.round(((p.original_price - p.price) / p.original_price) * 100);
      console.log("OK: " + p.name + " - Rs." + p.price + " (" + disc + "% off Rs." + p.original_price + ") ID: " + data[0].id);
      success++;
    }
  }

  console.log("Seeding complete! " + success + "/" + products.length + " products inserted.");
}

seed().catch(console.error);
