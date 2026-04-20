import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({});

async function main() {
  console.log('Seeding database...');

  // Create Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hotel.com' },
    update: {},
    create: {
      name: 'Hotel Manager',
      email: 'admin@hotel.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create User
  const userPassword = await bcrypt.hash('user123', 10);
  await prisma.user.upsert({
    where: { email: 'user@hotel.com' },
    update: {},
    create: {
      name: 'John Guest',
      email: 'user@hotel.com',
      password: userPassword,
      role: 'CUSTOMER',
    },
  });

  const menuItems = [
    // ── Veg ──
    { name: 'Paneer Butter Masala', description: 'Rich and creamy curry made with paneer, spices, onions, tomatoes, cashews and butter.', price: 350, category: 'Veg', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80' },
    { name: 'Veg Hakka Noodles', description: 'Wok tossed noodles with crunchy vegetables.', price: 210, category: 'Veg', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80' },
    { name: 'Butter Naan', description: 'Soft and buttery Indian flatbread baked in tandoor.', price: 60, category: 'Veg', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80' },
    { name: 'Dal Makhani', description: 'Whole black lentils cooked with butter and cream in a rich gravy.', price: 280, category: 'Veg', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80' },
    { name: 'Malai Kofta', description: 'Deep fried paneer potato balls in smooth, rich and creamy gravy.', price: 360, category: 'Veg', image: 'https://images.unsplash.com/photo-1585937421612-70a00df19932?auto=format&fit=crop&w=800&q=80' },

    // ── Non-Veg ──
    { name: 'Chicken Tikka Masala', description: 'Roasted marinated chicken chunks in a spiced curry sauce.', price: 420, category: 'Non-Veg', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80' },
    { name: 'Mutton Biryani', description: 'Classic dum biryani with tender mutton pieces and fragrant basmati rice.', price: 550, category: 'Non-Veg', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80' },
    { name: 'Crispy Fried Chicken', description: 'Golden crispy chicken wings served with dip.', price: 320, category: 'Non-Veg', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80' },
    { name: 'Fish Curry', description: 'Spicy and tangy coastal style fish curry.', price: 480, category: 'Non-Veg', image: 'https://images.pexels.com/photos/3659862/pexels-photo-3659862.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Chilli Chicken Dry', description: 'Batter fried chicken chunks tossed in spicy Chinese sauces.', price: 340, category: 'Non-Veg', image: 'https://images.unsplash.com/photo-1604908177453-7462950a6a3b?auto=format&fit=crop&w=800&q=80' },

    // ── Drinks ──
    { name: 'Fresh Lime Soda', description: 'Refreshing sweet and salty lime soda.', price: 90, category: 'Drinks', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80' },
    { name: 'Virgin Mojito', description: 'Mint and lemon muddled with ice and topped with sprite.', price: 150, category: 'Drinks', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80' },
    { name: 'Cold Coffee', description: 'Thick and creamy cold coffee blended with vanilla ice cream.', price: 160, category: 'Drinks', image: 'https://images.pexels.com/photos/2615323/pexels-photo-2615323.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Oreo Shake', description: 'Milkshake loaded with oreos, chocolate syrup and whipped cream.', price: 180, category: 'Drinks', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80' },

    // ── Wine & Beer (branded bottle/glass images) ──
    { name: 'Cabernet Sauvignon', description: 'Full-bodied red wine with deep dark fruit flavors and savory notes.', price: 1250, category: 'Wine & Beer', image: 'https://images.pexels.com/photos/2912108/pexels-photo-2912108.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Merlot', description: 'Elegant and soft red wine with plush plum and black cherry flavors.', price: 1100, category: 'Wine & Beer', image: 'https://images.pexels.com/photos/1123260/pexels-photo-1123260.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Pinot Noir', description: 'Light to medium-bodied red wine featuring delicate red fruit aromas.', price: 1450, category: 'Wine & Beer', image: 'https://images.pexels.com/photos/2702805/pexels-photo-2702805.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Chardonnay', description: 'Rich white wine with elegant flavors of yellow apple and a buttery finish.', price: 950, category: 'Wine & Beer', image: 'https://images.pexels.com/photos/5088017/pexels-photo-5088017.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Sauvignon Blanc', description: 'Crisp and vibrant white wine with refreshing acidity and citrus notes.', price: 850, category: 'Wine & Beer', image: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Premium Champagne', description: 'Iconic French sparkling wine with fine bubbles and complex notes.', price: 2450, category: 'Wine & Beer', image: 'https://images.pexels.com/photos/1571698/pexels-photo-1571698.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Prosecco', description: 'Lively and fruit-forward Italian sparkling wine with delicate aromas.', price: 1200, category: 'Wine & Beer', image: 'https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Golden Lager', description: 'Smooth, refreshing, and crisp golden lager with a clean malt finish.', price: 380, category: 'Wine & Beer', image: 'https://images.pexels.com/photos/1269025/pexels-photo-1269025.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Craft IPA', description: 'Hoppy and aromatic India Pale Ale with bold citrus and pine characters.', price: 480, category: 'Wine & Beer', image: 'https://images.pexels.com/photos/1267696/pexels-photo-1267696.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Guinness Extra Stout', description: 'Rich, dark Irish stout with deep notes of roasted coffee.', price: 550, category: 'Wine & Beer', image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Wheat Beer (Blanc)', description: 'Refreshing French-style wheat beer with hints of citrus.', price: 500, category: 'Wine & Beer', image: 'https://images.pexels.com/photos/1269043/pexels-photo-1269043.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Dutch Pilsner', description: 'World-famous pilsner with a perfectly balanced and recognizable taste.', price: 420, category: 'Wine & Beer', image: 'https://images.pexels.com/photos/1552631/pexels-photo-1552631.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'American Lager', description: 'Clean, crisp, and refreshing American classic lager.', price: 400, category: 'Wine & Beer', image: 'https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Mexican Lime Beer', description: 'Light lager served with a fresh slice of lime for the ultimate refreshment.', price: 450, category: 'Wine & Beer', image: 'https://images.pexels.com/photos/1292862/pexels-photo-1292862.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Classic Pilsner', description: 'Traditional golden beer with a slightly bitter finish.', price: 350, category: 'Wine & Beer', image: 'https://images.pexels.com/photos/1269042/pexels-photo-1269042.jpeg?auto=compress&cs=tinysrgb&w=800' },

    // ── Starters ──
    { name: 'Paneer Tikka', description: 'Marinated paneer cubes grilled to perfection with onions and bell peppers.', price: 280, category: 'Starters', image: 'https://images.pexels.com/photos/5410400/pexels-photo-5410400.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Chicken Tikka', description: 'Classic Indian starter of marinated and grilled chicken breast pieces.', price: 340, category: 'Starters', image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Veg Spring Rolls', description: 'Crispy deep-fried rolls stuffed with seasoned vegetables.', price: 180, category: 'Starters', image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Crispy Corn', description: 'Batter-fried sweet corn tossed with onions, green chilies, and spices.', price: 195, category: 'Starters', image: 'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Hara Bhara Kabab', description: 'Healthy and delicious green patties made with spinach, peas, and potatoes.', price: 210, category: 'Starters', image: 'https://images.pexels.com/photos/6542779/pexels-photo-6542779.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Fish Fingers', description: 'Crispy breaded fish strips served with tartar sauce.', price: 380, category: 'Starters', image: 'https://images.pexels.com/photos/3296398/pexels-photo-3296398.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Chili Paneer', description: 'Paneer cubes tossed in a spicy, tangy Indo-Chinese sauce.', price: 260, category: 'Starters', image: 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Garlic Mushrooms', description: 'Sautéed mushrooms with garlic, herbs, and a touch of butter.', price: 240, category: 'Starters', image: 'https://images.pexels.com/photos/5662182/pexels-photo-5662182.jpeg?auto=compress&cs=tinysrgb&w=800' },

    // ── Desserts ──
    { name: 'Gulab Jamun', description: 'Warm milk-solid based sweets soaked in cardamom flavored sugar syrup.', price: 120, category: 'Desserts', image: 'https://images.pexels.com/photos/15016498/pexels-photo-15016498.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Chocolate Brownie', description: 'Warm fudge brownie served with a scoop of vanilla ice cream.', price: 210, category: 'Desserts', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' },
    { name: 'NY Cheesecake', description: 'Creamy New York style cheesecake with a classic graham cracker crust.', price: 280, category: 'Desserts', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80' },
    { name: 'Fruit Tart', description: 'Shortcrust pastry filled with pastry cream and topped with fresh seasonal fruits.', price: 190, category: 'Desserts', image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Tiramisu', description: 'Coffee-flavored Italian dessert made of ladyfingers dipped in coffee.', price: 320, category: 'Desserts', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80' },
    { name: 'Red Velvet Cake', description: 'Rich velvet cake with cream cheese frosting.', price: 240, category: 'Desserts', image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=800&q=80' },
    { name: 'Kulfi', description: 'Traditional Indian frozen dessert made with reduced milk and saffron.', price: 140, category: 'Desserts', image: 'https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg?auto=compress&cs=tinysrgb&w=800' },
  ];

  for (const item of menuItems) {
    const exists = await prisma.menu.findFirst({ where: { name: item.name } });
    if (!exists) {
      await prisma.menu.create({ data: item });
    } else if (item.image) {
      await prisma.menu.update({ where: { id: exists.id }, data: { image: item.image } });
    }
  }

  console.log('Database seeded!');
  console.log('Admin Login -> admin@hotel.com / admin123');
  console.log('User Login -> user@hotel.com / user123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
