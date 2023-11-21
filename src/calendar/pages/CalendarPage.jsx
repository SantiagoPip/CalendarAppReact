import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Calendar } from 'react-big-calendar'

import { addHours } from 'date-fns'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { localizer } from '../../helpers/calendarLocalizer'
import { getMessages } from '../../helpers'
import { CalendarEventBox } from '../components/CalendarEventBox'
import { CalendarModal } from '../components/CalendarModal'
import { useAuthStore, useCalendarStore, useUIStore } from '../../hooks'
import { FabAddNew } from '../components/FabAddNew'
import { FabDelete } from '../components/FabDelete'

export const CalendarPage = () => {
  const {user} = useAuthStore()
    const [lastView,setLastView] = useState(localStorage.getItem('lastView') ||'week')
    const {openDateModal}  = useUIStore();
    const {events,setActiveEvent,startLoadingEvents} = useCalendarStore();

    const eventStyleGetter = (event,start,end,isSelected)=>{
      const isMyEvent = (user.uid===event.user._id)||(user.uid ===event.user.uid)
        const style={
            backgroundColor:isMyEvent?'#347CF7':"#464650",
            borderRadious:'0px',
            opacity:0.8,
            color:'white'
        }
        return {
            style
        }
    }
    const onDoubleClick = (event)=>{
      console.log('click')
        openDateModal()
    }
    const onSelect = (event)=>{
        setActiveEvent(event)
    }
    const onViewChange = (event)=>{
        localStorage.setItem('lastView',event)
        setLastView(event)
    }
    useEffect(() => {
      startLoadingEvents()
    }, [])
    
  return (
    <>
    <Navbar/>
    <Calendar
      localizer={localizer}
      events={events}
      defaultView={lastView}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 'calc(100vh - 80px)' }}
      messages={getMessages()}
      eventPropGetter={eventStyleGetter}
      components={{
        event:CalendarEventBox
      }}
      onDoubleClickEvent={onDoubleClick}
      onSelectEvent={onSelect}
      onView={onViewChange}
    />
    <CalendarModal/>
    <FabAddNew/>
    <FabDelete/>
    </>
  )
}
