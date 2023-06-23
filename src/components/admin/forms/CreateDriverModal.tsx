import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from '@/lib/api'
import Snackbar from '@mui/material/Snackbar'
import SnackbarContent from '@mui/material/SnackbarContent'
import { format } from 'date-fns';

const schema = z.object({
  name: z.string().nonempty({ message: 'Nome é obrigatório' }),
  registerNumber: z.string().regex(/^\d+$/, { message: 'Nº de registro deve conter apenas números' }),
  licenseCategory: z.string().regex(/^[A-D]$/, { message: 'Categoria de habilitação inválida' }).nonempty({ message: 'Categoria de habilitação é obrigatório' }),
  licenseExpirationDate: z.string().
  nonempty({ message: 'Data de validade da habilitação é obrigatório' }).
  regex(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'Data de validade da habilitação inválida' }),

});

type TFormSchema = z.infer<typeof schema>

export const CreateDriverModal = () => {

  const [infoToast, setInfoToast] = useState({
    open: false,
    message: '' as 'Motorista cadastrado com sucesso' | 'Erro ao cadastrar motorista' | '',
    type: '' as 'success' | 'error' | ''
  })

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<TFormSchema>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: TFormSchema) => {

    const formattedDate = format(new Date(data.licenseExpirationDate.split('/').reverse().join('-')), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

    try {

      const response = await api.post('/Condutor', {
        nome: data.name,
        numeroHabilitacao: data.registerNumber,
        categoriaHabilitacao: data.licenseCategory,
        vencimentoHabilitacao: formattedDate
      })

      if (typeof response.data === 'number') {
        reset()
        setInfoToast({
          open: true,
          message: 'Motorista cadastrado com sucesso',
          type: 'success'
        })
      }

    } catch (error) {
      console.log(error)
      setInfoToast({
        open: true,
        message: 'Erro ao cadastrar motorista',
        type: 'error'
      })
    }

  }

  const maskDate = (value: string) => {

    if(!value) return value
    let v = value.replace(/\D/g,'').slice(0, 10);
    if (v.length >= 5) {
      return `${v.slice(0,2)}/${v.slice(2,4)}/${v.slice(4)}`;
    }
    else if (v.length >= 3) {
      return `${v.slice(0,2)}/${v.slice(2)}`;
    }
    return v
  }

  const licenseExpirationDate = watch('licenseExpirationDate')

  return (
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
            reset()
          }} color="secondary" sx={{
            minWidth: '100px'
          }}>
            Limpar
          </Button>
          <Button
            variant="contained"
            color="primary"
            type='submit'
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
    </form >
  )
}
