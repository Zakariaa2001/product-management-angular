export interface Product {
    id : string;
    name : string;
    price : number; 
    promotion : boolean;
}
export interface PageProduct {
    Products: Product[];
    page: number;
    size: number;
    totalPages: number;
}