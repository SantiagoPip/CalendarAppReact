import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { onAddNewEvent, onSetActiveEvent, onUpdateEvent ,onDeleteEvent, onLoadEvents} from '../store';
import { calendarApi } from '../api';
import { compareEventsToDateEvents } from '../helpers';
import Swal from 'sweetalert2';

export const useCalendarStore = () => {
    const dispatch = useDispatch();
    const {events,activeEvent} = useSelector(state =>state.calendar);
    const {user} = useSelector(state => state.auth)
    const setActiveEvent = (calendarEvent)=>{
        dispatch(onSetActiveEvent(calendarEvent))
    }
    const startSavingEvent=async(calendarEvent)=>{
        try {
            if(calendarEvent.id){
                await calendarApi.put(`/events/${calendarEvent.id}`,calendarEvent)
                dispatch(onUpdateEvent({...calendarEvent,user}))
                return
            }
                const {data} = await calendarApi.post('/events',calendarEvent)
                console.log(data.msg.id)
                dispatch(onAddNewEvent({...calendarEvent,id:data.msg.id,user}))
        } catch (error) {
            Swal.fire('Error al guardar',error.response.data.msg)
        }
        
    }
    const startDeletingEvent =async ()=>{
        try{
           await calendarApi.delete(`/events/${activeEvent.id}`)     
           dispatch(onDeleteEvent())
        }catch(error){
            Swal.fire('No puedes eliminar este evento',error.response.data.msg)

        }
    }
    const startLoadingEvents= async()=>{
        try {
            const {data} = await calendarApi.get('/events')
            const events = compareEventsToDateEvents(data.eventos);
            dispatch(onLoadEvents(events))
            console.log(events)
            console.log(data)
        } catch (error) {
            console.log('Error cargando eventos')
            console.log(error)
        }
    }
    return {
        activeEvent,
        events,
        hasEventSelected:!!activeEvent,

        //Metodos
        startDeletingEvent,
        setActiveEvent,
        startSavingEvent,
        startLoadingEvents
    }
}
