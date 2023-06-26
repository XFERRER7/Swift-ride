import React, { useEffect, useRef, useState } from 'react'
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
  brandModel: z.string().nonempty({ message: 'Marca e modelo são obrigatórios' }),
  manufacturingYear: z.number().nonnegative({ message: 'Ano de fabricação é obrigatório' }),
  currentKm: z.number().nonnegative().refine((value) => value !== 0, {
    message: 'O valor deve ser diferente de zero.',
    path: ['currentKm'],
  }),
})

type TFormSchema = z.infer<typeof schema>

export interface IVehicleInfo {
  id: number
  brandModel: string
  manufacturingYear: number
  currentKm: number
}

interface IEditVehicleModalProps {
  open: boolean
  vehicle: IVehicleInfo
  setEditVehicleModalInfo: React.Dispatch<React.SetStateAction<{
    open: boolean
    result: 'success' | 'error' | ''
  }>>
}

export const EditVehicleModal = ({ open, vehicle, setEditVehicleModalInfo }: IEditVehicleModalProps) => {

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

      const response = await api.put(`/Veiculo/${vehicle.id}`, {
        id: vehicle.id,
        marcaModelo: data.brandModel,
        anoFabricacao: data.manufacturingYear,
        kmAtual: data.currentKm
      })

      if (typeof response.status === 'number' && response.status === 200) {
        reset()
        setEditVehicleModalInfo({
          open: false,
          result: 'success'
        })
      }
      setIsSending(false)
    } catch (error) {
      setIsSending(false)
      setEditVehicleModalInfo({
        open: false,
        result: 'error'
      })
    }

  }

  useEffect(() => {
    reset(vehicle)
  }, [vehicle, reset])

  return (
    <div>
      <Modal
        open={open}
        onClose={() => setEditVehicleModalInfo({
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
            Atualizar veículo
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>

              <Grid item xs={12} md={12}>
                <TextField
                  label="Marca/Modelo"
                  fullWidth
                  defaultValue={
                    vehicle.brandModel || ''
                  }
                  id='brandModel'
                  {...register('brandModel')}
                  error={!!errors.brandModel}
                  helperText={errors.brandModel?.message}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Km Atual"
                  defaultValue={
                    vehicle.currentKm || ''
                  }
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
                  defaultValue={
                    vehicle.manufacturingYear || ''
                  }
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
                  setEditVehicleModalInfo({
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
                  Confirmar
                </Button>

              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </div>
  )
}
