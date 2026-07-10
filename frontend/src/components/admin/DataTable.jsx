import { useMemo, useState } from "react";

import {
    FaSearch,
    FaEdit,
    FaTrash,
    FaEye
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

    searchable = true

}){

    const [search,setSearch]=useState("");

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

                            onChange={(e)=>setSearch(e.target.value)}

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

                    {filteredData.map((row)=>(

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

                                                className={`status ${String(row[key]).toLowerCase()}`}

                                            >

                                                {String(row[key]).charAt(0).toUpperCase() + String(row[key]).slice(1)}

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

                    {filteredData.length} Records

                </span>

                <div className="pagination">

                    <button className="page-btn">

                        1

                    </button>

                </div>

            </div>

        </div>

    );

}

export default DataTable;