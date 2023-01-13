import {authAPI} from '../api/todolists-api'
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {handleServerNetworkError} from "../utils/error-utils";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";


export const initializeAppTC = createAsyncThunk('app/initializeApp', async (param, thunkAPI) => {
    try {
        const res = await authAPI.me()
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setIsLoggedInAC({value: true}))
            } else {

            }
            return;
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({})
    }
})

const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle',
        error: null,
        isInitialized: false
    } as InitialStateType,
    reducers: {
        setAppStatusAC: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppErrorAC: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
    },
    extraReducers: builder => {
        builder.addCase(initializeAppTC.fulfilled, (state, action) => {
            state.isInitialized = true
    })}
})

export const appReducer = slice.reducer

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    error: string | null
    // true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
    isInitialized: boolean
}

export const {setAppErrorAC, setAppStatusAC} = slice.actions


export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>

