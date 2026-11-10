import { NextResponse } from "next/server";

import service from "./service";

class ProductController {

    // Get All Products
    async getAllProducts() {
        try {
            const products = await service.getAllProducts();
            return NextResponse.json({
                success: true,
                message: "Products fetched successfully",
                data: products
            });
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to get products"
                },
                { status: 500 }
            );
        }
    }

    // Get By [ID]
    async getProductsById(id: number) {
        try {
            const product = await service.getByIdProducts(id);
            if (!product) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Product not found"
                    },
                    { status: 404 }
                );
            }
            return NextResponse.json({
                success: true,
                message: "Product fetched successfully",
                data: product
            });
        } catch (error) {
    console.error("Get Product By ID Error:", error);

    return NextResponse.json(
        {
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to fetch product"
        },
        { status: 500 }
    );
}
    }

    // Create product
    async createProduct(request: Request) {
        try {
            const body = await request.json();
            const product = await service.createProducts(body);
            return NextResponse.json(
                {
                    success: true,
                    message: "Product created successfully",
                    data: product
                },
                { status: 201 }
            );
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: error instanceof Error
                        ? error.message
                        : "Failed to create product"
                },
                { status: 400 }
            );
        }
    }

    // Update product
    async updateProduct(id: number, request: Request) {
        try {
            const body = await request.json();
            const product = await service.updateProduct(id, body);
            if (!product) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Product not found"
                    },
                    { status: 404 }
                );
            }
            return NextResponse.json({
                success: true,
                message: "Product updated successfully",
                data: product
            });
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: error instanceof Error
                        ? error.message
                        : "Failed to update product"
                },
                { status: 400 }
            );
        }
    }

    // Delete product
    async deleteProduct(id: number) {
        try {
            const deleted = await service.deleteProduct(id);
            if (!deleted) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Product not found"
                    },
                    { status: 404 }
                );
            }
            return NextResponse.json({
                success: true,
                message: "Product deleted successfully"
            });
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to delete product"
                },
                { status: 500 }
            );
        }
    }

    // Get low-stock products
    async getLowStockProducts() {
        try {
            const products = await service.getLowStockProducts();
            return NextResponse.json({
                success: true,
                message: "Low stock products fetched successfully",
                data: products
            });
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to fetch low stock products"
                },
                { status: 500 }
            );
        }
    }
}

export default new ProductController();