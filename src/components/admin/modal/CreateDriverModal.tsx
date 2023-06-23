import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from '@/lib/api'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import { format } from 'date-fns';
import CircularProgress from '@mui/material/CircularProgress'

const schema = z.object({
  name: z.string().nonempty({ message: 'Nome é obrigatório' }),
  registerNumber: z.string().regex(/^\d+$/, { message: 'Nº de registro deve conter apenas números' }),
  licenseCategory: z.string().regex(/^[A-D]$/, { message: 'Categoria de habilitação inválida' }).nonempty({ message: 'Categoria de habilitação é obrigatório' }),
  licenseExpirationDate: z.string().
    nonempty({ message: 'Data de validade da habilitação é obrigatório' }).
    regex(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'Data de validade da habilitação inválida' }),

});

type TFormSchema = z.infer<typeof schema>

interface ICreateDriverModalProps {
  open: boolean
  setCreateDriverModalInfo: React.Dispatch<React.SetStateAction<{
    open: boolean
    result: 'success' | 'error' | ''
  }>>
}

export const CreateDriverModal = ({ open, setCreateDriverModalInfo }: ICreateDriverModalProps) => {

  const [isSending, setIsSending] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<TFormSchema>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: TFormSchema) => {

    const formattedDate = format(new Date(data.licenseExpirationDate.split('/').reverse().join('-')), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

    setIsSending(true)

    try {

      const response = await api.post('/Condutor', {
        nome: data.name,
        numeroHabilitacao: data.registerNumber,
        categoriaHabilitacao: data.licenseCategory,
        vencimentoHabilitacao: formattedDate
      })

      if (typeof response.data === 'number') {
        reset()
        setCreateDriverModalInfo({
          open: false,
          result: 'success'
        })
      }
      setIsSending(false)
    } catch (error) {
      setIsSending(false)
      setCreateDriverModalInfo({
        open: false,
        result: 'error'
      })
    }

  }

  const maskDate = (value: string) => {

    if (!value) return value
    let v = value.replace(/\D/g, '').slice(0, 10);
    if (v.length >= 5) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
    }
    else if (v.length >= 3) {
      return `${v.slice(0, 2)}/${v.slice(2)}`;
    }
    return v
  }

  const licenseExpirationDate = watch('licenseExpirationDate')

  return (
    <div>
      <Modal
        open={open}
        onClose={() => setCreateDriverModalInfo({
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
            Cadastrar novo condutor
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Nome"
                  fullWidth
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Nº de registro "
                  fullWidth
                  {...register('registerNumber')}
                  error={!!errors.registerNumber}
                  helperText={errors.registerNumber?.message}
                  inputProps={{ inputMode: 'numeric' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Categoria da habilitação"
                  select
                  fullWidth
                  {...register('licenseCategory')}
                  error={!!errors.licenseCategory}
                  helperText={errors.licenseCategory?.message}
                >
                  <MenuItem value='A'>A</MenuItem>
                  <MenuItem value='B'>B</MenuItem>
                  <MenuItem value='C'>C</MenuItem>
                  <MenuItem value='D'>D</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Data de validade da habilitação"
                  fullWidth
                  inputProps={{ maxLength: 10 }}
                  {...register('licenseExpirationDate')}
                  error={!!errors.licenseExpirationDate}
                  value={
                    licenseExpirationDate ? maskDate(licenseExpirationDate) : ''
                  }
                  helperText={errors.licenseExpirationDate?.message}
                />
              </Grid>
              <Grid item xs={12} display='flex' justifyContent='center' gap={10} marginTop={5}>
                <Button variant="contained" onClick={() => {
                  setCreateDriverModalInfo({
                    open: false,
                    result: ''
                  })
                }} color="error" sx={{
                  minWidth: '100px'
                }}>
                  Cancelar
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
          </form >
        </Box>
      </Modal>
    </div>
  )
}
