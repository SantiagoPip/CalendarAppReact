import { CalendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice"
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from "../../__fixtures__/calendarState";

describe('Pruebas en Calendar Slice', () => { 
    test('Debe regresar el estado por defecto', () => { 
        const state = CalendarSlice.getInitialState();
        console.log(state,'Estado')
        console.log(initialState,'Estado inicial')
        expect(state).toEqual(initialState)

     });
     test('onSetActiveEvent debe de activar el evento', () => { 
        const state = CalendarSlice.reducer(calendarWithEventsState,onSetActiveEvent(events[0]))
        expect(state.activeEvent).toEqual(events[0])
      });
    test('onAddNewEvent debe agregar el evento',()=>{
        
        const newEvent = {
            
                id:'2',
                title:'Cumpleanos de Santiago',
                notes:'Alguna nota',
                start:new Date('2022-10-21 13:00:00'),
                end:new Date('2022-10-21 15:00:00'),
              
        }
        const state = CalendarSlice.reducer(calendarWithEventsState,onAddNewEvent(newEvent))
        expect(state.events).toEqual([...events,newEvent])
    }),
    test('onUpdateEvent debe agregar el evento',()=>{
        
        const updatedEvent = {
            
                id:'1',
                title:'Cumpleanos de Santiago actualizado',
                notes:'Alguna nota actualizado',
                start:new Date('2022-10-21 13:00:00'),
                end:new Date('2022-10-21 15:00:00'),
              
        }
        const state = CalendarSlice.reducer(calendarWithEventsState,onUpdateEvent(updatedEvent))
        expect(state.events).toContain(updatedEvent)
    }),
    test('onDeleteEvent debe  de borrar el evento activo', () => { 
        //calendarWithActiveEvents
        const state = CalendarSlice.reducer(calendarWithActiveEventState,onDeleteEvent())
        expect(state.activeEvent).toBe(null)
        expect(state.events).not.toContain(events[0])

    }),
     test('onLoadsEvents debe de establecer los eventos', () => { 
        const state = CalendarSlice.reducer(initialState,onLoadEvents(events));
        expect(state.isLoadingEvents).toBeFalsy();
        expect(state.events).toEqual(events)
        const newState = CalendarSlice.reducer(state,onLoadEvents(events))
        expect(state.events.length).toBe(events.length)

    }),
      test('onLogoutCalendar debe de limpiar el estado', () => { 
        //calendarWithActiveEventState
        const state = CalendarSlice.reducer(calendarWithActiveEventState,onLogoutCalendar());
        expect(state).toEqual(initialState)
    })

 })