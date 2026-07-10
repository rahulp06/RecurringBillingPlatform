import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Sidebar from "../../components/admin/AdminSidebar";
import Topbar from "../../components/admin/AdminTopbar";
import DataTable from "../../components/admin/DataTable";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import AuditLogModal from "../../components/admin/AuditLogModal";

import {
    getAuditLogs,
    createAuditLog,
    updateAuditLog,
    deleteAuditLog
} from "../../services/api";

function AuditLogs() {

    const [logs, setLogs] = useState([]);

    const [loading, setLoading] = useState(true);

    const [openModal, setOpenModal] = useState(false);

    const [editLog, setEditLog] = useState(null);

    useEffect(() => {

        loadLogs();

    }, []);

    const loadLogs = async () => {

        setLoading(true);

        try {

            const data = await getAuditLogs();

            const formatted = data.map(log => ({

    id: log.id,

    timestamp: {
        date: new Date(log.created_at).toLocaleDateString("en-GB", {

            day: "2-digit",
            month: "short",
            year: "numeric"

        }),

        time: new Date(log.created_at).toLocaleTimeString([], {

            hour: "2-digit",
            minute: "2-digit"

        })
    },

    user: log.performed_by,

    action: log.action,

    entity:
        log.entity_type.charAt(0).toUpperCase() +
        log.entity_type.slice(1),

    entity_id: `#${log.entity_id}`,

    old_value: log.old_value,

    new_value: log.new_value,

    performed_by: log.performed_by,

    created_at: log.created_at

}));

            setLogs(formatted);

        }

        finally {

            setLoading(false);

        }

    };

    const handleEdit = (log) => {

        setEditLog(log);

        setOpenModal(true);

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this audit log?")) return;

        try {

            await deleteAuditLog(id);

            toast.success("Audit log deleted.");

            loadLogs();

        }

        catch {

            toast.error("Unable to delete audit log.");

        }

    };

    const handleSave = async (form) => {

        try {

            if (editLog) {

                await updateAuditLog(editLog.id, form);

                toast.success("Audit log updated.");

            }

            else {

                await createAuditLog(form);

                toast.success("Audit log created.");

            }

            setOpenModal(false);

            loadLogs();

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

                                Audit Logs

                            </h1>

                            <p>

                                Track all important system activities.

                            </p>

                        </div>

                        <button

                            className="primary-btn"

                            onClick={() => {

                                setEditLog(null);

                                setOpenModal(true);

                            }}

                        >

                            + Add Log

                        </button>

                    </div>

                    {

                        loading

                        ?

                        <Loading />

                        :

                        logs.length === 0

                        ?

                        <EmptyState

                            title="No Audit Logs"

                            message="No audit records found."

                        />

                        :

                        <DataTable

                            title="Audit History"

                            subtitle="System activity records."

                            columns={[

                                "Timestamp",

                                "User",

                                "Action",

                                "Entity",

                                "Entity Id",

                                "Actions"

                            ]}

                            data={logs}

                            onEdit={handleEdit}

                            onDelete={handleDelete}

                        />

                    }

                </div>

            </div>

            <AuditLogModal

                open={openModal}

                editLog={editLog}

                onClose={() => setOpenModal(false)}

                onSave={handleSave}

            />

        </div>

    );

}

export default AuditLogs;