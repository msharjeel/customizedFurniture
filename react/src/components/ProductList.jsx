import React, { useEffect, useState } from 'react';
import axiosClient from '../axios';
import { Link } from 'react-router-dom';
import { XCircleIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get('/products')
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      axiosClient
        .delete(`/products/${id}`)
        .then(() => {
          setProducts(products.filter((product) => product.id !== id));
        })
        .catch((error) => {
          console.error('Error deleting product:', error);
        });
    }
  };

  return (
    <div className="container mx-autrounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1o p-4">
      <h2 className="mb-6 text-xl font-semibold text-black dark:text-white">List of all Products</h2>
      
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded border border-gray-200">
            <thead>
              <tr className="bg-gray-50 border-b">
              <th className="p-4 text-left text-sm font-medium uppercase xsm:text-base">Id</th>
                <th className="p-4 text-left text-sm font-medium uppercase xsm:text-base">Product Name</th>
                <th className="p-4 text-left text-sm font-medium uppercase xsm:text-base">Description</th>
                <th className="p-4 text-left text-sm font-medium uppercase xsm:text-base">Price</th>
                <th className="text-center p-4 text-sm font-medium uppercase xsm:text-base">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                   <td className="p-4 border-b">{product.id}</td>
                  <td className="p-4 border-b">{product.name}</td>
                  <td className="p-4 border-b">{product.description}</td>
                  <td className="p-4 border-b">{product.total} BD</td>
                  <td className="p-4 flex justify-center">
                    <Link
                      to={`/products/edit/${product.id}`}
                      className="flex justify-between items-center rounded-md bg-blue-700 py-1.5 px-3 text-center font-medium text-white hover:bg-opacity-90 lg:px-4 xl:px-5 mr-1 ml-1"
                    >
                      <PencilIcon className="w-4 h-4 mr-2" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex justify-between items-center rounded-md bg-red-600 py-1.5 px-3 text-center font-medium text-white hover:bg-opacity-90 lg:px-4 xl:px-5 mr-1 ml-1"
                    >
                      <XCircleIcon className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}