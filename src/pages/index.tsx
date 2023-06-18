import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import adminImg from '../assets/admin.svg'
import clientImg from '../assets/client.svg'
import { useRouter } from 'next/router';

export default function Home() {

  const { push } = useRouter()

  function handleChoice(choice: string) {
    push(choice)
  }

  return (
    <main>
      <CssBaseline />
      <AppBar position="relative" color='primary'>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Swift Rider
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h4"
              variant="h4"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Escolha um tipo de usuário
            </Typography>
          </Container>
        </Box>
        <Container sx={{ py: 2 }} maxWidth="md">

          <Grid container spacing={4} justifyContent='center'>

            <Grid item key={1} xs={12} sm={6} md={4} justifyContent={'center'} alignItems='center'>
              <Card
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardMedia
                  component="div"
                  sx={{
                    pt: '56.25%',
                    objectFit: 'cover'
                  }}
                  image={adminImg.src}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Administrador
                  </Typography>
                  <Typography color='GrayText'>
                    Permissão para gerenciar veículos, motoristas e deslocamentos
                  </Typography>
                </CardContent>
                <CardActions sx={{
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <Button variant="contained" fullWidth onClick={() => {
                    handleChoice('/admin/dashboard/vehicles')
                  }}>Entrar</Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item key={1} xs={12} sm={6} md={4} justifyContent={'center'} alignItems='center'>
              <Card
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardMedia
                  component="div"
                  sx={{
                    // 16:9
                    pt: '56.25%',
                  }}
                  image={clientImg.src}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Cliente
                  </Typography>
                  <Typography color='GrayText'>
                    Permissão para solicitar deslocamentos
                  </Typography>
                </CardContent>
                <CardActions sx={{
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <Button variant="contained" fullWidth onClick={() => {
                    handleChoice('/client/home')
                  }}>Entrar</Button>
                </CardActions>
              </Card>
            </Grid>

          </Grid>
        </Container>
      </main>
    </main>
  )
}
