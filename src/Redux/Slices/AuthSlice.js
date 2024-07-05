// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axiosInstance from "../../Helpers/axiosInstance";
// import toast from "react-hot-toast";

// const initialState = {
//   isLoggedIn: localStorage.getItem("isLoggedIn") === "true" || false,
//   role: localStorage.getItem("role") || "",
//   token: localStorage.getItem("token") || "",
//   data: (() => {
//     const data = localStorage.getItem("data");
//     try {
//       return JSON.parse(data) || {};
//     } catch {
//       return {};
//     }
//   })(),
// };

// export const createAccount = createAsyncThunk(
//   "auth/createAccount",
//   async (data) => {
//     try {
//       const response = axiosInstance.post("/users", data);
      
//       toast.promise(response, {
//         loading: "Hold back tight, we are registering your id...",
//         success: "Account created successfully",
//         error: "Ohh No!, something went wrong. Please try again",
//       });

//       const apiResponse = await response;
//       console.log("My response", apiResponse);
//       return apiResponse;
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );

// export const login = createAsyncThunk("auth/login", async (data) => {
//   console.log("incoming data to the thunk", data);
//   try {
//     const response = axiosInstance.post("/auth/login", data);

//     toast.promise(response, {
//       loading: "Logging in...",
//       success: "Logged in successfully",
//       error: "Ohh No!, something went wrong. Please try again",
//     });

//     const apiResponse = await response;

//     // Store the token in localStorage
//     const { token } = apiResponse.data.data;
//     localStorage.setItem("token", token);

//     return apiResponse;
//   } catch (error) {
//     console.log(error);
//   }
// });

// export const logout = createAsyncThunk("auth/logout", async () => {
//   try {
//     const response = axiosInstance.post("/auth/logout");

//     toast.promise(response, {
//       loading: "Logging out...",
//       success: "Logged out successfully",
//       error: "Ohh No!, something went wrong. Please try again",
//     });

//     const apiResponse = await response;
//     return apiResponse;
//   } catch (error) {
//     console.log(error);
//   }
// });

// const AuthSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(login.fulfilled, (state, action) => {
//         state.isLoggedIn = true;
//         state.role = action?.payload?.data?.data?.userRole;
//         state.data = action?.payload?.data?.data?.userData;
//         state.token = action?.payload?.data?.data?.token;
        
//         localStorage.setItem("isLoggedIn", true);
//         localStorage.setItem("role", action?.payload?.data?.data?.userRole);
//         localStorage.setItem(
//           "data",
//           JSON.stringify(action?.payload?.data?.data?.userData)
//         );

//       })
//       .addCase(logout.fulfilled, (state) => {
//         localStorage.setItem("isLoggedIn", false);
//         localStorage.setItem("role", "");
//         localStorage.setItem("data", JSON.stringify({}));
//         localStorage.removeItem("token");
//         state.isLoggedIn = false;
//         state.role = "";
//         state.data = {};
//         state.token = "";
//       });
//   },
// });

// export default AuthSlice.reducer;

// authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true" || false,
  role: localStorage.getItem("role") || "",
  token: localStorage.getItem("token") || "",
  data: (() => {
    const data = localStorage.getItem("data");
    try {
      return JSON.parse(data) || {};
    } catch {
      return {};
    }
  })(),
};

export const login = createAsyncThunk("auth/login", async (credentials) => {
  try {
    const response = await axiosInstance.post("/auth/login", credentials);

    toast.promise(response, {
      loading: "Logging in...",
      success: "Logged in successfully",
      error: "Failed to log in. Please try again",
    });

    const apiResponse = response.data;

    // Store the token and user data in localStorage
    const { token, userRole, userData } = apiResponse.data;
    localStorage.setItem("token", token);
    localStorage.setItem("role", userRole);
    localStorage.setItem("data", JSON.stringify(userData));

    return apiResponse;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    const response = await axiosInstance.post("/auth/logout");

    toast.promise(response, {
      loading: "Logging out...",
      success: "Logged out successfully",
      error: "Failed to log out. Please try again",
    });

    // Clear localStorage on logout
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("data");

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.role = action.payload.data.userRole;
        state.data = action.payload.data.userData;
        state.token = action.payload.data.token;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.role = "";
        state.data = {};
        state.token = "";
      });
  },
});

export default authSlice.reducer;
