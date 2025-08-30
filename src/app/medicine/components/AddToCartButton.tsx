'use client';
import { IMedicine } from '@/interfaces/IMedicine';
import { addToCart } from '@/lib/features/cart/addToCart';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import React from 'react';

type AddToCartButtonProps = {
  medicine: IMedicine & {
    _id: string;
    generic: {
      name: string;
    };
    name: string;
  };
};

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ medicine }) => {
  const dispatch = useAppDispatch();

  const cart = useAppSelector((state) => state.addToCart.items);

  function handleAddToCart(quantityToAdd: number) {
    dispatch(
      addToCart({
        ...medicine,
        id: medicine._id,
        quantity: quantityToAdd,
        type: 'medicine',
      }),
    );
  }

  return (
    <div className="fixed bottom-[12vh] left-1/2 transform -translate-x-1/2 w-[90vw] max-w-md lg:w-[28vw] lg:max-w-sm">
      {cart[medicine._id]?.quantity ? (
        <div className="flex items-center justify-center gap-4 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
          <button
            onClick={() => handleAddToCart(-1)}
            className="w-12 h-12 flex items-center justify-center text-xl font-bold text-white bg-primary rounded-full hover:bg-blue-600 active:scale-95 transition-all duration-150 shadow-md"
          >
            −
          </button>
          
          <div className="flex items-center justify-center min-w-[60px] px-4 py-2 text-lg font-semibold text-primary bg-gray-50 rounded-xl border border-gray-200">
            {cart[medicine._id as string].quantity}
          </div>

          <button
            onClick={() => handleAddToCart(1)}
            className="w-12 h-12 flex items-center justify-center text-xl font-bold text-white bg-primary rounded-full hover:bg-blue-600 active:scale-95 transition-all duration-150 shadow-md"
          >
            +
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <button 
            onClick={() => handleAddToCart(1)} 
            className="w-full bg-primary text-white font-poppins font-bold text-xl py-4 rounded-2xl hover:bg-blue-600 active:scale-[0.98] transition-all duration-150 shadow-md"
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};
export default AddToCartButton;
