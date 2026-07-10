import { FaInbox } from "react-icons/fa";
import "../../styles/common/empty-state.css";

function EmptyState({

    title,

    description

}){

    return(

        <div className="empty-state">

            <FaInbox className="empty-icon"/>

            <h2>{title}</h2>

            <p>{description}</p>

        </div>

    );

}

export default EmptyState;