import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EmptyState from "../../components/common/EmptyState";
import Sidebar from "../../components/admin/AdminSidebar";
import Topbar from "../../components/admin/AdminTopbar";
import DataTable from "../../components/admin/DataTable";
import PlanModal from "../../components/admin/PlanModal";
import Loading from "../../components/common/Loading";
import {
    getPlans,
    createPlan,
    updatePlan,
    deletePlan
} from "../../services/api";

function Plans() {

    const [plans,setPlans]=useState([]);

    const [openModal,setOpenModal]=useState(false);

    const [editPlan,setEditPlan]=useState(null);

    const [loading,setLoading]=useState(true);

    useEffect(()=>{

        loadPlans();

    },[]);

    const loadPlans = async () => {

    setLoading(true);

    try{

        const data = await getPlans();

        setPlans(Array.isArray(data)?data:[]);

    }

    finally{

        setLoading(false);

    }

};

    const handleCreate=()=>{

        setEditPlan(null);

        setOpenModal(true);

    };

    const handleEdit=(plan)=>{

        setEditPlan(plan);

        setOpenModal(true);

    };

    const handleDelete = async (id) => {

    if(!window.confirm("Delete this plan?")) return;

    try{

        await deletePlan(id);

        toast.success("Plan deleted successfully.");

        loadPlans();

    }

    catch{

        toast.error("Unable to delete plan.");

    }

};

    const handleSave = async (form) => {

    try{

        if(editPlan){

            await updatePlan(editPlan.id,form);

            toast.success("Plan updated successfully.");

        }

        else{

            await createPlan(form);

            toast.success("Plan created successfully.");

        }

        setOpenModal(false);

        loadPlans();

    }

    catch{

        toast.error("Something went wrong.");

    }

};

    return(

        <div className="layout">

            <Sidebar/>

            <div className="main">

                <Topbar/>

                <div className="dashboard">

    <div className="page-header">

        <div>

            <h1>Plans</h1>

            <p>

                Manage subscription plans.

            </p>

        </div>

        <button
            className="primary-btn"
            onClick={handleCreate}
        >

            + Create Plan

        </button>

    </div>

    {
        loading ? (

    <Loading/>

) : plans.length === 0 ? (

    <EmptyState

        title="No Plans Found"

        message="Create your first subscription plan."

    />

) : (

    <DataTable

        title="Subscription Plans"

        subtitle="Manage all subscription plans"

        columns={[
            "Name",
            "Price",
            "Billing Interval",
            "Trial Days",
            "Status",
            "Actions"
        ]}

        data={plans}

        onEdit={handleEdit}

        onDelete={handleDelete}

    />

)
    }

</div>

            </div>

            <PlanModal

                open={openModal}

                editPlan={editPlan}

                onClose={()=>setOpenModal(false)}

                onSave={handleSave}

            />

        </div>

    );

}

export default Plans;