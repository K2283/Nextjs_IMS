import repository from "./repository";

import { Product,CreateProduct,UpdateProduct } from "./types";

class ProductService{

    //Get All Products
    async getAllProducts(): Promise<Product[]>{
        return await repository.getAll();
    }

    //Get By [ID]
    async getByIdProducts(id:number): Promise<Product | null>{
        return await repository.getById(id);
    }

    //Create a Product
    async createProducts(data: CreateProduct): Promise<Product>{
        if (!data.name || !data.name.trim()) {
            throw new Error("Product name is required");
        }
        if (!data.sku || !data.sku.trim()) {
            throw new Error("Product SKU is required");
        }
        const existingProduct = await repository.getBySku(data.sku);
        if (existingProduct) {
            throw new Error("Product SKU already exists");
        }

        if (data.price <= 0) {
            throw new Error("Price must be minimum 50000");
        }

        if (data.quantity < 0) {
            throw new Error("Quantity cannot be negative");
        }
        return await repository.create(data);
    }

    // Update product
    async updateProduct(id: number,data: UpdateProduct): Promise<Product | null> {
        const existingProduct = await repository.getById(id);
        if (!existingProduct) {
            return null;
        }

        // Check duplicate SKU
        const duplicateSKU = await repository.getBySku(data.sku);

        if (duplicateSKU && duplicateSKU.id !== id) {
            throw new Error("Product SKU already exists");
        }

        if (!data.name || !data.name.trim()) {
            throw new Error("Product name is required");
        }

        if (data.price <= 0) {
            throw new Error("Price must be greater than zero");
        }

        if (data.quantity < 0) {
            throw new Error("Quantity cannot be negative");
        }

        await repository.update(id, data);
        return await repository.getById(id);
    }

    // Delete product
    async deleteProduct(id: number): Promise<boolean> {
        return await repository.delete(id);
    }

    // Get low-stock products
    async getLowStockProducts(): Promise<Product[]> {
        const products = await repository.getAll();
        return products.filter(product => product.quantity <= product.low_stock_limit);
    }
}

export default new ProductService();

