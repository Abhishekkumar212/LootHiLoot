import React, { useState, useEffect, useCallback } from 'react';
import { auth, db } from './firebase';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy,
  runTransaction
} from 'firebase/firestore';

import type { Deal, User, FirestoreUser } from './types';
import Header from './components/Header';
import DealCard from './components/DealCard';
import DealModal from './components/AddDealModal';
import Login from './components/Login';
import MyOrders from './components/MyOrders';
import ConfirmationModal from './components/ConfirmationModal';

const App: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [liveDeals, setLiveDeals] = useState<Deal[]>([]);
  const [expiredDeals, setExpiredDeals] = useState<Deal[]>([]);
  
  const [user, setUser] = useState<FirestoreUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [orders, setOrders] = useState<Deal[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'deals' | 'orders'>('deals');
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [notifications, setNotifications] = useState<Set<string>>(new Set());
  const [confirmingDeal, setConfirmingDeal] = useState<Deal | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          name: currentUser.displayName || 'User',
          email: currentUser.email || '',
        });
        setIsAdmin(currentUser.email === import.meta.env.VITE_ADMIN_EMAIL);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'deals'), orderBy('dueDate', 'desc'));
    const unsubscribeDeals = onSnapshot(q, (snapshot) => {
      const dealsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Deal));
      setDeals(dealsData);
    });
    return () => unsubscribeDeals();
  }, []);

  useEffect(() => {
    if (!user) {
        setOrders([]);
        return;
    };
    const ordersQuery = query(collection(db, `users/${user.uid}/orders`));
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
        const ordersData = snapshot.docs.map(doc => doc.data() as Deal);
        setOrders(ordersData);
    });

    return () => unsubscribeOrders();
  }, [user]);

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
    const interval = setInterval(filterDeals, 10000);
    return () => clearInterval(interval);
  }, [filterDeals]);
  
  const handleRegister = async (newUser: Omit<User, 'uid'>) => {
    if (!newUser.password) {
        alert("Password is required for registration.");
        return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
      await updateProfile(userCredential.user, { displayName: newUser.name });
      setUser({ // Manually update state to reflect display name immediately
          uid: userCredential.user.uid,
          name: newUser.name,
          email: userCredential.user.email || ''
      });
    } catch (error: any) {
      alert(`Registration failed: ${error.message}`);
    }
  };

  const handleLogin = async (credentials: Pick<User, 'email' | 'password'>) => {
    if (!credentials.password) return;
    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    } catch (error: any) {
      alert(`Login failed: ${error.message}`);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      alert(`Google sign-in failed: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentPage('deals');
  };

  const handleOrdered = (deal: Deal) => {
    if (user) {
      setConfirmingDeal(deal);
    } else {
      alert("Please log in to track your order.");
    }
  };

  const handleConfirmOrder = async () => {
    if (!user || !confirmingDeal) return;
  
    const orderExists = orders.some(o => o.id === confirmingDeal.id);
    if (orderExists) {
      alert("You've already marked this item as ordered.");
      setConfirmingDeal(null);
      return;
    }
  
    const dealRef = doc(db, 'deals', confirmingDeal.id);
    const orderRef = doc(db, `users/${user.uid}/orders`, confirmingDeal.id);
  
    try {
      await runTransaction(db, async (transaction) => {
        const dealDoc = await transaction.get(dealRef);
        if (!dealDoc.exists()) {
          throw new Error("Deal does not exist!");
        }
  
        const currentQuantity = dealDoc.data().quantity;
        if (currentQuantity < 1) {
          throw new Error("Deal is out of stock!");
        }
  
        transaction.update(dealRef, { quantity: currentQuantity - 1 });
        transaction.set(orderRef, confirmingDeal);
      });
  
      window.open(confirmingDeal.orderLink, '_blank');
    } catch (error: any) {
      alert(`Order failed: ${error.message}`);
    } finally {
      setConfirmingDeal(null);
    }
  };


  const handleAddDeal = async (newDeal: Omit<Deal, 'id'>) => {
    try {
        await addDoc(collection(db, 'deals'), newDeal);
        setIsModalOpen(false);
    } catch (error) {
        console.error("Error adding deal: ", error);
        alert("Failed to add deal. Please try again.");
    }
  };

  const handleUpdateDeal = async (updatedDeal: Deal) => {
    const dealRef = doc(db, 'deals', updatedDeal.id);
    try {
        // Firestore updateDoc requires a plain object, remove id from the payload.
        const { id, ...dealData } = updatedDeal;
        await updateDoc(dealRef, dealData);
        setIsModalOpen(false);
        setEditingDeal(null);
    } catch(e) {
        console.error("Error updating deal: ", e);
        alert("Failed to update deal.");
    }
  };

  const handleOpenEditModal = (deal: Deal) => {
    setEditingDeal(deal);
    setIsModalOpen(true);
  };
  
  const handleNotify = (dealId: string) => {
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

  const removeDeal = async (id: string) => {
    if(window.confirm("Are you sure you want to permanently delete this deal?")){
      await deleteDoc(doc(db, 'deals', id));
    }
  };
  
  const expireDeal = async (id: string) => {
    const dealRef = doc(db, 'deals', id);
    await updateDoc(dealRef, { dueDate: new Date().toISOString() });
  };

  if (loading) {
    return <div className="min-h-screen bg-primary flex items-center justify-center text-light text-2xl">Loading...</div>;
  }
  
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
