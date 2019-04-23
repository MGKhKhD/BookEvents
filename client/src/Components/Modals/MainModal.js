import React from "react";

import "./Modal.css";

const MainModal = props => {
  return (
    <div className="modal">
      <header className="modal__header">
        <h1>Modal Title</h1>
      </header>
      <section className="modal__content">{props.children}</section>
      <section className="modal__actions">
        {props.canConfirm && (
          <button className="btn" onClick={() => props.actedConfirm()}>
            Confirm
          </button>
        )}
        {props.canCancel && (
          <button className="btn" onClick={() => props.actedCancel()}>
            Cancel
          </button>
        )}
      </section>
    </div>
  );
};

export default MainModal;
