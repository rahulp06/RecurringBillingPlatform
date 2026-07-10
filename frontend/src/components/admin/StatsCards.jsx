import {
  FaBoxOpen,
  FaCreditCard,
  FaHistory,
  FaClock,
} from "react-icons/fa";

import "../styles/cards.css";

function StatsCards({

  totalPlans = 0,
  subscriptions = 0,
  billingCycles = 0,
  trials = 0,

}) {

  const cards = [

    {
      title: "Plans",
      value: totalPlans,
      icon: <FaBoxOpen />,
      color: "#4f46e5",
    },

    {
      title: "Subscriptions",
      value: subscriptions,
      icon: <FaCreditCard />,
      color: "#22c55e",
    },

    {
      title: "Billing Cycles",
      value: billingCycles,
      icon: <FaHistory />,
      color: "#f59e0b",
    },

    {
      title: "Trials",
      value: trials,
      icon: <FaClock />,
      color: "#ef4444",
    },

  ];

  return (

    <div className="stats-grid">

      {cards.map((card) => (

        <div
          className="stats-card"
          key={card.title}
        >

          <div
            className="stats-icon"
            style={{ color: card.color }}
          >
            {card.icon}
          </div>

          <div>

            <h4>{card.title}</h4>

            <h2>{card.value}</h2>

          </div>

        </div>

      ))}

    </div>

  );

}

export default StatsCards;