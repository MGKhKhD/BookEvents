import React, { useContext } from "react";
import AuthContext from "../../Contexts/AuthContext";

import "./Modal.css";

const DetailsModal = ({ event, closeModal }) => {
  const auth = useContext(AuthContext);

  const bookEvent = () => {
    const reqBody = {
      query: `
  mutation { bookEvent(eventId: "${event._id}"){
    _id
    createdAt
    updatedAt
  }}
  `
    };
    fetch("http://localhost:4200/graphql", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + auth.token
      }
    })
      .then(res => {
        //if (res.status !== 200) throw new Error("Failed");
        return res.json();
      })
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };

  return (
    <div className="modal">
      <header className="modal__header">
        <h1>{event.title}</h1>
      </header>
      <section className="modal__content">
        <h3>${event.price}</h3>
        <h3>{new Date(event.date).toISOString().split("T")[0]}</h3>
        <h3>{new Date(event.date).toISOString().split("T")[1]}</h3>
        <p>{event.description}</p>
      </section>
      <section className="modal__actions">
        {auth.token && (
          <button className="btn" onClick={bookEvent}>
            Book
          </button>
        )}
        <button className="btn" onClick={() => closeModal()}>
          Close
        </button>
      </section>
    </div>
  );
};

export default DetailsModal;
