export type IOrderItem = {
  id: number;
  image: string;
  generic: string;
  brand: string;
  marketName: string;
  quantity: number;
};

export type IOrderDetails = {
  _id: string;
  cart_id: {
    _id: string;
    cartItems: {
      medicine_id:
        | string
        | {
            _id: string;
            name: string;
            generic: string;
            dosage: string;
            brand: string;
            price: number;
            discounted_price: number;
            medicine_category: string;
            cost_by_vendor: [];
            __v: number;
          };
      quantity: number;
      _id: string;
    }[];
    user_id: {
      _id: string;
      first_name: string;
      last_name: string;
      phone_number: string;
      sex: string;
      __v: number;
      profile_picture: string;
    };
    __v: number;
  };
  status: string;
  address: {
    detail: string;
    lat: number;
    long: number;
    _id: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
};
