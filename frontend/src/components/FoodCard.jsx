import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';

export default function FoodCard({ food }) {
  const dispatch = useDispatch();
  return (
    <article className="card flex flex-col transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative mb-3 flex h-28 items-center justify-center rounded-xl bg-brand-50 text-6xl dark:bg-gray-700" aria-hidden="true">
        {food.emoji}
        <span
          className={`absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-sm border-2 ${food.isVeg ? 'border-green-600' : 'border-red-600'}`}
          title={food.isVeg ? 'Vegetarian' : 'Non-vegetarian'}
        >
          <span className={`h-2.5 w-2.5 rounded-full ${food.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
        </span>
      </div>
      <h3 className="text-lg font-bold">{food.name}</h3>
      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{food.description}</p>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-700">{food.category}</span>
        <span className="rounded-full bg-green-100 px-2 py-0.5 font-semibold text-green-800">★ {food.rating?.toFixed(1)}</span>
        <span className="text-gray-500 dark:text-gray-400">⏱ {food.prepTime} min</span>
      </div>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-lg font-extrabold">₹{food.price}</span>
        <button className="btn" onClick={() => dispatch(addItem(food))} aria-label={`Add ${food.name} to cart`}>
          Add +
        </button>
      </div>
    </article>
  );
}
