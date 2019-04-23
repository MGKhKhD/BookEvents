import React, { useState, useEffect, useContext } from "react";

import AuthContext from "../Contexts/AuthContext";
import BookingsList from "../Components/Lists/BookingsList";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);

  useEffect(() => {
    setIsLoading(true);
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    const reqBody = {
      query: `
          query { bookings{
              _id
              createdAt
              event{
                _id
                title
                date
              }
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
        setIsLoading(false);
        return res.json();
      })
      .then(res => {
        console.log(res.data);
        setBookings(res.data.bookings);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const handleCancelBook = bookId => {
    setIsLoading(true);
    const reqBody = {
      query: `
          mutation { cancelBooking(bookingId: "${bookId}"){
              _id
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
        setIsLoading(false);
        return res.json();
      })
      .then(res => {
        const updated = bookings.filter(book => book._id !== bookId);
        setBookings([...updated]);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <BookingsList bookings={bookings} cancelBooking={handleCancelBook} />
      )}
    </div>
  );
};

export default Bookings;
