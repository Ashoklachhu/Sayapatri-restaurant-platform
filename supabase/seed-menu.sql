-- ============================================================
-- SEED MENU ITEMS
-- Run this in Supabase SQL Editor AFTER schema.sql has been run
-- This uses the category names to find the correct category UUIDs
-- ============================================================

do $$
declare
  cat_starters    uuid;
  cat_dal_bhat    uuid;
  cat_momos       uuid;
  cat_curries     uuid;
  cat_grills      uuid;
  cat_breads      uuid;
  cat_drinks      uuid;
  cat_desserts    uuid;
begin
  -- Get category IDs by name
  select id into cat_starters  from menu_categories where name = 'Starters'        limit 1;
  select id into cat_dal_bhat  from menu_categories where name = 'Dal Bhat Sets'   limit 1;
  select id into cat_momos     from menu_categories where name = 'Momos'           limit 1;
  select id into cat_curries   from menu_categories where name = 'Curries'         limit 1;
  select id into cat_grills    from menu_categories where name = 'Grills & Tandoor' limit 1;
  select id into cat_breads    from menu_categories where name = 'Breads'          limit 1;
  select id into cat_drinks    from menu_categories where name = 'Drinks'          limit 1;
  select id into cat_desserts  from menu_categories where name = 'Desserts'        limit 1;

  -- ============================================================
  -- MOMOS
  -- ============================================================
  insert into menu_items (category_id, name, name_ne, description, price_aed, image_url, is_vegetarian, is_vegan, is_spicy, spice_level, is_featured, is_available, prep_time_minutes, sort_order)
  values
    (cat_momos, 'Chicken Momo (10 pcs)', 'चिकन मोमो', 'Steamed dumplings with spiced chicken, served with tomato achar', 35, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80', false, false, true, 2, true, true, 20, 1),
    (cat_momos, 'Veg Momo (10 pcs)', 'भेज मोमो', 'Steamed dumplings filled with seasoned vegetables and cheese', 28, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80', true, false, false, null, false, true, 20, 2),
    (cat_momos, 'Buff Momo (10 pcs)', 'बफ मोमो', 'Traditional water buffalo momo, a Nepali classic', 38, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80', false, false, true, 1, false, true, 20, 3),
    (cat_momos, 'Jhol Momo (10 pcs)', 'झोल मोमो', 'Steamed momos served in a spicy sesame-tomato broth', 40, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80', false, false, true, 2, false, true, 25, 4),
    (cat_momos, 'Fried Momo (10 pcs)', 'फ्राइड मोमो', 'Crispy pan-fried momos with a golden crust', 38, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80', false, false, false, null, false, true, 25, 5);

  -- ============================================================
  -- DAL BHAT SETS
  -- ============================================================
  insert into menu_items (category_id, name, name_ne, description, price_aed, image_url, is_vegetarian, is_vegan, is_spicy, spice_level, is_featured, is_available, prep_time_minutes, sort_order)
  values
    (cat_dal_bhat, 'Dal Bhat (Full Set)', 'दाल भात', 'Lentil soup, steamed rice, seasonal vegetables, pickle & papad. Unlimited refills!', 55, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', true, true, false, null, true, true, 15, 1),
    (cat_dal_bhat, 'Non-Veg Dal Bhat', 'मासु दाल भात', 'Dal Bhat set with choice of chicken or mutton curry', 70, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', false, false, true, 1, false, true, 15, 2),
    (cat_dal_bhat, 'Dal Bhat (Half Set)', 'आधा दाल भात', 'Smaller portion of our classic Dal Bhat set, perfect for one', 38, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', true, true, false, null, false, true, 15, 3);

  -- ============================================================
  -- STARTERS
  -- ============================================================
  insert into menu_items (category_id, name, name_ne, description, price_aed, image_url, is_vegetarian, is_vegan, is_spicy, spice_level, is_featured, is_available, prep_time_minutes, sort_order)
  values
    (cat_starters, 'Chatamari', 'चटामरी', 'Newari rice crepe topped with minced meat, egg and spices — Nepal''s pizza!', 30, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', false, false, false, null, false, true, 15, 1),
    (cat_starters, 'Aloo Sadeko', 'आलु सदेको', 'Spiced potato salad with mustard oil, coriander and green chilli', 22, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', true, true, true, 2, false, true, 10, 2),
    (cat_starters, 'Bhuteko Makai', 'भुटेको मकै', 'Stir-fried corn with butter, cumin, and a squeeze of lemon', 18, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', true, true, false, null, false, true, 10, 3),
    (cat_starters, 'Sadheko Bhatmas', 'सदेको भटमास', 'Spiced roasted soybeans tossed with onion, chilli and coriander', 20, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', true, true, true, 1, false, true, 5, 4);

  -- ============================================================
  -- CURRIES
  -- ============================================================
  insert into menu_items (category_id, name, name_ne, description, price_aed, image_url, is_vegetarian, is_vegan, is_spicy, spice_level, is_featured, is_available, prep_time_minutes, sort_order)
  values
    (cat_curries, 'Butter Chicken', 'बटर चिकन', 'Tender chicken in a rich, creamy tomato-based sauce with aromatic spices', 48, 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80', false, false, true, 1, true, true, 25, 1),
    (cat_curries, 'Mutton Curry', 'खसीको मासु', 'Slow-cooked mutton in traditional Nepali masala', 65, 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&q=80', false, false, true, 2, false, true, 30, 2),
    (cat_curries, 'Chicken Curry', 'कुखुराको मासु', 'Home-style Nepali chicken curry with fresh ground spices', 45, 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80', false, false, true, 2, false, true, 25, 3),
    (cat_curries, 'Mixed Vegetable Curry', 'मिक्स तरकारी', 'Seasonal vegetables cooked in Nepali spices', 35, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', true, true, false, null, false, true, 20, 4),
    (cat_curries, 'Paneer Butter Masala', 'पनीर मसाला', 'Soft cottage cheese cubes in a rich, creamy tomato gravy', 42, 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80', true, false, true, 1, false, true, 20, 5);

  -- ============================================================
  -- GRILLS & TANDOOR
  -- ============================================================
  insert into menu_items (category_id, name, name_ne, description, price_aed, image_url, is_vegetarian, is_vegan, is_spicy, spice_level, is_featured, is_available, prep_time_minutes, sort_order)
  values
    (cat_grills, 'Sekuwa Platter', 'सेकुवा', 'Grilled marinated lamb skewers with Nepali spices, fresh salad & mint chutney', 75, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', false, false, true, 2, true, true, 30, 1),
    (cat_grills, 'Chicken Sekuwa', 'चिकन सेकुवा', 'Juicy chargrilled chicken marinated in Nepali spices', 60, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', false, false, true, 1, false, true, 25, 2),
    (cat_grills, 'Tandoori Chicken (Half)', 'तन्दुरी चिकन', 'Half chicken marinated in yoghurt and spices, slow-cooked in tandoor', 65, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', false, false, true, 2, false, true, 35, 3),
    (cat_grills, 'Paneer Tikka', 'पनीर टिक्का', 'Marinated cottage cheese cubes grilled in the tandoor', 45, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', true, false, true, 1, false, true, 25, 4);

  -- ============================================================
  -- BREADS
  -- ============================================================
  insert into menu_items (category_id, name, name_ne, description, price_aed, image_url, is_vegetarian, is_vegan, is_spicy, spice_level, is_featured, is_available, prep_time_minutes, sort_order)
  values
    (cat_breads, 'Plain Naan', 'नान', 'Soft leavened flatbread baked in the tandoor', 8, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', true, false, false, null, false, true, 10, 1),
    (cat_breads, 'Garlic Naan', 'गार्लिक नान', 'Tandoor naan brushed with butter and fresh garlic', 10, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', true, false, false, null, false, true, 10, 2),
    (cat_breads, 'Roti (2 pcs)', 'रोटी', 'Thin whole wheat flatbread, freshly made', 8, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', true, true, false, null, false, true, 10, 3),
    (cat_breads, 'Puri (4 pcs)', 'पुरी', 'Deep-fried puffy wheat bread, light and crispy', 12, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', true, true, false, null, false, true, 10, 4);

  -- ============================================================
  -- DRINKS
  -- ============================================================
  insert into menu_items (category_id, name, name_ne, description, price_aed, image_url, is_vegetarian, is_vegan, is_spicy, spice_level, is_featured, is_available, prep_time_minutes, sort_order)
  values
    (cat_drinks, 'Lassi (Sweet)', 'मिठो लस्सी', 'Chilled sweet yoghurt drink, creamy and refreshing', 18, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80', true, false, false, null, false, true, 5, 1),
    (cat_drinks, 'Lassi (Salty)', 'नुनिलो लस्सी', 'Chilled salted yoghurt drink with cumin and mint', 18, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80', true, false, false, null, false, true, 5, 2),
    (cat_drinks, 'Masala Chai', 'मसला चिया', 'Spiced milk tea brewed with cardamom, ginger and cloves', 12, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80', true, false, false, null, false, true, 5, 3),
    (cat_drinks, 'Mango Juice', 'आँपको जुस', 'Fresh chilled mango juice', 20, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80', true, true, false, null, false, true, 5, 4),
    (cat_drinks, 'Still Water', 'पानी', '500ml still mineral water', 5, null, true, true, false, null, false, true, 5, 5),
    (cat_drinks, 'Soft Drink', 'सफ्ट ड्रिंक', 'Pepsi, 7Up, or Mirinda — please specify', 10, null, true, true, false, null, false, true, 5, 6);

  -- ============================================================
  -- DESSERTS
  -- ============================================================
  insert into menu_items (category_id, name, name_ne, description, price_aed, image_url, is_vegetarian, is_vegan, is_spicy, spice_level, is_featured, is_available, prep_time_minutes, sort_order)
  values
    (cat_desserts, 'Kheer', 'खिर', 'Slow-cooked rice pudding with cardamom, saffron and pistachios', 22, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', true, false, false, null, false, true, 5, 1),
    (cat_desserts, 'Gulab Jamun (3 pcs)', 'गुलाब जामुन', 'Soft milk-solid dumplings soaked in rose-flavoured sugar syrup', 18, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', true, false, false, null, false, true, 5, 2),
    (cat_desserts, 'Jalebi', 'जलेबी', 'Crispy spiral sweets dipped in sugar syrup, served warm', 15, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', true, false, false, null, false, true, 5, 3);

end $$;
