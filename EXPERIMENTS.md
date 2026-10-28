# Full Stack Development – Lab File (Experiments 1–10)

**Mini project:** QuickBite – Food Delivery System (MERN)
Every experiment below builds one milestone of the same project. All code lives in this folder.

---

## Experiment 1 – Build Responsive and Interactive UIs using Tailwind CSS
**Milestone:** Responsive frontend pages (Home, Login, Dashboard)

**Aim:** To build a responsive and interactive webpage using Tailwind CSS.

**Step 1 – Create the React (Vite) project**
```bash
npm create vite@latest frontend -- --template react
cd frontend && npm install
```

**Step 2 – Install and initialise Tailwind CSS**
```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

**Step 3 – Configure template paths and dark mode** (`tailwind.config.js`)
```js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: { extend: { colors: { brand: { 500: '#f97316', 600: '#ea580c', 700: '#c2410c' } } } },
  plugins: [],
};
```

**Step 4 – Add Tailwind directives and reusable classes** (`src/index.css`)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn { @apply inline-flex rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700; }
  .card { @apply rounded-2xl border bg-white p-4 shadow-sm dark:bg-gray-800; }
}
```

**Step 5 – Build the responsive Home page** (`src/pages/Home.jsx`)
```jsx
<section className="rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 px-6 py-14 text-center text-white md:py-20">
  <h1 className="text-4xl font-extrabold md:text-6xl">Hungry? Get it in minutes.</h1>
  <Link to="/menu" className="mt-8 inline-block rounded-xl bg-white px-6 py-3 font-bold text-brand-700">Order now</Link>
</section>
<section className="mt-10 grid gap-4 md:grid-cols-3">   {/* 1 column on phone, 3 on desktop */}
  {steps.map(s => <div key={s.title} className="card text-center">…</div>)}
</section>
```
Responsive navbar with a mobile hamburger: `hidden md:flex` + a toggle button (`src/components/Navbar.jsx`).
Interactive states: `hover:`, `focus-visible:`, `dark:` utilities.

**Run:** `npm run dev` → open http://localhost:5173 and resize the window.
**Accessibility notes:** skip link, `aria-label`s, visible focus rings, `sr-only` labels, `motion-reduce` support.
**Result:** A responsive, interactive UI built with Tailwind CSS.

---

## Experiment 2 – React Hooks
**Milestone:** Forms, data fetching and reusable custom hooks

**Aim:** To use `useState`, `useEffect`, `useMemo` and custom hooks to build forms and fetch data.

**Step 1 – `useState` for form fields and UI state** (`pages/Menu.jsx`)
```jsx
const [search, setSearch] = useState('');
const [category, setCategory] = useState('All');
```

**Step 2 – `useEffect` + fetch inside a reusable custom hook** (`hooks/useFetch.js`)
```jsx
export default function useFetch(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const load = useCallback(async () => {
    setLoading(true);
    try { setData(await api(path)); } catch (e) { setError(e.message); } finally { setLoading(false); }
  }, [path]);
  useEffect(() => { load(); }, [load]);
  return { data, loading, error, refetch: load };
}
```

**Step 3 – Custom form hook with validation** (`hooks/useForm.js`)
```jsx
export default function useForm(initial, validate) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const onChange = (e) => setValues(v => ({ ...v, [e.target.name]: e.target.value }));
  const handleSubmit = (onValid) => (e) => {
    e.preventDefault();
    const found = validate ? validate(values) : {};
    setErrors(found);
    if (!Object.keys(found).length) onValid(values);
  };
  return { values, errors, onChange, handleSubmit };
}
```

**Step 4 – Use the hooks in a page** (`pages/Login.jsx`, `pages/Menu.jsx`)
```jsx
const { values, errors, onChange, handleSubmit } = useForm({ email: '', password: '' }, validate);
const { data: foods, loading, error } = useFetch('/foods');
```

