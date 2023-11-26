import { authSlice, clearErrorMessage, onLogin, onLogout } from "../../../src/store/auth/authSilce"
import { authenticatedState, initialState } from "../../__fixtures__/authState"
import { testUserCredentials } from "../../__fixtures__/testUser"

describe('Pruebas en el authSlice', () => {
    
    test('Debe Regresar el estado Inicial ', () => { 
        expect(authSlice.getInitialState()).toEqual(initialState)
     }),
     test('Debe realizar un login', () => { 
        const state = authSlice.reducer(initialState,onLogin(testUserCredentials));
        expect(state).toEqual({
            status:'authenticated',
            user:testUserCredentials,
            errorMessage:undefined
        })


      }),
      test('Debe realizar el logout', () => { 
        const state = authSlice.reducer(authenticatedState,onLogout())
        expect(state).toEqual({
            status:'not-authenticated',
            user:{},
            errorMessage:undefined
        })
       })
       test('Debe realizar el logout', () => { 
        const errorMessage ='Credenciales no validas'
        const state = authSlice.reducer(authenticatedState,onLogout(errorMessage))
        expect(state).toEqual({
            status:'not-authenticated',
            user:{},
            errorMessage:errorMessage
        })
       }),
       test('Debe limpiar el mensaje de error', () => { 
        const errorMessage ='Credenciales no validas'
        const state = authSlice.reducer(authenticatedState,onLogout(errorMessage))
        const newState = authSlice.reducer(state,clearErrorMessage())
        expect(newState.errorMessage).toBe(undefined)
       })

} )
    