import PageComponent from "../components/PageComponent";
import { useEffect, useState } from "react";
import axiosClient from "../axios.js";
import ProductList from '../components/ProductList.jsx';
import TButton from "../components/core/TButton";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/dashboard`)
      .then((res) => {
        setLoading(false);
        setData(res.data);
        return res;
      })
      .catch((error) => {
        setLoading(false);
        return error;
      });
  }, []);

  return (
    <PageComponent title="Product"
    buttons={
        <TButton color="indigo" to="/products/create">
          <PlusCircleIcon className="h-6 w-6 mr-2" />
          Create new
        </TButton>
      }>
      {loading && <div className="flex justify-center">Loading...</div>}
      {!loading && (
        <div className="grid grid-cols-1 gap-5 text-gray-700">

<div> 
<ProductList />
</div>
    


          
        </div>
      )}
    </PageComponent>

    
  );
  
  
}
