import React from 'react';
import type { Deal } from '../types';

interface DealCardProps {
  deal: Deal;
  isExpired: boolean;
  onOrdered?: (deal: Deal) => void;
  isAdmin: boolean;
  onRemove: (id: string) => void;
  onExpire?: (id: string) => void;
  onEdit: (deal: Deal) => void;
  onNotify: (dealId: string) => void;
  isNotificationSet: boolean;
}

const Countdown: React.FC<{ dueDate: string }> = ({ dueDate }) => {
  const calculateTimeLeft = React.useCallback(() => {
    const difference = +new Date(dueDate) - +new Date();
    let timeLeft: { [key: string]: number } = {};

    if (difference > 0) {
      timeLeft = {
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
  }, [dueDate]);

  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft());

  React.useEffect(() => {
    // Set up the interval
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    // Clear the interval on component unmount
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const timerComponents = Object.entries(timeLeft)
    .filter(([, value]) => value >= 0) // Keep all values including 0
    .slice(0, 3) // Show at most days, hours, minutes
    .map(([interval, value]) => {
        if(timeLeft.d > 0 && (interval === 'm' || interval === 's')) return null;
        if(timeLeft.h > 0 && interval === 's') return null;
        return <span key={interval} className="mx-1">{value}{interval}</span>;
    }).filter(Boolean);
  
  return (
    <div className="text-sm font-mono text-yellow-300">
      {timerComponents.length ? <>Expires in: {timerComponents}</> : <span>Expired</span>}
    </div>
  );
};

const EditIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);


const DealCard: React.FC<DealCardProps> = ({ deal, isExpired, onOrdered, isAdmin, onRemove, onExpire, onEdit, onNotify, isNotificationSet }) => {
  const discount = Math.round(((deal.originalPrice - deal.dealPrice) / deal.originalPrice) * 100);

  return (
    <div className={`group relative bg-secondary rounded-lg shadow-xl overflow-hidden transition-all duration-300 flex flex-col ${isExpired ? 'opacity-70' : 'hover:-translate-y-2'}`}>
        {discount > 0 && !isExpired && (
            <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-3 py-1 z-20 rounded-br-lg">
                {discount}% OFF
            </div>
        )}
         {isExpired && (
            <div className="absolute top-0 left-0 bg-gray-700 text-white text-xs font-bold px-3 py-1 z-20 rounded-br-lg">
                EXPIRED
            </div>
        )}
        {isAdmin && (
            <div className="absolute top-2 right-2 z-20 flex flex-col space-y-1.5">
                <button onClick={() => onRemove(deal.id)} className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-lg w-7 h-7 flex items-center justify-center">
                    <span className="text-xs font-bold">X</span>
                </button>
                <button onClick={() => onEdit(deal)} className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full shadow-lg w-7 h-7 flex items-center justify-center">
                    <EditIcon />
                </button>
                {!isExpired && onExpire && (
                    <button onClick={() => onExpire(deal.id)} className="bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 rounded-full shadow-lg w-7 h-7 flex items-center justify-center">
                         <span className="text-xs font-bold">E</span>
                    </button>
                )}
            </div>
        )}
      <a href={deal.affiliateUrl} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
        <img src={deal.imageUrl} alt={deal.productName} className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110" />
      </a>
      <div className="p-3 flex flex-col flex-grow">
        <a href={deal.affiliateUrl} target="_blank" rel="noopener noreferrer" className="block cursor-pointer flex-grow">
          <h3 className="text-base font-bold text-light truncate group-hover:text-highlight transition-colors" title={deal.productName}>
            {deal.productName}
          </h3>
        </a>
        <div className="flex items-baseline my-2">
          <p className="text-xl font-extrabold text-green-400">₹{deal.dealPrice.toLocaleString('en-IN')}</p>
          <p className="ml-2 text-xs line-through text-gray-400">₹{deal.originalPrice.toLocaleString('en-IN')}</p>
        </div>
        
        <div className="mt-auto">
            {!isExpired ? (
                <>
                    <div className="mb-2 text-xs flex justify-between items-center">
                        <Countdown dueDate={deal.dueDate} />
                        <span className="font-semibold text-light bg-accent px-2 py-0.5 rounded">
                            {deal.quantity > 0 ? `${deal.quantity} left` : 'Out of Stock'}
                        </span>
                    </div>
                    {onOrdered && (
                        <button 
                            onClick={(e) => {
                                e.preventDefault(); 
                                e.stopPropagation();
                                onOrdered(deal);
                            }}
                            className="w-full bg-highlight hover:bg-accent text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
                        >
                        I Ordered This
                        </button>
                    )}
                </>
            ) : (
                <button
                    onClick={() => onNotify(deal.id)}
                    className={`w-full font-bold py-2 px-4 rounded-lg transition-colors duration-300 text-sm ${
                        isNotificationSet 
                        ? 'bg-green-700 text-white cursor-default' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                    {isNotificationSet ? '✓ Notifying You' : 'Notify Me When Live'}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default DealCard;