import { AdminLayout } from "@/layouts/AdminLayout"
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
import ModeEdit from '@mui/icons-material/ModeEdit';
import Delete from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container"
import { useTheme } from "@mui/material"
import { useState } from "react"
import { CreateDriverForm } from "@/components/admin/forms/CreateDriverForm"
import { styled } from '@mui/material/styles';
import { GetServerSideProps } from "next"
import { api } from "@/lib/api"
import { IDriver } from "@/types/driver"


interface IDriversProps {
  data: IDriver[]
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


export default function drivers({ data }: IDriversProps) {

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
          <Tab label="Dados cadastrados" title="Lista de motoristas cadastrados no sistema" />
          <Tab label="Cadastro" title="Adicionar novo motorista ao sistema" />
        </Tabs>
      </Container>
      <Container>
        {activeTab === 0 && (
          <Box p={3}>

            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Nome</StyledTableCell>
                    <StyledTableCell align="right">Categoria da CNH</StyledTableCell>
                    <StyledTableCell align="right">Nº de registro</StyledTableCell>
                    <StyledTableCell align="right">Venciemento da CNH</StyledTableCell>
                    <StyledTableCell align="right">Editar</StyledTableCell>
                    <StyledTableCell align="right">Excluir</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    data.map((driver: IDriver) => (
                      <TableRow
                        key={driver.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {driver.name != '' ? driver.name : <Typography color="GrayText" >Não informado</Typography>}
                        </TableCell>
                        <TableCell align="right">{
                          driver.driverLicenseCategory != '' ? driver.driverLicenseCategory : <Typography color="GrayText" >Não informado</Typography>
                        }</TableCell>
                        <TableCell align="right">{
                          driver.driverLicenseNumber != '' ? driver.driverLicenseNumber : <Typography color="GrayText" >Não informado</Typography>
                        }</TableCell>
                        <TableCell align="right">{
                          driver.driverLicenseExpiration != '' ? driver.driverLicenseExpiration : <Typography color="GrayText" >Não informado</Typography>
                        }</TableCell>
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
        )}
        {activeTab === 1 && (

          <Box p={3}>
            <CreateDriverForm />
          </Box>

        )}
      </Container>

    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {

  const response = await api.get('/Condutor')

  const data = response.data

  const drivers: IDriver[] = []

  data.map((driver: any) => {

    const newDriver: IDriver = {
      id: driver.id,
      name: driver.nome || '',
      driverLicenseNumber: driver.numeroHabilitacao || '',
      driverLicenseCategory: driver.categoriaHabilitacao || '',
      driverLicenseExpiration: driver.vencimentoHabilitacao || '',
    }

    drivers.push(newDriver)

  })

  return {
    props: {
      data: drivers
    }
  }
}