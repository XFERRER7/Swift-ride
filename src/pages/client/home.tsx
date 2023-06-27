import { ClientLayout } from "@/layouts/ClientLayout"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Badge from "@mui/material/Badge"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import { useAppSelector } from "@/store"
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import deliveryImg from '@/assets/delivery.jpg'
import rideImg from '@/assets/ride.jpg'
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function home() {

  const client = useAppSelector(state => state.client.data)
  const { push } = useRouter()

  const getCurrentTime = () => {
    const currentDate = new Date()
    const formattedTime = format(currentDate, 'HH:mm')
    return formattedTime
  }

  const [currentTime, setCurrentTime] = useState(getCurrentTime())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime())
    }, 60000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const formattedDate = format(new Date(), 'EEEE', { locale: ptBR })

  return (
    <ClientLayout>

      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: {
          xs: 2,
          md: 20,
        }
      }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              sx={{
                backgroundColor: (theme) => theme.palette.primary.main,
                minHeight: 100,
                borderRadius: 2,
                display: 'flex',
                flexDirection: {
                  xs: 'column',
                  md: 'row',
                },
                gap: 2,
                '&:hover': {
                  opacity: 0.9,
                },
                justifyContent: 'space-between',
                padding: 2,
                alignItems: 'center',
                color: (theme) => theme.palette.primary.contrastText,
                position: 'relative',
              }}
            >
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Typography variant="body1" component="div" color='gold'>
                  Cliente Premium
                </Typography>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Nikola Joker
                </Typography>

              </Box>

              <Badge
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  transform: 'translate(50%, -50%) rotate(45deg)',
                  backgroundColor: 'gold',
                  color: (theme) => theme.palette.primary.contrastText,
                  padding: '10px 14px',
                  borderRadius: 2,
                }}
                badgeContent="Premium"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              />
              <div>
                <Typography variant="body1" component="div">
                  {formattedDate}
                </Typography>
                <Typography variant="body1" component="div">
                  {getCurrentTime()}
                </Typography>
              </div>
            </Box>
          </Grid>




          <Grid item xs={12} md={6}>
            {/* Card para Delivery */}
            <Card sx={{
              '&:hover': {
                transform: 'scale(1.03)',
                transition: 'all 0.5s ease-in-out',
                backgroundColor: '#f5f5f5'
              },
              cursor: 'pointer'
            }}
            onClick={() => push('/client/delivery')}
            >
              <CardMedia
                component="img"
                height="160"
                image={deliveryImg.src}
                alt="Delivery"
                sx={{
                  objectFit: 'cover',
                }}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  Delivery
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Descrição do serviço de Delivery.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Card para Viagem */}
            <Card sx={{
              '&:hover': {
                transform: 'scale(1.03)',
                transition: 'all 0.5s ease-in-out',
                backgroundColor: '#f5f5f5'
              },
              cursor: 'pointer'
            }}
            onClick={() => push('/client/ride')}
            >
              <CardMedia
                component="img"
                height="160"
                image={rideImg.src}
                alt="Viagem"
                sx={{
                  objectFit: 'cover',
                }}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  Viagem
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Descrição do serviço de Viagem.
                </Typography>
              </CardContent>
            </Card>





          </Grid>
        </Grid>
      </Box>

    </ClientLayout>
  )
}