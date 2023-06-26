import { AdminLayout } from "@/layouts/AdminLayout"
import Box from "@mui/material/Box"
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import AddCircleOutline from "@mui/icons-material/AddCircleOutline"
import CardActions from "@mui/material/CardActions"
import Grid from "@mui/material/Grid"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { IVehicle } from "@/types/vehicle"
import { DashboardSkeleton } from "@/components/admin/DashboardSkeleton";
import { CreateVehicleModal } from "@/components/admin/modal/CreateVehicleModal";
import Snackbar from '@mui/material/Snackbar'
import SnackbarContent from '@mui/material/SnackbarContent'
import { DeleteItemModal } from "@/components/admin/modal/DeleteItemModal";
import { EditVehicleModal, IVehicleInfo } from "@/components/admin/modal/EditVehicleModal";

export default function vehicles() {

  const [vehicles, setVehicles] = useState<IVehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [createVehicleModalInfo, setCreateVehicleModalInfo] = useState({
    open: false,
    result: '' as 'success' | 'error' | ''
  })
  const [editVehicleModalInfo, setEditVehicleModalInfo] = useState({
    open: false,
    result: '' as 'success' | 'error' | ''
  })
  const [deleteItemModalInfo, setDeleteItemModalInfo] = useState({
    open: false,
    result: '' as 'success' | 'error' | '',
  })

  const [vehicleToEditInfo, setVehicleToEditInfo] = useState<IVehicleInfo>({
    id: 0,
    brandModel: '',
    manufacturingYear: 0,
    currentKm: 0,
  })
  const [idToDelete, setIdToDelete] = useState(null as null | number)

  async function getDataVehicles() {

    const response = await api.get("/Veiculo")

    const data = response.data

    const vehicles: IVehicle[] = []

    data.map((vehicle: any) => {

      const newVehicle: IVehicle = {
        id: vehicle.id,
        licensePlate: vehicle.placa || '',
        brandModel: vehicle.marcaModelo || '',
        manufacturingYear: vehicle.anoFabricacao != 0 ? vehicle.anoFabricacao : '',
        currentKm: vehicle.kmAtual,
      }

      vehicles.push(newVehicle)
    })

    setVehicles(vehicles)
    setIsLoading(false)

  }

  useEffect(() => {
    if (createVehicleModalInfo.result === "success" || deleteItemModalInfo.result === "success" || editVehicleModalInfo.result === "success") {
      getDataVehicles()
    }

  }, [createVehicleModalInfo.result, deleteItemModalInfo.result, editVehicleModalInfo.result])

  useEffect(() => {
    getDataVehicles()
  }, []);

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
            Veículos cadastrados
          </Typography>


          <Button variant='contained' color='primary' onClick={() => setCreateVehicleModalInfo({
            open: true,
            result: ''
          })} startIcon={<AddCircleOutline />}>
            Adicionar veículo
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
                vehicles.map((vehicle: IVehicle) => (
                  <Grid item xs={12} sm={6} key={vehicle.id}>
                    <Card variant='outlined' sx={{ marginBottom: 2, backgroundColor: '#f5f5f5' }}>
                      <CardContent>
                        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                          {vehicle.brandModel}
                        </Typography>
                        <Box sx={{ display: 'flex', marginBottom: 1, marginTop: 1 }}>
                          <Typography variant='body2' sx={{ fontWeight: 'bold', marginRight: 1 }}>
                            Placa:
                          </Typography>
                          <Typography variant='body2'>{vehicle.licensePlate}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', marginBottom: 1 }}>
                          <Typography variant='body2' sx={{ fontWeight: 'bold', marginRight: 1 }}>
                            Ano de fabricação:
                          </Typography>
                          <Typography variant='body2'>{vehicle.manufacturingYear}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                          <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                            Km atual:
                          </Typography>
                          <Typography variant='body2'>{vehicle.currentKm}</Typography>
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button variant='contained' color='error' sx={{
                          width: '80px',
                        }}
                          onClick={() => {
                            setIdToDelete(vehicle.id)
                            setDeleteItemModalInfo({
                              open: true,
                              result: ''
                            })
                          }}
                        >
                          Excluir
                        </Button>
                        <Button
                          variant='contained'
                          color='primary'
                          sx={{ marginRight: 1 }}
                          onClick={() => {
                            setVehicleToEditInfo({
                              id: vehicle.id,
                              brandModel: vehicle.brandModel,
                              manufacturingYear: Number(vehicle.manufacturingYear),
                              currentKm: vehicle.currentKm,
                            })
                            setEditVehicleModalInfo({
                              open: true,
                              result: ''
                            })
                          }}
                        >
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
          createVehicleModalInfo.result === 'success' ? true :
            createVehicleModalInfo.result === 'error' ? true :
              deleteItemModalInfo.result === 'success' ? true :
                deleteItemModalInfo.result === 'error' ? true :
                  editVehicleModalInfo.result === 'success' ? true :
                    editVehicleModalInfo.result === 'error' ? true : false
        }
        autoHideDuration={2000}
        onClose={() => {
          setCreateVehicleModalInfo({
            open: false,
            result: ''
          })
          setEditVehicleModalInfo({
            open: false,
            result: ''
          })
          setDeleteItemModalInfo({
            open: false,
            result: ''
          })
        }}
      >
        <SnackbarContent
          style={{
            backgroundColor: createVehicleModalInfo.result === 'success' ? '#4caf50' :
              createVehicleModalInfo.result === 'error' ? '#f44336' :
                deleteItemModalInfo.result === 'success' ? '#4caf50' :
                  deleteItemModalInfo.result === 'error' ? '#f44336' :
                    editVehicleModalInfo.result === 'success' ? '#4caf50' :
                      editVehicleModalInfo.result === 'error' ? '#f44336' : ''
          }}
          message={
            createVehicleModalInfo.result === 'success' ?
              'Veículo cadastrado com sucesso!' :
              createVehicleModalInfo.result === 'error' ?
                'Erro ao cadastrar veículo!' :
                deleteItemModalInfo.result === 'success' ?
                  'Veículo excluído com sucesso!' :
                  deleteItemModalInfo.result === 'error' ?
                    'Erro ao excluir veículo!' :
                    editVehicleModalInfo.result === 'success' ?
                      'Veículo editado com sucesso!' :
                      editVehicleModalInfo.result === 'error' ?
                        'Erro ao editar veículo!' : ''
          }
        />
      </Snackbar>
      <CreateVehicleModal open={createVehicleModalInfo.open} setCreateVehicleModalInfo={setCreateVehicleModalInfo} />
      <EditVehicleModal
        open={editVehicleModalInfo.open}
        setEditVehicleModalInfo={setEditVehicleModalInfo}
        vehicle={vehicleToEditInfo}
      />
      <DeleteItemModal
        open={deleteItemModalInfo.open}
        id={idToDelete}
        type="vehicle"
        setDeleteItemModalInfo={setDeleteItemModalInfo}
      />
    </AdminLayout >
  )
}