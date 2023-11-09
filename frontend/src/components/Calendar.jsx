import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { Views } from "react-big-calendar";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import { addDays } from "date-fns";
import '../style/Calend.css';
import startOfWeek from "date-fns/startOfWeek";

const locales = {
    "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const EventComponent = ({ event, currentView }) => {
    let content = null;

    switch (currentView) {
        case "month":
            content = (
                <div className="event-content">
                    <p className="event-title"><b>{event.title}</b></p>
                </div>
            );
            break;
        case "week":
            content = (
                <div className="event-content">
                    <p className="event-title"><b>{event.title}</b></p>
                    <p className="event-place">{event.deptor_place}</p>
                </div>
            );
            break;
        case "day":
            content = (
                <div className="event-content">
                    <p className="event-title"><b>{event.title}</b></p>
                    
                </div>
            );
            break;
        default:
            content = (
                <div className="event-content">
                    <p className="event-title"><b>{event.title}</b></p>
                </div>
            );
    }

    return content;
};



const Calend = () => {
    const [events, setEvents] = useState([]);
    const [currentView, setCurrentView] = useState("month");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [SelectedEvent, setSelectedEvent] = useState("");
    const handleViewChange = (newView) => {
        setCurrentView(newView);
    };
    let endDate = addDays(currentDate, 6);
    const formattedStartDate = format(currentDate, "yyyy-MM-dd'T'00:00:00");
    const formattedEndDate = format(endDate, "yyyy-MM-dd'T'00:00:00");



    useEffect(() => {
        axios.get(`http://localhost:5000/getBookingsByDateRange`, {
            params: {
                startDate: "2010-03-09 00:00:00",
                endDate: "2026-03-09 00:00:00",
            }
        })
            .then((response) => {
                const bookingEvents = response.data.map((booking) => ({
                    title: booking.trip_name,
                    start: new Date(booking.startdate),
                    end: new Date(booking.enddate),
                    deptor_place: booking.deptor_place,
                    summary: booking.summary,
                    status_code: booking.status_code,
                    number: booking.number,
                    company_name: booking.company_name,
                    contact_first_name: booking.contact_first_name,

                    bookingelements: booking.booking_elements.map((element) => ({
                        element_name:element.element_name,
                        start: new Date(element.startdate),
                        end: new Date(element.enddate),
                        starttime: element.starttime,
                        endtime: element.endtime,
                        supplier_place: element.supplier_place,

                    })),

                }));
                setEvents(bookingEvents);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des réservations :", error);
            });
    }, [currentDate]);

    console.log(SelectedEvent);
    return (
        <div className="App">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 700, margin: "50px" }}
                components={{ event: (eventProps) => <EventComponent {...eventProps} currentView={currentView} /> }}
                onView={handleViewChange}
                onNavigate={(newDate) => setCurrentDate(newDate)}
                onSelectEvent={(event) => setSelectedEvent(event)}
            />
            {SelectedEvent && (
                <div className="form-container">
                    <div className="form-row">
                        <div className="form-column">
                            <label>Booking:</label>
                            <input type="text" value={SelectedEvent.number} readOnly />
                        </div>
                        <div className="form-column">
                            <label>Trip Name:</label>
                            <input type="text" value={SelectedEvent.title} readOnly />
                        </div>
                        <div className="form-column">
                            <label>Status Code:</label>
                            <input type="text" value={SelectedEvent.status_code} readOnly />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-column">
                            <label>Start Date:</label>
                            <input type="text" value={SelectedEvent.start.toLocaleString()} readOnly />
                        </div>
                        <div className="form-column">
                            <label>End Date:</label>
                            <input type="text" value={SelectedEvent.end.toLocaleString()} readOnly />
                        </div>
                        <div className="form-column">
                            <label>Contact First Name:</label>
                            <input type="text" value={SelectedEvent.contact_first_name} readOnly />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-column">
                            <label>Company Name:</label>
                            <input type="text" value={SelectedEvent.company_name} readOnly />
                        </div>
                        <div className="form-column">
                            <label>Deptor Place:</label>
                            <input type="text" value={SelectedEvent.deptor_place} readOnly />
                        </div>
                    </div>
                    <br />

                    {SelectedEvent.bookingelements.map((element, index) => (
                        <div key={index} className="form-column">
                            <label> {element.element_name}{index + 1}:</label>
                            <br />
                            <label>Start:</label>
                            <input type="text" value={element.start.toLocaleString()} readOnly />
                            <label>End:</label>
                            <input type="text" value={element.end.toLocaleString()} readOnly />
                            <label>Starttime:</label>
                            <input type="text" value={element.starttime.toLocaleString()} readOnly />
                            <label>EndTime:</label>
                            <input type="text" value={element.endtime.toLocaleString()} readOnly />
                            <label>Supplier Place:</label>
                            <input type="text" value={element.supplier_place || "None"}  readOnly />                          
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default Calend;
