import { AdminLayout } from "@/layouts/AdminLayout"
import { BorderBottom, Menu } from "@mui/icons-material"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Container from '@mui/material/Container'
import { useState } from "react"
import { GetServerSideProps } from "next"
import { api } from "@/lib/api"
import { IDisplacement } from "@/types/displacement"
import { styled } from '@mui/material/styles';
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Typography from '@mui/material/Typography';
import ModeEdit from "@mui/icons-material/ModeEdit"
import Delete from "@mui/icons-material/Delete"

interface IDisplacementsProps {
  data: IDisplacement[]
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));


export default function displacements({ data }: IDisplacementsProps) {

  console.log(data)
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setActiveTab(newValue);
  };


  return (
    <AdminLayout>

      <Container>
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

      </Container>

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