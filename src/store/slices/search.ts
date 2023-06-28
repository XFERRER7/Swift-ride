import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({

  name: "search",
  initialState: {
    search: '',
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload
    },
    clearSearch: (state) => {
      state.search = ''
    }
  }
})

export const search = searchSlice.reducer
export const { setSearch, clearSearch } = searchSlice.actions