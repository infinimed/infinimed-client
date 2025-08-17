// import { IOrderItem } from './IOrderItem';
export type IGender = 'male' | 'female' | 'other';
export type IIssue = {
  token: string;
  for_someone: boolean;
  service_id: string;
  assets: string[];
  patient_details?: {
    name: string;
    gender: IGender;
    dob: Date;
  };
};

export type IIssueDetails = {
  _id: string;
  service_id: {
    _id: string;
    name: string;
    sub_category: {
      _id: string;
      name: string;
      category_id?: {
        _id: string;
        name: string;
      };
    };
  };
  assets: string[];
  __v?: number;
};
