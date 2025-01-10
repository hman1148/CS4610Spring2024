export type GenericResponse<T> = {
    item?: T;
    success: boolean;
    message: string;
}

export type GenericsResponse<T> = {
    items?: T[],
    success: boolean;
    message: string;
}