**Step 5 – `useMemo` for filtered lists**
```jsx
const visible = useMemo(() => foods.filter(f => f.name.toLowerCase().includes(search.toLowerCase())), [foods, search]);
```
**Result:** Working forms with validation, API data fetching and reusable hooks.

---

## Experiment 3 – Redux / Context API
**Milestone:** Manage login state, cart and application data

**Aim:** To manage global state with Redux Toolkit and the Context API.

**Step 1 – Install**
```bash
npm install @reduxjs/toolkit react-redux
```

**Step 2 – Create the cart slice** (`store/cartSlice.js`)
```js
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addItem(state, { payload }) {
      const found = state.items.find(i => i.id === payload._id);
      if (found) found.qty += 1;
      else state.items.push({ id: payload._id, name: payload.name, price: payload.price, qty: 1 });
    },
    removeItem(state, { payload }) { state.items = state.items.filter(i => i.id !== payload); },
    clearCart(state) { state.items = []; },
  },
});
```

**Step 3 – Create the auth slice with an async thunk** (`store/authSlice.js`)
```js
export const login = createAsyncThunk('auth/login', async (body, { rejectWithValue }) => {
  try { return await api('/auth/login', { method: 'POST', body }); }
  catch (e) { return rejectWithValue(e.message); }
});
```

**Step 4 – Configure the store and provide it** (`store/index.js`, `main.jsx`)
```jsx
export const store = configureStore({ reducer: { auth, cart } });

<Provider store={store}><App /></Provider>
```

**Step 5 – Context API for the theme + use state in components**
```jsx
// context/ThemeContext.jsx
const ThemeContext = createContext();
export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(false);
  return <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>{children}</ThemeContext.Provider>;
};

// in a component
const dispatch = useDispatch();
const count = useSelector(selectCartCount);
dispatch(addItem(food));
```
**Result:** Login state and cart shared across the whole app.

---

## Experiment 4 – REST API + MongoDB + Mongoose
**Milestone:** Create CRUD APIs and connect to the database

**Aim:** To build CRUD REST APIs with Express and store data in MongoDB using Mongoose.

**Step 1 – Initialise the backend**
```bash
mkdir backend && cd backend && npm init -y
npm install express mongoose cors dotenv
```

**Step 2 – Connect to MongoDB** (`src/config/db.js`)
```js
module.exports = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');
};
```

**Step 3 – Define the schema** (`src/models/Food.js`)
```js
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  category: { type: String, default: 'Main' },
  available: { type: Boolean, default: true },
}, { timestamps: true });
module.exports = mongoose.model('Food', foodSchema);
```

**Step 4 – CRUD routes** (`src/routes/foods.js`)
```js
router.get('/',  async (req, res) => res.json(await Food.find()));                       // Read
router.post('/', async (req, res) => res.status(201).json(await Food.create(req.body))); // Create
router.put('/:id', async (req, res) =>                                                    // Update
  res.json(await Food.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete('/:id', async (req, res) => {                                               // Delete
  await Food.findByIdAndDelete(req.params.id);
  res.json({ message: 'Food deleted' });
});
```

**Step 5 – Start the server and test**
```bash
node server.js
curl http://localhost:5000/api/foods
curl -X POST http://localhost:5000/api/foods -H "Content-Type: application/json" \
     -d '{"name":"Pizza","price":249}'
```
**Result:** Full CRUD API connected to MongoDB.

---

## Experiment 5 – Secure REST APIs
**Milestone:** Validation, error handling and production-ready API structure

**Aim:** To secure and structure the API for production.

**Step 1 – Install security packages**
```bash
npm install express-validator helmet express-rate-limit morgan
```

**Step 2 – Add helmet, CORS, body limit and rate limiting** (`app.js`)
```js
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json({ limit: '10kb' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
```

**Step 3 – Request validation middleware** (`middleware/validate.js` + route rules)
```js
router.post('/register',
  [ body('name').trim().isLength({ min: 2 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }) ],
  validate, handler);
```

