export type IAppointment = {
  id: string;
  time_frame: {
    date: string;
    start_time: string;
    end_time: string;
  };
  price: number;
  image?: string;
  service_name?: string;
  category_name?: string; // populated for cart display
  sub_category_name?: string; // populated for cart display
  address?: {
    detail: string;
    lat: number;
    long: number;
  };
};

export type IUpcomingAppointment = {
  _id: string;
  status: string;
  issue_id: {
    service_id: {
      name: string;
      sub_category: {
        name: string;
      };
    };
  };
  apt_time: Date;
};

export type IAppointmentDetails = {
  time_frame: {
    start_time: string;
    end_time: string;
  };
  apt_time?: string;
  _id: string;
  user_id: {
    _id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    sex: string;
    __v: string;
    profile_picture: string;
  };
  status: string;
  address: {
    detail: string;
    lat: number;
    long: number;
    _id: string;
  };
  issue_id: {
    patient_details: {
      name: string;
      gender: string;
    };
    _id: string;
    user_id: string;
    for_someone: boolean;
    service_id: {
      _id: string;
      name: string;
      sub_category: {
        name: string;
      };
      price: number;
      general_cost: number;
      flat_discount: number;
      banner_image: string;
      __v: number;
    };
    assets: string[];
    __v: number;
  };
  __v: number;
  createdAt: string;
  updatedAt: string;
};
