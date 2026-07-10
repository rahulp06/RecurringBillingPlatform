import { useEffect, useState } from "react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

import DashboardHeader from "../../components/admin/DashboardHeader";
import KPISection from "../../components/admin/KPISection";
import RevenueSection from "../../components/admin/RevenueSection";
import ActivitySection from "../../components/admin/ActivitySection";

import LoadingSpinner from "../../components/common/LoadingSpinner";

import { getDashboardData } from "../../services/dashboardService";

import "../../styles/admin/admin-dashboard.css";

function AdminDashboard() {

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const data = await getDashboardData();

            setDashboard(data);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <LoadingSpinner />;

    }

    return (

        <div className="layout">

            <AdminSidebar />

            <div className="main">

                <AdminTopbar />

                <div className="dashboard">

                    <DashboardHeader />

                    <KPISection
                        dashboard={dashboard}
                    />

                    <RevenueSection
                        dashboard={dashboard}
                    />

                    <ActivitySection
                        dashboard={dashboard}
                    />

                </div>

            </div>

        </div>

    );

}

export default AdminDashboard;