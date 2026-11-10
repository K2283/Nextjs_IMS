
import productController from "@/modules/product/controller";

// GET: Fetch all products
export async function GET() {
    return await productController.getAllProducts();
}

// POST: Create a new product
export async function POST(request: Request) {
    return await productController.createProduct(request);
}
