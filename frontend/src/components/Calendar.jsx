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
                    <p className="eventtitle"><b>{event.title}</b></p>
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
                        element_name: element.element_name,
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
        <div className="calend-container">
            {currentView === "week" &&  (
                <div className="events-column" style={{ paddingTop: "66px", width: "300px" }}>
                    <div className="rbc-header" >
                        <span role="clomnheader">Event</span>
                    </div>
                    {SelectedEvent && (
                        <div className="form-row">
                            <div className="form-column">
                                <label style={{ textDecoration: 'underline' }}>{SelectedEvent.title}</label>
                                <label style={{ backgroundColor: 'yellow' }}>Status: {SelectedEvent.status_code}</label>
                                <label>{`${format(SelectedEvent.start, 'dd/MMM/yyyy')}-${format(SelectedEvent.end, 'dd/MMM/yyyy')}`}</label>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {currentView === "day" &&  (
                <div className="events-column" style={{ paddingTop: "66px", width: "300px" }}>
                    <div className="rbc-header" >
                        <span role="clomnheader">Event</span>
                    </div>
                    {SelectedEvent && (
                        <div className="form-row">
                            <div className="form-column">
                                <label style={{ textDecoration: 'underline' }}>{SelectedEvent.title}</label>
                                <label style={{ backgroundColor: 'green' }}>Status: {SelectedEvent.status_code}</label>
                                <label>{`${format(SelectedEvent.start, 'dd/MMM/yyyy')}-${format(SelectedEvent.end, 'dd/MMM/yyyy')}`}</label>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className="calendar-column">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 800, margin: "10px" }}
                    components={{ event: (eventProps) => <EventComponent {...eventProps} currentView={currentView} /> }}
                    onView={handleViewChange}
                    onNavigate={(newDate) => setCurrentDate(newDate)}
                    onSelectEvent={(event) => setSelectedEvent(event)}
                    popup

                />
                {SelectedEvent && (
                    <div className="event-details-container">
                        <div className="event-details-header">
                            <h2 className="event-details-title">{SelectedEvent.title}</h2>
                            <p className="event-details-status">Status: {SelectedEvent.status_code}</p>
                            <p className="event-details-dates">{`${format(SelectedEvent.start, "dd/MMM/yyyy")}-${format(SelectedEvent.end, "dd/MMM/yyyy")}`}</p>
                        </div>

                        <div className="event-details-body">
                            <div className="event-details-row">
                                <div className="event-details-label">Booking:</div>
                                <div className="event-details-value">{SelectedEvent.number}</div>
                            </div>

                            <div className="event-details-row">
                                <div className="event-details-label">Trip Name:</div>
                                <div className="event-details-value">{SelectedEvent.title}</div>
                            </div>

                            <div className="event-details-row">
                                <div className="event-details-label">Contact First Name:</div>
                                <div className="event-details-value">{SelectedEvent.contact_first_name}</div>
                            </div>

                            <div className="event-details-row">
                                <div className="event-details-label">Company Name:</div>
                                <div className="event-details-value">{SelectedEvent.company_name}</div>
                            </div>

                            <div className="event-details-row">
                                <div className="event-details-label">Deptor Place:</div>
                                <div className="event-details-value">{SelectedEvent.deptor_place}</div>
                            </div>
                        </div>

                        {SelectedEvent.bookingelements.length > 0 && (
                            <div className="event-details-bookingelements-container">
                                <h3>Booking Elements</h3>
                                {SelectedEvent.bookingelements.map((element, index) => (
                                    <div key={index} className="event-details-bookingelement">
                                        <p className="event-details-bookingelement-name">{element.element_name}</p>
                                        <div className="event-details-bookingelement-details">
                                            <div className="event-details-bookingelement-detail">
                                                <label>Start:</label>
                                                <span>{element.start.toLocaleString()}</span>
                                            </div>

                                            <div className="event-details-bookingelement-detail">
                                                <label>End:</label>
                                                <span>{element.end.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="event-details-bookingelement-details">
                                            <div className="event-details-bookingelement-detail">
                                                <label>Starttime:</label>
                                                <span>{element.starttime.toLocaleString()}</span>
                                            </div>

                                            <div className="event-details-bookingelement-detail">
                                                <label>EndTime:</label>
                                                <span>{element.endtime.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="event-details-bookingelement-detail">
                                            <label>Supplier Place:</label>
                                            <span>{element.supplier_place || "None"}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                )}

            </div>
        </div>
    );
};

export default Calend;