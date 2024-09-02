import PageComponent from "../components/PageComponent.jsx";
import { useEffect, useState } from "react";
import axiosClient from "../axios.js";
import ProductMaterial from '../components/ProductMaterial.jsx';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState([]); // Assuming materials is in the response data

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/dashboard`)
      .then((res) => {
        setLoading(false);
        setMaterials(res.data.materials); // Assuming materials is in the response data
      })
      .catch((error) => {
        setLoading(false);
        return error;
      });
  }, []);

  return (
    <PageComponent title="Add Material">
      {loading && <div className="flex justify-center">Loading...</div>}
      {!loading && (
        <div className="grid grid-cols-1 gap-5 text-gray-700">
          <ProductMaterial materials={materials} />
        </div>
      )}
    </PageComponent>
  );
}