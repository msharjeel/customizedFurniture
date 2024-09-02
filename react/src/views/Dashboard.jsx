import PageComponent from "../components/PageComponent";
import DashboardCard from "../components/DashboardCard.jsx";
import { useEffect, useState } from "react";
import axiosClient from "../axios.js";
import TButton from "../components/core/TButton.jsx";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";

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
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; 
  };

  return (
    <PageComponent title="Dashboard">
      {loading && <div className="flex justify-center">Loading...</div>}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-gray-700">
          <DashboardCard
            title="Total Products"
            className="order-1 lg:order-2"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="text-8xl pb-4 font-semibold flex-1 flex items-center justify-center">
              {data.totalProducts}
            </div>
          </DashboardCard>
         
          <DashboardCard
            title="Total Materials"
            className="order-2 lg:order-3"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="text-8xl pb-4 font-semibold flex-1 flex items-center justify-center">
              {data.totalMaterials}
            </div>
          </DashboardCard>
          
          <DashboardCard
            title="Latest Product"
            className="order-3 lg:order-1 row-span-2"
            style={{ animationDelay: '0.2s' }}
          >
            {data.latestProduct && (
              <div>
                 <h2 className="font-bold text-xl mb-3">
                 <br></br> {data.latestProduct.name}<br></br>
            
                  </h2>
                <h3 className="text-lg mb-3">
                  {data.latestProduct.description}
                </h3>
                <div className="flex justify-between text-sm mb-1">
                  <div>Create Date:</div>
                  <div>{formatDate(data.latestProduct.created_at)}</div>
                </div>
        
                <div className="flex justify-between">
                  <TButton to={`/products/edit/${data.latestProduct.id}`} link>
                    <PencilIcon className="w-5 h-5 mr-2" />
                    Edit Product
                  </TButton>

                  
                </div>
              </div>
            )}
            {!data.latestProduct && (
              <div className="text-gray-600 text-center py-16">
                Your don't have any Product
              </div>
            )}
          </DashboardCard>
      
        </div> 
      )}
    </PageComponent>
  );
}
