import { useMemo, useState } from "react";

import {
    FaSearch,
    FaEdit,
    FaTrash,
    FaEye,
    FaCreditCard,
    FaRedoAlt,
    FaMoneyBillWave
} from "react-icons/fa";

import "../../styles/admin/admin-table.css";

function DataTable({
    title,
    subtitle,
    columns,
    data,
    onEdit,
    onDelete,
    onView,
    onProcessPayment,
    onRetry,
    onRefund,
    searchable = true,
    pageSize = 10
}){

    const [search,setSearch]=useState("");
    const [currentPage,setCurrentPage]=useState(1);

    const RECORDS_PER_PAGE = pageSize ?? 10;

    const filteredData=useMemo(()=>{

    if(!search) return data;

    return data.filter((row)=>

        Object.values(row).some((value)=>

            String(value)
            .toLowerCase()
            .includes(search.toLowerCase())

        )

    );

    },[search,data]);

    const totalPages=Math.max(
        1,
        Math.ceil(filteredData.length/RECORDS_PER_PAGE)
    );

    const paginatedData=useMemo(()=>{

        const start=(currentPage-1)*RECORDS_PER_PAGE;

        return filteredData.slice(
            start,
            start+RECORDS_PER_PAGE
        );

    },[filteredData,currentPage]);

    const startRecord=
        filteredData.length===0
        ?0
        :(currentPage-1)*RECORDS_PER_PAGE+1;

    const endRecord=Math.min(
        currentPage*RECORDS_PER_PAGE,
        filteredData.length
    );

    return(

        <div className="table-container">

            <div className="table-header">

                <div>

                    <h2 className="table-title">

                        {title}

                    </h2>

                    {subtitle && (

                        <p className="table-subtitle">

                            {subtitle}

                        </p>

                    )}

                </div>

                {searchable && (

                    <div className="search-wrapper">

                        <FaSearch/>

                        <input

                            placeholder="Search..."

                            value={search}

                            onChange={(e)=>{

                                setSearch(e.target.value);

                                setCurrentPage(1);

                            }}

                        />

                    </div>

                )}

            </div>

            <table className="billing-table">

                <thead>

                    <tr>

                        {columns.map((column)=>(

                            <th key={column}>

                                {column}

                            </th>

                        ))}

                    </tr>

                </thead>

                <tbody>

                    {paginatedData.map((row)=>(

                        <tr key={row.id}>

                            {columns.map((column)=>{

                                const key=column

                                    .toLowerCase()

                                    .replace(/ /g,"_");

                                if(key==="actions"){

                                    return(

                                        <td key={column}>

                                            <div className="icon-actions">

                                                {onView && (

                                                    <button

                                                        className="action-btn view-btn"

                                                        onClick={()=>onView(row)}

                                                    >

                                                        <FaEye/>

                                                    </button>

                                                )}

                                                {onProcessPayment && row.status !== "paid" && (
                                                    <button
                                                        className="action-btn payment-btn"
                                                        onClick={() => onProcessPayment(row)}
                                                        title="Process Payment"
                                                    >
                                                        <FaCreditCard />
                                                    </button>
                                                )}

                                                {onRetry && row.status === "failed" && (
                                                    <button
                                                        className="action-btn retry-btn"
                                                        onClick={() => onRetry(row)}
                                                        title="Retry Payment"
                                                    >
                                                        <FaRedoAlt />
                                                    </button>
                                                )}

                                                {onRefund &&
                                                    (
                                                        row.status_raw === "paid" ||
                                                        row.status_raw === "partially_refunded"
                                                    ) && (
                                                    <button
                                                        className="action-btn refund-btn"
                                                        onClick={() => onRefund(row)}
                                                        title="Issue Refund"
                                                    >
                                                        <FaMoneyBillWave size={16} />
                                                    </button>
                                                )}

                                                {onEdit && (

                                                    <button

                                                        className="action-btn edit-btn"

                                                        onClick={()=>onEdit(row)}

                                                    >

                                                        <FaEdit/>

                                                    </button>

                                                )}

                                                {onDelete && (

                                                    <button

                                                        className="action-btn delete-btn"

                                                        onClick={()=>onDelete(row.id)}

                                                    >

                                                        <FaTrash/>

                                                    </button>

                                                )}

                                            </div>

                                        </td>

                                    );

                                }

                                if(key==="status" || key==="role"){

                                    return(

                                        <td key={column}>

                                            <span

                                                className={`status ${String(row[key])
                                                    .toLowerCase()
                                                    .replace(/_/g, "-")
                                                    .replace(/\s+/g, "-")}`}

                                            >

                                                {String(row[key])
                                                    .replace(/_/g, " ")
                                                    .replace(/\b\w/g, c => c.toUpperCase())}

                                            </span>

                                        </td>

                                    );

                                }

                                if (key === "subscription") {

                                            const parts = String(row[key]).split(" • ");

                                            return (

                                                <td key={column}>

                                                    <div className="subscription-cell">

                                                        <strong>

                                                            {parts[0]}

                                                        </strong>

                                                        <span>

                                                            {parts[1]}

                                                        </span>

                                                    </div>

                                                </td>

                                            );

                                        }

                                        if (

    typeof row[key] === "object" &&

    row[key] !== null &&

    row[key].date

){

    return(

        <td key={column}>

            <div className="subscription-cell">

                <strong>

                    {row[key].date}

                </strong>

                <span>

                    {row[key].time}

                </span>

            </div>

        </td>

    );

}

                                        return(

                                            <td key={column}>

                                                {row[key]}

                                            </td>

);

                            })}

                        </tr>

                    ))}

                </tbody>

            </table>

            <div className="table-footer">

                <span>

                    Showing {startRecord}-{endRecord} of {filteredData.length} records • Page {currentPage} of {totalPages}

                </span>

                <div className="pagination">

                    <button
                        className={`page-btn ${currentPage===1?"disabled":""}`}
                        disabled={currentPage===1}
                        onClick={()=>
                            setCurrentPage(p=>p-1)
                        }
                    >
                        Prev
                    </button>

                    {

                        Array.from(
                            {length:totalPages},
                            (_,i)=>i+1
                        ).map(page=>(

                            <button

                                key={page}

                                className={`page-btn ${
                                    currentPage===page
                                    ?"active"
                                    :""
                                }`}

                                onClick={()=>
                                    setCurrentPage(page)
                                }

                            >

                                {page}

                            </button>

                        ))

                    }

                    <button
                        className={`page-btn ${currentPage===totalPages?"disabled":""}`}
                        disabled={currentPage===totalPages}
                        onClick={()=>
                            setCurrentPage(p=>p+1)
                        }
                    >
                        Next
                    </button>

                </div>

            </div>

        </div>

    );

}

export default DataTable;