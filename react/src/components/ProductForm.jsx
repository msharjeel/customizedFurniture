import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import to read URL parameters
import axiosClient from "../axios.js";
import { useNavigate } from 'react-router-dom';

const ProductForm = () => {
  const { id } = useParams(); // Read 'id' from URL parameters
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: '',
    quantity: '',
    description: '',
    materials: [ { materialDescription: '', materialId: '', materialQuantity: 0, materialRate: 0, amount: 0 },],
    wastePercentage: '',
    labourCostPercentage: '',
    equipmentCost: '',
    otherCostPercentage: '',
    marginPercentage: '',
  });

  const [productMaterials, setProductMaterials] = useState([]);

  useEffect(() => {
    const fetchProductMaterials = async () => {
      try {
        const response = await axiosClient.get('/product_materials');
        setProductMaterials(response.data);
      } catch (error) {
        console.error('Error fetching product materials:', error);
      }
    };
 
    const fetchProductData = async () => {
      if (id) { // If editing an existing product
        try {
          const response = await axiosClient.get(`/products/${id}`);
          const product = response.data;
          const materialsWithDefaults = response.data.materials.map((material) => ({
            ...material,
            materialDescription: material.material_description || '', // Ensure materialDescription is set
            materialQuantity: material.materialQuantity || 0,
            materialRate: material.materialRate || 0,
            amount: parseFloat(material.materialQuantity) * parseFloat(material.materialRate) || 0, // Calculate the amount if fields are present
          }));
          
          setProductData({
            ...product,
            materials: materialsWithDefaults, // Use the modified materials array
          });
         
        } catch (error) {
          console.error('Error fetching product data:', error);
        }
      }
    };

    fetchProductMaterials();
    fetchProductData();
  }, [id]);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: name !== 'name' && name !== 'description' ? parseFloat(value) : value,
    });
  };

 const handleMaterialChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMaterials = [...productData.materials];

    updatedMaterials[index][name] = name === 'materialQuantity' || name === 'materialRate' ? parseFloat(value) : value;
    setProductData({
      ...productData,
      materials: updatedMaterials,
    });
  };

  const handleMaterialDescriptionChange = async (index, event) => {
    const { value } = event.target;
    const selectedDescription = event.target.value.trim(); // Trim the selected value
        const updatedMaterials = [...productData.materials];
    updatedMaterials[index].materialDescription = value;
  
    // Update productData with the modified materials array
    setProductData((prevState) => ({
      ...prevState,
      materials: updatedMaterials,
    }));
  
    // Fetch material ID based on the selected description (if needed)
    try {
      const response = await axiosClient.get(`/product_materials/search?description=${selectedDescription}`);
      const foundMaterial = response.data.find(material => material.material_description === selectedDescription);
  
      if (foundMaterial) {
        updatedMaterials[index].materialId = foundMaterial.material_id;
        setProductData({
          ...productData,
          materials: updatedMaterials,
        });
      }
    } catch (error) {
      console.error('Error fetching material ID:', error);
    }
  };

  const handleAddMaterial = () => {
    setProductData({
      ...productData,
      materials: [...productData.materials, { materialId: '', materialDescription: '', materialQuantity: '', materialRate: '', amount: '' }],
    });
  };

  const handleRemoveMaterial = (index) => {
    const updatedMaterials = [...productData.materials];
    updatedMaterials.splice(index, 1);
    setProductData({
      ...productData,
      materials: updatedMaterials,
    });
  };

  const calculateTotalMaterialItems = () => productData.materials.length;

  const calculateMaterialCost = () => productData.materials.reduce((total, material) => {
    const materialQuantity = parseFloat(material.materialQuantity);
    const materialRate = parseFloat(material.materialRate);
    if (!isNaN(materialQuantity) && !isNaN(materialRate)) {
      return total + materialQuantity * materialRate;
    }
    return total;
  }, 0);

  const calculateWasteAmount = () => {
    const materialCost = calculateMaterialCost();
    const wastePercentage = parseFloat(productData.wastePercentage);
    return !isNaN(materialCost) && !isNaN(wastePercentage) ? (wastePercentage / 100) * materialCost : 0;
  };

  const calculateLabourCost = () => {
    const materialCost = calculateMaterialCost();
    const wasteAmount = calculateWasteAmount();
    const labourCostPercentage = parseFloat(productData.labourCostPercentage);
    return !isNaN(materialCost) && !isNaN(wasteAmount) && !isNaN(labourCostPercentage) ? (labourCostPercentage / 100) * (materialCost + wasteAmount) : 0;
  };

  const calculateOtherAmount = () => {
    const equipmentCost = parseFloat(productData.equipmentCost);
    const labourCost = calculateLabourCost();
    const materialCost = calculateMaterialCost();
    const wasteAmount = calculateWasteAmount();
    const otherCostPercentage = parseFloat(productData.otherCostPercentage);
    return !isNaN(equipmentCost) && !isNaN(labourCost) && !isNaN(materialCost) && !isNaN(wasteAmount) && !isNaN(otherCostPercentage)
      ? (otherCostPercentage / 100) * (equipmentCost + labourCost + materialCost + wasteAmount)
      : 0;
  };

  const calculateMarginAmount = () => {
    const otherAmount = calculateOtherAmount();
    const equipmentCost = parseFloat(productData.equipmentCost);
    const labourCost = calculateLabourCost();
    const materialCost = calculateMaterialCost();
    const wasteAmount = calculateWasteAmount();
    const marginPercentage = parseFloat(productData.marginPercentage);
    return !isNaN(otherAmount) && !isNaN(equipmentCost) && !isNaN(labourCost) && !isNaN(materialCost) && !isNaN(wasteAmount) && !isNaN(marginPercentage)
      ? (marginPercentage / 100) * (otherAmount + equipmentCost + labourCost + materialCost + wasteAmount)
      : 0;
  };

  const calculateSubTotal = () => {
    const otherAmount = calculateOtherAmount();
    const equipmentCost = parseFloat(productData.equipmentCost);
    const labourCost = calculateLabourCost();
    const materialCost = calculateMaterialCost();
    const wasteAmount = calculateWasteAmount();
    const marginAmount = calculateMarginAmount();
    return !isNaN(otherAmount) && !isNaN(equipmentCost) && !isNaN(labourCost) && !isNaN(materialCost) && !isNaN(wasteAmount) && !isNaN(marginAmount)
      ? otherAmount + equipmentCost + labourCost + materialCost + wasteAmount + marginAmount
      : 0;
  };

  const calculateTotal = () => {
    const subTotal = calculateSubTotal(); // Ensure this function returns the correct subTotal
    const materialQuantity = parseFloat(productData.quantity); // Convert the quantity to a float
  
    // Check if both subTotal and materialQuantity are valid numbers
    if (!isNaN(subTotal) && !isNaN(materialQuantity)) {
      return (subTotal * materialQuantity); // Return total as a fixed 2 decimal number
    } else {
      return 0;
    }
  };

  const submitProductData = async (productData) => {
    try {
      // Format materials properly for the backend
      const formattedMaterials = productData.materials.map(
        ({ amount, materialDescription, ...rest }) => ({
          ...rest,
          material_description: materialDescription || "", // Include material_description correctly
        })
      );
  
  
      // Send the request to the backend
      const response = id
        ? await axiosClient.put(`/products/${id}`, {
            // PUT request for updating
            ...productData,
            materials: formattedMaterials,
          })
        : await axiosClient.post("/products", {
            // POST request for creating
            ...productData,
            materials: formattedMaterials,
          });
  
      if (response.status === 200) {
        alert("Product added/updated successfully!");
        navigate("/allproducts"); // Redirect to the product list page after success
      } else {
        console.error("Error adding/updating product:", response.data);
      }
    } catch (error) {
      console.error(
        "Error adding/updating product:",
        error.response?.data || error.message
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Calculate total
    const total = parseFloat(calculateTotal()).toFixed(2);
   
  
    // Prepare data for submission
    const updatedProductData = {
      ...productData,
      total, // Include total
    };
  
    
  
    // Submit the data
    await submitProductData(updatedProductData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Product Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-gray-700">Name:</label>
          <input type="text" className="border rounded px-3 py-2" name="name" value={productData.name} onChange={handleProductChange} />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Quantity:</label>
          <input type="number" className="border rounded px-3 py-2" name="quantity" value={productData.quantity} onChange={handleProductChange} />
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700">Description:</label>
        <textarea className="border rounded px-3 py-2" name="description" value={productData.description} onChange={handleProductChange} />
      </div>

        {/* Materials */}
        <h2 className="text-2xl font-bold mt-4">Materials</h2>
      {productData.materials.map((material, index) => (
        <div key={index} className="grid grid-cols-5 gap-4 mb-4">
          <div className="flex flex-col">
            <label className="text-gray-700">Description:</label>
            <select
            id={`material-description-${index}`}
            className="border rounded px-3 py-2"
            value={material.materialDescription || ''} 
            onChange={(e) => handleMaterialDescriptionChange(index, e)}
          >
            <option value="">Select Description</option>
            {productMaterials.map((productMaterial) => (
              <option key={productMaterial.id} value={productMaterial.material_description}>
                {productMaterial.material_description}
              </option>
            ))}
          </select>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700">Quantity:</label>
            <input type="number" className="border rounded px-3 py-2" name="materialQuantity" value={material.materialQuantity || ''} onChange={(e) => handleMaterialChange(index, e)} />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700">Rate:</label>
            <input type="number" className="border rounded px-3 py-2" name="materialRate" value={material.materialRate || ''} onChange={(e) => handleMaterialChange(index, e)} />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700">Amount:</label>
            <input type="number" className="border rounded px-3 py-2" name="amount" value={material.materialQuantity && material.materialRate ? (material.materialQuantity * material.materialRate).toFixed(2) : ''} readOnly />
          </div>
          <div className="flex items-end">
            <button type="button" className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleRemoveMaterial(index)}>
              Remove
            </button>
          </div>
        </div>
      ))}

      <button type="button" className="bg-green-500 text-white px-4 py-2 rounded mb-4" onClick={handleAddMaterial}>
        Add Material
      </button>

      {/* New Percentage and Cost Fields */}
      <div className="grid grid-cols-3 gap-4 mt-6">
      <div className="flex flex-col">
          <label className="text-gray-700">Total Materials:</label>
          <input type="number" className="border rounded px-3 py-2" value={calculateTotalMaterialItems()} readOnly />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Waste Percentage:</label>
          <input type="number" className="border rounded px-3 py-2" name="wastePercentage" value={productData.wastePercentage} onChange={handleProductChange} />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Labour Cost Percentage:</label>
          <input type="number" className="border rounded px-3 py-2" name="labourCostPercentage" value={productData.labourCostPercentage} onChange={handleProductChange} />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Equipment Cost:</label>
          <input type="number" className="border rounded px-3 py-2" name="equipmentCost" value={productData.equipmentCost} onChange={handleProductChange} />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Other Cost Percentage:</label>
          <input type="number" className="border rounded px-3 py-2" name="otherCostPercentage" value={productData.otherCostPercentage} onChange={handleProductChange} />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Margin Percentage:</label>
          <input type="number" className="border rounded px-3 py-2" name="marginPercentage" value={productData.marginPercentage} onChange={handleProductChange} />
        </div>
      </div>

    

      {/* Calculated Fields */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="flex flex-col">
          <label className="text-gray-700">Waste Amount:</label>
          <input type="number" className="border rounded px-3 py-2" value={calculateWasteAmount().toFixed(2)} readOnly />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Labour Cost:</label>
          <input type="number" className="border rounded px-3 py-2" value={calculateLabourCost().toFixed(2)} readOnly />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Other Amount:</label>
          <input type="number" className="border rounded px-3 py-2" value={calculateOtherAmount().toFixed(2)} readOnly />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Margin Amount:</label>
          <input type="number" className="border rounded px-3 py-2" value={calculateMarginAmount().toFixed(2)} readOnly />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Sub Total:</label>
          <input type="number" className="border rounded px-3 py-2" value={calculateSubTotal().toFixed(2)} readOnly />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Total:</label>
          <input type="number" className="border rounded px-3 py-2" value={calculateTotal().toFixed(2)} readOnly />
        </div>
      </div>

      {/* Submit Button */}
      <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded mt-6" onClick={handleSubmit}>
        {id ? 'Update Product' : 'Add Product'}
      </button>
    </div>
  );
};

export default ProductForm;
