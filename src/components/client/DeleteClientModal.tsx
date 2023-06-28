import React, { useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { api } from '@/lib/api'
import { useAppSelector } from '@/store'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { clearAllDelivery } from '@/store/slices/delivery'
import { logout } from '@/store/slices/client'

interface IDeleteClientModalProps {
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>
  setInfoDelete: React.Dispatch<React.SetStateAction<string>>
  isDeleting: boolean
}

export const DeleteClientModal = ({ setIsDeleting, isDeleting, setInfoDelete }: IDeleteClientModalProps) => {

  const [isSending, setIsSending] = useState(false)

  const { id } = useAppSelector(state => state.client.data)
  const router = useRouter()

  const dispatch = useDispatch()

  async function deleteItem() {

    try {

      setIsSending(true)

      const response = await api.delete(`/Cliente/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          id
        }
      })

      if (response.status === 200) {
        router.push('/client/credentials')
        dispatch(clearAllDelivery())
        dispatch(logout())
        setIsDeleting(false)
      }
      setIsSending(false)
    } catch (error) {
      setInfoDelete('Ocorreu um erro ao excluir o cliente')
      setIsSending(false)
      setIsDeleting(false)
    }

  }

  return (
    <div>
      <Modal
        open={
          isDeleting
        }
        onClose={() => {
          setIsDeleting(false)
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '400px',
          bgcolor: 'background.paper',
          borderRadius: '5px',
          boxShadow: 24,
          p: 4,
        }}>

          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            Tem certeza que deseja excluir este cliente?
          </Typography>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Button variant="contained" onClick={() => {
              setIsDeleting(false)
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
              onClick={() => deleteItem()}
            >
              Confirmar
            </Button>
          </Box>

        </Box>
      </Modal>
    </div>
  )
}
