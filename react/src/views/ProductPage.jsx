import PageComponent from "../components/PageComponent";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axios.js";
import ProductForm from '../components/ProductForm.jsx';


export default function ProductPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null); // Change initial state to null
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate(); // Use navigate for redirect after save or error

  useEffect(() => {
    if (id) {  // If there's an ID in the URL, fetch the product data for editing
      setLoading(true);
      axiosClient
        .get(`/products/${id}`)  // Fetch product data by ID
        .then((res) => {
          setData(res.data); // Store fetched data in state
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching product data:", error);
          setLoading(false);
        });
    } else {
      setLoading(false); // If no ID, we're creating a new product
    }
  }, [id]);

  const handleFormSubmit = (formData) => {
    const saveOrUpdate = id 
      ? axiosClient.put(`/products/${id}`, formData)  // Update product if ID exists
      : axiosClient.post('/products', formData);  // Create new product if no ID

    saveOrUpdate
      .then(() => {
        navigate('/allproducts'); // Redirect to product list after successful save
      })
      .catch((error) => {
        console.error("Error saving product data:", error);
      });
  };

  return (
    <PageComponent title={id ? "Edit Product" : "Create Product"}>
      {loading && <div className="flex justify-center">Loading...</div>}
      {!loading && (
        <div className="grid grid-cols-1 gap-5 text-gray-700">
          <ProductForm productData={data} onSubmit={handleFormSubmit} />
        </div>
      )}
    </PageComponent>
  );
}