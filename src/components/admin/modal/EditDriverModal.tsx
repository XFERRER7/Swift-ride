import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from '@/lib/api'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import { add, format, isAfter, isEqual, parseISO } from 'date-fns';
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

const schema = z.object({
  licenseCategory: z.string(),
  licenseExpirationDate: z.string().
    nonempty({ message: 'Data de validade da habilitação é obrigatório' }).
    regex(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'Data de validade da habilitação inválida' }),
});

type TFormSchema = z.infer<typeof schema>

interface IDriverInfo {
  id: number
  driverLicenseCategory: string
  driverLicenseExpiration: string
}

interface IEditDriverModalProps {
  open: boolean
  driver: IDriverInfo
  setEditDriverModalInfo: React.Dispatch<React.SetStateAction<{
    open: boolean
    result: 'success' | 'error' | ''
  }>>
}

export const EditDriverModal = ({ open, driver, setEditDriverModalInfo }: IEditDriverModalProps) => {

  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<TFormSchema>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: TFormSchema) => {

    setIsSending(true)
    const dateParts = data.licenseExpirationDate.split('/');
    const year = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[0], 10);

    const formattedDate = format(new Date(year, month, day), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

    const date1 = new Date(formattedDate)
    const date2 = new Date(driver.driverLicenseExpiration)

    if (isAfter(date2, date1)) {
      setError('Data de validade da habilitação deve ser maior que a data atual')
      setIsSending(false)
      return
    }
    console.log({
      data1: data.licenseCategory,
      data2: driver.driverLicenseCategory
    })
    try {
      const response = await api.put(`/Condutor/${driver.id}`, {
        id: driver.id,
        categoriaHabilitacao: data.licenseCategory != driver.driverLicenseCategory ?
          `${driver.driverLicenseCategory}, ${data.licenseCategory}` : '',
        vencimentoHabilitacao: formattedDate
      })

      if (response.status === 200) {
        reset()
        setEditDriverModalInfo({
          open: false,
          result: 'success'
        })
      }
      setIsSending(false)
      setError('')
    } catch (error) {
      setError('')
      setIsSending(false)
      setEditDriverModalInfo({
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

  useEffect(() => {
    const date =
      driver.driverLicenseExpiration
        .split('T')[0]
        .replace(/(\d{4})-(\d{2})-(\d{2})/, '$3/$2/$1')

    setValue('licenseExpirationDate', date)

    reset({
      licenseCategory: driver.driverLicenseCategory,
      licenseExpirationDate: date
    })
  }, [driver, reset])

  const licenseExpirationDate = watch('licenseExpirationDate')

  return (
    <div>
      <Modal
        open={open}
        onClose={() => setEditDriverModalInfo({
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
          <Collapse in={
            error !== ''
          }>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setError('')
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          </Collapse>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            Atualizar condutor
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Adicione mais uma categoria"
                  select
                  placeholder='Adicione mais uma categoria'
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
                  setError('')
                  setEditDriverModalInfo({
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
                  Confirmar
                </Button>
              </Grid>
            </Grid>
          </form >
        </Box>
      </Modal>
    </div>
  )
}
