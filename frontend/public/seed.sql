-- ═══════════════════════════════════════════════════════════════
-- AYURVED LIFE - Product Seed (14 Products with Real Images)
-- Run in: Supabase Dashboard -> SQL Editor
-- ═══════════════════════════════════════════════════════════════

DELETE FROM public.products;

INSERT INTO public.products (name, description, price, original_price, badge, image_url, category, in_stock) VALUES
  ('Pathrii Mukti',    'Helps break down kidney stones naturally. Supports smooth urine flow and reduces burning sensation. Aids in flushing out toxins from kidneys. 60 Capsules - Dietary Supplement.',    979,  1399, 'Best Seller', '/images/pathrii-mukti.jpg',    'kidney',           true),
  ('Ear Veda',         'Helps Relieve Ear Pain Naturally. Reduces Ear Discharge and Inflammation. Supports Better Hearing and Ear Health. 60 Capsules - Dietary Supplement.',                            1119, 1599, 'New',         '/images/ear-veda.jpg',         'ear health',       true),
  ('Brain Booster',    'Useful for Brain Health, Memory and Focus. Powered by Brahmi, Ashwagandha and Shankhpushpi. Enhances concentration and cognitive clarity.',                                      799,  1599, 'Sale',        '/images/brain-booster.jpg',    'brain',            true),
  ('Hair Growth',      'Reduces Hair Fall. Strengthens Hair Roots. Promotes Hair Regrowth. Improves Scalp Health. Nourishes Hair from within. 100% Herbal, Ayurvedic Formula, No Chemicals.',           1049, 1499, 'Popular',     '/images/hair-growth.jpg',      'hair',             true),
  ('Pathri Mukti (Hindi)', 'Pathri ko todkar bahar nikale. Dard aur jalan mein aram de. Kidney ki sehat ka khayal rakhe. Pathri ko dobara banne se roke. 100% Ayurvedic Formula.',                     979,  1399, 'Best Seller', '/images/pathri-mukti-hindi.jpg','kidney',           true),
  ('Sugar Control',    'Supports Healthy Blood Sugar Levels. Formulated with Karela, Jamun and Methi. 60 Vegetarian Capsules - 100% Natural, No Side Effects.',                                        1119, 1599, 'New',         '/images/sugar-control.jpg',    'diabetes',         true),
  ('Kidney Stone',     'Dissolves Kidney Stones. Reduces Pain and Discomfort. Supports Kidney Health. Prevents Stone Formation. Varuna 200mg, Golshura 160mg, Pashanbhed 150mg. 100% Herbal.',         979,  1399, 'Best Seller', '/images/kidney-stone.jpg',     'kidney',           true),
  ('BP Mukti',         'Supports Healthy Blood Pressure Levels. Powerful herbs for cardiovascular wellness. 122 Veggie Capsules - Vegan, 100% Herbal, No Chemicals. Ayurvedic Formula.',               1119, 1599, 'Popular',     '/images/bp-mukti.jpg',         'blood pressure',   true),
  ('Weight Loss',      'Boosts Metabolism. Suppresses Appetite. Burns Fat Naturally. Promotes Healthy Weight. 100% Herbal, Ayurvedic Formula, No Chemicals. Dietary Supplement.',                       799,  1599, 'Sale',        '/images/weight-loss.jpg',      'weight management',true),
  ('Liver Care',       'Supports Liver Health & Detoxification. 60 Vegetarian Capsules. Powerful Ayurvedic formula for optimal liver function.',                                                      1119, 1599, 'New',         '/images/liver-care.jpg',       'liver',            true),
  ('Joint Pain',       'Reduces Joint Pain. Supports Joint Flexibility. Soothes Inflammation. Promotes Joint Strength. Helps Lubricate Joints. 100% Herbal.',                                          1049, 1499, 'Popular',     '/images/joint-pain.jpg',       'joints',           true),
  ('Heart Care',       'Supports Heart Health. Helps Cholesterol Levels. Promotes Healthy Antioxidant Heart Support. 100% Herbal, Ayurvedic Formula, No Chemicals.',                                  1119, 1599, 'Best Seller', '/images/heart-care.jpg',       'heart',            true),
  ('Mirgi Mukth',      'Ayurvedic Solution for Seizure Control, Epilepsy Support, and Brain Health. 100% Herbal formulation.',                                                                        1119, 1599, 'New',         '/images/mirgi-mukth.jpg',      'brain',            true),
  ('Ear Wellness',     'Ayurvedic Solution for Cleansing, Itching, and Wax Removal. Supports overall ear health organically.',                                                                         979,  1399, 'Popular',     '/images/ear-wellness.jpg',     'ear health',       true);

SELECT name, price, original_price, badge, category FROM public.products ORDER BY created_at;
