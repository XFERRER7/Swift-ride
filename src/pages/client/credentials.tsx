import Box from '@mui/material/Box'
import { ClientLayout } from '../../layouts/ClientLayout'
import { useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Container from '@mui/material/Container'
import { AuthForm } from '@/components/client/AuthForm'
import { RegisterForm } from '@/components/client/RegisterForm'

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

export default function credentials() {

  const [tabValue, setTabValue] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <ClientLayout>

      <Box sx={{
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 10,

      }}>
        <Box sx={{
          borderBottom: 1, borderColor: 'divider', width: {
            xs: 300,
            md: 600,
          }
        }}>
          <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Entre" sx={{
              flexGrow: 1, width: {
                xs: 100,
                md: 300,
              }
            }} />
            <Tab label="Registre-se" sx={{
              flexGrow: 1, width: {
                xs: 100,
                md: 300,
              }
            }} />
          </Tabs>
        </Box>
        <Container sx={{
          width: {
            xs: 300,
            md: 600,
          }
        }}>
          {tabValue === 0 && (
            <Box p={3}>
              <AuthForm />
            </Box>
          )}
          {tabValue === 1 && (
            <Box p={3}>
              <RegisterForm />
            </Box>
          )}
        </Container>
      </Box>

    </ClientLayout>
  )
}
