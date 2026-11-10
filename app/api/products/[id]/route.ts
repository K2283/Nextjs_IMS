
import productController from "@/modules/product/controller";
import { NextResponse } from "next/server";

type RouteContext = {
    params: Promise<{ id: string }>;
};

// Validate product ID
async function getProductId(context: RouteContext) {
    const { id } = await context.params;
    const productId = Number(id);
    if (!Number.isInteger(productId) || productId <= 0) {
        return null;
    }

    return productId;
}

// Get by ID
export async function GET(
    request: Request,
    context: RouteContext
) {
    const id = await getProductId(context);
    if (id === null) {
        return NextResponse.json(
            {
                success: false,
                message: "Invalid product ID"
            },
            { status: 400 }
        );
    }

    return await productController.getProductsById(id);
}

// Update
export async function PUT(
    request: Request,
    context: RouteContext
) {
    const id = await getProductId(context);
    if (id === null) {
        return NextResponse.json(
            {
                success: false,
                message: "Invalid product ID"
            },
            { status: 400 }
        );
    }

    return await productController.updateProduct(id, request);
}

//Delete
export async function DELETE(
    request: Request,
    context: RouteContext
) {
    const id = await getProductId(context);
    if (id === null) {
        return NextResponse.json(
            {
                success: false,
                message: "Invalid product ID"
            },
            { status: 400 }
        );
    }

    return await productController.deleteProduct(id);
}
