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
import { DashboardSkeleton } from "@/components/admin/DashboardSkeleton";
import { GetServerSideProps } from "next";
import { IDisplacement } from "@/types/displacement";

interface IDisplacementsProps {
  data: IDisplacement[]
}

const driver = {
  name: 'John Doe',
  driverLicenseCategory: 'Category A',
  driverLicenseNumber: '123456789',
  driverLicenseExpiration: '2023-12-31',
  data1: 'Data 1',
  data2: 'Data 2',
  data3: 'Data 3',
  data4: 'Data 4',
  data5: 'Data 5',
  data6: 'Data 6',
};

export default function displacements({ data }: IDisplacementsProps) {

  const [displacements, setDisplacements] = useState<IDisplacement[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

                  displacements.map((displacement: IDisplacement) => (



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
                                  displacement.driverId  ?
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
                                  displacement.vehicleId  ?
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
                          <Button variant='contained' color='error' sx={{ width: '80px' }}>
                            Excluir
                          </Button>
                          <Button variant='contained' color='primary' sx={{ marginRight: 1 }}>
                            Editar
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

    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {

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

  })

  return {
    props: {
      data: displacements
    }
  }
}



{/* <Container>
        <Tabs variant="fullWidth" value={activeTab} onChange={handleTabChange}>
          <Tab label="Listar" title="Lista de motoristas cadastrados no sistema" />
        </Tabs>
      </Container>
      <Container>

        <Box p={3}>

          <TableContainer component={Paper} sx={{
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#374151',
              borderRadius: '5px',
            }
          }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Início</StyledTableCell>
                  <StyledTableCell align="right">Fim</StyledTableCell>
                  <StyledTableCell align="right">Km inicial</StyledTableCell>
                  <StyledTableCell align="right">Km final</StyledTableCell>
                  <StyledTableCell align="right">CheckList</StyledTableCell>
                  <StyledTableCell align="right">Motivo</StyledTableCell>
                  <StyledTableCell align="right">Observações</StyledTableCell>
                  <StyledTableCell align="right">id Condutor</StyledTableCell>
                  <StyledTableCell align="right">id Veiculo</StyledTableCell>
                  <StyledTableCell align="right">id Cliente</StyledTableCell>
                  <StyledTableCell align="right">Editar</StyledTableCell>
                  <StyledTableCell align="right">Excluir</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  data.map((displacement: IDisplacement) => (
                    <TableRow
                      key={displacement.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {
                          displacement.startOfDisplacement != '' ? displacement.startOfDisplacement : <Typography color="GrayText" >Não informado</Typography>
                        }
                      </TableCell>
                      <TableCell align="right">
                        {
                          displacement.endOfDisplacement != '' ? displacement.endOfDisplacement : <Typography color="GrayText" >Não informado</Typography>
                        }
                      </TableCell>
                      <TableCell align="right">
                        {
                          displacement.initialKm
                        }
                      </TableCell>
                      <TableCell align="right">
                        {
                          displacement.finalKm
                        }
                      </TableCell>
                      <TableCell align="right">
                        {
                          displacement.checkList != '' ? displacement.checkList : <Typography color="GrayText" >Não informado</Typography>
                        }
                      </TableCell>
                      <TableCell align="right">
                        {
                          displacement.reason != '' ? displacement.reason : <Typography color="GrayText" >Não informado</Typography>
                        }
                      </TableCell>
                      <TableCell align="right">
                        {
                          displacement.observation != '' ? displacement.observation : <Typography color="GrayText" >Não informado</Typography>
                        }
                      </TableCell>
                      <TableCell align="right">
                        {
                          displacement.driverId != 0 ? displacement.driverId : <Typography color="GrayText" >Não informado</Typography>
                        }
                      </TableCell>
                      <TableCell align="right">
                        {
                          displacement.vehicleId != 0 ? displacement.vehicleId : <Typography color="GrayText" >Não informado</Typography>
                        }
                      </TableCell>
                      <TableCell align="right">
                        {
                          displacement.customerId != 0 ? displacement.customerId : <Typography color="GrayText" >Não informado</Typography>
                        }
                      </TableCell>

                      <TableCell align="right" sx={{
                        cursor: "pointer"
                      }}>
                        <ModeEdit color='warning' />
                      </TableCell>
                      <TableCell align="right" sx={{
                        cursor: "pointer"
                      }}>
                        <Delete color="error" />
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>

        </Box>

      </Container> */}