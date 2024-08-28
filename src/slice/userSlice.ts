import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

// Thunk for fetching the user data
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        throw new Error(error.message);
      }

      return user;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchUser.fulfilled,
      (state, action: PayloadAction<User | null>) => {
        state.user = action.payload;
      }
    );
    builder.addCase(fetchUser.rejected, (state, action) => {
      console.error("Failed to fetch user:", action.payload);
    });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
