const Food = require('./models/Food');
const User = require('./models/User');
const Order = require('./models/Order');

// [name, description, price, category, emoji, isVeg]
const MENU = [
  // Pizza
  ['Margherita Pizza', 'Tomato, mozzarella, fresh basil', 249, 'Pizza', '🍕', true],
  ['Farmhouse Pizza', 'Capsicum, onion, mushroom, tomato', 329, 'Pizza', '🍕', true],
  ['Peppy Paneer Pizza', 'Spicy paneer with red paprika', 349, 'Pizza', '🍕', true],
  ['Cheese Burst Pizza', 'Molten cheese-filled crust', 359, 'Pizza', '🍕', true],
  ['Pepperoni Pizza', 'Classic pepperoni and mozzarella', 379, 'Pizza', '🍕', false],
  ['BBQ Chicken Pizza', 'Smoky BBQ chicken and onions', 399, 'Pizza', '🍕', false],
  // Burgers
  ['Aloo Tikki Burger', 'Crispy potato patty, mint mayo', 99, 'Burgers', '🍔', true],
  ['Veggie Burger', 'Garden patty with fresh veggies', 149, 'Burgers', '🍔', true],
  ['Paneer Zinger Burger', 'Crunchy paneer fillet, spicy sauce', 179, 'Burgers', '🍔', true],
  ['Mushroom Swiss Burger', 'Grilled mushroom and cheese', 189, 'Burgers', '🍔', true],
  ['Crispy Chicken Burger', 'Fried chicken with lettuce', 199, 'Burgers', '🍔', false],
  ['Double Chicken Cheese Burger', 'Two patties, double cheese', 249, 'Burgers', '🍔', false],
  // Wraps & Rolls
  ['Veg Kathi Roll', 'Street-style veg roll', 99, 'Wraps', '🌯', true],
  ['Schezwan Veg Wrap', 'Spicy schezwan veggies', 119, 'Wraps', '🌯', true],
  ['Paneer Tikka Wrap', 'Smoky paneer in a soft roll', 129, 'Wraps', '🌯', true],
  ['Falafel Wrap', 'Crisp falafel, hummus, salad', 139, 'Wraps', '🌯', true],
  ['Egg Roll', 'Double egg paratha roll', 89, 'Wraps', '🌯', false],
  ['Chicken Kathi Roll', 'Tandoori chicken roll', 149, 'Wraps', '🌯', false],
  // Chinese
  ['Hot & Sour Soup', 'Tangy veg soup', 99, 'Chinese', '🍲', true],
  ['Veg Spring Rolls', 'Crispy rolls with sweet chilli dip', 129, 'Chinese', '🥟', true],
  ['Veg Manchurian', 'Veg balls in spicy gravy', 159, 'Chinese', '🥡', true],
  ['Hakka Noodles', 'Wok-tossed veg noodles', 169, 'Chinese', '🍜', true],
  ['Schezwan Fried Rice', 'Fiery fried rice with veggies', 169, 'Chinese', '🍚', true],
  ['Chicken Fried Rice', 'Egg and chicken fried rice', 189, 'Chinese', '🍚', false],
  ['Chilli Paneer', 'Paneer tossed with capsicum', 199, 'Chinese', '🥡', true],
  ['Chicken Manchurian', 'Chicken in tangy gravy', 219, 'Chinese', '🥡', false],
  // North Indian
  ['Butter Naan', 'Soft tandoori naan', 49, 'Indian', '🫓', true],
  ['Chole Bhature', 'Spicy chickpeas with fluffy bhature', 149, 'Indian', '🫓', true],
  ['Rajma Chawal', 'Kidney bean curry with rice', 149, 'Indian', '🍛', true],
  ['Dal Makhani', 'Slow-cooked creamy black lentils', 219, 'Indian', '🍲', true],
  ['Palak Paneer', 'Paneer in spinach gravy', 239, 'Indian', '🥬', true],
  ['Paneer Butter Masala', 'Rich tomato-butter gravy', 259, 'Indian', '🍛', true],
  ['Kadhai Chicken', 'Chicken with peppers and spices', 289, 'Indian', '🍗', false],
  ['Butter Chicken Bowl', 'Creamy curry with rice', 299, 'Indian', '🍛', false],
  // South Indian
  ['Medu Vada', 'Crisp lentil donuts with sambar', 79, 'South Indian', '🍩', true],
  ['Idli Sambar', 'Steamed rice cakes, sambar, chutney', 89, 'South Indian', '🍚', true],
  ['Uttapam', 'Thick pancake with onion and tomato', 109, 'South Indian', '🥞', true],
  ['Masala Dosa', 'Crispy dosa with potato masala', 119, 'South Indian', '🥞', true],
  ['Rava Dosa', 'Lacy semolina dosa', 129, 'South Indian', '🥞', true],
  ['Mysore Masala Dosa', 'Spicy red chutney dosa', 139, 'South Indian', '🥞', true],
  // Biryani
  ['Veg Biryani', 'Fragrant basmati with vegetables', 199, 'Biryani', '🍚', true],
  ['Egg Biryani', 'Spiced rice with boiled eggs', 229, 'Biryani', '🍚', false],
  ['Paneer Biryani', 'Dum biryani with paneer', 239, 'Biryani', '🍚', true],
  ['Hyderabadi Chicken Biryani', 'Dum-cooked, with raita', 279, 'Biryani', '🍗', false],
  ['Mutton Biryani', 'Slow-cooked mutton biryani', 349, 'Biryani', '🍖', false],
  // Pasta
  ['Arrabbiata Pasta', 'Spicy tomato penne', 209, 'Pasta', '🍝', true],
  ['Alfredo Pasta', 'Creamy white sauce penne', 229, 'Pasta', '🍝', true],
  ['Pesto Penne', 'Basil pesto and parmesan', 239, 'Pasta', '🍝', true],
  ['Mac & Cheese', 'Baked cheesy macaroni', 199, 'Pasta', '🧀', true],
  ['Chicken Alfredo Pasta', 'Creamy pasta with grilled chicken', 269, 'Pasta', '🍝', false],
  ['Veg Lasagna', 'Layered pasta, béchamel, cheese', 279, 'Pasta', '🍝', true],
  // Sandwiches
  ['Bombay Masala Sandwich', 'Chutney, potato and veggies', 79, 'Sandwiches', '🥪', true],
  ['Cheese Chilli Toast', 'Toasted cheesy chilli bread', 89, 'Sandwiches', '🍞', true],
  ['Grilled Veg Sandwich', 'Grilled with cheese and veggies', 99, 'Sandwiches', '🥪', true],
  ['Paneer Sandwich', 'Spiced paneer filling', 129, 'Sandwiches', '🥪', true],
  ['Club Sandwich', 'Triple-decker with fries', 149, 'Sandwiches', '🥪', true],
  ['Chicken Tikka Sandwich', 'Tandoori chicken and mint mayo', 169, 'Sandwiches', '🥪', false],
  // Snacks
  ['Samosa (2 pcs)', 'Crisp pastry with spiced potato', 39, 'Snacks', '🥟', true],
  ['Pani Puri', '6 crispy puris with tangy water', 59, 'Snacks', '🫧', true],
  ['Dahi Puri', 'Puris with curd and chutneys', 79, 'Snacks', '🥣', true],
  ['Masala Fries', 'Spicy, crunchy, shareable', 99, 'Snacks', '🍟', true],
  ['Onion Rings', 'Golden battered rings', 109, 'Snacks', '🧅', true],
  ['Pav Bhaji', 'Buttery bhaji with toasted pav', 149, 'Snacks', '🍞', true],
  ['Loaded Nachos', 'Cheese, salsa, jalapeños', 149, 'Snacks', '🌮', true],
  ['Chicken Nuggets', '8 crispy nuggets with dip', 149, 'Snacks', '🍗', false],
  ['Paneer Tikka', 'Tandoor-grilled paneer cubes', 219, 'Snacks', '🍢', true],
  // Breakfast
  ['Poha', 'Flattened rice with peanuts', 59, 'Breakfast', '🥣', true],
  ['Upma', 'Semolina with veggies', 59, 'Breakfast', '🥣', true],
  ['Veg Omelette', 'Three-egg omelette with veggies', 79, 'Breakfast', '🍳', false],
  ['Aloo Paratha', 'Stuffed paratha with curd and pickle', 89, 'Breakfast', '🫓', true],
  ['French Toast', 'Golden toast with maple syrup', 99, 'Breakfast', '🍞', true],
  ['Fluffy Pancakes', 'Stack of three with honey', 129, 'Breakfast', '🥞', true],
  // Healthy
  ['Sprout Chaat', 'Protein-rich sprouts salad', 89, 'Healthy', '🥗', true],
  ['Fruit Bowl', 'Seasonal fresh fruits', 119, 'Healthy', '🍉', true],
  ['Oats Smoothie Bowl', 'Oats, banana, berries, seeds', 159, 'Healthy', '🥣', true],
  ['Greek Salad', 'Feta, olives, cucumber, tomato', 169, 'Healthy', '🥗', true],
  ['Quinoa Veg Bowl', 'Quinoa with roasted veggies', 229, 'Healthy', '🥣', true],
  ['Grilled Chicken Salad', 'Lean chicken, greens, dressing', 249, 'Healthy', '🥗', false],
  // Desserts
  ['Kulfi', 'Malai kulfi on a stick', 79, 'Dessert', '🍦', true],
  ['Gulab Jamun (2 pcs)', 'Warm syrup-soaked dumplings', 89, 'Dessert', '🍮', true],
  ['Jalebi', 'Crisp, syrupy swirls', 99, 'Dessert', '🍥', true],
  ['Choco Lava Cake', 'Molten chocolate centre', 109, 'Dessert', '🍰', true],
  ['Chocolate Brownie', 'Warm with fudge sauce', 119, 'Dessert', '🍫', true],
  ['Rasmalai', 'Soft cheese in saffron milk', 129, 'Dessert', '🍮', true],
  ['Ice Cream Sundae', 'Vanilla, nuts, chocolate sauce', 149, 'Dessert', '🍨', true],
  ['New York Cheesecake', 'Creamy baked cheesecake', 179, 'Dessert', '🍰', true],
  // Drinks
  ['Masala Chai', 'Hot spiced tea', 39, 'Drinks', '☕', true],
  ['Cola', 'Chilled 300 ml', 49, 'Drinks', '🥤', true],
  ['Filter Coffee', 'South Indian style', 59, 'Drinks', '☕', true],
  ['Fresh Lime Soda', 'Sweet or salted', 69, 'Drinks', '🍋', true],
  ['Mango Lassi', 'Chilled and thick', 79, 'Drinks', '🥭', true],
  ['Watermelon Juice', 'Fresh pressed', 89, 'Drinks', '🍉', true],
  ['Thandai', 'Cold spiced almond milk', 99, 'Drinks', '🥛', true],
  ['Cold Coffee', 'Blended with ice cream', 129, 'Drinks', '🧋', true],
  ['Oreo Shake', 'Thick cookies-and-cream shake', 149, 'Drinks', '🥤', true],
];

