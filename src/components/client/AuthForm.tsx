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

const schema = z.object({
  docNumber: z.string().nonempty({ message: 'Campo obrigatório' })
})

type TFormValues = z.infer<typeof schema>

export const AuthForm = () => {

  const [notFoundMessage, setNotFoundMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<TFormValues>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: TFormValues) => {

    setNotFoundMessage('')
    setIsSending(true)

    try {

      const response = await api.get('/Cliente')

      const client = response.data.find((client: any) => client.numeroDocumento === data.docNumber)

      if (client == undefined) {
        setIsSending(false)
        setNotFoundMessage('Cliente não encontrado')
        return
      }
      alert('Cliente encontrado')
      setIsSending(false)
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
            id="docNumber"
            label="Id de usuário"
            fullWidth
            type='number'
            {...register('docNumber')}
            error={!!errors.docNumber}
            helperText={errors.docNumber?.message}
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
