import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import '../style/Calend.css';
import Layout from "../components/Layout";
import { Scrollbars } from 'react-custom-scrollbars';
import { startOfWeek, endOfWeek, isWithinInterval, format } from 'date-fns';

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
                    <Scrollbars style={{ height: 40 }}>

                        <p className="event-title"><b>{event.title}</b></p>

                    </Scrollbars>
                </div>
            );
            break;
        case "week":
            content = (
                <div className="event-content">
                    <Scrollbars style={{ height: 73 }}>
                        {event.booking_elements?.map((element, index) => (
                            <div key={index} className="booking-element">
                                <p className="element-tittle"><b>{element.element_name}</b></p>
                                <p className="event-place">{element.starttime.toLocaleString()} - {element.endtime.toLocaleString()}</p>
                            </div>
                        ))}
                    </Scrollbars>
                </div>
            );
            break;
        case "day":
            content = (
                <div className="event-content">
                    <Scrollbars style={{ height: 72 }}>
                        {event.booking_elements?.map((element, index) => (
                            <div key={index} className="booking-element">
                                <p className="element-tittle"><b>{element.element_name}</b></p>
                                <p className="event-place">{element.starttime.toLocaleString()} - {element.endtime.toLocaleString()}</p>
                            </div>
                        ))}
                    </Scrollbars>
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
    useEffect(() => {
        axios.get(`http://localhost:5000/booking/getBookingsByDateRange`, {
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

    const clickRef = useRef(null);
    const onDoubleClickEvent = useCallback((calEvent) => {
        /**
         * Notice our use of the same ref as above.
         */
        window.clearTimeout(clickRef?.current)
        clickRef.current = window.setTimeout(() => {
            window.alert(calEvent, 'onDoubleClickEvent')
        })
    }, [])

    return (
        <Layout>
            <div className="calend-container">
                <div className="rbc-row">
                    {currentView === "week" && (
                        <div className="calendar-events-weekly" style={{ paddingTop: "46px", width: "300px" }}>
                            <div className="rbc-header">
                                <span>Event</span>
                            </div>
                            {events.map((event) => {
                                const weekStart = startOfWeek(currentDate);
                                const weekEnd = endOfWeek(currentDate);
                                if (isWithinInterval(event.start, { start: weekStart, end: weekEnd })) {
                                    return (
                                        <div key={event.id} className="eventalista">
                                            <div className="rbc-row-content-scroll-container">
                                                <h6 className="eventtitla" style={{ textDecoration: 'underline' }}>{event.title}</h6 >
                                                <h6 className="eventtitla" style={{ backgroundColor: 'yellow' }}>Status: {event.status_code}</h6 >
                                                <h6 className="eventtitla">{`${format(event.start, 'dd/MMM/yyyy')}-${format(event.end, 'dd/MMM/yyyy')}`}</h6 >
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    )}
                    {currentView === "day" && (
                        <div className="calendar-events-weekly" style={{ paddingTop: "46px", width: "300px" }}>
                            <div className="rbc-header">
                                <span>Event</span>
                            </div>
                            {events.map((event) => {
                                const weekStart = startOfWeek(currentDate);
                                const weekEnd = endOfWeek(currentDate);
                                if (isWithinInterval(event.start, { start: weekStart, end: weekEnd })) {
                                    return (
                                        <div key={event.id} className="eventalista">
                                            <div className="rbc-row-content-scroll-container">
                                                <h6 className="eventtitla" style={{ textDecoration: 'underline' }}>{event.title}</h6 >
                                                <h6 className="eventtitla" style={{ backgroundColor: 'yellow' }}>Status: {event.status_code}</h6 >
                                                <h6 className="eventtitla">{`${format(event.start, 'dd/MMM/yyyy')}-${format(event.end, 'dd/MMM/yyyy')}`}</h6 >
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    )}

                </div>
                <div className="calendar-column">
                    <Calendar
                        localizer={localizer}
                        events={events.map((booking) => ({
                            ...booking,

                            booking_elements: booking.bookingelements.map((element) => ({
                                element_name: element.element_name,
                                start: new Date(element.startdate),
                                end: new Date(element.enddate),
                                starttime: element.starttime,
                                endtime: element.endtime,
                                supplier_place: element.supplier_place,

                            })),
                        }))}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 1000 }}
                        components={{ event: (eventProps) => <EventComponent {...eventProps} currentView={currentView} /> }}
                        onView={handleViewChange}
                        onNavigate={(newDate) => setCurrentDate(newDate)}
                        onSelectEvent={(event) => setSelectedEvent(event)}
                        showAllEvents
                        onDoubleClickEvent={onDoubleClickEvent}
                    />
                    {/* <div className="date-row" >

                        <div className="rbc-header" >
                            <span>11/20/2023</span>
                        </div>
                        <div className="rbc-header" >
                            <span>11/20/2023</span>
                        </div>
                        <div className="rbc-header" >
                            <span>11/20/2023</span>
                        </div>
                        <div className="rbc-header" >
                            <span>11/20/2023</span>
                        </div>
                        <div className="rbc-header" >
                            <span>11/20/2023</span>
                        </div>
                        <div className="rbc-header" >
                            <span>11/20/2023</span>
                        </div>
                        <div className="rbc-header" >
                            <span>11/20/2023</span>
                        </div>
                    </div> */}

                </div>

            </div>
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


        </Layout>
    );
};

export default Calend;