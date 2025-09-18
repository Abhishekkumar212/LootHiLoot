import React, { useState, useEffect } from 'react';
import type { Deal } from '../types';

interface DealModalProps {
  onClose: () => void;
  onAddDeal: (newDeal: Omit<Deal, 'id'>) => void;
  onUpdateDeal: (updatedDeal: Deal) => void;
  dealToEdit: Deal | null;
}

const DealModal: React.FC<DealModalProps> = ({ onClose, onAddDeal, onUpdateDeal, dealToEdit }) => {
  const isEditMode = dealToEdit !== null;

  const [productName, setProductName] = useState('');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [dealPrice, setDealPrice] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orderLink, setOrderLink] = useState('');
  const [refundLink, setRefundLink] = useState('');

  useEffect(() => {
    if (isEditMode && dealToEdit) {
      setProductName(dealToEdit.productName);
      setAffiliateUrl(dealToEdit.affiliateUrl);
      setImageUrl(dealToEdit.imageUrl);
      setOriginalPrice(dealToEdit.originalPrice.toString());
      setDealPrice(dealToEdit.dealPrice.toString());
      // Format date for datetime-local input
      const localDate = new Date(dealToEdit.dueDate);
      localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
      setDueDate(localDate.toISOString().slice(0, 16));
      setQuantity(dealToEdit.quantity.toString());
      setOrderLink(dealToEdit.orderLink);
      setRefundLink(dealToEdit.refundLink);
    }
  }, [isEditMode, dealToEdit]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName || !affiliateUrl || !originalPrice || !dealPrice || !dueDate || !quantity || !orderLink || !refundLink) {
      alert("Please fill out all required fields.");
      return;
    }

    if (isEditMode && dealToEdit) {
        const updatedDeal: Deal = {
            ...dealToEdit,
            productName,
            affiliateUrl,
            imageUrl: imageUrl || `https://picsum.photos/seed/${productName.replace(/\s+/g, '')}/400/300`,
            originalPrice: parseFloat(originalPrice),
            dealPrice: parseFloat(dealPrice),
            dueDate: new Date(dueDate).toISOString(),
            quantity: parseInt(quantity, 10),
            orderLink,
            refundLink,
        };
        onUpdateDeal(updatedDeal);
    } else {
        const newDeal: Omit<Deal, 'id'> = {
            productName,
            affiliateUrl,
            imageUrl: imageUrl || `https://picsum.photos/seed/${productName.replace(/\s+/g, '')}/400/300`,
            originalPrice: parseFloat(originalPrice),
            dealPrice: parseFloat(dealPrice),
            dueDate: new Date(dueDate).toISOString(),
            quantity: parseInt(quantity, 10),
            orderLink,
            refundLink,
        };
        onAddDeal(newDeal);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-secondary rounded-lg p-8 w-full max-w-lg max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-light">{isEditMode ? 'Edit Deal' : 'Add a New Deal'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="productName" className="block text-sm font-medium text-light">Product Name</label>
                <input type="text" id="productName" value={productName} onChange={e => setProductName(e.target.value)} required className="mt-1 w-full bg-accent p-2 rounded-md text-light border border-gray-600 focus:ring-highlight focus:border-highlight"/>
            </div>
             <div>
                <label htmlFor="affiliateUrl" className="block text-sm font-medium text-light">Affiliate URL</label>
                <input type="url" id="affiliateUrl" value={affiliateUrl} onChange={e => setAffiliateUrl(e.target.value)} required className="mt-1 w-full bg-accent p-2 rounded-md text-light border border-gray-600 focus:ring-highlight focus:border-highlight"/>
            </div>
             <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-light">Image URL (optional)</label>
                <input type="url" id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="mt-1 w-full bg-accent p-2 rounded-md text-light border border-gray-600 focus:ring-highlight focus:border-highlight"/>
            </div>
             <div>
                <label htmlFor="orderLink" className="block text-sm font-medium text-light">Order Form Link</label>
                <input type="url" id="orderLink" value={orderLink} onChange={e => setOrderLink(e.target.value)} required className="mt-1 w-full bg-accent p-2 rounded-md text-light border border-gray-600 focus:ring-highlight focus:border-highlight"/>
            </div>
             <div>
                <label htmlFor="refundLink" className="block text-sm font-medium text-light">Refund Form Link</label>
                <input type="url" id="refundLink" value={refundLink} onChange={e => setRefundLink(e.target.value)} required className="mt-1 w-full bg-accent p-2 rounded-md text-light border border-gray-600 focus:ring-highlight focus:border-highlight"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="originalPrice" className="block text-sm font-medium text-light">Original Price (₹)</label>
                    <input type="number" id="originalPrice" step="0.01" min="0" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} required className="mt-1 w-full bg-accent p-2 rounded-md text-light border border-gray-600 focus:ring-highlight focus:border-highlight"/>
                </div>
                 <div>
                    <label htmlFor="dealPrice" className="block text-sm font-medium text-light">Deal Price (₹)</label>
                    <input type="number" id="dealPrice" step="0.01" min="0" value={dealPrice} onChange={e => setDealPrice(e.target.value)} required className="mt-1 w-full bg-accent p-2 rounded-md text-light border border-gray-600 focus:ring-highlight focus:border-highlight"/>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-light">Quantity</label>
                    <input type="number" id="quantity" min="0" value={quantity} onChange={e => setQuantity(e.target.value)} required className="mt-1 w-full bg-accent p-2 rounded-md text-light border border-gray-600 focus:ring-highlight focus:border-highlight"/>
                </div>
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-light">Due Date</label>
                    <input type="datetime-local" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="mt-1 w-full bg-accent p-2 rounded-md text-light border border-gray-600 focus:ring-highlight focus:border-highlight"/>
                </div>
            </div>
            <div className="flex justify-end pt-4 space-x-3">
                 <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                 <button type="submit" className="bg-highlight hover:bg-accent text-white font-bold py-2 px-4 rounded-lg">
                    {isEditMode ? 'Update Deal' : 'Add Deal'}
                 </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default DealModal;
