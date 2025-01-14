export type User = {
  id: number;
  name: string;
  email: string;
  age: number;
};

export type State = {
  currentUser: User;
  isEntitiesLoaded: boolean;
  isLoading: boolean;
};

export const initialUser = (): User => ({
  id: -1,
  name: '',
  age: 0,
  email: '',
});

export const initialStoreState = (): State => ({
  currentUser: initialUser(),
  isEntitiesLoaded: false,
  isLoading: false,
});
