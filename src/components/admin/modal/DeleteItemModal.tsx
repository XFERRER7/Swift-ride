import React, { useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { api } from '@/lib/api'

interface IDeleteItemModalProps {
  open: boolean
  type: 'driver' | 'vehicle'
  id: null | number
  setDeleteItemModalInfo: React.Dispatch<React.SetStateAction<{
    open: boolean
    result: 'success' | 'error' | '',
  }>>
}

export const DeleteItemModal = ({ open, type, id, setDeleteItemModalInfo }: IDeleteItemModalProps) => {

  const [isDeleting, setIsDeleting] = useState(false)

  async function deleteItem() {

    try {
      
      const url = type === 'driver' ? '/Condutor' : type === 'vehicle' ? '/Veiculo' : ''

      setIsDeleting(true)

      const response = await api.delete(`${url}/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          id
        }
      })

      if(response.status === 200) {
        setDeleteItemModalInfo({
          open: false,
          result: 'success'
        })
      }
      setIsDeleting(false)
    } catch (error) {
      setIsDeleting(false)
      setDeleteItemModalInfo({
        open: false,
        result: 'error'
      })
    }

  }

  return (
    <div>
      <Modal
        open={open}
        onClose={() => setDeleteItemModalInfo({
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
            {
              type === 'driver' ?
                'Tem certeza que deseja excluir este motorista?' :
                type === 'vehicle' ?
                  'Tem certeza que deseja excluir este veículo?' :
                  'Tem certeza que deseja excluir este item?'
            }
          </Typography>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Button variant="contained" onClick={() => {
              setDeleteItemModalInfo({
                open: false,
                result: ''
              })
            }} color="error" sx={{
              minWidth: '100px'
            }}>
              Cancelar
            </Button>
            <Button
              disabled={isDeleting}
              startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : null}
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
