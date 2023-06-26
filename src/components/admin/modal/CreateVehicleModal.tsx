import React, { useRef, useState } from 'react'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { years } from '@/utils/years'
import { z } from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from '@/lib/api'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

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

interface ICreateVehicleModalProps {
  open: boolean
  setCreateVehicleModalInfo: React.Dispatch<React.SetStateAction<{
    open: boolean
    result: 'success' | 'error' | ''
  }>>
}

export const CreateVehicleModal = ({ open, setCreateVehicleModalInfo }: ICreateVehicleModalProps) => {

  const [isSending, setIsSending] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<TFormSchema>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: TFormSchema) => {

    setIsSending(true)

    try {

      const response = await api.post('/Veiculo', {
        placa: data.licensePlate,
        marcaModelo: `${data.brand} ${data.model}`,
        anoFabricacao: data.manufacturingYear,
        kmAtual: data.currentKm
      })

      if (typeof response.data === 'number') {
        reset()
        setCreateVehicleModalInfo({
          open: false,
          result: 'success'
        })
      }
      setIsSending(false)
    } catch (error) {
      setIsSending(false)
      setCreateVehicleModalInfo({
        open: false,
        result: 'error'
      })
    }

  }


  return (
    <div>
      <Modal
        open={open}
        onClose={() => setCreateVehicleModalInfo({
          open: false,
          result: ''
        })}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '600px',
          bgcolor: 'background.paper',
          borderRadius: '5px',
          boxShadow: 24,
          p: 4,
        }}>

          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            Cadastrar novo veículo
          </Typography>

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
                <Button variant="contained" color="error" onClick={() => {
                  setCreateVehicleModalInfo({
                    open: false,
                    result: ''
                  })
                }} sx={{
                  minWidth: '100px'
                }}>
                  cancelar
                </Button>
                <Button
                  disabled={isSending}
                  startIcon={isSending ? <CircularProgress size={20} color="inherit" /> : null}
                  variant="contained"
                  color="primary"
                  type='submit'
                >
                  Cadastrar
                </Button>
                
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </div>
  )
}
