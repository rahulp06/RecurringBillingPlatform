import RevenueChart from "./RevenueChart";
import RevenuePie from "./RevenuePie";

import "../../styles/admin/admin-dashboard.css";

function RevenueSection() {

    return (

        <div className="analytics-grid">

            <div className="analytics-card analytics-large">

                <div className="card-header">

                    <div>

                        <h3>

                            Revenue Analytics

                        </h3>

                        <p>

                            Monthly revenue overview

                        </p>

                    </div>

                    <select className="card-select">

                        <option>Last 12 Months</option>

                        <option>Last 6 Months</option>

                        <option>Last 30 Days</option>

                    </select>

                </div>

                <RevenueChart/>

            </div>

            <div className="analytics-card">

                <div className="card-header">

                    <div>

                        <h3>

                            Subscription Distribution

                        </h3>

                        <p>

                            Current active plans

                        </p>

                    </div>

                </div>

                <RevenuePie/>

            </div>

        </div>

    );

}

export default RevenueSection;