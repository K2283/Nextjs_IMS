
import productController from "@/modules/product/controller";

// GET: Fetch low-stock products
export async function GET() {
    return await productController.getLowStockProducts();
}
