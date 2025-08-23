import { IAppointment } from '@/interfaces/IAppointment';
import { IMedicine } from '@/interfaces/IMedicine';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type MedicineCartItem = IMedicine & {
  id: string;
  quantity: number;
  type: 'medicine';
  cartKey?: string;
};

type AppointmentCartItem = IAppointment & {
  id: string;
  quantity: number;
  type: 'appointment';
  cartKey?: string;
};

type CartItem = MedicineCartItem | AppointmentCartItem;

type ICart = {
  items: Record<string, CartItem>;
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
      action: PayloadAction<CartItem>,
    ) {
      const payload = action.payload as CartItem;
      const delta = Number(payload.quantity) || 0;

      const makeAppointmentKey = (p: AppointmentCartItem) => {
        const datePart = p.time_frame?.date ?? '';
        const startPart = p.time_frame?.start_time ?? '';
        return `${p.id}_${datePart}_${startPart}_${Date.now()}`;
      };

      const findExistingKey = () =>
        Object.keys(state.items).find((k) => {
          const it = state.items[k];
          if (it.id !== payload.id || it.type !== payload.type) return false;
          if (payload.type === 'appointment') {
            const itAppt = it as AppointmentCartItem;
            const pAppt = payload as AppointmentCartItem;
            return (
              itAppt.time_frame?.date === pAppt.time_frame?.date &&
              itAppt.time_frame?.start_time === pAppt.time_frame?.start_time
            );
          }
          return true;
        });

      const storeKey = (payload.cartKey as string) || findExistingKey() ||
        (payload.type === 'appointment' ? makeAppointmentKey(payload as AppointmentCartItem) : payload.id);

      const existing = storeKey ? state.items[storeKey] : undefined;

      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          if (storeKey) delete state.items[storeKey];
        } else {
          state.items[storeKey].quantity = newQty;
        }
        return;
      }

      if (delta > 0 && storeKey) {
        if (payload.type === 'appointment') {
          const p = payload as AppointmentCartItem;
          const toStore: AppointmentCartItem = { ...p, quantity: delta, cartKey: storeKey };
          state.items[storeKey] = toStore;
        } else {
          const p = payload as MedicineCartItem;
          const toStore: MedicineCartItem = { ...p, quantity: delta, cartKey: storeKey };
          state.items[storeKey] = toStore;
        }
      }
    },
    clearCart(state: ICart) {
      state.items = {};
    },
  },
});

export const { addToCart, clearCart } = addToCartSlice.actions;
export default addToCartSlice.reducer;
