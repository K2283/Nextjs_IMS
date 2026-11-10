
export interface Product{
    id: number,
    name: string,
    sku: string,
    description: string | null,
    price: number,
    quantity: number,
    category: string,
    low_stock_limit: number
}

export type CreateProduct = Omit<Product, "id">;

export type UpdateProduct = CreateProduct;