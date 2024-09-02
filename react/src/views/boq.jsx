import PageComponent from "../components/PageComponent";
import { useEffect, useState } from "react";
import axiosClient from "../axios.js";
import BOQForm from '../components/BOQForm.jsx';

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
    <PageComponent title="Bulk Quantity Order">
      {loading && <div className="flex justify-center">Loading...</div>}
      {!loading && (
        <div className="grid grid-cols-1 gap-5 text-gray-700">

<div> 
<BOQForm />
</div>
    


          
        </div>
      )}
    </PageComponent>

    
  );
  
  
}
