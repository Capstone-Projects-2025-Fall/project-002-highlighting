-- Category Animals
INSERT INTO category (name, description, "tileColor") VALUES ('Animals', NULL, 'green') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category At
INSERT INTO category (name, description, "tileColor") VALUES ('At', NULL, 'blue') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Because
INSERT INTO category (name, description, "tileColor") VALUES ('Because', NULL, 'purple') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Body
INSERT INTO category (name, description, "tileColor") VALUES ('Body', NULL, 'orange') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Classroom
INSERT INTO category (name, description, "tileColor") VALUES ('Classroom', NULL, 'blue') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Clothes
INSERT INTO category (name, description, "tileColor") VALUES ('Clothes', NULL, 'orange') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Colors
INSERT INTO category (name, description, "tileColor") VALUES ('Colors', NULL, 'orange') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Directions
INSERT INTO category (name, description, "tileColor") VALUES ('Directions', NULL, 'orange') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Electronics
INSERT INTO category (name, description, "tileColor") VALUES ('Electronics', NULL, NULL) ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Employee
INSERT INTO category (name, description, "tileColor") VALUES ('Employee', NULL, 'yellow') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Feelings
INSERT INTO category (name, description, "tileColor") VALUES ('Feelings', NULL, 'blue') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Foods
INSERT INTO category (name, description, "tileColor") VALUES ('Foods', NULL, 'green') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Game
INSERT INTO category (name, description, "tileColor") VALUES ('Game', NULL, 'yellow') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category House
INSERT INTO category (name, description, "tileColor") VALUES ('House', NULL, 'blue') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Is
INSERT INTO category (name, description, "tileColor") VALUES ('Is', NULL, 'blue') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Job
INSERT INTO category (name, description, "tileColor") VALUES ('Job', NULL, 'yellow') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Learn
INSERT INTO category (name, description, "tileColor") VALUES ('Learn', NULL, 'blue') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Locations
INSERT INTO category (name, description, "tileColor") VALUES ('Locations', NULL, 'blue') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Materials
INSERT INTO category (name, description, "tileColor") VALUES ('Materials', NULL, 'purple') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Office
INSERT INTO category (name, description, "tileColor") VALUES ('Office', NULL, 'yellow') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Okay
INSERT INTO category (name, description, "tileColor") VALUES ('Okay', NULL, 'yellow') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Playlist
INSERT INTO category (name, description, "tileColor") VALUES ('Playlist', NULL, 'orange') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Shapes
INSERT INTO category (name, description, "tileColor") VALUES ('Shapes', NULL, 'blue') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Sky
INSERT INTO category (name, description, "tileColor") VALUES ('Sky', NULL, 'orange') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category SomewhereElse
INSERT INTO category (name, description, "tileColor") VALUES ('SomewhereElse', NULL, 'yellow') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Sound
INSERT INTO category (name, description, "tileColor") VALUES ('Sound', NULL, 'orange') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Tell
INSERT INTO category (name, description, "tileColor") VALUES ('Tell', NULL, 'blue') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category These
INSERT INTO category (name, description, "tileColor") VALUES ('These', NULL, 'blue') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category They
INSERT INTO category (name, description, "tileColor") VALUES ('They', NULL, 'orange') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Things
INSERT INTO category (name, description, "tileColor") VALUES ('Things', NULL, 'red') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category This
INSERT INTO category (name, description, "tileColor") VALUES ('This', NULL, NULL) ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Tools
INSERT INTO category (name, description, "tileColor") VALUES ('Tools', NULL, 'red') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Touch
INSERT INTO category (name, description, "tileColor") VALUES ('Touch', NULL, 'green') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Category Who
INSERT INTO category (name, description, "tileColor") VALUES ('Who', NULL, 'purple') ON CONFLICT (name) DO UPDATE SET "tileColor" = EXCLUDED."tileColor";
-- Word Animal (category: Animals)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Animal', '/AAC_assets/img/animals/animal.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Animal' LIMIT 1),(SELECT id FROM category WHERE name='Animals' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Bug (category: Animals)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Bug', '/AAC_assets/img/animals/bug.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Bug' LIMIT 1),(SELECT id FROM category WHERE name='Animals' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Cat (category: Animals)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Cat', '/AAC_assets/img/animals/cat.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Cat' LIMIT 1),(SELECT id FROM category WHERE name='Animals' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Dog (category: Animals)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Dog', '/AAC_assets/img/animals/dog.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Dog' LIMIT 1),(SELECT id FROM category WHERE name='Animals' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Pet (category: Animals)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Pet', '/AAC_assets/img/animals/pet.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Pet' LIMIT 1),(SELECT id FROM category WHERE name='Animals' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Fish (category: Animals)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Fish', '/AAC_assets/img/animals/fish.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Fish' LIMIT 1),(SELECT id FROM category WHERE name='Animals' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Butterfly (category: Animals)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Butterfly', '/AAC_assets/img/animals/butterfly.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Butterfly' LIMIT 1),(SELECT id FROM category WHERE name='Animals' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word At (category: At)
INSERT INTO word (text, symbol, "tileColor") VALUES ('At', '/AAC_assets/img/locations/at.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='At' LIMIT 1),(SELECT id FROM category WHERE name='At' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Around (category: At)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Around', '/AAC_assets/img/actions/around.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Around' LIMIT 1),(SELECT id FROM category WHERE name='At' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Sit (category: At)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Sit', '/AAC_assets/img/actions/sit.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Sit' LIMIT 1),(SELECT id FROM category WHERE name='At' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Stand (category: At)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Stand', '/AAC_assets/img/actions/stand.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Stand' LIMIT 1),(SELECT id FROM category WHERE name='At' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Stay (category: At)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Stay', '/AAC_assets/img/actions/stay.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Stay' LIMIT 1),(SELECT id FROM category WHERE name='At' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Walk (category: At)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Walk', '/AAC_assets/img/actions/walk.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Walk' LIMIT 1),(SELECT id FROM category WHERE name='At' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Run (category: At)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Run', '/AAC_assets/img/actions/run.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Run' LIMIT 1),(SELECT id FROM category WHERE name='At' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Ride (category: At)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Ride', '/AAC_assets/img/actions/ride.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Ride' LIMIT 1),(SELECT id FROM category WHERE name='At' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Drive (category: At)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Drive', '/AAC_assets/img/actions/drive.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Drive' LIMIT 1),(SELECT id FROM category WHERE name='At' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Fly (category: At)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Fly', '/AAC_assets/img/actions/fly.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Fly' LIMIT 1),(SELECT id FROM category WHERE name='At' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Through (category: At)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Through', '/AAC_assets/img/actions/through.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Through' LIMIT 1),(SELECT id FROM category WHERE name='At' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Give (category: At)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Give', '/AAC_assets/img/actions/Give.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Give' LIMIT 1),(SELECT id FROM category WHERE name='At' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Bring (category: At)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Bring', '/AAC_assets/img/actions/bring.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Bring' LIMIT 1),(SELECT id FROM category WHERE name='At' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Take (category: At)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Take', '/AAC_assets/img/actions/take.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Take' LIMIT 1),(SELECT id FROM category WHERE name='At' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Push (category: At)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Push', '/AAC_assets/img/actions/push.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Push' LIMIT 1),(SELECT id FROM category WHERE name='At' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Start (category: At)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Start', '/AAC_assets/img/actions/start.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Start' LIMIT 1),(SELECT id FROM category WHERE name='At' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word City (category: At)
INSERT INTO word (text, symbol, "tileColor") VALUES ('City', '/AAC_assets/img/locations/city.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='City' LIMIT 1),(SELECT id FROM category WHERE name='At' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Town (category: At)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Town', '/AAC_assets/img/locations/town.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Town' LIMIT 1),(SELECT id FROM category WHERE name='At' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Farm (category: At)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Farm', '/AAC_assets/img/locations/farm.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Farm' LIMIT 1),(SELECT id FROM category WHERE name='At' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Shop (category: At)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Shop', '/AAC_assets/img/locations/shop.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Shop' LIMIT 1),(SELECT id FROM category WHERE name='At' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Because (category: Because)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Because', '/AAC_assets/img/tell/because.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Because' LIMIT 1),(SELECT id FROM category WHERE name='Because' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word If (category: Because)
INSERT INTO word (text, symbol, "tileColor") VALUES ('If', '/AAC_assets/img/smallWords/if.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='If' LIMIT 1),(SELECT id FROM category WHERE name='Because' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word for (category: Because)
INSERT INTO word (text, symbol, "tileColor") VALUES ('for', '/AAC_assets/img/smallWords/for.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='for' LIMIT 1),(SELECT id FROM category WHERE name='Because' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word by (category: Because)
INSERT INTO word (text, symbol, "tileColor") VALUES ('by', '/AAC_assets/img/smallWords/by.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='by' LIMIT 1),(SELECT id FROM category WHERE name='Because' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word From (category: Because)
INSERT INTO word (text, symbol, "tileColor") VALUES ('From', '/AAC_assets/img/smallWords/from.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='From' LIMIT 1),(SELECT id FROM category WHERE name='Because' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word But (category: Because)
INSERT INTO word (text, symbol, "tileColor") VALUES ('But', '/AAC_assets/img/smallWords/but.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='But' LIMIT 1),(SELECT id FROM category WHERE name='Because' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word And (category: Because)
INSERT INTO word (text, symbol, "tileColor") VALUES ('And', '/AAC_assets/img/smallWords/and.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='And' LIMIT 1),(SELECT id FROM category WHERE name='Because' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word With (category: Because)
INSERT INTO word (text, symbol, "tileColor") VALUES ('With', '/AAC_assets/img/smallWords/with.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='With' LIMIT 1),(SELECT id FROM category WHERE name='Because' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Of (category: Because)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Of', '/AAC_assets/img/smallWords/of.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Of' LIMIT 1),(SELECT id FROM category WHERE name='Because' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Arm (category: Body)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Arm', '/AAC_assets/img/body/arm.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Arm' LIMIT 1),(SELECT id FROM category WHERE name='Body' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Back (category: Body)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Back', '/AAC_assets/img/body/back.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Back' LIMIT 1),(SELECT id FROM category WHERE name='Body' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Body (category: Body)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Body', '/AAC_assets/img/body/body.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Body' LIMIT 1),(SELECT id FROM category WHERE name='Body' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Bottom (category: Body)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Bottom', '/AAC_assets/img/body/bottom.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Bottom' LIMIT 1),(SELECT id FROM category WHERE name='Body' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Chest (category: Body)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Chest', '/AAC_assets/img/body/chest.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Chest' LIMIT 1),(SELECT id FROM category WHERE name='Body' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Face (category: Body)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Face', '/AAC_assets/img/body/face.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Face' LIMIT 1),(SELECT id FROM category WHERE name='Body' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Finger (category: Body)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Finger', '/AAC_assets/img/body/finger.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Finger' LIMIT 1),(SELECT id FROM category WHERE name='Body' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Foot (category: Body)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Foot', '/AAC_assets/img/body/foot.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Foot' LIMIT 1),(SELECT id FROM category WHERE name='Body' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Hair (category: Body)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Hair', '/AAC_assets/img/body/hair.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Hair' LIMIT 1),(SELECT id FROM category WHERE name='Body' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Hand (category: Body)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Hand', '/AAC_assets/img/body/hand.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Hand' LIMIT 1),(SELECT id FROM category WHERE name='Body' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Head (category: Body)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Head', '/AAC_assets/img/body/head.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Head' LIMIT 1),(SELECT id FROM category WHERE name='Body' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Leg (category: Body)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Leg', '/AAC_assets/img/body/leg.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Leg' LIMIT 1),(SELECT id FROM category WHERE name='Body' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Mouth (category: Body)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Mouth', '/AAC_assets/img/body/mouth.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Mouth' LIMIT 1),(SELECT id FROM category WHERE name='Body' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Privates (category: Body)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Privates', '/AAC_assets/img/body/privateparts.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Privates' LIMIT 1),(SELECT id FROM category WHERE name='Body' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Stomach (category: Body)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Stomach', '/AAC_assets/img/body/stomach.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Stomach' LIMIT 1),(SELECT id FROM category WHERE name='Body' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Teeth (category: Body)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Teeth', '/AAC_assets/img/body/teeth.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Teeth' LIMIT 1),(SELECT id FROM category WHERE name='Body' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Tongue (category: Body)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Tongue', '/AAC_assets/img/body/tongue.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Tongue' LIMIT 1),(SELECT id FROM category WHERE name='Body' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Bandage (category: Body)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Bandage', '/AAC_assets/img/body/bandage.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Bandage' LIMIT 1),(SELECT id FROM category WHERE name='Body' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Eye (category: Body)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Eye', '/AAC_assets/img/body/eye.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Eye' LIMIT 1),(SELECT id FROM category WHERE name='Body' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Classroom (category: Classroom)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Classroom', '/AAC_assets/img/learn/classroom.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Classroom' LIMIT 1),(SELECT id FROM category WHERE name='Classroom' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word School People (category: Classroom)
INSERT INTO word (text, symbol, "tileColor") VALUES ('School People', '/AAC_assets/img/learn/schoolPeople.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='School People' LIMIT 1),(SELECT id FROM category WHERE name='Classroom' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Clothes (category: Clothes)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Clothes', '/AAC_assets/img/clothes/clothes.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Clothes' LIMIT 1),(SELECT id FROM category WHERE name='Clothes' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Shirt (category: Clothes)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Shirt', '/AAC_assets/img/clothes/shirt.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Shirt' LIMIT 1),(SELECT id FROM category WHERE name='Clothes' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Pants (category: Clothes)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Pants', '/AAC_assets/img/clothes/pants.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Pants' LIMIT 1),(SELECT id FROM category WHERE name='Clothes' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Underwear (category: Clothes)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Underwear', '/AAC_assets/img/clothes/underwear.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Underwear' LIMIT 1),(SELECT id FROM category WHERE name='Clothes' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Hat (category: Clothes)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Hat', '/AAC_assets/img/clothes/hat.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Hat' LIMIT 1),(SELECT id FROM category WHERE name='Clothes' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Shoes (category: Clothes)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Shoes', '/AAC_assets/img/clothes/shoes.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Shoes' LIMIT 1),(SELECT id FROM category WHERE name='Clothes' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Coat (category: Clothes)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Coat', '/AAC_assets/img/clothes/coat.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Coat' LIMIT 1),(SELECT id FROM category WHERE name='Clothes' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Glasses (category: Clothes)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Glasses', '/AAC_assets/img/clothes/glasses.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Glasses' LIMIT 1),(SELECT id FROM category WHERE name='Clothes' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Dress (category: Clothes)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Dress', '/AAC_assets/img/clothes/dress.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Dress' LIMIT 1),(SELECT id FROM category WHERE name='Clothes' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Get Dressed (category: Clothes)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Get Dressed', '/AAC_assets/img/clothes/getdressed.png', 'CLOTHES_VERB_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Get Dressed' LIMIT 1),(SELECT id FROM category WHERE name='Clothes' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Handsome (category: Clothes)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Handsome', '/AAC_assets/img/clothes/handsome.png', 'CLOTHES_ADJECTIVE_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Handsome' LIMIT 1),(SELECT id FROM category WHERE name='Clothes' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Pajamas (category: Clothes)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Pajamas', '/AAC_assets/img/clothes/pajamas.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Pajamas' LIMIT 1),(SELECT id FROM category WHERE name='Clothes' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Pretty (category: Clothes)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Pretty', '/AAC_assets/img/clothes/pretty.png', 'CLOTHES_ADJECTIVE_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Pretty' LIMIT 1),(SELECT id FROM category WHERE name='Clothes' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Put On (category: Clothes)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Put On', '/AAC_assets/img/clothes/puton.png', 'CLOTHES_VERB_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Put On' LIMIT 1),(SELECT id FROM category WHERE name='Clothes' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Socks (category: Clothes)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Socks', '/AAC_assets/img/clothes/socks.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Socks' LIMIT 1),(SELECT id FROM category WHERE name='Clothes' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Take Off (category: Clothes)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Take Off', '/AAC_assets/img/clothes/takeoff.png', 'CLOTHES_VERB_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Take Off' LIMIT 1),(SELECT id FROM category WHERE name='Clothes' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Ugly (category: Clothes)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Ugly', '/AAC_assets/img/clothes/ugly.png', 'CLOTHES_ADJECTIVE_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Ugly' LIMIT 1),(SELECT id FROM category WHERE name='Clothes' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Undress (category: Clothes)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Undress', '/AAC_assets/img/clothes/undress.png', 'CLOTHES_VERB_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Undress' LIMIT 1),(SELECT id FROM category WHERE name='Clothes' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Colors (category: Colors)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Colors', '/AAC_assets/img/colors/blue.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Colors' LIMIT 1),(SELECT id FROM category WHERE name='Colors' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Blue (category: Colors)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Blue', '/AAC_assets/img/colors/blue.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Blue' LIMIT 1),(SELECT id FROM category WHERE name='Colors' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Brown (category: Colors)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Brown', '/AAC_assets/img/colors/brown.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Brown' LIMIT 1),(SELECT id FROM category WHERE name='Colors' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Green (category: Colors)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Green', '/AAC_assets/img/colors/green.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Green' LIMIT 1),(SELECT id FROM category WHERE name='Colors' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Orange (category: Colors)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Orange', '/AAC_assets/img/colors/orange.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Orange' LIMIT 1),(SELECT id FROM category WHERE name='Colors' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Pink (category: Colors)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Pink', '/AAC_assets/img/colors/pink.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Pink' LIMIT 1),(SELECT id FROM category WHERE name='Colors' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Purple (category: Colors)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Purple', '/AAC_assets/img/colors/purple.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Purple' LIMIT 1),(SELECT id FROM category WHERE name='Colors' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Red (category: Colors)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Red', '/AAC_assets/img/colors/red.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Red' LIMIT 1),(SELECT id FROM category WHERE name='Colors' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Gray (category: Colors)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Gray', '/AAC_assets/img/colors/gray.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Gray' LIMIT 1),(SELECT id FROM category WHERE name='Colors' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Direction (category: Directions)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Direction', '/AAC_assets/img/locations/directions.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Direction' LIMIT 1),(SELECT id FROM category WHERE name='Directions' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word High (category: Directions)
INSERT INTO word (text, symbol, "tileColor") VALUES ('High', '/AAC_assets/img/directions/high.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='High' LIMIT 1),(SELECT id FROM category WHERE name='Directions' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Middle (category: Directions)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Middle', '/AAC_assets/img/directions/middle.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Middle' LIMIT 1),(SELECT id FROM category WHERE name='Directions' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word low (category: Directions)
INSERT INTO word (text, symbol, "tileColor") VALUES ('low', '/AAC_assets/img/directions/low.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='low' LIMIT 1),(SELECT id FROM category WHERE name='Directions' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Up (category: Directions)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Up', '/AAC_assets/img/directions/up.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Up' LIMIT 1),(SELECT id FROM category WHERE name='Directions' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Down (category: Directions)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Down', '/AAC_assets/img/directions/down.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Down' LIMIT 1),(SELECT id FROM category WHERE name='Directions' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Top (category: Directions)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Top', '/AAC_assets/img/directions/top.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Top' LIMIT 1),(SELECT id FROM category WHERE name='Directions' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Bottom (category: Directions)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Bottom', '/AAC_assets/img/directions/bottom.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Bottom' LIMIT 1),(SELECT id FROM category WHERE name='Directions' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Side (category: Directions)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Side', '/AAC_assets/img/directions/side.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Side' LIMIT 1),(SELECT id FROM category WHERE name='Directions' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Over (category: Directions)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Over', '/AAC_assets/img/directions/over.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Over' LIMIT 1),(SELECT id FROM category WHERE name='Directions' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Bottom (category: Directions)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Bottom', '/AAC_assets/img/directions/bottom.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Bottom' LIMIT 1),(SELECT id FROM category WHERE name='Directions' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Front (category: Directions)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Front', '/AAC_assets/img/directions/front.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Front' LIMIT 1),(SELECT id FROM category WHERE name='Directions' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Under (category: Directions)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Under', '/AAC_assets/img/directions/under.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Under' LIMIT 1),(SELECT id FROM category WHERE name='Directions' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Electronics (category: Electronics)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Electronics', '/AAC_assets/img/electronics/technology.png', NULL) ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Electronics' LIMIT 1),(SELECT id FROM category WHERE name='Electronics' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Technology (category: Electronics)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Technology', '/AAC_assets/img/electronics/technology.png', 'ELECTRONICS_TILE_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Technology' LIMIT 1),(SELECT id FROM category WHERE name='Electronics' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Tv (category: Electronics)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Tv', '/AAC_assets/img/electronics/tv.png', 'ELECTRONICS_TILE_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Tv' LIMIT 1),(SELECT id FROM category WHERE name='Electronics' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Computer (category: Electronics)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Computer', '/AAC_assets/img/electronics/computer.png', 'ELECTRONICS_TILE_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Computer' LIMIT 1),(SELECT id FROM category WHERE name='Electronics' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Clock (category: Electronics)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Clock', '/AAC_assets/img/electronics/clock.png', 'ELECTRONICS_TILE_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Clock' LIMIT 1),(SELECT id FROM category WHERE name='Electronics' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Phone (category: Electronics)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Phone', '/AAC_assets/img/electronics/mobile.png', 'ELECTRONICS_TILE_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Phone' LIMIT 1),(SELECT id FROM category WHERE name='Electronics' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Camera (category: Electronics)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Camera', '/AAC_assets/img/electronics/camera.png', 'ELECTRONICS_TILE_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Camera' LIMIT 1),(SELECT id FROM category WHERE name='Electronics' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Tablet (category: Electronics)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Tablet', '/AAC_assets/img/electronics/tablet.png', 'ELECTRONICS_TILE_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Tablet' LIMIT 1),(SELECT id FROM category WHERE name='Electronics' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word employee (category: Employee)
INSERT INTO word (text, symbol, "tileColor") VALUES ('employee', '/AAC_assets/img/job/employee.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='employee' LIMIT 1),(SELECT id FROM category WHERE name='Employee' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Work People (category: Employee)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Work People', '/AAC_assets/img/job/workPeople.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Work People' LIMIT 1),(SELECT id FROM category WHERE name='Employee' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Feelings (category: Feelings)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Feelings', '/AAC_assets/img/feelings/feelings.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Feelings' LIMIT 1),(SELECT id FROM category WHERE name='Feelings' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Love (category: Feelings)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Love', '/AAC_assets/img/feelings/love.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Love' LIMIT 1),(SELECT id FROM category WHERE name='Feelings' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Smart (category: Feelings)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Smart', '/AAC_assets/img/feelings/smart.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Smart' LIMIT 1),(SELECT id FROM category WHERE name='Feelings' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Silly (category: Feelings)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Silly', '/AAC_assets/img/feelings/silly.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Silly' LIMIT 1),(SELECT id FROM category WHERE name='Feelings' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Change (category: Feelings)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Change', '/AAC_assets/img/feelings/change.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Change' LIMIT 1),(SELECT id FROM category WHERE name='Feelings' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Nice (category: Feelings)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Nice', '/AAC_assets/img/feelings/nice.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Nice' LIMIT 1),(SELECT id FROM category WHERE name='Feelings' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Ready (category: Feelings)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Ready', '/AAC_assets/img/feelings/ready.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Ready' LIMIT 1),(SELECT id FROM category WHERE name='Feelings' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Tired (category: Feelings)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Tired', '/AAC_assets/img/feelings/tired.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Tired' LIMIT 1),(SELECT id FROM category WHERE name='Feelings' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Hurt (category: Feelings)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Hurt', '/AAC_assets/img/feelings/hurt.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Hurt' LIMIT 1),(SELECT id FROM category WHERE name='Feelings' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Scared (category: Feelings)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Scared', '/AAC_assets/img/feelings/scared.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Scared' LIMIT 1),(SELECT id FROM category WHERE name='Feelings' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Angry (category: Feelings)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Angry', '/AAC_assets/img/feelings/angry.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Angry' LIMIT 1),(SELECT id FROM category WHERE name='Feelings' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Nervous (category: Feelings)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Nervous', '/AAC_assets/img/feelings/nervous.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Nervous' LIMIT 1),(SELECT id FROM category WHERE name='Feelings' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Shy (category: Feelings)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Shy', '/AAC_assets/img/feelings/shy.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Shy' LIMIT 1),(SELECT id FROM category WHERE name='Feelings' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Sick (category: Feelings)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Sick', '/AAC_assets/img/feelings/sick.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Sick' LIMIT 1),(SELECT id FROM category WHERE name='Feelings' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Confused (category: Feelings)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Confused', '/AAC_assets/img/feelings/confused.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Confused' LIMIT 1),(SELECT id FROM category WHERE name='Feelings' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Excited (category: Feelings)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Excited', '/AAC_assets/img/feelings/excited.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Excited' LIMIT 1),(SELECT id FROM category WHERE name='Feelings' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Happy (category: Feelings)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Happy', '/AAC_assets/img/feelings/happy.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Happy' LIMIT 1),(SELECT id FROM category WHERE name='Feelings' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Sad (category: Feelings)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Sad', '/AAC_assets/img/feelings/sad.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Sad' LIMIT 1),(SELECT id FROM category WHERE name='Feelings' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Foods (category: Foods)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Foods', '/AAC_assets/img/food/eat.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Foods' LIMIT 1),(SELECT id FROM category WHERE name='Foods' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Eat (category: Foods)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Eat', '/AAC_assets/img/food/eat.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Eat' LIMIT 1),(SELECT id FROM category WHERE name='Foods' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Taste (category: Foods)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Taste', '/AAC_assets/img/food/taste.svg', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Taste' LIMIT 1),(SELECT id FROM category WHERE name='Foods' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Water (category: Foods)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Water', '/AAC_assets/img/food/water.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Water' LIMIT 1),(SELECT id FROM category WHERE name='Foods' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Drink (category: Foods)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Drink', '/AAC_assets/img/food/drink.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Drink' LIMIT 1),(SELECT id FROM category WHERE name='Foods' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Blueberry (category: Foods)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Blueberry', '/AAC_assets/img/food/blueberry.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Blueberry' LIMIT 1),(SELECT id FROM category WHERE name='Foods' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Bread (category: Foods)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Bread', '/AAC_assets/img/food/bread.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Bread' LIMIT 1),(SELECT id FROM category WHERE name='Foods' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Carrot (category: Foods)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Carrot', '/AAC_assets/img/food/carrot.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Carrot' LIMIT 1),(SELECT id FROM category WHERE name='Foods' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Cheese (category: Foods)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Cheese', '/AAC_assets/img/food/cheese.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Cheese' LIMIT 1),(SELECT id FROM category WHERE name='Foods' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Hamburger (category: Foods)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Hamburger', '/AAC_assets/img/food/hamburger.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Hamburger' LIMIT 1),(SELECT id FROM category WHERE name='Foods' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Meat (category: Foods)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Meat', '/AAC_assets/img/food/meat.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Meat' LIMIT 1),(SELECT id FROM category WHERE name='Foods' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Milk (category: Foods)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Milk', '/AAC_assets/img/food/milk.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Milk' LIMIT 1),(SELECT id FROM category WHERE name='Foods' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Pizza (category: Foods)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Pizza', '/AAC_assets/img/food/pizza.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Pizza' LIMIT 1),(SELECT id FROM category WHERE name='Foods' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Rice (category: Foods)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Rice', '/AAC_assets/img/food/rice.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Rice' LIMIT 1),(SELECT id FROM category WHERE name='Foods' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Strawberry (category: Foods)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Strawberry', '/AAC_assets/img/food/strawberry.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Strawberry' LIMIT 1),(SELECT id FROM category WHERE name='Foods' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Taco (category: Foods)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Taco', '/AAC_assets/img/food/taco.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Taco' LIMIT 1),(SELECT id FROM category WHERE name='Foods' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Hotdog (category: Foods)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Hotdog', '/AAC_assets/img/food/hotdog.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Hotdog' LIMIT 1),(SELECT id FROM category WHERE name='Foods' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Sweets (category: Foods)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Sweets', '/AAC_assets/img/food/sweets.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Sweets' LIMIT 1),(SELECT id FROM category WHERE name='Foods' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Biscuit (category: Foods)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Biscuit', '/AAC_assets/img/food/biscuit.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Biscuit' LIMIT 1),(SELECT id FROM category WHERE name='Foods' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Vegetable (category: Foods)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Vegetable', '/AAC_assets/img/food/vegetable.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Vegetable' LIMIT 1),(SELECT id FROM category WHERE name='Foods' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Bottle (category: Foods)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Bottle', '/AAC_assets/img/food/bottle.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Bottle' LIMIT 1),(SELECT id FROM category WHERE name='Foods' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Game (category: Game)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Game', '/AAC_assets/img/this/game.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Game' LIMIT 1),(SELECT id FROM category WHERE name='Game' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Play (category: Game)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Play', '/AAC_assets/img/games/play.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Play' LIMIT 1),(SELECT id FROM category WHERE name='Game' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Toy (category: Game)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Toy', '/AAC_assets/img/games/toy.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Toy' LIMIT 1),(SELECT id FROM category WHERE name='Game' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Party (category: Game)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Party', '/AAC_assets/img/games/party.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Party' LIMIT 1),(SELECT id FROM category WHERE name='Game' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Hide (category: Game)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Hide', '/AAC_assets/img/games/hide.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Hide' LIMIT 1),(SELECT id FROM category WHERE name='Game' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Jump (category: Game)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Jump', '/AAC_assets/img/games/jump.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Jump' LIMIT 1),(SELECT id FROM category WHERE name='Game' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Practice (category: Game)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Practice', '/AAC_assets/img/games/practice.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Practice' LIMIT 1),(SELECT id FROM category WHERE name='Game' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Win (category: Game)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Win', '/AAC_assets/img/games/win.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Win' LIMIT 1),(SELECT id FROM category WHERE name='Game' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Lose (category: Game)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Lose', '/AAC_assets/img/games/lose.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Lose' LIMIT 1),(SELECT id FROM category WHERE name='Game' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word My Games (category: Game)
INSERT INTO word (text, symbol, "tileColor") VALUES ('My Games', '/AAC_assets/img/games/myGames.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='My Games' LIMIT 1),(SELECT id FROM category WHERE name='Game' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word My Toys (category: Game)
INSERT INTO word (text, symbol, "tileColor") VALUES ('My Toys', '/AAC_assets/img/games/myToys.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='My Toys' LIMIT 1),(SELECT id FROM category WHERE name='Game' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Bicycle (category: Game)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Bicycle', '/AAC_assets/img/games/bicycle.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Bicycle' LIMIT 1),(SELECT id FROM category WHERE name='Game' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word House (category: House)
INSERT INTO word (text, symbol, "tileColor") VALUES ('House', '/AAC_assets/img/locations/house.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='House' LIMIT 1),(SELECT id FROM category WHERE name='House' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Street (category: House)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Street', '/AAC_assets/img/locations/street.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Street' LIMIT 1),(SELECT id FROM category WHERE name='House' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Kitchen (category: House)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Kitchen', '/AAC_assets/img/house/kitchen.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Kitchen' LIMIT 1),(SELECT id FROM category WHERE name='House' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Address (category: House)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Address', '/AAC_assets/img/house/address.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Address' LIMIT 1),(SELECT id FROM category WHERE name='House' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Window (category: House)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Window', '/AAC_assets/img/house/window.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Window' LIMIT 1),(SELECT id FROM category WHERE name='House' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Door (category: House)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Door', '/AAC_assets/img/house/door.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Door' LIMIT 1),(SELECT id FROM category WHERE name='House' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Room (category: House)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Room', '/AAC_assets/img/house/room.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Room' LIMIT 1),(SELECT id FROM category WHERE name='House' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Table (category: House)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Table', '/AAC_assets/img/house/table.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Table' LIMIT 1),(SELECT id FROM category WHERE name='House' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Chair (category: House)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Chair', '/AAC_assets/img/house/chair.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Chair' LIMIT 1),(SELECT id FROM category WHERE name='House' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Lighting (category: House)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Lighting', '/AAC_assets/img/house/lighting.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Lighting' LIMIT 1),(SELECT id FROM category WHERE name='House' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Wall (category: House)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Wall', '/AAC_assets/img/house/wall.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Wall' LIMIT 1),(SELECT id FROM category WHERE name='House' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Bed (category: House)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Bed', '/AAC_assets/img/house/bed.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Bed' LIMIT 1),(SELECT id FROM category WHERE name='House' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Tooth Brush (category: House)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Tooth Brush', '/AAC_assets/img/house/brush.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Tooth Brush' LIMIT 1),(SELECT id FROM category WHERE name='House' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Am (category: Is)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Am', '/AAC_assets/img/is/am.png', 'IS_VERB_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Am' LIMIT 1),(SELECT id FROM category WHERE name='Is' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Are (category: Is)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Are', '/AAC_assets/img/is/are.png', 'IS_VERB_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Are' LIMIT 1),(SELECT id FROM category WHERE name='Is' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Be (category: Is)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Be', '/AAC_assets/img/is/be.png', 'IS_VERB_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Be' LIMIT 1),(SELECT id FROM category WHERE name='Is' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Busy (category: Is)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Busy', '/AAC_assets/img/is/busy.svg', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Busy' LIMIT 1),(SELECT id FROM category WHERE name='Is' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Change (category: Is)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Change', '/AAC_assets/img/is/change.png', 'IS_VERB_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Change' LIMIT 1),(SELECT id FROM category WHERE name='Is' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Confused (category: Is)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Confused', '/AAC_assets/img/is/confused.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Confused' LIMIT 1),(SELECT id FROM category WHERE name='Is' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Excited (category: Is)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Excited', '/AAC_assets/img/is/excited.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Excited' LIMIT 1),(SELECT id FROM category WHERE name='Is' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Frustrated (category: Is)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Frustrated', '/AAC_assets/img/is/frustrated.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Frustrated' LIMIT 1),(SELECT id FROM category WHERE name='Is' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Grow (category: Is)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Grow', '/AAC_assets/img/is/grow.png', 'IS_VERB_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Grow' LIMIT 1),(SELECT id FROM category WHERE name='Is' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Happy (category: Is)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Happy', '/AAC_assets/img/is/happy.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Happy' LIMIT 1),(SELECT id FROM category WHERE name='Is' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Hurt (category: Is)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Hurt', '/AAC_assets/img/is/hurt.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Hurt' LIMIT 1),(SELECT id FROM category WHERE name='Is' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Is (category: Is)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Is', '/AAC_assets/img/is/is.png', 'IS_VERB_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Is' LIMIT 1),(SELECT id FROM category WHERE name='Is' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Live (category: Is)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Live', '/AAC_assets/img/is/live.png', 'IS_VERB_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Live' LIMIT 1),(SELECT id FROM category WHERE name='Is' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Nervous (category: Is)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Nervous', '/AAC_assets/img/is/nervous.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Nervous' LIMIT 1),(SELECT id FROM category WHERE name='Is' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Nice (category: Is)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Nice', '/AAC_assets/img/is/nice.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Nice' LIMIT 1),(SELECT id FROM category WHERE name='Is' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Ready (category: Is)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Ready', '/AAC_assets/img/is/ready.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Ready' LIMIT 1),(SELECT id FROM category WHERE name='Is' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Sad (category: Is)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Sad', '/AAC_assets/img/is/sad.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Sad' LIMIT 1),(SELECT id FROM category WHERE name='Is' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Scared (category: Is)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Scared', '/AAC_assets/img/is/scared.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Scared' LIMIT 1),(SELECT id FROM category WHERE name='Is' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Shy (category: Is)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Shy', '/AAC_assets/img/is/shy.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Shy' LIMIT 1),(SELECT id FROM category WHERE name='Is' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Sick (category: Is)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Sick', '/AAC_assets/img/is/sick.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Sick' LIMIT 1),(SELECT id FROM category WHERE name='Is' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Silly (category: Is)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Silly', '/AAC_assets/img/is/silly.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Silly' LIMIT 1),(SELECT id FROM category WHERE name='Is' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Smart (category: Is)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Smart', '/AAC_assets/img/is/smart.svg', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Smart' LIMIT 1),(SELECT id FROM category WHERE name='Is' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Tired (category: Is)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Tired', '/AAC_assets/img/is/tired.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Tired' LIMIT 1),(SELECT id FROM category WHERE name='Is' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Was (category: Is)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Was', '/AAC_assets/img/is/was.svg', 'IS_VERB_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Was' LIMIT 1),(SELECT id FROM category WHERE name='Is' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Job (category: Job)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Job', '/AAC_assets/img/this/job.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Job' LIMIT 1),(SELECT id FROM category WHERE name='Job' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Money (category: Job)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Money', '/AAC_assets/img/job/money.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Money' LIMIT 1),(SELECT id FROM category WHERE name='Job' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Office (category: Job)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Office', '/AAC_assets/img/job/office.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Office' LIMIT 1),(SELECT id FROM category WHERE name='Job' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Employee (category: Job)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Employee', '/AAC_assets/img/job/employee.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Employee' LIMIT 1),(SELECT id FROM category WHERE name='Job' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Work (category: Job)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Work', '/AAC_assets/img/job/work.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Work' LIMIT 1),(SELECT id FROM category WHERE name='Job' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Trade (category: Job)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Trade', '/AAC_assets/img/job/trade.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Trade' LIMIT 1),(SELECT id FROM category WHERE name='Job' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Sell (category: Job)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Sell', '/AAC_assets/img/job/sell.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Sell' LIMIT 1),(SELECT id FROM category WHERE name='Job' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Buy (category: Job)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Buy', '/AAC_assets/img/job/buy.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Buy' LIMIT 1),(SELECT id FROM category WHERE name='Job' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Learn (category: Learn)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Learn', '/AAC_assets/img/tell/learn.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Learn' LIMIT 1),(SELECT id FROM category WHERE name='Learn' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Share (category: Learn)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Share', '/AAC_assets/img/learn/_share.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Share' LIMIT 1),(SELECT id FROM category WHERE name='Learn' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Mean (category: Learn)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Mean', '/AAC_assets/img/learn/mean.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Mean' LIMIT 1),(SELECT id FROM category WHERE name='Learn' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Understand (category: Learn)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Understand', '/AAC_assets/img/learn/understand.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Understand' LIMIT 1),(SELECT id FROM category WHERE name='Learn' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Trouble (category: Learn)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Trouble', '/AAC_assets/img/learn/trouble.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Trouble' LIMIT 1),(SELECT id FROM category WHERE name='Learn' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Success (category: Learn)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Success', '/AAC_assets/img/learn/success.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Success' LIMIT 1),(SELECT id FROM category WHERE name='Learn' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Problem (category: Learn)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Problem', '/AAC_assets/img/learn/problem.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Problem' LIMIT 1),(SELECT id FROM category WHERE name='Learn' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Idea (category: Learn)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Idea', '/AAC_assets/img/learn/idea.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Idea' LIMIT 1),(SELECT id FROM category WHERE name='Learn' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Question (category: Learn)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Question', '/AAC_assets/img/learn/question.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Question' LIMIT 1),(SELECT id FROM category WHERE name='Learn' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Classroom (category: Learn)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Classroom', '/AAC_assets/img/learn/classroom.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Classroom' LIMIT 1),(SELECT id FROM category WHERE name='Learn' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Simple (category: Learn)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Simple', '/AAC_assets/img/learn/simple.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Simple' LIMIT 1),(SELECT id FROM category WHERE name='Learn' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Hard (category: Learn)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Hard', '/AAC_assets/img/learn/Hard.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Hard' LIMIT 1),(SELECT id FROM category WHERE name='Learn' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Right (category: Learn)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Right', '/AAC_assets/img/learn/right.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Right' LIMIT 1),(SELECT id FROM category WHERE name='Learn' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Wrong (category: Learn)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Wrong', '/AAC_assets/img/learn/wrong.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Wrong' LIMIT 1),(SELECT id FROM category WHERE name='Learn' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Locations (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Locations', '/AAC_assets/img/locations/go.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Locations' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Go (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Go', '/AAC_assets/img/locations/go.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Go' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Home (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Home', '/AAC_assets/img/locations/home.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Home' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word My Room (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('My Room', '/AAC_assets/img/locations/myRoom.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='My Room' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Way (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Way', '/AAC_assets/img/locations/milkyWay.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Way' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Inside (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Inside', '/AAC_assets/img/go/inside.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Inside' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Outside (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Outside', '/AAC_assets/img/go/outside.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Outside' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word At (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('At', '/AAC_assets/img/locations/at.png', 'AT_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='At' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Where (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Where', '/AAC_assets/img/locations/where.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Where' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Place (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Place', '/AAC_assets/img/locations/place.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Place' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Upstairs (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Upstairs', '/AAC_assets/img/go/upstairs.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Upstairs' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word downstairs (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('downstairs', '/AAC_assets/img/go/downstairs.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='downstairs' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Bathroom (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Bathroom', '/AAC_assets/img/locations/bathroom.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Bathroom' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Hospital (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Hospital', '/AAC_assets/img/locations/hospital.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Hospital' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word School (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('School', '/AAC_assets/img/locations/school.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='School' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Church (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Church', '/AAC_assets/img/locations/church.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Church' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Restaurant (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Restaurant', '/AAC_assets/img/locations/restaurant.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Restaurant' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word House (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('House', '/AAC_assets/img/locations/house.png', 'HOUSE_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='House' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Library (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Library', '/AAC_assets/img/locations/library.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Library' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Here (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Here', '/AAC_assets/img/go/here.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Here' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word There (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('There', '/AAC_assets/img/go/there.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='There' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Away (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Away', '/AAC_assets/img/locations/away.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Away' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Store (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Store', '/AAC_assets/img/locations/store.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Store' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Direction (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Direction', '/AAC_assets/img/locations/directions.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Direction' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Somewhere Else (category: Locations)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Somewhere Else', '/AAC_assets/img/go/somewhereElse.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Somewhere Else' LIMIT 1),(SELECT id FROM category WHERE name='Locations' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Diamond (category: Materials)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Diamond', '/AAC_assets/img/materials/diamond.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Diamond' LIMIT 1),(SELECT id FROM category WHERE name='Materials' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Ruby (category: Materials)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Ruby', '/AAC_assets/img/materials/ruby.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Ruby' LIMIT 1),(SELECT id FROM category WHERE name='Materials' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Glass (category: Materials)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Glass', '/AAC_assets/img/materials/glass.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Glass' LIMIT 1),(SELECT id FROM category WHERE name='Materials' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Stone (category: Materials)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Stone', '/AAC_assets/img/materials/stone.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Stone' LIMIT 1),(SELECT id FROM category WHERE name='Materials' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Paper (category: Materials)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Paper', '/AAC_assets/img/materials/paper.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Paper' LIMIT 1),(SELECT id FROM category WHERE name='Materials' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Stickers (category: Materials)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Stickers', '/AAC_assets/img/materials/stickers.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Stickers' LIMIT 1),(SELECT id FROM category WHERE name='Materials' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Tape (category: Materials)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Tape', '/AAC_assets/img/materials/tape.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Tape' LIMIT 1),(SELECT id FROM category WHERE name='Materials' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Scissors (category: Materials)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Scissors', '/AAC_assets/img/materials/scissors.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Scissors' LIMIT 1),(SELECT id FROM category WHERE name='Materials' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Paintbrush (category: Materials)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Paintbrush', '/AAC_assets/img/materials/paintbrush.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Paintbrush' LIMIT 1),(SELECT id FROM category WHERE name='Materials' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Paint (category: Materials)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Paint', '/AAC_assets/img/materials/paint.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Paint' LIMIT 1),(SELECT id FROM category WHERE name='Materials' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Glue (category: Materials)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Glue', '/AAC_assets/img/materials/glue.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Glue' LIMIT 1),(SELECT id FROM category WHERE name='Materials' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Sponge (category: Materials)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Sponge', '/AAC_assets/img/materials/sponge.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Sponge' LIMIT 1),(SELECT id FROM category WHERE name='Materials' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Fire (category: Materials)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Fire', '/AAC_assets/img/materials/fire.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Fire' LIMIT 1),(SELECT id FROM category WHERE name='Materials' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Wood (category: Materials)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Wood', '/AAC_assets/img/materials/wood.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Wood' LIMIT 1),(SELECT id FROM category WHERE name='Materials' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Material (category: Materials)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Material', '/AAC_assets/img/materials/material.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Material' LIMIT 1),(SELECT id FROM category WHERE name='Materials' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Office (category: Office)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Office', '/AAC_assets/img/job/office.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Office' LIMIT 1),(SELECT id FROM category WHERE name='Office' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Work Words (category: Office)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Work Words', '/AAC_assets/img/job/workWord.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Work Words' LIMIT 1),(SELECT id FROM category WHERE name='Office' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Okay (category: Okay)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Okay', '/AAC_assets/img/tell/okay.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Okay' LIMIT 1),(SELECT id FROM category WHERE name='Okay' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Name (category: Okay)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Name', '/AAC_assets/img/okay/name.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Name' LIMIT 1),(SELECT id FROM category WHERE name='Okay' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Great (category: Okay)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Great', '/AAC_assets/img/okay/great.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Great' LIMIT 1),(SELECT id FROM category WHERE name='Okay' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Cool (category: Okay)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Cool', '/AAC_assets/img/okay/cool.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Cool' LIMIT 1),(SELECT id FROM category WHERE name='Okay' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Wonderful (category: Okay)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Wonderful', '/AAC_assets/img/okay/wonderful.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Wonderful' LIMIT 1),(SELECT id FROM category WHERE name='Okay' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Awesome (category: Okay)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Awesome', '/AAC_assets/img/okay/awesome.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Awesome' LIMIT 1),(SELECT id FROM category WHERE name='Okay' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Real (category: Okay)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Real', '/AAC_assets/img/okay/real.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Real' LIMIT 1),(SELECT id FROM category WHERE name='Okay' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word About (category: Okay)
INSERT INTO word (text, symbol, "tileColor") VALUES ('About', '/AAC_assets/img/okay/about.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='About' LIMIT 1),(SELECT id FROM category WHERE name='Okay' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Let (category: Okay)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Let', '/AAC_assets/img/okay/lets.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Let' LIMIT 1),(SELECT id FROM category WHERE name='Okay' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Excuse Me (category: Okay)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Excuse Me', '/AAC_assets/img/okay/excuseMe.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Excuse Me' LIMIT 1),(SELECT id FROM category WHERE name='Okay' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word maybe (category: Okay)
INSERT INTO word (text, symbol, "tileColor") VALUES ('maybe', '/AAC_assets/img/okay/maybe.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='maybe' LIMIT 1),(SELECT id FROM category WHERE name='Okay' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word My Phrase (category: Okay)
INSERT INTO word (text, symbol, "tileColor") VALUES ('My Phrase', '/AAC_assets/img/okay/myPhrase.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='My Phrase' LIMIT 1),(SELECT id FROM category WHERE name='Okay' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Playlist (category: Playlist)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Playlist', '/AAC_assets/img/sound/playlist.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Playlist' LIMIT 1),(SELECT id FROM category WHERE name='Playlist' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word My Song (category: Playlist)
INSERT INTO word (text, symbol, "tileColor") VALUES ('My Song', '/AAC_assets/img/sound/mySong.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='My Song' LIMIT 1),(SELECT id FROM category WHERE name='Playlist' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word My Artist (category: Playlist)
INSERT INTO word (text, symbol, "tileColor") VALUES ('My Artist', '/AAC_assets/img/sound/my.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='My Artist' LIMIT 1),(SELECT id FROM category WHERE name='Playlist' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Shapes (category: Shapes)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Shapes', '/AAC_assets/img/shapes/triangle.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Shapes' LIMIT 1),(SELECT id FROM category WHERE name='Shapes' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Triangle (category: Shapes)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Triangle', '/AAC_assets/img/shapes/triangle.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Triangle' LIMIT 1),(SELECT id FROM category WHERE name='Shapes' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Square (category: Shapes)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Square', '/AAC_assets/img/shapes/square.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Square' LIMIT 1),(SELECT id FROM category WHERE name='Shapes' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Circle (category: Shapes)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Circle', '/AAC_assets/img/shapes/circle.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Circle' LIMIT 1),(SELECT id FROM category WHERE name='Shapes' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Rectangle (category: Shapes)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Rectangle', '/AAC_assets/img/shapes/rectangle.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Rectangle' LIMIT 1),(SELECT id FROM category WHERE name='Shapes' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Sky (category: Sky)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Sky', '/AAC_assets/img/this/sky.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Sky' LIMIT 1),(SELECT id FROM category WHERE name='Sky' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Planet (category: Sky)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Planet', '/AAC_assets/img/sky/planet.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Planet' LIMIT 1),(SELECT id FROM category WHERE name='Sky' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Space (category: Sky)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Space', '/AAC_assets/img/sky/space.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Space' LIMIT 1),(SELECT id FROM category WHERE name='Sky' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Moon (category: Sky)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Moon', '/AAC_assets/img/sky/moon.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Moon' LIMIT 1),(SELECT id FROM category WHERE name='Sky' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Sun (category: Sky)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Sun', '/AAC_assets/img/sky/sun.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Sun' LIMIT 1),(SELECT id FROM category WHERE name='Sky' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Lightning (category: Sky)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Lightning', '/AAC_assets/img/sky/lightning.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Lightning' LIMIT 1),(SELECT id FROM category WHERE name='Sky' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Thunder (category: Sky)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Thunder', '/AAC_assets/img/sky/thunder.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Thunder' LIMIT 1),(SELECT id FROM category WHERE name='Sky' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Wind (category: Sky)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Wind', '/AAC_assets/img/sky/wind.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Wind' LIMIT 1),(SELECT id FROM category WHERE name='Sky' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Snow (category: Sky)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Snow', '/AAC_assets/img/sky/snow.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Snow' LIMIT 1),(SELECT id FROM category WHERE name='Sky' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Rain (category: Sky)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Rain', '/AAC_assets/img/sky/rain.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Rain' LIMIT 1),(SELECT id FROM category WHERE name='Sky' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Storm (category: Sky)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Storm', '/AAC_assets/img/sky/storm.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Storm' LIMIT 1),(SELECT id FROM category WHERE name='Sky' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Weather (category: Sky)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Weather', '/AAC_assets/img/sky/weather.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Weather' LIMIT 1),(SELECT id FROM category WHERE name='Sky' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Somewhere Else (category: SomewhereElse)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Somewhere Else', '/AAC_assets/img/go/somewhereElse.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Somewhere Else' LIMIT 1),(SELECT id FROM category WHERE name='SomewhereElse' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word My Place (category: SomewhereElse)
INSERT INTO word (text, symbol, "tileColor") VALUES ('My Place', '/AAC_assets/img/locations/myPlace.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='My Place' LIMIT 1),(SELECT id FROM category WHERE name='SomewhereElse' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Sound (category: Sound)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Sound', '/AAC_assets/img/tell/sound.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Sound' LIMIT 1),(SELECT id FROM category WHERE name='Sound' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Loud (category: Sound)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Loud', '/AAC_assets/img/sound/loud.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Loud' LIMIT 1),(SELECT id FROM category WHERE name='Sound' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Quiet (category: Sound)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Quiet', '/AAC_assets/img/sound/quiet.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Quiet' LIMIT 1),(SELECT id FROM category WHERE name='Sound' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Soft (category: Sound)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Soft', '/AAC_assets/img/sound/soft.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Soft' LIMIT 1),(SELECT id FROM category WHERE name='Sound' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Noisy (category: Sound)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Noisy', '/AAC_assets/img/sound/noisy.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Noisy' LIMIT 1),(SELECT id FROM category WHERE name='Sound' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Sing (category: Sound)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Sing', '/AAC_assets/img/sound/sing.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Sing' LIMIT 1),(SELECT id FROM category WHERE name='Sound' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Music (category: Sound)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Music', '/AAC_assets/img/sound/music.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Music' LIMIT 1),(SELECT id FROM category WHERE name='Sound' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Song (category: Sound)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Song', '/AAC_assets/img/sound/song.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Song' LIMIT 1),(SELECT id FROM category WHERE name='Sound' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Playlist (category: Sound)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Playlist', '/AAC_assets/img/sound/playlist.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Playlist' LIMIT 1),(SELECT id FROM category WHERE name='Sound' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Loud (category: Sound)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Loud', '/AAC_assets/img/sound/loud.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Loud' LIMIT 1),(SELECT id FROM category WHERE name='Sound' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Loud (category: Sound)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Loud', '/AAC_assets/img/sound/loud.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Loud' LIMIT 1),(SELECT id FROM category WHERE name='Sound' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Tell (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Tell', '/AAC_assets/img/tell/tell.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Tell' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Yes (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Yes', '/AAC_assets/img/tell/yes.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Yes' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Learn (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Learn', '/AAC_assets/img/tell/learn.png', 'LEARN_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Learn' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Okay (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Okay', '/AAC_assets/img/tell/okay.png', 'OKAY_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Okay' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Sound (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Sound', '/AAC_assets/img/tell/sound.png', 'SOUND_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Sound' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Sorry (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Sorry', '/AAC_assets/img/tell/sorry.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Sorry' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Ask (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Ask', '/AAC_assets/img/tell/ask.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Ask' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Write (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Write', '/AAC_assets/img/tell/write.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Write' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Call (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Call', '/AAC_assets/img/tell/call.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Call' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word No (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('No', '/AAC_assets/img/tell/no.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='No' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Talk (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Talk', '/AAC_assets/img/tell/talk.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Talk' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Speak (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Speak', '/AAC_assets/img/tell/speak.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Speak' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Say (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Say', '/AAC_assets/img/tell/say.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Say' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Guess (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Guess', '/AAC_assets/img/tell/guess.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Guess' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Hello (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Hello', '/AAC_assets/img/tell/hello.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Hello' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Listen (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Listen', '/AAC_assets/img/tell/listen.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Listen' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Hear (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Hear', '/AAC_assets/img/tell/hear.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Hear' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Because (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Because', '/AAC_assets/img/tell/because.png', 'BECAUSE_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Because' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Goodbye (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Goodbye', '/AAC_assets/img/tell/goodbye.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Goodbye' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Please (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Please', '/AAC_assets/img/tell/please.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Please' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Thank You (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Thank You', '/AAC_assets/img/tell/thankyou.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Thank You' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word My Turn (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('My Turn', '/AAC_assets/img/tell/myturn.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='My Turn' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Your Turn (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Your Turn', '/AAC_assets/img/tell/yourTurn.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Your Turn' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Think (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Think', '/AAC_assets/img/tell/think.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Think' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Remember (category: Tell)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Remember', '/AAC_assets/img/tell/remember.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Remember' LIMIT 1),(SELECT id FROM category WHERE name='Tell' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word These (category: These)
INSERT INTO word (text, symbol, "tileColor") VALUES ('These', '/AAC_assets/img/this/this.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='These' LIMIT 1),(SELECT id FROM category WHERE name='These' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word This (category: These)
INSERT INTO word (text, symbol, "tileColor") VALUES ('This', '/AAC_assets/img/this/this.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='This' LIMIT 1),(SELECT id FROM category WHERE name='These' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Could (category: These)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Could', '/AAC_assets/img/this/could.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Could' LIMIT 1),(SELECT id FROM category WHERE name='These' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Would (category: These)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Would', '/AAC_assets/img/this/would.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Would' LIMIT 1),(SELECT id FROM category WHERE name='These' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Still (category: These)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Still', '/AAC_assets/img/this/still.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Still' LIMIT 1),(SELECT id FROM category WHERE name='These' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Also (category: These)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Also', '/AAC_assets/img/this/also.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Also' LIMIT 1),(SELECT id FROM category WHERE name='These' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Instead (category: These)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Instead', '/AAC_assets/img/this/instead.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Instead' LIMIT 1),(SELECT id FROM category WHERE name='These' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Almost (category: These)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Almost', '/AAC_assets/img/this/almost.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Almost' LIMIT 1),(SELECT id FROM category WHERE name='These' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Again (category: These)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Again', '/AAC_assets/img/this/again.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Again' LIMIT 1),(SELECT id FROM category WHERE name='These' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word That (category: These)
INSERT INTO word (text, symbol, "tileColor") VALUES ('That', '/AAC_assets/img/this/that.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='That' LIMIT 1),(SELECT id FROM category WHERE name='These' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Even (category: These)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Even', '/AAC_assets/img/this/even.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Even' LIMIT 1),(SELECT id FROM category WHERE name='These' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Definitely (category: These)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Definitely', '/AAC_assets/img/this/definitely.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Definitely' LIMIT 1),(SELECT id FROM category WHERE name='These' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word May (category: These)
INSERT INTO word (text, symbol, "tileColor") VALUES ('May', '/AAC_assets/img/this/may.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='May' LIMIT 1),(SELECT id FROM category WHERE name='These' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Should (category: These)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Should', '/AAC_assets/img/this/should.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Should' LIMIT 1),(SELECT id FROM category WHERE name='These' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Must (category: These)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Must', '/AAC_assets/img/this/must.png', 'blue') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Must' LIMIT 1),(SELECT id FROM category WHERE name='These' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Very (category: These)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Very', '/AAC_assets/img/this/very.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Very' LIMIT 1),(SELECT id FROM category WHERE name='These' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Sky (category: These)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Sky', '/AAC_assets/img/this/sky.png', 'SKY_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Sky' LIMIT 1),(SELECT id FROM category WHERE name='These' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Job (category: These)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Job', '/AAC_assets/img/this/job.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Job' LIMIT 1),(SELECT id FROM category WHERE name='These' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Game (category: These)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Game', '/AAC_assets/img/this/game.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Game' LIMIT 1),(SELECT id FROM category WHERE name='These' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word He (category: They)
INSERT INTO word (text, symbol, "tileColor") VALUES ('He', '/AAC_assets/img/they/he.png', 'THEY_PRONOUN_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='He' LIMIT 1),(SELECT id FROM category WHERE name='They' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word She (category: They)
INSERT INTO word (text, symbol, "tileColor") VALUES ('She', '/AAC_assets/img/they/she.png', 'THEY_PRONOUN_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='She' LIMIT 1),(SELECT id FROM category WHERE name='They' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word We (category: They)
INSERT INTO word (text, symbol, "tileColor") VALUES ('We', '/AAC_assets/img/they/we.png', 'THEY_PRONOUN_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='We' LIMIT 1),(SELECT id FROM category WHERE name='They' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word They (category: They)
INSERT INTO word (text, symbol, "tileColor") VALUES ('They', '/AAC_assets/img/they/they.png', 'THEY_PRONOUN_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='They' LIMIT 1),(SELECT id FROM category WHERE name='They' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Who (category: They)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Who', '/AAC_assets/img/who/who.png', 'WHO_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Who' LIMIT 1),(SELECT id FROM category WHERE name='They' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Grandma (category: They)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Grandma', '/AAC_assets/img/they/grandma.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Grandma' LIMIT 1),(SELECT id FROM category WHERE name='They' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Grandpa (category: They)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Grandpa', '/AAC_assets/img/they/grandpa.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Grandpa' LIMIT 1),(SELECT id FROM category WHERE name='They' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Teacher (category: They)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Teacher', '/AAC_assets/img/they/teacher.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Teacher' LIMIT 1),(SELECT id FROM category WHERE name='They' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Cook (category: They)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Cook', '/AAC_assets/img/they/cook.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Cook' LIMIT 1),(SELECT id FROM category WHERE name='They' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Sister (category: They)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Sister', '/AAC_assets/img/they/sister.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Sister' LIMIT 1),(SELECT id FROM category WHERE name='They' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Brother (category: They)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Brother', '/AAC_assets/img/they/brother.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Brother' LIMIT 1),(SELECT id FROM category WHERE name='They' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Police Officer (category: They)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Police Officer', '/AAC_assets/img/they/policeofficer.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Police Officer' LIMIT 1),(SELECT id FROM category WHERE name='They' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Mother (category: They)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Mother', '/AAC_assets/img/they/mother.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Mother' LIMIT 1),(SELECT id FROM category WHERE name='They' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Father (category: They)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Father', '/AAC_assets/img/they/father.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Father' LIMIT 1),(SELECT id FROM category WHERE name='They' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Doctor (category: They)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Doctor', '/AAC_assets/img/they/doctor.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Doctor' LIMIT 1),(SELECT id FROM category WHERE name='They' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Fireman (category: They)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Fireman', '/AAC_assets/img/they/fireman.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Fireman' LIMIT 1),(SELECT id FROM category WHERE name='They' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Boy (category: They)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Boy', '/AAC_assets/img/they/boy.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Boy' LIMIT 1),(SELECT id FROM category WHERE name='They' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Girl (category: They)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Girl', '/AAC_assets/img/they/girl.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Girl' LIMIT 1),(SELECT id FROM category WHERE name='They' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Baby (category: They)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Baby', '/AAC_assets/img/they/baby.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Baby' LIMIT 1),(SELECT id FROM category WHERE name='They' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Friend (category: They)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Friend', '/AAC_assets/img/they/friend.png', 'orange') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Friend' LIMIT 1),(SELECT id FROM category WHERE name='They' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Things (category: Things)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Things', '/AAC_assets/img/things/things.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Things' LIMIT 1),(SELECT id FROM category WHERE name='Things' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Boat (category: Things)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Boat', '/AAC_assets/img/things/boat.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Boat' LIMIT 1),(SELECT id FROM category WHERE name='Things' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Bridge (category: Things)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Bridge', '/AAC_assets/img/things/bridge.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Bridge' LIMIT 1),(SELECT id FROM category WHERE name='Things' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Bus (category: Things)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Bus', '/AAC_assets/img/things/bus.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Bus' LIMIT 1),(SELECT id FROM category WHERE name='Things' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Car (category: Things)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Car', '/AAC_assets/img/things/car.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Car' LIMIT 1),(SELECT id FROM category WHERE name='Things' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Plane (category: Things)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Plane', '/AAC_assets/img/things/plane.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Plane' LIMIT 1),(SELECT id FROM category WHERE name='Things' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Flower (category: Things)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Flower', '/AAC_assets/img/things/flower.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Flower' LIMIT 1),(SELECT id FROM category WHERE name='Things' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Forest (category: Things)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Forest', '/AAC_assets/img/things/forest.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Forest' LIMIT 1),(SELECT id FROM category WHERE name='Things' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word It (category: Things)
INSERT INTO word (text, symbol, "tileColor") VALUES ('It', '/AAC_assets/img/things/it.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='It' LIMIT 1),(SELECT id FROM category WHERE name='Things' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Lake (category: Things)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Lake', '/AAC_assets/img/things/lake.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Lake' LIMIT 1),(SELECT id FROM category WHERE name='Things' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Materials (category: Things)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Materials', '/AAC_assets/img/things/materials.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Materials' LIMIT 1),(SELECT id FROM category WHERE name='Things' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Mountain (category: Things)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Mountain', '/AAC_assets/img/things/mountain.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Mountain' LIMIT 1),(SELECT id FROM category WHERE name='Things' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Ocean (category: Things)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Ocean', '/AAC_assets/img/things/ocean.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Ocean' LIMIT 1),(SELECT id FROM category WHERE name='Things' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Road (category: Things)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Road', '/AAC_assets/img/things/road.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Road' LIMIT 1),(SELECT id FROM category WHERE name='Things' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Tool (category: Things)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Tool', '/AAC_assets/img/things/tool.png', 'yellow') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Tool' LIMIT 1),(SELECT id FROM category WHERE name='Things' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Tree (category: Things)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Tree', '/AAC_assets/img/things/tree.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Tree' LIMIT 1),(SELECT id FROM category WHERE name='Things' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Accessory (category: Things)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Accessory', '/AAC_assets/img/things/accessory.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Accessory' LIMIT 1),(SELECT id FROM category WHERE name='Things' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Wallet (category: Things)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Wallet', '/AAC_assets/img/things/wallet.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Wallet' LIMIT 1),(SELECT id FROM category WHERE name='Things' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Rifle (category: Things)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Rifle', '/AAC_assets/img/things/rifle.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Rifle' LIMIT 1),(SELECT id FROM category WHERE name='Things' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word This (category: This)
INSERT INTO word (text, symbol, "tileColor") VALUES ('This', NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='This' LIMIT 1),(SELECT id FROM category WHERE name='This' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Tools (category: Tools)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Tools', '/AAC_assets/img/things/tool.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Tools' LIMIT 1),(SELECT id FROM category WHERE name='Tools' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Fork (category: Tools)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Fork', '/AAC_assets/img/tools/fork.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Fork' LIMIT 1),(SELECT id FROM category WHERE name='Tools' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Spoon (category: Tools)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Spoon', '/AAC_assets/img/tools/spoon.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Spoon' LIMIT 1),(SELECT id FROM category WHERE name='Tools' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Knife (category: Tools)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Knife', '/AAC_assets/img/tools/knife.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Knife' LIMIT 1),(SELECT id FROM category WHERE name='Tools' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Plate (category: Tools)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Plate', '/AAC_assets/img/tools/plate.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Plate' LIMIT 1),(SELECT id FROM category WHERE name='Tools' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Bowl (category: Tools)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Bowl', '/AAC_assets/img/tools/bowl.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Bowl' LIMIT 1),(SELECT id FROM category WHERE name='Tools' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Cup (category: Tools)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Cup', '/AAC_assets/img/tools/cup.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Cup' LIMIT 1),(SELECT id FROM category WHERE name='Tools' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Pen (category: Tools)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Pen', '/AAC_assets/img/tools/pen.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Pen' LIMIT 1),(SELECT id FROM category WHERE name='Tools' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Pencil (category: Tools)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Pencil', '/AAC_assets/img/tools/pencil.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Pencil' LIMIT 1),(SELECT id FROM category WHERE name='Tools' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Paper (category: Tools)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Paper', '/AAC_assets/img/tools/paper.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Paper' LIMIT 1),(SELECT id FROM category WHERE name='Tools' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word ScrewDriver (category: Tools)
INSERT INTO word (text, symbol, "tileColor") VALUES ('ScrewDriver', '/AAC_assets/img/tools/screwdriver.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='ScrewDriver' LIMIT 1),(SELECT id FROM category WHERE name='Tools' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Hammer (category: Tools)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Hammer', '/AAC_assets/img/tools/hammer.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Hammer' LIMIT 1),(SELECT id FROM category WHERE name='Tools' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Ladder (category: Tools)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Ladder', '/AAC_assets/img/tools/ladder.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Ladder' LIMIT 1),(SELECT id FROM category WHERE name='Tools' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Paperclip (category: Tools)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Paperclip', '/AAC_assets/img/tools/paperclip.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Paperclip' LIMIT 1),(SELECT id FROM category WHERE name='Tools' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Umbrella (category: Tools)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Umbrella', '/AAC_assets/img/tools/umbrella.png', 'red') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Umbrella' LIMIT 1),(SELECT id FROM category WHERE name='Tools' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Break (category: Touch)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Break', '/AAC_assets/img/touch/break.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Break' LIMIT 1),(SELECT id FROM category WHERE name='Touch' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Clean (category: Touch)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Clean', '/AAC_assets/img/touch/clean.png', 'TOUCH_ADJECTIVE_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Clean' LIMIT 1),(SELECT id FROM category WHERE name='Touch' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Close (category: Touch)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Close', '/AAC_assets/img/touch/close.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Close' LIMIT 1),(SELECT id FROM category WHERE name='Touch' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Crooked (category: Touch)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Crooked', '/AAC_assets/img/touch/crooked.png', 'TOUCH_ADJECTIVE_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Crooked' LIMIT 1),(SELECT id FROM category WHERE name='Touch' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Cut (category: Touch)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Cut', '/AAC_assets/img/touch/cut.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Cut' LIMIT 1),(SELECT id FROM category WHERE name='Touch' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Dirty (category: Touch)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Dirty', '/AAC_assets/img/touch/dirty.png', 'TOUCH_ADJECTIVE_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Dirty' LIMIT 1),(SELECT id FROM category WHERE name='Touch' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Dull (category: Touch)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Dull', '/AAC_assets/img/touch/dull.png', 'TOUCH_ADJECTIVE_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Dull' LIMIT 1),(SELECT id FROM category WHERE name='Touch' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Finish (category: Touch)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Finish', '/AAC_assets/img/touch/finish.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Finish' LIMIT 1),(SELECT id FROM category WHERE name='Touch' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Fix (category: Touch)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Fix', '/AAC_assets/img/touch/fix.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Fix' LIMIT 1),(SELECT id FROM category WHERE name='Touch' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word New (category: Touch)
INSERT INTO word (text, symbol, "tileColor") VALUES ('New', '/AAC_assets/img/touch/new.png', 'TOUCH_ADJECTIVE_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='New' LIMIT 1),(SELECT id FROM category WHERE name='Touch' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Old (category: Touch)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Old', '/AAC_assets/img/touch/old.png', 'TOUCH_ADJECTIVE_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Old' LIMIT 1),(SELECT id FROM category WHERE name='Touch' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Open (category: Touch)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Open', '/AAC_assets/img/touch/open.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Open' LIMIT 1),(SELECT id FROM category WHERE name='Touch' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Sharp (category: Touch)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Sharp', '/AAC_assets/img/touch/sharp.png', 'TOUCH_ADJECTIVE_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Sharp' LIMIT 1),(SELECT id FROM category WHERE name='Touch' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Short (category: Touch)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Short', '/AAC_assets/img/touch/short.png', 'TOUCH_ADJECTIVE_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Short' LIMIT 1),(SELECT id FROM category WHERE name='Touch' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Show (category: Touch)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Show', '/AAC_assets/img/touch/show.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Show' LIMIT 1),(SELECT id FROM category WHERE name='Touch' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Soft (category: Touch)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Soft', '/AAC_assets/img/touch/soft.png', 'TOUCH_ADJECTIVE_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Soft' LIMIT 1),(SELECT id FROM category WHERE name='Touch' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Straight (category: Touch)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Straight', '/AAC_assets/img/touch/straight.png', 'TOUCH_ADJECTIVE_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Straight' LIMIT 1),(SELECT id FROM category WHERE name='Touch' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Tall (category: Touch)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Tall', '/AAC_assets/img/touch/tall.png', 'TOUCH_ADJECTIVE_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Tall' LIMIT 1),(SELECT id FROM category WHERE name='Touch' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Touch (category: Touch)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Touch', '/AAC_assets/img/touch/touch.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Touch' LIMIT 1),(SELECT id FROM category WHERE name='Touch' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Wash (category: Touch)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Wash', '/AAC_assets/img/touch/wash.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Wash' LIMIT 1),(SELECT id FROM category WHERE name='Touch' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Wet (category: Touch)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Wet', '/AAC_assets/img/touch/wet.png', 'TOUCH_ADJECTIVE_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Wet' LIMIT 1),(SELECT id FROM category WHERE name='Touch' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Made (category: Touch)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Made', '/AAC_assets/img/materials/material.png', 'green') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Made' LIMIT 1),(SELECT id FROM category WHERE name='Touch' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Who (category: Who)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Who', '/AAC_assets/img/who/who.png', 'purple') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Who' LIMIT 1),(SELECT id FROM category WHERE name='Who' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Him (category: Who)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Him', '/AAC_assets/img/they/boy.png', 'WHO_PRONOUN_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Him' LIMIT 1),(SELECT id FROM category WHERE name='Who' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word His (category: Who)
INSERT INTO word (text, symbol, "tileColor") VALUES ('His', '/AAC_assets/img/they/he.png', 'WHO_PRONOUN_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='His' LIMIT 1),(SELECT id FROM category WHERE name='Who' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Her (category: Who)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Her', '/AAC_assets/img/they/girl.png', 'WHO_PRONOUN_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Her' LIMIT 1),(SELECT id FROM category WHERE name='Who' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Hers (category: Who)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Hers', '/AAC_assets/img/they/she.png', 'WHO_PRONOUN_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Hers' LIMIT 1),(SELECT id FROM category WHERE name='Who' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Us (category: Who)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Us', '/AAC_assets/img/who/us.png', 'WHO_PRONOUN_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Us' LIMIT 1),(SELECT id FROM category WHERE name='Who' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Theirs (category: Who)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Theirs', '/AAC_assets/img/who/theirs.png', 'WHO_PRONOUN_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Theirs' LIMIT 1),(SELECT id FROM category WHERE name='Who' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Myself (category: Who)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Myself', '/AAC_assets/img/who/myself.png', 'WHO_PRONOUN_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Myself' LIMIT 1),(SELECT id FROM category WHERE name='Who' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Mine (category: Who)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Mine', '/AAC_assets/img/who/mine.png', 'WHO_PRONOUN_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Mine' LIMIT 1),(SELECT id FROM category WHERE name='Who' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word People (category: Who)
INSERT INTO word (text, symbol, "tileColor") VALUES ('People', '/AAC_assets/img/who/people.png', 'WHO_NOUN_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='People' LIMIT 1),(SELECT id FROM category WHERE name='Who' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Man (category: Who)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Man', '/AAC_assets/img/who/man.png', 'WHO_NOUN_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Man' LIMIT 1),(SELECT id FROM category WHERE name='Who' LIMIT 1)) ON CONFLICT DO NOTHING;
-- Word Woman (category: Who)
INSERT INTO word (text, symbol, "tileColor") VALUES ('Woman', '/AAC_assets/img/who/woman.png', 'WHO_NOUN_TILES_COLOR') ON CONFLICT DO NOTHING;
INSERT INTO word_categories_category ("wordId","categoryId") VALUES ((SELECT id FROM word WHERE text='Woman' LIMIT 1),(SELECT id FROM category WHERE name='Who' LIMIT 1)) ON CONFLICT DO NOTHING;
