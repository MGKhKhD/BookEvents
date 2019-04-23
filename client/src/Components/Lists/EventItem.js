import React, { useContext } from "react";
import AuthContext from "../../Contexts/AuthContext";

import "./EventItem.css";

const EventItem = ({ event, eventClick }) => {
  const auth = useContext(AuthContext);

  return (
    <li className="events-list__item">
      <div>
        <h1>{event.title}</h1>
        <h2>
          ${event.price}
          {"  "}
          {new Date(event.date).toLocaleDateString()}
        </h2>
      </div>
      <div>
        <button className="btn" onClick={eventClick.bind(this, event)}>
          Details
        </button>
        <p>
          {auth.token && auth.userId === event.creator._id
            ? "Owener"
            : event.creator.email}
        </p>
      </div>
    </li>
  );
};

export default EventItem;
