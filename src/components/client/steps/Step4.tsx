import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useAppSelector } from '@/store'
import { api } from '@/lib/api'

export const Step4 = () => {

  const [driverName, setDriverName] = useState('')
  const [vehicleName, setVehicleName] = useState('')
  const [vehiclePlate, setVehiclePlate] = useState('')


  const {
    driverId,
    currentKm,
    reason,
    observations,
    vehicleId
  } = useAppSelector(state => state.delivery)


  async function getDriverData() {

    try {

      const response = await api.get(`/Condutor/${driverId}`)

      const { nome } = response.data

      setDriverName(nome)

    } catch (error) {
      setDriverName('Não informado')
    }


  }

  async function getVehicleData() {

    try {

      const response = await api.get(`/Veiculo/${vehicleId}`)

      const { marcaModelo, placa } = response.data

      setVehicleName(marcaModelo)
      setVehiclePlate(placa)

    } catch (error) {
      setVehicleName('Não informado')
      setVehiclePlate('Não informado')
    }

  }


  useEffect(() => {
    getDriverData()
  }, [driverId])

  useEffect(() => {
    getVehicleData()
  }, [vehicleId])


  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>

        <Paper elevation={3} sx={{
          p: 2,
          height: '70px',
          minWidth: {
            xs: '100%',
            md: '300px'
          },
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: '3px'
        }}>
          <Typography variant="body1" fontWeight='bold'>Km inicial:</Typography>
          <Typography variant="body2">{
            currentKm
          }</Typography>
        </Paper>
        <Paper elevation={3} sx={{
          p: 2,
          height: '70px',
          minWidth: {
            xs: '100%',
            md: '300px'
          },
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: '3px'
        }}>
          <Typography variant="body1" fontWeight='bold'>Motivo:</Typography>
          <Typography variant="body2">
            {
              reason
            }
          </Typography>
        </Paper>
        <Paper elevation={3} sx={{
          p: 2,
          height: '70px',
          minWidth: {
            xs: '100%',
            md: '300px'
          },
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: '3px'
        }}>
          <Typography variant="body1" fontWeight='bold'>Observações:</Typography>
          <Typography variant="body2">{
            observations !== null ? observations : 'Nenhuma observação'
          }</Typography>
        </Paper>
      </Grid>


      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{
          p: 2,
          height: '70px',
          minWidth: {
            xs: '100%',
            md: '300px'
          },
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: '3px'
        }}>
          <Typography variant="body1" fontWeight='bold'>Motorista:</Typography>
          <Typography variant="body2">
            {
              driverName
            }
          </Typography>
        </Paper>
        <Paper elevation={3} sx={{
          p: 2,
          height: '70px',
          minWidth: {
            xs: '100%',
            md: '300px'
          },
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: '3px'
        }}>
          <Typography variant="body1" fontWeight='bold'>Carro:</Typography>
          <Typography variant="body2">
            {
              vehicleName
            }
          </Typography>
        </Paper>
        <Paper elevation={3} sx={{
          p: 2,
          height: '70px',
          minWidth: {
            xs: '100%',
            md: '300px'
          },
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: '3px'
        }}>
          <Typography variant="body1" fontWeight='bold'>Placa:</Typography>
          <Typography variant="body2">
            {
              vehiclePlate
            }
          </Typography>
        </Paper>
      </Grid>

    </Grid>
  )
}
