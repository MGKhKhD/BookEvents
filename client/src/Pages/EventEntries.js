import React, { useState } from "react";

const EventEntries = props => {
  const [eventEntry, useEventEntry] = useState({
    title: "",
    price: 0.0,
    date: "",
    description: ""
  });

  function handleChange(e) {
    useEventEntry({
      ...eventEntry,
      [e.target.name]: e.target.value
    });
    props.values(eventEntry);
  }

  return (
    <form>
      <div className="form-control">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="tilte"
          name="title"
          onChange={e => handleChange(e)}
        />
      </div>
      <div className="form-control">
        <label htmlFor="price">Price</label>
        <input
          type="number"
          id="price"
          name="price"
          onChange={e => handleChange(e)}
        />
      </div>
      <div className="form-control">
        <label htmlFor="date">Date</label>
        <input
          type="datetime-local"
          id="date"
          name="date"
          onChange={e => handleChange(e)}
        />
      </div>
      <div className="form-control">
        <label htmlFor="description">Description</label>
        <textarea
          type="text"
          id="description"
          rows="4"
          name="description"
          onChange={e => handleChange(e)}
        />
      </div>
    </form>
  );
};

export default EventEntries;
