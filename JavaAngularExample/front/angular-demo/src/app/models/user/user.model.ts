export type User = {
    id: number;
    name: string;
    email: string;
    age: number
}

export type State = {
    currentUser: User;
    isEntitiesLoaded: boolean;
    isLoading: boolean;
}