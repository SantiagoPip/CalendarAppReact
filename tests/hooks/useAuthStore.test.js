import { renderHook, waitFor } from "@testing-library/react"
import { useAuthStore } from "../../src/hooks/useAuthStore"
import { initialState, notAuthenticatedState } from "../__fixtures__/authState"
import {configureStore} from '@reduxjs/toolkit'
import {Provider} from 'react-redux'
import { authSlice } from "../../src/store/auth/authSilce"
import { testUserCredentials } from "../__fixtures__/testUser"
import { act } from "react-dom/test-utils"
import { calendarApi } from "../../src/api"

const getMockStore = (initialState)=>{
    return configureStore({
        reducer:{
            auth:authSlice.reducer,
        },
        preloadedState:{
            auth:{...initialState}
        }
    })
}

describe('Pruebas en el useAuthStore', () => { 
    beforeEach(()=> localStorage.clear())
    test('Debe de regresar los valores por defecto', () => { 
        const mockStore = getMockStore({...initialState});
        const {result} = renderHook(()=>useAuthStore(),{
            wrapper:({children})=>
                <Provider store={mockStore}>{children}</Provider>
            
        })
        expect(result.current).toEqual({
        status: 'checking',
        user: {},
        errorMessage: undefined,
        checkAuthToken:expect.any(Function) ,
        startLogin: expect.any(Function),
        startRegister:expect.any(Function) ,
        startLogout: expect.any(Function)
        })

     }),
     test('startLogin debe de realizar el login correctamente',async () => { 
        const mockStore = getMockStore({...notAuthenticatedState})
        const {result} = renderHook(()=>useAuthStore(),{
            wrapper:({children})=>
                <Provider store={mockStore}>{children}</Provider>
            
        });
        await act(async()=>{
           await result.current.startLogin(testUserCredentials)
        })
        const {errorMessage,status,user} = result.current;
        expect({errorMessage,status,user}).toEqual({
            errorMessage:undefined,
            status:'authenticated',
            user:{name:'Test User',uid:'655cb7e117d8c9a6d373413f'}
        })
        expect(localStorage.getItem('token')).toEqual(expect.any(String))
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String))

      }),
      test('should fail de authentication', async() => { 
        const mockStore = getMockStore({...notAuthenticatedState})
        const {result} = renderHook(()=>useAuthStore(),{
            wrapper:({children})=>
                <Provider store={mockStore}>{children}</Provider>
            
        });
        await act(async()=>{
           await result.current.startLogin({email:'algo@google.com',password:'123456'})
        })
        const {errorMessage,status,user} = result.current;
        console.log(errorMessage,status,user)
        console.log(localStorage.getItem('token'))
        expect(localStorage.getItem('token')).toBe(null);
        console.log()
        expect({errorMessage,status,user}).toEqual({
            errorMessage:'El usuario no existe  ese email',
            status:'not-authenticated',
            user:{}
        })
        waitFor(
            ()=>expect(result.current.errorMessage).toBe(undefined)
        )
       }),
       test('start register debe de crear un usuario', async() => { 
        const newUser = {email:'algo@google.com',password:'123456',name:    'Test user 2'}
        const mockStore = getMockStore({...notAuthenticatedState})
        const {result} = renderHook(()=>useAuthStore(),{
            wrapper:({children})=>
                <Provider store={mockStore}>{children}</Provider>
            
        });
       const spy = jest.spyOn(calendarApi,'post').mockReturnValue({
        data:{
            ok:true,
            uid:"31241234123",
            name:'Test user',
            token:'ALGUN-TOKEN'
        }
       }) 
        await act(async()=>{
           await result.current.startRegister(newUser)
        })
        const {errorMessage,status,user} = result.current
        expect({errorMessage,status,user}).toEqual({
            errorMessage:undefined,
            status:'authenticated',
            user:{name:'Test user',uid:'31241234123'}
        })
        spy.mockRestore();
        })

        test('start register debe de fallar la creacion',async () => { 
            const mockStore = getMockStore({...notAuthenticatedState})
            const {result} = renderHook(()=>useAuthStore(),{
                wrapper:({children})=>
                    <Provider store={mockStore}>{children}</Provider>
                
            });
           
            await act(async()=>{
               await result.current.startRegister(testUserCredentials)
            })
            const {errorMessage,status,user} = result.current
            expect({errorMessage,status,user}).toEqual({
                errorMessage:'Credenciales incorrectas',
                status:'not-authenticated',
                user:{}
            })
         })
         test('CheckAuthToken debe fallar si no hay token', async () => { 
            const mockStore = getMockStore({...initialState})
            const {result} = renderHook(()=>useAuthStore(),{
                wrapper:({children})=>
                    <Provider store={mockStore}>{children}</Provider>
                
            });
            
            await act(async()=>{
                await result.current.checkAuthToken()
            })
            const {errorMessage,status,user} = result.current;
            expect({errorMessage,status,user}).toEqual({
                errorMessage:undefined,
                status:'not-authenticated',
                user:{}
            })
          });
          test('checkAuthToken debe de autenticar el usuario si hay un token',async () => { 
            const {data} = await calendarApi.post('/auth',testUserCredentials);
            localStorage.setItem('token',data.token)
            const mockStore = getMockStore({...initialState})

            const {result} = renderHook(()=>useAuthStore(),{
                wrapper:({children})=>
                    <Provider store={mockStore}>{children}</Provider>
                
            });
            
            await act(async()=>{
                await result.current.checkAuthToken()
            })
            const {errorMessage,status,user} = result.current;
            console.log(errorMessage,status,user)
            expect({errorMessage,status,user}).toEqual({
                errorMessage:undefined,
                status:'authenticated',
                user:{uid: '655cb7e117d8c9a6d373413f',name: 'Test User'}
            })
           })
 })