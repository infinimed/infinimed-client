import { IAppointment } from '@/interfaces/IAppointment';
import { IMedicine } from '@/interfaces/IMedicine';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
type ICart = {
  items: {
    [key: string]: (IMedicine | IAppointment) & {
      id: string;
      quantity: number;
      type: 'appointment' | 'medicine';
    };
  };
};

const initialState: ICart = {
  items: {},
};

const addToCartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(
      state: ICart,
      action: PayloadAction<
        (IMedicine | IAppointment) & {
          id: string;
          quantity: number;
          type: 'appointment' | 'medicine';
        }
      >,
    ) {
      const id = action.payload.id;
      const delta = action.payload.quantity;

      if (state.items[id]?.quantity !== undefined) {
        const newQty = state.items[id].quantity + delta;
        if (newQty <= 0) {
          delete state.items[id];
        } else {
          state.items[id].quantity = newQty;
        }
        return;
      }

      if (delta > 0) {
        state.items[id] = { ...action.payload, quantity: delta };
      }
    },
    clearCart(state: ICart) {
      state.items = {};
    },
  },
});

export const { addToCart, clearCart } = addToCartSlice.actions;
export default addToCartSlice.reducer;
