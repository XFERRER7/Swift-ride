import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import DriveEta from "@mui/icons-material/DriveEta"
import Person from "@mui/icons-material/Person"
import LocationOn from "@mui/icons-material/LocationOn"
import SearchIcon from "@mui/icons-material/Search"
import InputBase from "@mui/material/InputBase"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { useTheme } from "@mui/material/styles"
import { useEffect, useState } from "react"
import { useMediaQuery } from "@mui/material"
import { useRouter } from "next/router"
import { useAppSelector } from "@/store"


interface AdminLayoutProps {
  children: React.ReactNode
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {

  const [open, setOpen] = useState(false)
  const { push, pathname } = useRouter()
  const [currentPath, setCurrentPath] = useState(pathname)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    setCurrentPath(pathname)
  }, [pathname])

 

  const currentPageStyle = {
    container: {
      backgroundColor: '#f5f5f5',
      color: theme.palette.primary?.main,
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.primary?.contrastText,
        color: theme.palette.primary?.main,
      }
    },
    icon: {
      color: theme.palette.primary?.main
    }
  }

  const listitems = [
    {
      text: 'Veículos',
      icon: <DriveEta sx={
        pathname === '/admin/dashboard/vehicles' ? currentPageStyle.icon : {
          color: theme.palette.primary?.contrastText
        }
      } />,
      path: '/admin/dashboard/vehicles',
    },
    {
      text: 'Motoristas',
      icon: <Person sx={
        pathname === '/admin/dashboard/drivers' ? currentPageStyle.icon : {
          color: theme.palette.primary?.contrastText
        }
      } />,
      path: '/admin/dashboard/drivers',
    },
    {
      text: 'Deslocamentos',
      icon: <LocationOn sx={
        pathname === '/admin/dashboard/displacements' ? currentPageStyle.icon : {
          color: theme.palette.primary?.contrastText
        }
      } />,
      path: '/admin/dashboard/displacements',
    }
  ]



  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant={
          isMobile ? 'temporary' : 'permanent'
        }
        open={open}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            borderRight: 'none',
            backgroundColor: theme.palette.primary?.main,
            color: theme.palette.primary?.contrastText,
          },
        }}
      >
        <Toolbar sx={{
          px: 2,
          backgroundColor: theme.palette.primary?.main,
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <Typography variant="h6" sx={{
            fontSize: {
              xs: '0.8rem',
              md: '1.1rem',
            }
          }}>
            Swift Ride | Admin
          </Typography>

          {
            isMobile && (
              <IconButton
                onClick={() => setOpen(false)}
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2, backgroundColor: theme.palette.primary?.main, }}
              >
                <ChevronLeftIcon />
              </IconButton>
            )
          }

        </Toolbar>
        <Divider color={theme.palette.primary?.contrastText} />

        <List sx={{
          marginTop: '2rem',
        }}>

          {
            listitems.map((item, index) => (
              <ListItem
                key={index}
                onClick={() => push(item.path)}
                sx={
                  currentPath === item.path ? currentPageStyle.container : {
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }
                }>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))
          }
        </List>
        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="contained"
          onClick={() => push('/')}
          sx={{
            mx: 2,
            mb: 2,
            backgroundColor: theme.palette.primary?.contrastText,
            color: theme.palette.primary?.main,
            fontWeight: '600',
            '&:hover': {
              backgroundColor: theme.palette.primary?.contrastText,
            }
          }}
        >
          Voltar ao Menu
        </Button>
      </Drawer>

      {/* Conteúdo */}
      <Box component="main" sx={{
        flexGrow: 1,
      }}>

        <Grid container spacing={2} sx={{
          paddingLeft: '1rem',
          paddingRight: '1rem',
        }}>
          <Grid item xs={12}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '1rem',
              alignItems: 'center',
              height: '4rem',
              backgroundColor: '#ffffff',
              borderBottom: '1px solid #e0e0e0'

            }}>

              {
                !isMobile && (
                  <Typography variant="h5" component="h6" sx={{
                    mr: 2,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: 'inherit',
                    textDecoration: 'none',
                  }}>
                    Painel de Controle
                  </Typography>
                )
              }

              {
                isMobile && (
                  <Box>
                    <IconButton
                      size="large"
                      edge="start"
                      color="inherit"
                      aria-label="menu"
                      sx={{ mr: 2 }}
                      onClick={() => setOpen(true)}
                    >
                      <MenuIcon />
                    </IconButton>
                  </Box>

                )
              }

              <Paper
                component="form"
                sx={{
                  display: 'flex', alignItems: 'center', width: {
                    md: '60%',
                    lg: '30%',

                  }
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder={
                    isMobile ? 'Pesquisar' : currentPath === '/admin/dashboard/vehicles' ?
                      'Pesquise por veículos' : currentPath === '/admin/dashboard/drivers' ?
                        'Pesquise por motoristas' : 'Pesquise por deslocamentos'
                  }
                  inputProps={{ 'aria-label': 'search google maps' }}
                />
                <IconButton type="submit" sx={{ p: '6px' }} aria-label="search">
                  <SearchIcon />
                </IconButton>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            width: '100%',
            marginTop: '4rem',
            maxWidth: '95%'
          }}
        >
          {children}
        </Box>


      </Box>
    </Box>
  )
}
