import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Mill {
  _id: string;
  millcode: string;
  millname: string;
  focalperson: string;
  cnic: string;
  phone: string;
  address?: string;
  email: string;
  profilePicture: string;
  status: string;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  _id?: string;                 // MongoDB ObjectId
  millid?: Mill;              // Reference to another User (ObjectId as string)
  name: string;
  email: string;
  phone: string;
  cnic: string;
  address?: string;
  role: string;                 // Default: "Customer"
  image?: string;               // Default placeholder
  lastLogin?: Date;
  status: "Active" | "Inactive";
  otp?: string;
  otpExpiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}


interface UserState {
  list: User[];
  currentUser: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  list: [],
  currentUser: null,
  token: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.list = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.list.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.list = state.list.map((u) =>
        u._id === action.payload._id ? action.payload : u
      );
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((u) => u._id !== action.payload);
    },
    setCurrentUser: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.token = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  setLoading,
  setError,
  setCurrentUser,
  logoutUser,
} = userSlice.actions;

export default userSlice.reducer;
