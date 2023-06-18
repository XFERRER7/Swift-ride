import { AdminLayout } from "@/layouts/AdminLayout"
import Delete from "@mui/icons-material/Delete"
import ModeEdit from "@mui/icons-material/ModeEdit"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { styled } from '@mui/material/styles';

import { Container, useTheme } from "@mui/material"
import { useState } from "react"
import { CreateVehicleForm } from "@/components/admin/forms/CreateVehicleForm"
import { GetServerSideProps } from "next"
import { api } from "@/lib/api"
import { IVehicle } from "@/types/vehicle"

interface IVehicleProps {
  data: IVehicle[]
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

export default function vehicles({ data }: IVehicleProps) {

  const theme = useTheme();

  const [activeTab, setActiveTab] = useState(1);

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setActiveTab(newValue);
  };

  return (
    <AdminLayout>

      <Container>
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Cadastro" title="Adicionar novo veículo ao sistema" />
          <Tab label="Dados cadastrados" title="Lista de veículos cadastrados no sistema" />
        </Tabs>
      </Container>
      <Container>
        {activeTab === 0 && (
          <Box p={3}>

            <CreateVehicleForm />

          </Box>
        )}
        {activeTab === 1 && (
          <Box p={3} sx={{
            overflow: "hidden",
          }}>

            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Marca - Modelo</StyledTableCell>
                    <StyledTableCell align="right">Placa</StyledTableCell>
                    <StyledTableCell align="right">Ano de fabricação</StyledTableCell>
                    <StyledTableCell align="right">Km atual</StyledTableCell>
                    <StyledTableCell align="right">Editar</StyledTableCell>
                    <StyledTableCell align="right">Excluir</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    data.map((vehicle: IVehicle) => (
                      <TableRow
                        key={vehicle.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {vehicle.makeModel}
                        </TableCell>
                        <TableCell align="right">{vehicle.licensePlate}</TableCell>
                        <TableCell align="right">{vehicle.manufacturingYear}</TableCell>
                        <TableCell align="right">{vehicle.currentKm}</TableCell>
                        <TableCell align="right" sx={{
                            cursor: "pointer"
                          }}>
                          <ModeEdit color='warning'/>
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
        )}
      </Container>

    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {

  const response = await api.get("/Veiculo")

  const data = response.data

  const vehicles: IVehicle[] = []

  data.map((vehicle: any) => {
    
    const vehicleData: IVehicle = {
      id: vehicle.id,
      licensePlate: vehicle.placa,
      makeModel: vehicle.marcaModelo,
      manufacturingYear: vehicle.anoFabricacao,
      currentKm: vehicle.kmAtual,
    }

    vehicles.push(vehicleData)
  })

  return {
    props: {
      data: vehicles
    }
  }

}