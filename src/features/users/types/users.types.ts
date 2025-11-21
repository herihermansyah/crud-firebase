export type Users = {
  firstName: string;
  lastName: string;
  image: string;
  email: string;
  phone: number | string;
  username: string;
  password: string;
  role: string;
  gender: string;
  birthDate: string;
  address: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
};

export type UsersWithId = Users & {id: string};
