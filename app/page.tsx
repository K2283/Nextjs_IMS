
"use client";

import { useState, useEffect, useCallback } from "react";

import ProductForm, { type ProductFormData } from "@/app/components/form";

import ProductTable from "@/app/components/table";

import type { Product } from "@/modules/product/types";

const emptyForm: ProductFormData = {
    name: "",
    sku: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    low_stock_limit: "5"
};

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    // Fetch products
    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/products");
            const result = await res.json();

            if (!res.ok || !result.success) {
                throw new Error(result.message || "Failed to fetch products");
            } 
            setProducts(result.data);
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    // Handle input changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Create or update product
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        try {
            const payload = {
                ...form,
                description: form.description || null,
                price: Number(form.price),
                quantity: Number(form.quantity),
                low_stock_limit: Number(form.low_stock_limit)
            };

            const res = await fetch(
                editId !== null ? `/api/products/${editId}` : "/api/products",
                {
                    method: editId !== null ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                }
            );

            const result = await res.json();

            if (!res.ok || !result.success) {
                throw new Error(result.message || "Operation failed");
            }

            setMessage(result.message);
            setForm(emptyForm);
            setEditId(null);

            await loadProducts();
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    // Select product for editing
    const handleEdit = (product: Product) => {
        setEditId(product.id);

        setForm({
            name: product.name,
            sku: product.sku,
            description: product.description || "",
            price: String(product.price),
            quantity: String(product.quantity),
            category: product.category,
            low_stock_limit: String(product.low_stock_limit)
        });

        setMessage("");
    };

    // Delete product
    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE"
            });

            const result = await res.json();

            if (!res.ok || !result.success) {
                throw new Error(result.message || "Delete failed");
            }

            setMessage(result.message);
            await loadProducts();
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Something went wrong");
        }
    };

    const lowStock = products.filter(
        p => p.quantity <= p.low_stock_limit
    ).length;

    return (
        <main className="dashboard">

            <header>
                <h1>Inventory Management</h1>
                <p>Manage your products and stock</p>
            </header>

            <section className="summary">
                <div className="summary-card">
                    <h3>Total Products</h3>
                    <h2>{products.length}</h2>
                </div>

                <div className="summary-card">
                    <h3>Low Stock</h3>
                    <h2>{lowStock}</h2>
                </div>
            </section>

            <ProductForm
                form={form}
                editId={editId}
                saving={saving}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onCancel={() => {
                    setEditId(null);
                    setForm(emptyForm);
                }}
            />

            {message && <p className="message">{message}</p>}

            <ProductTable
                products={products}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

        </main>
    );
}
