import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';

const Home = () => {
  const features = [
    {
      name: 'Fast Shipping',
      description: 'Get your orders delivered instantly to your door.',
      icon: <Zap className="w-6 h-6 text-blue-600" />,
    },
    {
      name: 'Secure Payments',
      description: 'Your payment data is fully encrypted and safe.',
      icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
    },
    {
      name: 'Vast Collection',
      description: 'Find everything you need in our extensive database.',
      icon: <ShoppingBag className="w-6 h-6 text-blue-600" />,
    },
  ];

  return (
    <div className="flex flex-col gap-16">
      <section className="text-center py-20 px-6 sm:px-12 bg-white rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ShopSmart</span>
        </h1>
        <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto">
          The best place to find top quality products at unbeatable prices. Fast, minimalist, and smart shopping.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-lg font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all"
          >
            Start Shopping
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-gray-300 text-lg font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-all"
          >
            Login <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      <section className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.name} className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl">
              <div className="p-3 bg-white rounded-full shadow-sm mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.name}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
