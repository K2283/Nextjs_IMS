
import type { Product } from "@/modules/product/types";

interface Props {
    products: Product[];
    loading: boolean;
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
}

export default function ProductTable({products,loading,onEdit,onDelete}: Props){
    const formatPrice = (price: number) => price.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR"
        });

    return (
        <section className="panel">
            <h2>Product List</h2>
            {loading ? (<p>Loading products...</p>) : products.length === 0 ? (<p>No products available.</p>) : (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>SKU</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map(product => {
                                const isLowStock =
                                    product.quantity <= product.low_stock_limit;

                                return (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td>{product.sku}</td>
                                        <td>{product.category}</td>
                                        <td>{formatPrice(product.price)}</td>
                                        <td>{product.quantity}</td>

                                        <td>
                                            <span className={
                                                isLowStock ? "low-stock" : "in-stock"
                                            }>
                                                {isLowStock ? "Low Stock" : "In Stock"}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                className="edit"
                                                onClick={() => onEdit(product)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete"
                                                onClick={() => onDelete(product.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
