import React from "react";

import "./BookingsList.css";

const BookingsList = ({ bookings, cancelBooking }) => {
  return (
    <ul className="bookings-list">
      {bookings.map(book => (
        <li key={book._id} className="bookings-list__item">
          <div>
            {book.event.title}---
            {new Date(book.event.date).toLocaleDateString()}
          </div>
          <div className="bookings-list_actions">
            <button className="btn" onClick={() => cancelBooking(book._id)}>
              Cancel
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BookingsList;
