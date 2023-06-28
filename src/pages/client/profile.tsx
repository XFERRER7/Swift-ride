import { ClientLayout } from "@/layouts/ClientLayout"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Delete from "@mui/icons-material/Delete"
import Avatar from "@mui/material/Avatar"
import Alert from '@mui/material/Alert'
import Collapse from '@mui/material/Collapse'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect, useState } from "react"
import { useAppSelector } from "@/store"
import { IClient } from "@/types/client"
import { api } from "@/lib/api"
import { LoadButton } from "@/components/global/LoadButton"
import { ufList } from "@/utils/ufList"
import { DeleteClientModal } from "@/components/client/DeleteClientModal"
import { useDispatch } from "react-redux"
import { setClient as setStoreClient } from "@/store/slices/client"

export default function profile() {

  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [infoDelete, setInfoDelete] = useState('')
  const [client, setClient] = useState<IClient>({
    id: 0,
    name: '',
    street: '',
    city: '',
    neighborhood: '',
    uf: '',
    phone: '',
    documentNumber: '',
    documentType: '',
  })

  const { id } = useAppSelector(state => state.client.data)

  const dispatch = useDispatch()


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setClient((prevClient) => ({
      ...prevClient,
      [name]: value,
    }))
  }

  async function getDataClient() {

    try {

      const response = await api.get(`/Cliente/${id}`)

      const client: IClient = {
        id: response.data.id,
        name: response.data.nome,
        street: response.data.logradouro,
        city: response.data.cidade,
        neighborhood: response.data.bairro,
        uf: response.data.uf,
        phone: response.data.numero,
        documentNumber: response.data.numeroDocumento,
        documentType: response.data.tipoDocumento
      }

      dispatch(setStoreClient(client))
      setClient(client)

    }
    catch (error) {
      console.log(error)
    }

  }

  async function updateClient() {

    setMessage('')
    setIsSending(true)
    try {

      const response = await api.put(`/Cliente/${id}`, {
        id,
        nome: client.name,
        logradouro: client.street,
        bairro: client.neighborhood,
        cidade: client.city,
        uf: client.uf,
        numero: client.phone,
      })

      if (response.status === 200) {
        setMessage('Dados do cliente atualizados com sucesso')
        setIsEditing(false)
      }

      setIsSending(false)

    } catch (error) {
      setIsSending(false)
      setMessage('Erro ao atualizar os dados do cliente. Certifique-se de que todos os campos estão preenchidos corretamente')
    }

  }

  useEffect(() => {
    getDataClient()
  }, [isEditing])

  useEffect(() => {
    if (message !== '') {
      getDataClient()
    }
  }, [message])

  return (
    <ClientLayout>
      <Paper elevation={2} sx={{
        paddingBottom: 2,
        paddingLeft: 4,
        paddingRight: 4,
      }}>
        <Box p={2}>

          <Grid container spacing={2}>

            <Grid item xs={12}>
              <Collapse in={
                message !== '' ||
                infoDelete !== ''
              }>
                <Alert
                  severity={
                    message.includes('sucesso') ? 'success' :
                      message.includes('Erro') ? 'error' :
                        infoDelete.includes('erro') ? 'error' : 'info'
                  }
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setInfoDelete('')
                        setMessage('')
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  sx={{ mb: 2 }}
                >
                  {
                    message !== '' ? message :
                      infoDelete !== '' ? infoDelete : ''
                  }
                </Alert>
              </Collapse>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Perfil do Usuário</Typography>
            </Grid>
            <Grid item xs={12}>
              <Avatar sx={{
                width: (theme) => theme.spacing(12),
                height: (theme) => theme.spacing(12),
                margin: '0 auto',
              }} />
              <Typography variant="h6" align="center">
                {client.name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ID"
                name="id"
                value={id}
                onChange={handleChange}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome"
                name="name"
                value={client.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Logradouro"
                name="street"
                value={client.street}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bairro"
                name="neighborhood"
                value={client.neighborhood}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cidade"
                name="city"
                value={client.city}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="UF"
                label="UF"
                name="uf"
                value={client.uf}
                onChange={handleChange}
                fullWidth
                select
                disabled={!isEditing}
              >

                {
                  ufList.map((uf) => (
                    <MenuItem key={uf.id} value={uf.name}>{uf.name}</MenuItem>
                  ))
                }

              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Número de Telefone"
                name="phone"
                type="number"
                value={client.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sx={{
              display: 'flex',
              gap: 2,
            }}>
              {isEditing ? (
                <>
                  <Button color="error" variant='contained' onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <LoadButton
                    isSending={isSending}
                    onClick={updateClient}
                    text='Confirmar'
                    color="primary" variant='contained'
                  />
                </>
              ) : (
                <>
                  <Button color="primary" variant='contained' onClick={() => {
                    setInfoDelete('')
                    setMessage('')
                    setIsEditing(true)
                  }}>
                    Editar
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => {
                      setMessage('')
                      setInfoDelete('')
                      setIsDeleting(true)
                    }}
                  >
                    <Delete />
                  </IconButton>
                </>
              )}
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <DeleteClientModal
        setIsDeleting={setIsDeleting}
        isDeleting={isDeleting}
        setInfoDelete={setInfoDelete}
      />
    </ClientLayout>
  )
}