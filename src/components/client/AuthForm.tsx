import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
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
import { useDispatch } from 'react-redux'
import { setClient } from '@/store/slices/client'
import { useRouter } from 'next/router'
import { useAppSelector } from '@/store'

const schema = z.object({
  id: z.string().nonempty({ message: 'Campo obrigatório' })
})

type TFormValues = z.infer<typeof schema>

export const AuthForm = () => {

  const [notFoundMessage, setNotFoundMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const clientRegisteredId = useAppSelector(state => {
    return state.client.clientRegisteredId
  })

  const { register, handleSubmit, formState: { errors } } = useForm<TFormValues>({
    resolver: zodResolver(schema)
  })

  const { push } = useRouter()
  const dispatch = useDispatch()

  const onSubmit = async (data: TFormValues) => {

    setNotFoundMessage('')
    setIsSending(true)

    try {

      const response = await api.get(`/cliente/${data.id}`)

      if (response.data == undefined) {
        setIsSending(false)
        setNotFoundMessage('Cliente não encontrado')
        return
      }

      dispatch(setClient({
        id: response.data.id,
        documentNumber: response.data.numeroDocumento,
        documentType: response.data.tipoDocumento,
        name: response.data.nome,
        street: response.data.logradouro,
        phone: response.data.numero,
        neighborhood: response.data.bairro,
        city: response.data.cidade,
        uf: response.data.uf,
      }))

      setIsSending(false)

      push('/client/home')

    } catch (error) {
      setIsSending(false)
      setNotFoundMessage('Cliente não encontrado')
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
        - Precisamos apenas do seu id de usuário para continuar. Não compartilhe-o com ninguém.
      </Typography>
      {
        clientRegisteredId !== 0 &&
        <Typography variant="body1" component="h6" color='green' fontWeight='semibold'>
          - O id que está pré selecionado é o último que você cadastrou.
        </Typography>
      }

      <Collapse in={
        notFoundMessage !== ''
      }>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setNotFoundMessage('')
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {notFoundMessage}
        </Alert>
      </Collapse>

      <Grid container spacing={2} sx={{
        mt: 1
      }}>
        <Grid item xs={12}>
          <TextField
            id="id"
            label="Id de usuário"
            fullWidth
            defaultValue={
              clientRegisteredId !== 0 ? clientRegisteredId : ''
            }
            type='number'
            {...register('id')}
            error={!!errors.id}
            helperText={errors.id?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <LoadButton
            isSending={isSending}
            text='Entrar'
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
