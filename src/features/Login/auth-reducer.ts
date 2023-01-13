import {Dispatch} from 'redux'
import {setAppStatusAC} from '../../app/app-reducer'
import {authAPI, FieldErrorType, LoginParamsType} from '../../api/todolists-api'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {AxiosError} from "axios";

const initialState = {
    isLoggedIn: false
}

export const loginTC = createAsyncThunk<undefined, LoginParamsType, { rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> } }>('auth/login', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const response = await authAPI.login(param)
        if (response.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return
        } else {
            handleServerAppError(response.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: response.data.messages, fieldsErrors: response.data.fieldsErrors})
        }
    } catch (error) {
        const err: AxiosError = error
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors: [err.message], fieldsErrors: undefined})
    }
})

export const logoutTC = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({})
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({})
    }
})


const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: builder => {
        builder.addCase(loginTC.fulfilled, (state) => {
            state.isLoggedIn = true
        })
        builder.addCase(logoutTC.fulfilled, (state) => {
            state.isLoggedIn = false
        })
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions


const a1 = {
    type: 'SET-IS-LOGIN-IN',
    payload: {
        value: true
    }
}
const a2 = {
    type: 'SET-blabal',
    payload: {
        user: {name: "sdsd"},
        age: 12
    }
}
