import { useEffect, useMemo, useState } from 'react';
import useFetch from '../hooks/useFetch';
import FoodCard from '../components/FoodCard';

const PAGE = 12;

const SORTS = {
  popular: (a, b) => b.rating - a.rating,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  fastest: (a, b) => a.prepTime - b.prepTime,
  name: (a, b) => a.name.localeCompare(b.name),
};

export default function Menu() {
  const { data: foods, loading, error } = useFetch('/foods');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [sort, setSort] = useState('popular');
  const [shown, setShown] = useState(PAGE);

  const categories = useMemo(() => ['All', ...new Set((foods || []).map((f) => f.category))], [foods]);

  const visible = useMemo(
    () =>
      (foods || [])
        .filter(
          (f) =>
            f.available &&
            (category === 'All' || f.category === category) &&
            (!vegOnly || f.isVeg) &&
            `${f.name} ${f.description}`.toLowerCase().includes(search.toLowerCase())
        )
        .sort(SORTS[sort]),
    [foods, search, category, vegOnly, sort]
  );

  // Go back to the first page whenever the filters change
  useEffect(() => setShown(PAGE), [search, category, vegOnly, sort]);

  return (
    <>
      <h1 className="mb-1 text-3xl font-extrabold">Menu</h1>
      <p className="mb-4 text-gray-500 dark:text-gray-400" aria-live="polite">
        {loading ? 'Loading…' : `${visible.length} items`}
      </p>

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
        <label className="sr-only" htmlFor="search">Search food</label>
        <input id="search" className="input md:max-w-xs" placeholder="Search food…" value={search} onChange={(e) => setSearch(e.target.value)} />

        <label className="sr-only" htmlFor="sort">Sort by</label>
        <select id="sort" className="input md:w-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="popular">Top rated</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="fastest">Fastest</option>
          <option value="name">Name A–Z</option>
        </select>

        <label className="flex items-center gap-2 font-medium">
          <input type="checkbox" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} className="h-4 w-4 accent-green-600" />
          Veg only
        </label>
      </div>

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={`rounded-full px-3 py-1 text-sm font-medium ${category === c ? 'bg-brand-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="text-red-600">{error}</p>}
      {!loading && !error && visible.length === 0 && <p>No items found.</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.slice(0, shown).map((f) => (
          <FoodCard key={f._id} food={f} />
        ))}
      </div>

      {shown < visible.length && (
        <div className="mt-8 text-center">
          <button className="btn-outline" onClick={() => setShown((n) => n + PAGE)}>
            Show more ({visible.length - shown} left)
          </button>
        </div>
      )}
    </>
  );
}
