import React from 'react';
import { FiPhone } from 'react-icons/fi';

interface FloatingCallButtonProps {
  phoneNumber: string;
}

const FloatingCallButton: React.FC<FloatingCallButtonProps> = ({
  phoneNumber,
}) => {
  const handleCallClick = () => {
    window.open(`tel:${phoneNumber}`);
  };

  return (
    <button
      onClick={handleCallClick}
      className="fixed bottom-[10vh] right-4 bg-blue-500 text-white rounded-full p-4 shadow-lg mr-4 mb-4 hover:bg-blue-600 transition duration-200 flex items-center justify-center"
    >
      <FiPhone className="text-2xl" />
    </button>
  );
};

export default FloatingCallButton;
