import { AdminLayout } from "@/layouts/AdminLayout"
import Box from "@mui/material/Box"
import Typography from '@mui/material/Typography'
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardActions from "@mui/material/CardActions"
import Grid from "@mui/material/Grid"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { DashboardSkeleton } from "@/components/admin/DashboardSkeleton"
import { IDisplacement } from "@/types/displacement"
import { DeleteItemModal } from "@/components/admin/modal/DeleteItemModal"
import Snackbar from '@mui/material/Snackbar'
import SnackbarContent from '@mui/material/SnackbarContent'
import { useAppSelector } from "@/store"
import { useDispatch } from "react-redux"
import { setSearch } from "@/store/slices/search"

export default function displacements() {

  const [displacements, setDisplacements] = useState<IDisplacement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteItemModalInfo, setDeleteItemModalInfo] = useState({
    open: false,
    result: '' as 'success' | 'error' | '',
  })
  const [idToDelete, setIdToDelete] = useState(null as null | number)

  const { search } = useAppSelector(state => state.search)

  const dispatch = useDispatch()

  async function getDataDisplacements() {

    const response = await api.get("/Deslocamento")

    const data = response.data

    const displacements: IDisplacement[] = []

    data.map((displacement: any) => {

      const newDisplacement: IDisplacement = {
        id: displacement.id,
        initialKm: displacement.kmInicial,
        finalKm: displacement.kmFinal,
        startOfDisplacement: displacement.inicioDeslocamento,
        endOfDisplacement: displacement.fimDeslocamento,
        checkList: displacement.checkList,
        reason: displacement.motivo,
        observation: displacement.observacao,
        driverId: displacement.idCondutor,
        vehicleId: displacement.idVeiculo,
        customerId: displacement.idCliente
      }

      displacements.push(newDisplacement)
      console.log(displacements)

    })

    setDisplacements(displacements)
    setIsLoading(false)

  }

  useEffect(() => {

    if (deleteItemModalInfo.result === "success") {
      getDataDisplacements()
    }

  }, [deleteItemModalInfo.result])

  useEffect(() => {

    dispatch(setSearch(''))
    getDataDisplacements()

  }, [])

  return (
    <AdminLayout>

      <Box display='flex' flexDirection='column' sx={{
        paddingLeft: 5,
        paddingRight: 5,
      }}>

        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          flexDirection: {
            xs: 'column',
            sm: 'row',
          }
        }}>
          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
              mr: 2,
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Lista de deslocamentos
          </Typography>

        </Box>

        <Box sx={{}} mt={3}>


          <Grid container spacing={2}>
            {

              isLoading ? (
                <>
                  <Grid item xs={12} sm={6}>
                    <DashboardSkeleton />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DashboardSkeleton />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DashboardSkeleton />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DashboardSkeleton />
                  </Grid>
                </>
              )
                :
                (

                  
                  displacements.filter((displacement: IDisplacement) => {
                    if (search === '') {
                      return displacement
                    } else if (displacement.reason.toLowerCase().includes(search.toLowerCase())) {
                      return displacement
                    }
                  })
                  .map((displacement: IDisplacement) => (

                    <Grid item xs={12} sm={12}>
                      <Card variant='outlined' sx={{ marginBottom: 2, backgroundColor: '#f5f5f5' }}>
                        <CardContent sx={{
                          display: 'flex',
                          flexDirection: 'column',
                        }}>

                          {
                            displacement.reason !== '' ?
                              <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                                {displacement.reason}
                              </Typography>
                              : <Typography color="GrayText" >
                                Motivo nao especificado
                              </Typography>
                          }

                          <Box sx={{
                            display: {
                              sm: 'block',
                              md: 'flex',
                            },
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1,
                          }}>


                            {/* Primeira coluna */}
                            <Box sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 1,
                            }} >

                              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1, marginTop: 1 }}>
                                <Typography variant='body2' sx={{ fontWeight: 'bold', marginRight: 1 }}>
                                  Km inicial:
                                </Typography>

                                {
                                  displacement.initialKm !== undefined ?
                                    <Typography variant='body2'>
                                      {displacement.initialKm}
                                    </Typography>
                                    : <Typography color="GrayText">Não informado</Typography>
                                }
                              </Box>
                              <Box sx={{ display: 'flex', marginBottom: 1 }}>
                                <Typography variant='body2' sx={{ fontWeight: 'bold', marginRight: 1 }}>
                                  Km final:
                                </Typography>

                                {
                                  displacement.finalKm !== null ?
                                    <Typography variant='body2'>
                                      {displacement.finalKm}
                                    </Typography>
                                    : <Typography color="GrayText">Não informado</Typography>
                                }
                              </Box>
                              <Box sx={{ display: 'flex' }}>
                                <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                                  Observações:
                                </Typography>

                                {
                                  displacement.observation !== '' ?
                                    <Typography variant='body2'>
                                      {displacement.observation}
                                    </Typography>
                                    : <Typography color="GrayText">Não informado</Typography>
                                }
                              </Box>
                            </Box>

                            {/* Segunda coluna */}
                            <Box sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 1,
                            }}>


                              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1, marginTop: 1 }}>
                                <Typography variant='body2' sx={{ fontWeight: 'bold', marginRight: 1 }}>
                                  Início:
                                </Typography>
                                {
                                  displacement.startOfDisplacement !== null ?
                                    <Typography variant='body2'>
                                      {displacement.startOfDisplacement}
                                    </Typography>
                                    : <Typography color="GrayText">Não informado</Typography>
                                }
                              </Box>
                              <Box sx={{ display: 'flex', marginBottom: 1 }}>
                                <Typography variant='body2' sx={{ fontWeight: 'bold', marginRight: 1 }}>
                                  Fim:
                                </Typography>
                                {
                                  displacement.endOfDisplacement !== null ?
                                    <Typography variant='body2'>
                                      {displacement.endOfDisplacement}
                                    </Typography>
                                    : <Typography color="GrayText">Não informado</Typography>
                                }
                              </Box>
                              <Box sx={{ display: 'flex' }}>
                                <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                                  CheckList:
                                </Typography>
                                {
                                  displacement.checkList !== '' ?
                                    <Typography variant='body2'>
                                      {displacement.checkList}
                                    </Typography>
                                    : <Typography color="GrayText">Não informado</Typography>
                                }
                              </Box>
                            </Box>

                            {/* Terceira coluna */}
                            <Box sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 1,
                            }}>

                              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1, marginTop: 1 }}>
                                <Typography variant='body2' sx={{ fontWeight: 'bold', marginRight: 1 }}>
                                  Condutor:
                                </Typography>
                                {
                                  displacement.driverId ?
                                    <Typography variant='body2'>
                                      {displacement.driverId}
                                    </Typography>
                                    : <Typography color="GrayText">Não informado</Typography>
                                }
                              </Box>
                              <Box sx={{ display: 'flex', marginBottom: 1 }}>
                                <Typography variant='body2' sx={{ fontWeight: 'bold', marginRight: 1 }}>
                                  Veículo:
                                </Typography>
                                {
                                  displacement.vehicleId ?
                                    <Typography variant='body2'>
                                      {displacement.vehicleId}
                                    </Typography>
                                    : <Typography color="GrayText">Não informado</Typography>
                                }
                              </Box>
                              <Box sx={{ display: 'flex' }}>
                                <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                                  Cliente:
                                </Typography>
                                {
                                  displacement.customerId ?
                                    <Typography variant='body2'>
                                      {displacement.customerId}
                                    </Typography>
                                    : <Typography color="GrayText">Não informado</Typography>
                                }
                              </Box>
                            </Box>

                          </Box>

                        </CardContent>
                        <CardActions>
                          <Button
                            variant='contained'
                            color='error'
                            sx={{ width: '80px' }}
                            onClick={() => {
                              setIdToDelete(displacement.id)
                              setDeleteItemModalInfo({
                                open: true,
                                result: ''
                              })
                            }}
                          >
                            Excluir
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                )

            }
          </Grid>

        </Box>

      </Box>

      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={
          deleteItemModalInfo.result === 'success' ||
          deleteItemModalInfo.result === 'error'
        }
        autoHideDuration={3000}
        onClose={() => setDeleteItemModalInfo({
          open: false,
          result: ''
        })}
      >
        <SnackbarContent
          style={{
            backgroundColor: deleteItemModalInfo.result === 'success' ? '#4caf50' :
              deleteItemModalInfo.result === 'error' ? '#f44336' : ''
          }}
          message={
            deleteItemModalInfo.result === 'success' ?
              'Deslocamento excluído com sucesso!' :
              deleteItemModalInfo.result === 'error' ?
                'Erro ao excluir deslocamento!' :
                ''
          }
        />
      </Snackbar>

      <DeleteItemModal
        open={deleteItemModalInfo.open}
        id={idToDelete}
        type="displacement"
        setDeleteItemModalInfo={setDeleteItemModalInfo}
      />
    </AdminLayout>
  )
}