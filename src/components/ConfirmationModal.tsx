import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, productName }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
    >
      <div 
        className="bg-secondary rounded-lg p-8 w-full max-w-md text-center shadow-2xl transform transition-all"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h2 id="confirmation-title" className="text-2xl font-bold text-light mb-4">Confirm Your Purchase</h2>
        <p className="text-highlight mb-8">
          Are you sure you have purchased the item: <strong className="text-light">{productName}</strong>?
        </p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={onClose} 
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-8 rounded-lg transition-colors"
          >
            No, Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-lg transition-colors"
          >
            Yes, I Purchased
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