const DEMO_USERS = [
  ['Aarav Sharma', 'aarav@example.com'],
  ['Diya Patel', 'diya@example.com'],
  ['Rohan Mehta', 'rohan@example.com'],
  ['Ananya Iyer', 'ananya@example.com'],
  ['Kabir Singh', 'kabir@example.com'],
  ['Meera Nair', 'meera@example.com'],
];

const ADDRESSES = [
  '12 Park Street, Kolkata 700016',
  '45 MG Road, Bengaluru 560001',
  '7 Sector 18, Noida 201301',
  '221 Marine Drive, Mumbai 400020',
  '88 Anna Salai, Chennai 600002',
  '19 Banjara Hills, Hyderabad 500034',
];

const STATUSES = ['delivered', 'delivered', 'delivered', 'out_for_delivery', 'preparing', 'placed', 'cancelled'];
const rand = (n) => Math.floor(Math.random() * n);

module.exports = async function seed() {
  // Menu: insert only the items that don't exist yet, so admin edits are never overwritten
  const ops = MENU.map(([name, description, price, category, emoji, isVeg], i) => ({
    updateOne: {
      filter: { name },
      update: {
        $setOnInsert: {
          name, description, price, category, emoji, isVeg,
          rating: Math.min(4.9, +(3.8 + ((i * 7) % 12) / 10).toFixed(1)),
          prepTime: 10 + ((i * 5) % 21),
          available: true,
        },
      },
      upsert: true,
    },
  }));
  const res = await Food.bulkWrite(ops);
  if (res.upsertedCount) console.log(`Seeded ${res.upsertedCount} menu items`);

  // Admin + demo customers
  if (!(await User.findOne({ email: 'admin@quickbite.com' }))) {
    await User.create({ name: 'QuickBite Admin', email: 'admin@quickbite.com', password: 'Admin@123', role: 'admin' });
    console.log('Seeded admin: admin@quickbite.com / Admin@123');
  }
  for (const [name, email] of DEMO_USERS) {
    if (!(await User.findOne({ email }))) await User.create({ name, email, password: 'User@123' });
  }

  // Sample order history so the admin dashboard and "My Orders" aren't empty
  if ((await Order.countDocuments()) === 0) {
    const users = await User.find({ role: 'user' });
    const foods = await Food.find();
    const orders = [];
    for (let n = 0; n < 40; n++) {
      const picks = Array.from({ length: 1 + rand(4) }, () => foods[rand(foods.length)]);
      const items = picks.map((f) => ({ food: f._id, name: f.name, price: f.price, qty: 1 + rand(3) }));
      const createdAt = new Date(Date.now() - rand(14 * 24 * 60) * 60 * 1000);
      orders.push({
        user: users[rand(users.length)]._id,
        items,
        total: items.reduce((s, i) => s + i.price * i.qty, 0),
        address: ADDRESSES[rand(ADDRESSES.length)],
        status: STATUSES[rand(STATUSES.length)],
        createdAt,
      });
    }
    await Order.insertMany(orders);
    console.log('Seeded 40 sample orders (demo customers use password User@123)');
  }
};