**Step 4 – Central error handling** (`middleware/error.js`)
```js
exports.notFound = (req, res) => res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
exports.errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: status === 500 ? 'Server error' : err.message });
};
```
Plus an `asyncHandler` wrapper so rejected promises reach the error handler.

**Step 5 – Layered structure + tests**
```
backend/ app.js · server.js · src/{config,models,routes,middleware,utils} · tests/
```
```bash
npm test      # node:test checks /api/health, 401 on protected routes, 404 on unknown routes
```
**Result:** A validated, rate-limited, well-structured API.

---

## Experiment 6 – JWT Authentication
**Milestone:** Login, registration, protected routes and user roles (Admin/User)

**Aim:** To implement JWT-based authentication and role-based authorization.

**Step 1 – Install**
```bash
npm install jsonwebtoken bcryptjs
```

**Step 2 – User model with password hashing** (`models/User.js`)
```js
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.matchPassword = function (plain) { return bcrypt.compare(plain, this.password); };
```

**Step 3 – Register / login issue a token** (`routes/auth.js`)
```js
const sign = (u) => jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
// login
const user = await User.findOne({ email }).select('+password');
if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid email or password' });
res.json({ token: sign(user), user });
```

**Step 4 – Protect routes and check roles** (`middleware/auth.js`)
```js
exports.protect = async (req, res, next) => {
  const token = (req.headers.authorization || '').split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authenticated' });
  const { id } = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(id);
  next();
};
exports.authorize = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'Forbidden' });

router.post('/', protect, authorize('admin'), createFood);   // admin only
```

**Step 5 – Protect pages in React** (`components/ProtectedRoute.jsx`)
```jsx
export default function ProtectedRoute({ children, role }) {
  const { user } = useSelector(s => s.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}
<Route path="/admin" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
```
**Result:** Secure login/registration, protected routes and Admin/User roles.
(Public signup can never create an admin; the admin is seeded: `admin@quickbite.com / Admin@123`.)

---

## Experiment 7 – Deploy using Docker
**Milestone:** Dockerize frontend and backend

**Aim:** To containerize the application using Docker.

**Step 1 – Backend Dockerfile** (`backend/Dockerfile`)
```dockerfile
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

**Step 2 – Frontend multi-stage Dockerfile** (`frontend/Dockerfile`)
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

**Step 3 – `.dockerignore`**
```
node_modules
dist
.env
```

**Step 4 – Build the images**
```bash
docker build -t quickbite-backend ./backend
docker build -t quickbite-frontend ./frontend
```

**Step 5 – Run the containers**
```bash
docker run -d -p 5000:5000 -e MONGO_URI=mongodb://host.docker.internal:27017/quickbite quickbite-backend
docker run -d -p 3000:80 quickbite-frontend
docker ps
```
**Result:** Frontend and backend run as Docker containers.

---

## Experiment 8 – WebSockets
**Milestone:** Add real-time notifications

**Aim:** To add real-time order notifications using Socket.io.

**Step 1 – Install**
```bash
npm install socket.io            # backend
npm install socket.io-client     # frontend
```

**Step 2 – Attach Socket.io to the HTTP server and authenticate with the JWT** (`src/socket.js`, `server.js`)
```js
io = new Server(httpServer, { cors: { origin: true } });
io.use((socket, next) => {
  try { socket.user = jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET); next(); }
  catch { next(new Error('unauthorized')); }
});
io.on('connection', (socket) => {
  socket.join(`user:${socket.user.id}`);
  if (socket.user.role === 'admin') socket.join('admins');
});
```

**Step 3 – Emit events from the REST routes** (`routes/orders.js`)
```js
socket.toAdmins('order:new', { id: order._id, total, by: req.user.name });          // on new order
socket.toUser(order.user, 'order:update', { id: order._id, status: order.status }); // on status change
```

**Step 4 – Connect from React** (`socket.js`)
```js
export const connectSocket = (token) => io('/', { auth: { token } });
```

**Step 5 – Show live toasts** (`components/Notifications.jsx`)
```jsx
socket.on('order:update', (o) => push(`🔔 Your order ${LABELS[o.status]}`));
socket.on('order:new',    (o) => push(`🆕 New order of ₹${o.total} from ${o.by}`));
```
**Test:** log in as user + admin in two browsers; change an order's status and watch the toast appear instantly.
**Result:** Real-time notifications between admin and customers.

---

## Experiment 9 – Containerization (Docker Compose)
**Milestone:** Multi-container setup using Docker Compose

**Aim:** To run MongoDB, backend and frontend together with Docker Compose.

**Step 1 – Plan the services:** `mongo` (database) · `backend` (API) · `frontend` (nginx serving React).

**Step 2 – Write `docker-compose.yml`**
```yaml
services:
  mongo:
    image: mongo:7
    volumes: [mongo_data:/data/db]
  backend:
    build: ./backend
    environment:
      MONGO_URI: mongodb://mongo:27017/quickbite
      JWT_SECRET: ${JWT_SECRET:-change_me_in_production}
    depends_on: [mongo]
  frontend:
    build: ./frontend
    ports: ["3000:80"]
    depends_on: [backend]
