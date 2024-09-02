import React, { useState } from 'react';
import axiosClient from "../axios.js";

const MaterialEntryForm = () => {
  const [materialData, setMaterialData] = useState({
    material_id: '',
    material_description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterialData({
      ...materialData,
      [name]: value,
    });
  };
  const [error, setError] = useState('');
  
  const handleSubmit = async () => {
    try {
      const response = await axiosClient.post('/product_materials', materialData); // Replace '/api/materials' with your Laravel API endpoint

      if (response.status === 200) {
        setSuccessMessage('Material added successfully!');
      } else {
        //console.error('Error adding material:', response.data);
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error adding material:', error);
      setError('An error occurred while adding the material.');
    }
  };

  const [successMessage, setSuccessMessage] = useState(''); // Moved this line outside MyComponent

  return (
    <div className="container max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Material Entry</h2>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col">
          <label className="text-gray-700">Material ID:</label>
          <input type="number" className="border rounded px-3 py-2" name="material_id" value={materialData.material_id} onChange={handleChange} />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Material Description:</label>
          <input type="text" className="border rounded px-3 py-2" name="material_description" value={materialData.material_description} onChange={handleChange} />
        </div>
      </div>
      <button className="bg-blue-800 text-white px-4 py-2 rounded-md mt-4 w-full" onClick={handleSubmit}>Submit</button>
      {successMessage && <p>{successMessage}</p>}  {/* Moved this line below button */}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default MaterialEntryForm;