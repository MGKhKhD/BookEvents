import React from "react";

import "./EventsList.css";
import EventItem from "./EventItem";

const EventsList = ({ events, showDetails }) => {
  const handleEventClick = event => {
    showDetails(event);
  };

  const rows = [];
  events.forEach(event =>
    rows.push(
      <EventItem key={event._id} event={event} eventClick={handleEventClick} />
    )
  );

  return <ul className="events-list">{rows}</ul>;
};

export default EventsList;
