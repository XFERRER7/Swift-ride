import { AdminLayout } from "@/layouts/AdminLayout"
import { BorderBottom, Menu } from "@mui/icons-material"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import IconButton from "@mui/material/IconButton"
import InputBase from "@mui/material/InputBase"
import SearchIcon from "@mui/icons-material/Search"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Container from '@mui/material/Container'
import { useState } from "react"

export default function displacements() {

  const [activeTab, setActiveTab] = useState(0);

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

          <Typography variant="h5" component="h6">
            Listar Motoristas
          </Typography>

        </Box>

      </Container>

    </AdminLayout>
  )
}