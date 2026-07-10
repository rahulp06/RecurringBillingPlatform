import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Sidebar from "../../components/admin/AdminSidebar";
import Topbar from "../../components/admin/AdminTopbar";
import DataTable from "../../components/admin/DataTable";
import CustomerModal from "../../components/admin/CustomerModal";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";

import {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer
} from "../../services/api";

function Customers() {

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openModal, setOpenModal] = useState(false);
    const [editCustomer, setEditCustomer] = useState(null);

    useEffect(() => {

        loadCustomers();

    }, []);

    const loadCustomers = async () => {

        setLoading(true);

        try {

            const data = await getCustomers();

            setCustomers(

                Array.isArray(data)

                    ? data.map(customer => ({

                        id: customer.id,

                        full_name: customer.name,

                        email: customer.email,

                        company: customer.company_name,

                        role:
                            customer.role === "admin"
                                ? "Admin"
                                : "Customer"

                    }))

                    : []

            );

        }

        finally {

            setLoading(false);

        }

    };

    const handleEdit = (customer) => {

        setEditCustomer(customer);

        setOpenModal(true);

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this customer?")) return;

        try {

            await deleteCustomer(id);

            toast.success("Customer deleted successfully.");

            loadCustomers();

        }

        catch {

            toast.error("Unable to delete customer.");

        }

    };

    const handleSave = async (form) => {

        try {

            if (editCustomer) {

                await updateCustomer(editCustomer.id, form);

                toast.success("Customer updated successfully.");

            }

            else {

                await createCustomer(form);

                toast.success("Customer created successfully.");

            }

            setOpenModal(false);

            setEditCustomer(null);

            loadCustomers();

        }

        catch {

            toast.error("Operation failed.");

        }

    };

    return (

        <div className="layout">

            <Sidebar />

            <div className="main">

                <Topbar />

                <div className="dashboard">

                    <div className="page-header">

                        <div>

                            <h1>

                                Customers

                            </h1>

                            <p>

                                Manage all registered customers.

                            </p>

                        </div>

                        <button

                            className="primary-btn"

                            onClick={() => {

                                setEditCustomer(null);

                                setOpenModal(true);

                            }}

                        >

                            + Create Customer

                        </button>

                    </div>

                    {

                        loading

                            ?

                            <Loading />

                            :

                            customers.length === 0

                                ?

                                <EmptyState

                                    title="No Customers"

                                    message="No registered customers found."

                                />

                                :

                                <DataTable

                                    title="Customers"

                                    subtitle="Registered Users"

                                    columns={[

                                        "Full Name",

                                        "Email",

                                        "Company",

                                        "Role",

                                        "Actions"

                                    ]}

                                    data={customers}

                                    onEdit={handleEdit}

                                    onDelete={handleDelete}

                                />

                    }

                </div>

            </div>

            <CustomerModal

                open={openModal}

                editCustomer={editCustomer}

                onClose={() => {

                    setOpenModal(false);

                    setEditCustomer(null);

                }}

                onSave={handleSave}

            />

        </div>

    );

}

export default Customers;