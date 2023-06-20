import React, { useRef, useState } from 'react'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import { years } from '@/utils/years'
import { z } from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from '@/lib/api'
import Snackbar from '@mui/material/Snackbar'
import SnackbarContent from '@mui/material/SnackbarContent'

const schema = z.object({
  licensePlate: z.string().nonempty({ message: 'Placa é obrigatória' }),
  brand: z.string().nonempty({ message: 'Marca é obrigatória' }),
  model: z.string().nonempty({ message: 'Modelo é obrigatório' }),
  manufacturingYear: z.number().nonnegative({ message: 'Ano de fabricação é obrigatório' }),
  currentKm: z.number().nonnegative().refine((value) => value !== 0, {
    message: 'O valor deve ser diferente de zero.',
    path: ['currentKm'],
  }),
})

type TFormSchema = z.infer<typeof schema>

export const CreateVehicleForm = () => {

  const [infoToast, setInfoToast] = useState({
    open: false,
    message: '' as 'Veículo cadastrado com sucesso' | 'Erro ao cadastrar veículo' | '',
    type: '' as 'success' | 'error' | ''
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<TFormSchema>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: TFormSchema) => {

    try {

      const response = await api.post('/Veiculo', {
        placa: data.licensePlate,
        marcaModelo: `${data.brand} ${data.model}`,
        anoFabricacao: data.manufacturingYear,
        kmAtual: data.currentKm
      })

      if (typeof response.data === 'number') {
        reset()
        setInfoToast({
          open: true,
          message: 'Veículo cadastrado com sucesso',
          type: 'success'
        })
      }

    } catch (error) {
      console.log(error)
      setInfoToast({
        open: true,
        message: 'Erro ao cadastrar veículo',
        type: 'error'
      })
    }

  }


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Marca"
            fullWidth
            id='brand'
            {...register('brand')}
            error={!!errors.brand}
            helperText={errors.brand?.message}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Modelo"
            fullWidth
            id='model'
            {...register('model')}
            error={!!errors.model}
            helperText={errors.model?.message}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Placa"
            fullWidth
            id='licensePlate'
            {...register('licensePlate')}
            error={!!errors.licensePlate}
            helperText={errors.licensePlate?.message}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Km Atual"
            fullWidth
            id='currentKm'
            type='number'
            inputProps={{
              min: 0,
              step: 1,
              pattern: '\\d*',
            }}
            {...register('currentKm', {
              valueAsNumber: true, // Converter o valor para número
            })}
            error={!!errors.currentKm}
            helperText={errors.currentKm?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Ano de fabricação"
            fullWidth
            id='manufacturingYear'
            {...register('manufacturingYear')}
            error={!!errors.manufacturingYear}
            helperText={errors.manufacturingYear?.message}
          >
            {
              years.map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))
            }
          </TextField>
        </Grid>

        <Grid item xs={12} display='flex' justifyContent='center' gap={10} marginTop={5}>
          <Button variant="contained" color="secondary" onClick={() => {
            reset()
          }} sx={{
            minWidth: '100px'
          }}>
            Limpar
          </Button>
          <Button
            variant="contained"
            type='submit'
            color="primary"
          >
            Cadastrar
          </Button>
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={
              infoToast.open
            }
            autoHideDuration={3000}
            onClose={() => setInfoToast({
              open: false,
              message: '',
              type: ''
            })}
          >
            <SnackbarContent
              style={{ backgroundColor: infoToast.type === 'success' ? '#4caf50' : '#f44336' }}
              message={infoToast.message}
            />
          </Snackbar>
        </Grid>
      </Grid>
    </form>
  )
}