volumes:
  mongo_data:
```

**Step 3 – nginx reverse proxy so the browser talks to one origin** (`frontend/nginx.conf`)
```nginx
location /          { try_files $uri /index.html; }
location /api/      { proxy_pass http://backend:5000; }
location /socket.io/ {
  proxy_pass http://backend:5000;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
}
```

**Step 4 – Start everything**
```bash
docker compose up --build
```

**Step 5 – Verify and stop**
```bash
docker compose ps
docker compose logs -f backend
# open http://localhost:3000
docker compose down
```
**Result:** The whole QuickBite system runs with a single command.

---

## Experiment 10 – CI/CD
**Milestone:** Deploy automatically using GitHub Actions and Render/Vercel

**Aim:** To automate testing, building and deployment with GitHub Actions.

**Step 1 – Push the project to GitHub**
```bash
git init && git add . && git commit -m "QuickBite"
git branch -M main && git remote add origin <your-repo-url> && git push -u origin main
```

**Step 2 – Create the workflow** (`.github/workflows/ci.yml`) – test + build job
```yaml
on: { push: { branches: [main] }, pull_request: { branches: [main] } }
jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - { name: Backend tests, working-directory: backend,  run: "npm install && npm test" }
      - { name: Frontend build, working-directory: frontend, run: "npm install && npm run build" }
```

**Step 3 – Deploy the backend to Render**
1. Render → New Web Service → connect the repo, root `backend`, start command `node server.js`.
2. Add env vars: `MONGO_URI` (MongoDB Atlas), `JWT_SECRET`, `CLIENT_ORIGIN`.
3. Copy the service's **Deploy Hook URL** → GitHub repo → Settings → Secrets → `RENDER_DEPLOY_HOOK_URL`.

**Step 4 – Deploy the frontend to Vercel**
1. Vercel → import the repo, root `frontend`, framework Vite.
2. Set `VITE_API_URL` to your Render URL + `/api`.
3. Add secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

**Step 5 – Add the deploy job (runs only after tests pass on `main`)**
```yaml
  deploy:
    needs: test-and-build
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - run: curl -fsS -X POST "${{ secrets.RENDER_DEPLOY_HOOK_URL }}"
      # then the Vercel CLI steps (see .github/workflows/ci.yml)
```
Push a commit → GitHub **Actions** tab shows tests → build → deploy automatically.
**Result:** Every push to `main` is tested and deployed automatically.

> Note: for the Vercel deployment the frontend calls the Render API directly, and Socket.io needs the
> same origin — set `VITE_API_URL` (ends with `/api`) and `VITE_SOCKET_URL` (the Render URL, no `/api`).
> The Docker Compose setup (Experiment 9) avoids this by proxying through nginx.

---

## Term-work marking reminder (from the syllabus)
File 25M (10 experiments × 15 marks each, + 2 assignments, + attendance 5M) · Mini project 25M
(report + demo) · Oral & practical 25M · **Total 75 marks**.
