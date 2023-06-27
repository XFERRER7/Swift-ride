import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useState } from "react"
import { IVehicle } from '@/types/vehicle';
import { useAppSelector } from '@/store';
import { useDispatch } from 'react-redux';
import { setVehicleId } from '@/store/slices/delivery';

interface IStep1Props {
  vehicles: IVehicle[]
}

export const Step2 = ({ vehicles }: IStep1Props) => {

  const { vehicleId: selectedVehicle } = useAppSelector(state => state.delivery)

  const dispatch = useDispatch()


  return (
    <Box sx={{
      width: {
        sm: '90%',
        md: '800px',
      },
      maxHeight: '350px',
      overflowY: 'scroll',
      scrollbarWidth: 'thin',
      '&::-webkit-scrollbar': {
        height: '8px',
        width: '8px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#374151',
        borderRadius: '5px',
      }
    }}>

      <Grid container spacing={2} sx={{

      }}>

        {
          vehicles.map((vehicle, i) => (
            <Grid item xs={12} md={6} >
              <Card variant="elevation" sx={{
                backgroundColor: '#f5f5f5',
              }}>
                <CardContent sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2
                }}>
                  <Typography variant="h6" component="div">
                    {vehicle.brandModel}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {
                      `Placa:  ${vehicle.licensePlate}`
                    }
                  </Typography>
                  <Button
                    variant="contained"
                    disabled={
                      selectedVehicle !== null && selectedVehicle !== vehicle.id
                    }
                    color={
                      selectedVehicle === vehicle.id ? 'success' : 'primary'
                    }
                    onClick={() => {
                      if (selectedVehicle === vehicle.id) {
                        dispatch(setVehicleId(null))
                      }
                      else {
                        dispatch(setVehicleId(vehicle.id))
                      }
                    }}>
                    {
                      selectedVehicle === vehicle.id ? 'Selecionado' : 'Selecionar'
                    }
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        }



      </Grid>

    </Box>
  )
}
