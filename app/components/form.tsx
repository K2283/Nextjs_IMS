
import type { ChangeEvent, FormEvent } from "react";

export interface ProductFormData {
    name: string;
    sku: string;
    description: string;
    price: string;
    quantity: string;
    category: string;
    low_stock_limit: string;
}

interface Props {
    form: ProductFormData;
    editId: number | null;
    saving: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
}

const fields: {
    name: keyof ProductFormData;
    type: string;
    min?: string;
    step?: string;
}[] = [
    { name: "name", type: "text" },
    { name: "sku", type: "text" },
    { name: "category", type: "text" },
    { name: "price", type: "number", min: "0.01", step: "0.01" },
    { name: "quantity", type: "number", min: "0" },
    { name: "low_stock_limit", type: "number", min: "0" }
];

export default function ProductForm({form,editId,saving,onChange,onSubmit,onCancel}: Props) {
    return (
        <section className="panel">
            <h2>{editId !== null ? "Update Product" : "Add Product"}</h2>
            <form onSubmit={onSubmit}>
                <div className="form-grid">
                    {fields.map(field => (
                        <input
                            key={field.name}
                            name={field.name}
                            type={field.type}
                            min={field.min}
                            step={field.step}
                            placeholder={field.name.replaceAll("_", " ").toUpperCase()}
                            value={form[field.name]}
                            onChange={onChange}
                            required
                        />
                    ))}
                </div>

                <textarea name="description" placeholder="Product description" value={form.description}onChange={onChange}/>

                <div className="form-actions">
                    <button type="submit" disabled={saving}>
                        {saving ? "Saving..." : editId !== null ? "Update Product" : "Add Product"}
                    </button>

                    {editId !== null && (
                        <button type="button" className="cancel" onClick={onCancel}> Cancel </button>
                    )}
                </div>
            </form>
        </section>
    );
}
