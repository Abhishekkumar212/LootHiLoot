import React from 'react';
import type { Deal } from '../types';

interface MyOrdersProps {
  orders: Deal[];
  onNavigateBack: () => void;
}

const MyOrders: React.FC<MyOrdersProps> = ({ orders, onNavigateBack }) => {
  return (
    <section id="my-orders" className="bg-secondary p-6 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-accent">
        <h2 className="text-4xl font-extrabold text-light">
          My Orders
        </h2>
        <button
          onClick={onNavigateBack}
          className="bg-highlight hover:bg-accent text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          &larr; Back to Deals
        </button>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="flex flex-col md:flex-row items-center bg-primary p-4 rounded-lg shadow-md gap-4">
              <img src={order.imageUrl} alt={order.productName} className="w-32 h-32 object-cover rounded-md flex-shrink-0" />
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-xl font-bold text-light">{order.productName}</h3>
                <div className="flex items-baseline justify-center md:justify-start my-1">
                    <p className="text-2xl font-bold text-green-400">₹{order.dealPrice.toLocaleString('en-IN')}</p>
                    <p className="ml-3 text-sm line-through text-gray-400">₹{order.originalPrice.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <a 
                href={order.refundLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full md:w-auto flex-shrink-0 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-center"
              >
                Fill Refund Form
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-2xl font-semibold text-light mb-2">Your order list is empty.</h3>
          <p className="text-highlight mb-6">Looks like you haven't ordered any deals yet.</p>
          <button
            onClick={onNavigateBack}
            className="bg-highlight hover:bg-accent text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
          >
            Find Some Deals!
          </button>
        </div>
      )}
    </section>
  );
};

export default MyOrders;
