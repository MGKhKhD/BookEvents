import React, { useState, useEffect, useContext } from "react";

import MainModal from "../Components/Modals/MainModal";
import DetailsModal from "../Components/Modals/DetailsModal";
import Backdrop from "../Components/Modals/Backdrop";
import EventEntries from "./EventEntries";
import AuthContext from "../Contexts/AuthContext";
import EventsList from "../Components/Lists/EventsLists";

import "./Events.css";

const Events = () => {
  const auth = useContext(AuthContext);
  const [modal, setModal] = useState(false);
  const [entries, setEntries] = useState({
    title: "",
    price: 0.0,
    date: new Date(),
    description: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [detailEvent, setDetailEvent] = useState(null);
  const [detailModal, setDetailModal] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const token = auth.token;

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    setIsLoading(true);
    if (isActive) {
      fetchEvents(signal);
    }
    return () => {
      abortController.abort();
      setIsActive(false);
    };
  }, []);

  const fetchEvents = signal => {
    const reqBody = {
      query: `
          query { events{
              _id
              title
              description
              price
              date
              creator{
                _id
                email
              }
          }}
          `
    };

    fetch("http://localhost:4200/graphql", {
      signal: signal,
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        setEvents([...res.data.events]);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  function addEntries(entries) {
    entries.price = parseFloat(entries.price);
    setEntries(entries);
  }

  function confirmEntries() {
    if (
      entries.title.length === 0 ||
      entries.description.length === 0 ||
      entries.price < 0 ||
      entries.date.length === 0
    ) {
      return;
    }

    setIsLoading(true);
    const reqBody = {
      query: `
  mutation { createEvent(inputEvent: {title: "${
    entries.title
  }", description: "${entries.description}", price:${parseFloat(
        entries.price
      )}, date: "${entries.date}"}){
      _id
      title
      description
      price
      date
  }}
  `
    };

    fetch("http://localhost:4200/graphql", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        if (res.status !== 200) throw new Error("Failed");
        return res.json();
      })
      .then(res => {
        const updatedEvents = [...events];
        const resData = res.data.createEvent;
        const resEvent = {
          _id: resData._id,
          title: resData.title,
          description: resData.description,
          price: resData.price,
          date: resData.date,
          creator: {
            _id: auth.userId,
            email: auth.email
          }
        };
        updatedEvents.push(resEvent);
        setEvents(updatedEvents);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }

  const showDetailsModal = event => {
    setDetailEvent(event);
    setDetailModal(true);
  };

  return (
    <React.Fragment>
      {(modal || detailModal) && <Backdrop />}
      {modal && (
        <MainModal
          title="Add Event"
          canCancel
          canConfirm
          actedConfirm={() => {
            setModal(false);
            confirmEntries();
          }}
          actedCancel={() => setModal(false)}
        >
          <EventEntries values={entries => addEntries(entries)} />
        </MainModal>
      )}
      {detailModal && (
        <DetailsModal
          event={detailEvent}
          closeModal={() => {
            setDetailModal(false);
          }}
        />
      )}
      {token && (
        <div className="events-control">
          <p>Share new Events</p>
          <button className="btn" onClick={() => setModal(!modal)}>
            Add Event
          </button>
        </div>
      )}
      {isLoading ? (
        <p className="loading-p">Loading....</p>
      ) : (
        <EventsList events={events} showDetails={showDetailsModal} />
      )}
    </React.Fragment>
  );
};

export default Events;
