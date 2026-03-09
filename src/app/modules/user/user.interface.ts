export type IUserAddress = {
  apartment?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

export type IUser = {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  phone?: string;
  address?: IUserAddress;
};
