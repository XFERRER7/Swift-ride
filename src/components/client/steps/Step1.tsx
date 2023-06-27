import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useState } from "react"
import { IDriver } from '@/types/driver';

interface IStep1Props {
  drivers: IDriver[]
  selectedDriver: number | null
  setSelectedDriver: React.Dispatch<React.SetStateAction<number | null>>
}

export const Step1 = ({ drivers, setSelectedDriver, selectedDriver }: IStep1Props) => {
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
          drivers.map((driver, i) => (
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
                    {driver.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {
                     `Categoria de habilitação:  ${driver.driverLicenseCategory}`
                    }
                  </Typography>
                  <Button 
                  variant="contained" 
                  disabled={
                    selectedDriver !== null && selectedDriver !== driver.id
                  }
                  color={
                    selectedDriver === driver.id ? 'success' : 'primary'
                  }
                  onClick={() => {
                    if (selectedDriver === driver.id) {
                      setSelectedDriver(null)
                    }
                    else {
                      setSelectedDriver(driver.id)
                    }
                  }}>
                    {
                      selectedDriver === driver.id ? 'Selecionado' : 'Selecionar'
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