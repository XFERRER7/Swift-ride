import { AdminLayout } from "@/layouts/AdminLayout"
import Box from "@mui/material/Box"
import Typography from '@mui/material/Typography'
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import AddCircleOutline from "@mui/icons-material/AddCircleOutline"
import CardActions from "@mui/material/CardActions"
import Grid from "@mui/material/Grid"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { DashboardSkeleton } from "@/components/admin/DashboardSkeleton"
import { IDriver } from "@/types/driver"
import Snackbar from '@mui/material/Snackbar'
import SnackbarContent from '@mui/material/SnackbarContent'
import { CreateDriverModal } from "@/components/admin/modal/CreateDriverModal"
import { DeleteItemModal } from "@/components/admin/modal/DeleteItemModal"

export default function drivers() {

  const [drivers, setDrivers] = useState<IDriver[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [createDriverModalInfo, setCreateDriverModalInfo] = useState({
    open: false,
    result: '' as 'success' | 'error' | ''
  })
  const [deleteItemModalInfo, setDeleteItemModalInfo] = useState({
    open: false,
    result: '' as 'success' | 'error' | '',
  })
  const [idToDelete, setIdToDelete] = useState(null as null | number)

  async function getDataDrivers() {

    const response = await api.get('/Condutor')

    const data = response.data

    const drivers: IDriver[] = []

    data.map((driver: any) => {

      const newDriver: IDriver = {
        id: driver.id,
        name: driver.nome || '',
        driverLicenseNumber: driver.numeroHabilitacao || '',
        driverLicenseCategory: driver.catergoriaHabilitacao || '',
        driverLicenseExpiration: driver.vencimentoHabilitacao || '',
      }

      drivers.push(newDriver)

    })

    setDrivers(drivers)
    setIsLoading(false)

  }

  useEffect(() => {

    if (createDriverModalInfo.result === "success" || deleteItemModalInfo.result === "success") {
      getDataDrivers()
    }

  }, [createDriverModalInfo.result, deleteItemModalInfo.result])

  useEffect(() => {
    getDataDrivers()
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
            Motoristas cadastrados
          </Typography>


          <Button
            variant='contained'
            color='primary'
            startIcon={<AddCircleOutline />}
            onClick={() => setCreateDriverModalInfo({
              open: true,
              result: ''
            })}>
            Adicionar motorista
          </Button>

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


                drivers.map((driver: IDriver) => (

                  <Grid item xs={12} sm={6} key={driver.id}>
                    <Card variant='outlined' sx={{ marginBottom: 2, backgroundColor: '#f5f5f5' }}>
                      <CardContent>
                        {
                          driver.name != '' ?
                            <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                              {driver.name}
                            </Typography>
                            : <Typography color="GrayText" >
                              Não informado
                            </Typography>
                        }

                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1, marginTop: 1 }}>
                          <Typography variant='body2' sx={{ fontWeight: 'bold', marginRight: 1 }}>
                            Categoria da CNH:
                          </Typography>

                          {
                            driver.driverLicenseCategory != '' ?
                              <Typography variant='body2'>
                                {driver.driverLicenseCategory}
                              </Typography>
                              : <Typography color="GrayText" >Não informado</Typography>
                          }
                        </Box>
                        <Box sx={{ display: 'flex', marginBottom: 1 }}>
                          <Typography variant='body2' sx={{ fontWeight: 'bold', marginRight: 1 }}>
                            Nº de registro:
                          </Typography>

                          {
                            driver.driverLicenseNumber != '' ?
                              <Typography variant='body2'>
                                {driver.driverLicenseNumber}
                              </Typography>
                              : <Typography color="GrayText" >Não informado</Typography>
                          }
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                          <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                            Vencimento da CNH:
                          </Typography>

                          {
                            driver.driverLicenseExpiration != '' ?
                              <Typography variant='body2'>
                                {driver.driverLicenseExpiration}
                              </Typography>
                              : <Typography color="GrayText" >Não informado</Typography>
                          }
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button variant='contained' color='error' sx={{
                          width: '80px',
                        }}
                          onClick={() => {
                            setIdToDelete(driver.id)
                            setDeleteItemModalInfo({
                              open: true,
                              result: ''
                            })
                          }}
                        >
                          Excluir
                        </Button>
                        <Button variant='contained' color='primary' sx={{ marginRight: 1 }}>
                          Editar
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>


                ))


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
          createDriverModalInfo.result === '' ? false :
            createDriverModalInfo.result === 'success' ? true :
              createDriverModalInfo.result === 'error' ? true : false
        }
        autoHideDuration={3000}
        onClose={() => setCreateDriverModalInfo({
          open: false,
          result: ''
        })}
      >
        <SnackbarContent
          style={{
            backgroundColor: createDriverModalInfo.result === 'success' ? '#4caf50' :
              createDriverModalInfo.result === 'error' ? '#f44336' : ''
          }}
          message={
            createDriverModalInfo.result === 'success' ?
              'Veículo cadastrado com sucesso!' :
              createDriverModalInfo.result === 'error' ?
                'Erro ao cadastrar veículo!' : ''
          }
        />
      </Snackbar>
      <CreateDriverModal
        open={createDriverModalInfo.open}
        setCreateDriverModalInfo={setCreateDriverModalInfo}
      />
      <DeleteItemModal
        open={deleteItemModalInfo.open}
        id={idToDelete}
        type="driver"
        setDeleteItemModalInfo={setDeleteItemModalInfo}
      />
    </AdminLayout>
  )
}

