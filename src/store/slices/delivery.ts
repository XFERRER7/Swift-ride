import { createSlice } from "@reduxjs/toolkit";


const deliverySlice = createSlice({
  name: "delivery",
  initialState: {
    currentKm: null,
    driverId: null,
    vehicleId: null,
    observations: null,
    reason: null,
    displacementId: null
  },
  reducers: {
    setCurrentKm: (state, action) => {
      state.currentKm = action.payload
    },
    setDriverId: (state, action) => {
      state.driverId = action.payload
    },
    setVehicleId: (state, action) => {
      state.vehicleId = action.payload
    },
    setObservations: (state, action) => {
      state.observations = action.payload
    },
    setReason: (state, action) => {
      state.reason = action.payload
    },
    setDisplacementId: (state, action) => {
      state.displacementId = action.payload
    },
    clearDisplacementId: (state) => {
      state.displacementId = null
    },
    clearDelivery: (state) => {
      state.currentKm = null
      state.driverId = null
      state.vehicleId = null
      state.observations = null
      state.reason = null
    }
  }
})

export const delivery = deliverySlice.reducer
export const  {
  setCurrentKm,
  setDriverId,
  setVehicleId,
  setObservations,
  setReason,
  clearDelivery
} = deliverySlice.actions