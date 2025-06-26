import { createSlice, createAsyncThunk, PayloadAction, isRejectedWithValue } from "@reduxjs/toolkit"
import api from "@/lib/axios"
import {setAccessToken} from "@/lib/authUtils"
import { actionAsyncStorage } from "next/dist/server/app-render/action-async-storage.external"

interface User {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null,
  message: string | null,
  loading: boolean
  error: string | null,
  isLoading?: boolean,
  isError?:string | null,
  checkedUser? : User | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  message: null,
  loading: false,
  error: null,
  checkedUser: null
}

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/login", { email, password })
      setAccessToken(res.data.tokens.accessToken) // Store token in authUtils

      return {
        user: res.data.user,
        token: res.data.tokens.accessToken,
        message: res.data.message || "Login successful",
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.response?.data?.error || err.message || "Login failed"
      return rejectWithValue(message)
    }
  }
)

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    { name, email, password }: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post("/api/auth/register", { name, email, password })
      setAccessToken(res.data.tokens.accessToken)
      return {
        user: res.data.user,
        message: res.data.message || "Registration successful. Please verify your email with the OTP sent to you."
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Registration failed"
      return rejectWithValue(msg)
    }
  }
)

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (
    { email, otp }: { email: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post("/api/auth/verifyOTP", { email, otp });
      setAccessToken(res.data.tokens.accessToken)
      return {
        user: res.data.user,
        token: res.data.tokens.accessToken,
        message: res.data.message || "OTP verified",
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Verification failed"
      return rejectWithValue(msg)
    }
  }
)

export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/resend-otp", { email })
      return { message: res.data.message || "OTP resent successfully" }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Resend OTP failed"
      return rejectWithValue(msg)
    }
  }
)

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/forgot-password", { email })
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong")
    }
  }
)

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    { token, email, password, confirmPassword }: { token: string, email: string, password: string, confirmPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post("/api/auth/reset-password", {
        token, email, password, confirmPassword,
      })
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Reset failed")
    }
  }
)

export const checkUser = createAsyncThunk<User, void>(
  "user/checkUser",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get<User>(
        `/api/auth/check-auth`,
        { withCredentials: true }
      )
      return data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to check user"
      )
    }
  }
)



const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.loading = false
        state.user = payload.user
        
        state.message = payload.message
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload as string
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.message = action.payload.message || "Login successful"
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    .addCase(verifyOtp.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(verifyOtp.fulfilled, (state, { payload }) => {
      state.loading = false
      state.user = payload.user
      state.token = payload.token
      state.message = payload.message
    })
    .addCase(verifyOtp.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload as string
    })
      .addCase(resendOtp.pending, (state) => {
    state.loading = true
    state.error = null
  })
  .addCase(resendOtp.fulfilled, (state, { payload }) => {
    state.loading = false
    state.message = payload.message
  })
  .addCase(resendOtp.rejected, (state, { payload }) => {
    state.loading = false
    state.error = payload as string
  })

  .addCase(forgotPassword.pending, (state) => {
      state.loading = true
      state.error = null
      state.message = null
    })
    .addCase(forgotPassword.fulfilled, (state, action) => {
      state.loading = false
      state.message = action.payload.message || "Reset email sent"
    })
    .addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
    .addCase(resetPassword.pending, (state) => {
    state.loading = true
    state.error = null
    state.message = null
  })
  .addCase(resetPassword.fulfilled, (state, action) => {
    state.loading = false
    state.message = action.payload.message || "Password reset successful"
  })
  .addCase(resetPassword.rejected, (state, action) => {
    state.loading = false
    state.error = action.payload as string
  })
  .addCase(checkUser.pending, (state) => {
      state.isLoading = true
      // state.isError = null
      // state.checkedUser = null
    })
    .addCase(checkUser.fulfilled, (state, { payload }) => {
      state.isLoading = false
      state.checkedUser = payload
    })
    .addCase(checkUser.rejected, (state, { payload }) => {
      state.isLoading = false
      state.isError = payload as string
    })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
