import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { ufList } from '@/utils/ufList'
import { z } from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from '@/lib/api'
import Alert from '@mui/material/Alert'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { LoadButton } from '../global/LoadButton'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { setClientRegisteredId } from '@/store/slices/client'

interface IRegisterFormProps {
  setTabValue: React.Dispatch<React.SetStateAction<number>>
}

const schema = z.object({
  name: z.string().nonempty({ message: 'Campo obrigatório' }),
  phone: z.string().nonempty({ message: 'Campo obrigatório' }),
  docType: z.string().nonempty({ message: 'Campo obrigatório' }),
  docNumber: z.string().nonempty({ message: 'Campo obrigatório' }),
  city: z.string().nonempty({ message: 'Campo obrigatório' }),
  uf: z.string().nonempty({ message: 'Campo obrigatório' }),
  neighborhood: z.string().nonempty({ message: 'Campo obrigatório' }),
  street: z.string().nonempty({ message: 'Campo obrigatório' }),
})

type TFormValues = z.infer<typeof schema>

export const RegisterForm = ({ setTabValue }: IRegisterFormProps) => {

  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<TFormValues>({
    resolver: zodResolver(schema)
  })

  const { push } = useRouter()
  const dispatch = useDispatch()

  const onSubmit = async (data: TFormValues) => {

    setRequestErrorMessage('')
    setIsSending(true)
    try {

      const response = await api.post('/Cliente', {
        numeroDocumento: data.docNumber,
        tipoDocumento: data.docType,
        nome: data.name,
        logradouro: data.street,
        numero: data.phone,
        bairro: data.neighborhood,
        cidade: data.city,
        uf: data.uf,
      })

      if (typeof response.data !== 'number') {
        setIsSending(false)
        setRequestErrorMessage('Erro ao cadastrar cliente')
        reset()
        return
      }
      else if (typeof response.data === 'number') {
        dispatch(setClientRegisteredId(response.data))
        setTabValue(0)
        setIsSending(false)
  
        reset()
        return
      }


    } catch (error) {
      console.log(error)
      setIsSending(false)
      reset()
      setRequestErrorMessage('Erro ao cadastrar cliente')
    }

  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    }}>
      <Typography variant="body1" component="h6" fontWeight='semibold' color='GrayText'>
        Informe seus dados para se cadastrar
      </Typography>

      <Collapse in={
        requestErrorMessage !== ''
      }>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setRequestErrorMessage('')
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {requestErrorMessage}
        </Alert>
      </Collapse>

      <Grid container spacing={2} sx={{
        mt: 1
      }}>
        <Grid item xs={12} md={6}>
          <TextField
            id="name"
            label="Nome"
            fullWidth
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="phone"
            label="Número"
            type='number'
            fullWidth
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            id="docType"
            label="Tipo do documento"
            select
            fullWidth
            {...register('docType')}
            error={!!errors.docType}
            helperText={errors.docType?.message}
          >
            <MenuItem value="rg">RG</MenuItem>
            <MenuItem value="cpf">CPF</MenuItem>
            <MenuItem value="cnh">CNH</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="docNumber"
            label="Número do documento"
            fullWidth
            type='number'
            {...register('docNumber')}
            error={!!errors.docNumber}
            helperText={errors.docNumber?.message}
          />
        </Grid>


        <Grid item xs={12} md={6}>
          <TextField
            id="Cidade"
            label="Cidade"
            fullWidth
            {...register('city')}
            error={!!errors.city}
            helperText={errors.city?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="UF"
            label="UF"
            autoComplete="given-name"
            fullWidth
            select
            {...register('uf')}
            error={!!errors.uf}
            helperText={errors.uf?.message}
          >

            {
              ufList.map((uf) => (
                <MenuItem key={uf.id} value={uf.name}>{uf.name}</MenuItem>
              ))
            }

          </TextField>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            id="neighborhood"
            label="Bairro"
            fullWidth
            {...register('neighborhood')}
            error={!!errors.neighborhood}
            helperText={errors.neighborhood?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="street"
            label="Logradouro"
            fullWidth
            {...register('street')}
            error={!!errors.street}
            helperText={errors.street?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <LoadButton
            isSending={isSending}
            text='Registrar'
            variant="contained"
            color='primary'
            fullWidth
            type='submit'
          />
        </Grid>
      </Grid>
    </form>
  )
}
