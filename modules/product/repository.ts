
import { RejectedReactPromise } from "react";
import db from "../../app/config/db";

import { Product,CreateProduct,UpdateProduct } from "./types";

import { ResultSetHeader } from "mysql2";

class ProductRepository {
    
    //Get All Products
    async getAll(): Promise<Product[]>{
        const [rows] = await db.query("Select * From products")
        return rows as Product[];
    }

    //Get By [ID]
    async getById(id:number): Promise<Product | null>{
        const [rows] = await db.execute("Select * From products WHERE id = ?",[id])
        const products = rows as Product[];
        return products[0] || null;
    }

    //Create a Product
    async create(data: CreateProduct): Promise<Product>{
        const[res] = await db.execute<ResultSetHeader>(`INSERT INTO products
            (name, sku, description, price, quantity, category, low_stock_limit)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                data.name,
                data.sku,
                data.description,
                data.price,
                data.quantity,
                data.category,
                data.low_stock_limit
            ]
        )
        return {
            id:res.insertId,
            ...data
        }
    }

    //Update Product
    async update(id:number, data:UpdateProduct): Promise<boolean>{
        const pro = await this.getById(id);
        if(!pro){
            return false;
        }
        await db.execute(`UPDATE products SET name = ?,sku = ?,description = ?,price = ?,quantity = ?,category = ?,low_stock_limit = ? WHERE id = ?`,
            [data.name,data.sku,data.description,data.price,data.quantity,data.category,data.low_stock_limit,id]
        );
        return true;
    }

    //Delete Product
    async delete(id: number): Promise<boolean> {
    const [result] = await db.execute<ResultSetHeader>("DELETE FROM products WHERE id = ?",[id]);
    return result.affectedRows > 0;
    }

    // Get product by SKU
    async getBySku(sku: string): Promise<Product | null> {
    const [rows] = await db.execute("SELECT * FROM products WHERE sku = ?",[sku]);
    const products = rows as Product[];
    return products[0] || null;
    
  }
}

export default new ProductRepository();
