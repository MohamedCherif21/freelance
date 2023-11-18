import React, { useState, useEffect } from "react";
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
                    <p className="event-title"><b>{event.title}</b></p>
                    <p className="event-place">{event.deptor_place}</p>
                </div>
            );
            break;
        case "day":
            content = (
                <div className="event-content">
                    <p className="event-title"><b>{event.title}</b></p>
                    <p className="timestyle">{`${format(event.start, 'HH:MM:SS')}-${format(event.end, 'HH:MM:SS')}`}</p>
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
    return (
        <Layout>
            <div className="calend-container">
                <div className="rbc-row">
                    {currentView === "week" && (
                        <div className="calendar-events-weekly" style={{ paddingTop: "46px", width: "300px" }}>
                            <div className="rbc-header">
                                <span>Event</span>
                            </div>
                            {/* Filtrer les événements par semaine */}
                            {events.map((event) => {
                                // Filtrer les événements pour chaque semaine affichée dans le calendrier
                                const weekStart = startOfWeek(currentDate); // Obtenez le début de la semaine actuellement affichée
                                const weekEnd = endOfWeek(currentDate); // Obtenez la fin de la semaine actuellement affichée

                                // Vérifier si l'événement se trouve dans la semaine actuellement affichée
                                if (isWithinInterval(event.start, { start: weekStart, end: weekEnd })) {
                                    return (
                                        <div key={event.id} className="rbc-row">
                                            <div className="rbc-row-content-scroll-container">
                                                <label style={{ textDecoration: 'underline' }}>{event.title}</label>
                                                <label style={{ backgroundColor: 'yellow' }}>Status: {event.status_code}</label>
                                                <label>{`${format(event.start, 'dd/MMM/yyyy')}-${format(event.end, 'dd/MMM/yyyy')}`}</label>
                                            </div>
                                        </div>
                                    );
                                }
                                return null; // Ne rien afficher si l'événement n'est pas dans la semaine actuelle
                            })}
                        </div>
                    )}
                    {currentView === "day" && (
                        <div className="calendar-events-daily" style={{ paddingTop: "46px", width: "300px" }}>
                            <div className="rbc-header">
                                <span>Event</span>
                            </div>
                            {/* Filtrer les événements par jour */}
                            {events.map((event) => {
                                // Vérifier si l'événement se produit le jour actuellement affiché
                                const isEventOnSelectedDay =
                                    event.start.getDate() === currentDate.getDate() &&
                                    event.start.getMonth() === currentDate.getMonth() &&
                                    event.start.getFullYear() === currentDate.getFullYear();

                                // Afficher les détails de l'événement si l'événement se produit ce jour-là
                                if (isEventOnSelectedDay) {
                                    return (
                                        <div key={event.id} className="rbc-row">
                                            <div className="rbc-row-content-scroll-container">
                                                <label style={{ textDecoration: 'underline' }}>{event.title}</label>
                                                <label style={{ backgroundColor: '#86e486' }}>Status: {event.status_code}</label>
                                                <label>{`${format(event.start, 'dd/MMM/yyyy')}-${format(event.end, 'dd/MMM/yyyy')}`}</label>
                                            </div>
                                        </div>
                                    );
                                }
                                return null; // Ne rien afficher si l'événement n'est pas pour ce jour
                            })}
                        </div>
                    )}

                </div>
                <div className="calendar-column">
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 1000 }}
                        components={{ event: (eventProps) => <EventComponent {...eventProps} currentView={currentView} /> }}
                        onView={handleViewChange}
                        onNavigate={(newDate) => setCurrentDate(newDate)}
                        onSelectEvent={(event) => setSelectedEvent(event)}
                        popup
                        showAllEvents

                    />
                </div>
            </div>
        </Layout>
    );
};

export default Calend;