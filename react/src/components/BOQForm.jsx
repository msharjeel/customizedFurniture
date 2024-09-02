import React, { useState, useEffect } from 'react';
import axiosClient from "../axios.js";

const BOQForm = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [productCost, setProductCost] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        // Fetch products for the searchable field
        const fetchProducts = async () => {
            try {
                const response = await axiosClient.get('/products'); // Adjust endpoint as needed
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleProductChange = (e) => {
        const productId = e.target.value;
        const product = products.find(p => p.id === parseInt(productId));
        setSelectedProduct(productId);
        const cost = product ? parseFloat(product.total) : 0;
        setProductCost(cost);
        setTotal(cost * quantity);
    };

    const handleQuantityChange = (e) => {
        const qty = parseFloat(e.target.value) || 0;
        setQuantity(qty);
        setTotal(productCost * qty);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/boqs', {
                product_id: selectedProduct,
                product_cost: productCost.toFixed(2),
                quantity: quantity,
                total: total.toFixed(2)
            });
            alert('BOQ saved successfully!');
        } catch (error) {
            console.error('Error saving BOQ:', error);
        }
    };

    return (
        
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-100 rounded-lg shadow-md">
          <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col">
                <label htmlFor="product" className="block text-sm font-medium text-gray-700">Product Name</label>
                <select
                    id="product"
                    value={selectedProduct}
                    onChange={handleProductChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                >
                    <option value="">Select a product</option>
                    {products.map(product => (
                        <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col">
                <label htmlFor="productCost" className="block text-sm font-medium text-gray-700">Product Cost</label>
                <input
                    type="text"
                    id="productCost"
                    value={productCost.toFixed(2)}
                    readOnly
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="total" className="block text-sm font-medium text-gray-700">Total</label>
                <input
                    type="text"
                    id="total"
                    value={total.toFixed(2)}
                    readOnly
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
            </div>
            </div>

            <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-800 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700"
            >
                Create Order
            </button>
        </form>
    );
};

export default BOQForm;