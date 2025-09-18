import React, { useState, useEffect, useCallback } from 'react';
import { initialDeals } from './constants';
import type { Deal, User } from './types';
import Header from './components/Header';
import DealCard from './components/DealCard';
import DealModal from './components/AddDealModal';
import Login from './components/Login';
import MyOrders from './components/MyOrders';
import ConfirmationModal from './components/ConfirmationModal';

const App: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [liveDeals, setLiveDeals] = useState<Deal[]>([]);
  const [expiredDeals, setExpiredDeals] = useState<Deal[]>([]);
  
  // User state management
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  
  const [orders, setOrders] = useState<Deal[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'deals' | 'orders'>('deals');
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [notifications, setNotifications] = useState<Set<number>>(new Set());
  const [confirmingDeal, setConfirmingDeal] = useState<Deal | null>(null);

  const filterDeals = useCallback(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const currentLiveDeals = deals.filter(deal => new Date(deal.dueDate) > now && deal.quantity > 0);
    const recentExpiredDeals = deals.filter(deal => {
      const dueDate = new Date(deal.dueDate);
      const isExpired = dueDate <= now || deal.quantity <= 0;
      return isExpired && dueDate >= sevenDaysAgo;
    });
    
    setLiveDeals(currentLiveDeals.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
    setExpiredDeals(recentExpiredDeals.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()));
  }, [deals]);

  useEffect(() => {
    filterDeals();
    const interval = setInterval(filterDeals, 10000); // Re-filter every 10 seconds
    return () => clearInterval(interval);
  }, [filterDeals]);
  
  const handleRegister = (newUser: Omit<User, 'id'>) => {
    if (registeredUsers.find(u => u.email === newUser.email)) {
      alert('An account with this email already exists.');
      return false;
    }
    const userWithId = { ...newUser, id: Date.now() };
    setRegisteredUsers(prev => [...prev, userWithId]);
    setUser(userWithId);
    return true;
  };

  const handleLogin = (credentials: Pick<User, 'email' | 'password'>) => {
    const foundUser = registeredUsers.find(u => u.email === credentials.email && u.password === credentials.password);
    if (foundUser) {
      setUser(foundUser);
    } else {
      alert("Invalid email or password.");
    }
  };

  const handleGoogleLogin = () => {
    const mockGoogleUser = {
      name: 'Google User',
      email: 'google.user@example.com',
      // No password needed for Google login simulation
    };
    
    const existingUser = registeredUsers.find(u => u.email === mockGoogleUser.email);
    
    if (existingUser) {
        setUser(existingUser); // Login existing user
    } else {
        // Register and login the new Google user
        const newUser: User = { ...mockGoogleUser, id: Date.now() };
        setRegisteredUsers(prev => [...prev, newUser]);
        setUser(newUser);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setOrders([]);
    setIsAdmin(false);
    setCurrentPage('deals');
  };

  const handleOrdered = (deal: Deal) => {
    if (user) {
      setConfirmingDeal(deal);
    } else {
      alert("Please log in to track your order.");
    }
  };

  const handleConfirmOrder = () => {
    if (!user || !confirmingDeal) return;

    if (orders.find(o => o.id === confirmingDeal.id)) {
      alert("You've already marked this item as ordered.");
      setConfirmingDeal(null);
      return;
    }
    
    setDeals(prevDeals => 
      prevDeals.map(d => 
        d.id === confirmingDeal.id ? { ...d, quantity: d.quantity - 1 } : d
      )
    );
    setOrders(prevOrders => [...prevOrders, confirmingDeal]);
    window.open(confirmingDeal.orderLink, '_blank');
    setConfirmingDeal(null);
  };


  const handleAddDeal = (newDeal: Omit<Deal, 'id'>) => {
    const dealWithId: Deal = { ...newDeal, id: Date.now() };
    setDeals(prevDeals => [dealWithId, ...prevDeals]);
    setIsModalOpen(false);
  };

  const handleUpdateDeal = (updatedDeal: Deal) => {
    setDeals(deals.map(d => d.id === updatedDeal.id ? updatedDeal : d));
    setIsModalOpen(false);
    setEditingDeal(null);
  };

  const handleOpenEditModal = (deal: Deal) => {
    setEditingDeal(deal);
    setIsModalOpen(true);
  };
  
  const handleNotify = (dealId: number) => {
    setNotifications(prev => {
        const newNotifications = new Set(prev);
        if (newNotifications.has(dealId)) {
            newNotifications.delete(dealId);
            alert('You will no longer be notified about this deal.');
        } else {
            newNotifications.add(dealId);
            alert('You will be notified by email when this deal is back!');
        }
        return newNotifications;
    });
  };

  const removeDeal = (id: number) => {
    setDeals(deals.filter(d => d.id !== id));
  };
  
  const expireDeal = (id: number) => {
    setDeals(deals.map(d => d.id === id ? {...d, dueDate: new Date().toISOString()} : d));
  };

  if (!user) {
    return <Login onLogin={handleLogin} onRegister={handleRegister} onGoogleLogin={handleGoogleLogin} />;
  }

  return (
    <div className="min-h-screen bg-primary">
      <Header 
        user={user} 
        orderCount={orders.length}
        onLogout={handleLogout} 
        isAdmin={isAdmin} 
        setIsAdmin={setIsAdmin}
        onNavigate={setCurrentPage}
      />
      <main className="container mx-auto p-4 md:p-8">
        {currentPage === 'deals' ? (
          <>
            {isAdmin && (
              <div className="text-center mb-8">
                <button
                  onClick={() => { setEditingDeal(null); setIsModalOpen(true); }}
                  className="bg-highlight hover:bg-accent text-white font-bold py-2 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
                >
                  + Add New Deal
                </button>
              </div>
            )}
            
            {isModalOpen && <DealModal 
                onClose={() => { setIsModalOpen(false); setEditingDeal(null); }} 
                onAddDeal={handleAddDeal}
                onUpdateDeal={handleUpdateDeal}
                dealToEdit={editingDeal}
            />}

            <section id="live-deals" className="mb-12">
              <h2 className="text-4xl font-extrabold text-light mb-6 pb-2 border-b-2 border-accent">
                🔥 Live Deals
              </h2>
              {liveDeals.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {liveDeals.map(deal => (
                    <DealCard 
                        key={deal.id} 
                        deal={deal} 
                        isExpired={false} 
                        onOrdered={handleOrdered} 
                        isAdmin={isAdmin}
                        onRemove={removeDeal}
                        onExpire={expireDeal}
                        onEdit={handleOpenEditModal}
                        onNotify={handleNotify}
                        isNotificationSet={notifications.has(deal.id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-highlight text-lg">No live deals at the moment. Check back soon!</p>
              )}
            </section>

            <section id="expired-deals">
              <h2 className="text-4xl font-extrabold text-light mb-6 pb-2 border-b-2 border-accent">
                Expired Deals
              </h2>
              {expiredDeals.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {expiredDeals.map(deal => (
                    <DealCard 
                        key={deal.id} 
                        deal={deal} 
                        isExpired={true}
                        isAdmin={isAdmin}
                        onRemove={removeDeal}
                        onEdit={handleOpenEditModal}
                        onNotify={handleNotify}
                        isNotificationSet={notifications.has(deal.id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-highlight text-lg">No deals have expired in the last week.</p>
              )}
            </section>
          </>
        ) : (
          <MyOrders orders={orders} onNavigateBack={() => setCurrentPage('deals')} />
        )}
      </main>
      
      <ConfirmationModal 
        isOpen={!!confirmingDeal}
        onClose={() => setConfirmingDeal(null)}
        onConfirm={handleConfirmOrder}
        productName={confirmingDeal?.productName || ''}
      />

      <footer className="text-center p-4 mt-8 text-accent">
        <p>&copy; {new Date().getFullYear()} Loot Hi Loot Deals. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;