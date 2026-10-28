import { Link } from 'react-router-dom';

const steps = [
  { icon: '📱', title: 'Pick your food', text: 'Browse the menu and add favourites to your cart.' },
  { icon: '👨‍🍳', title: 'We cook it', text: 'Kitchens start preparing as soon as you order.' },
  { icon: '🛵', title: 'Fast delivery', text: 'Track your order status live, right on the page.' },
];

export default function Home() {
  return (
    <>
      <section className="rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 px-6 py-14 text-center text-white md:py-20">
        <h1 className="text-4xl font-extrabold md:text-6xl">Hungry? Get it in minutes.</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
          QuickBite brings your favourite meals to your door, hot and fast.
        </p>
        <Link to="/menu" className="mt-8 inline-block rounded-xl bg-white px-6 py-3 font-bold text-brand-700 hover:bg-brand-50">
          Order now
        </Link>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3" aria-label="How it works">
        {steps.map((s) => (
          <div key={s.title} className="card text-center">
            <div className="text-4xl" aria-hidden="true">{s.icon}</div>
            <h2 className="mt-2 text-lg font-bold">{s.title}</h2>
            <p className="text-gray-500 dark:text-gray-400">{s.text}</p>
          </div>
        ))}
      </section>
    </>
  );
}
