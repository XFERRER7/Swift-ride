import { createSlice } from "@reduxjs/toolkit";


const clientSlice = createSlice({
  name: "client",
  initialState: {
    data: {
      id: 0,
      documentNumber: '',
      documentType: '',
      name: '',
      street: '',
      phone: '',
      neighborhood: ' ',
      city: '',
      uf: ''
    },
    clientRegisteredId: 0
  },
  reducers: {
    setClient: (state, action) => {

      state.data.id = action.payload.id
      state.data.documentNumber = action.payload.documentNumber
      state.data.documentType = action.payload.documentType
      state.data.name = action.payload.name
      state.data.street = action.payload.street
      state.data.phone = action.payload.phone
      state.data.neighborhood = action.payload.neighborhood
      state.data.city = action.payload.city
      state.data.uf = action.payload.uf

    },
    setClientRegisteredId: (state, action) => {
      state.clientRegisteredId = action.payload
    }
  }
})

export const client = clientSlice.reducer
export const { setClient, setClientRegisteredId } = clientSlice.actions