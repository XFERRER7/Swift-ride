import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import makeStyles from '@mui/material/styles/makeStyles'
import { ReactNode, useState } from 'react'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { useRouter } from 'next/router'

interface IClientLayoutProps {
  children: ReactNode
}

export const ClientLayout = ({ children }: IClientLayoutProps) => {


  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter()

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Painel de Admin', path: '/about' },
    { title: 'Services', path: '/services' },
    { title: 'Contact', path: '/contact' },
  ];


  return (
    <Box sx={{
      flexGrow: 1,
      height: '100vh',
    }}>
      <AppBar position="static">
        <Toolbar sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>

          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setIsOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h4" fontWeight='bold' sx={{
            display: {
              xs: 'none',
              md: 'block',
            }
          }}>
            Credenciais
          </Typography>

          <Typography variant="h6">
            Swift Rider
          </Typography>

        </Toolbar>
        <Drawer anchor="left" open={isOpen}
          onClose={() => setIsOpen(false)}
        >

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            mt: 2,
          }}>

            <Typography variant="h6" fontWeight='bold' sx={{

            }}>
              Credenciais
            </Typography>

            <IconButton onClick={() => setIsOpen(false)}>
              <ChevronLeftIcon />
            </IconButton>

          </Box>

          <List sx={{
            width: 200,
          }}>
            {navLinks.map((link) => (
              <ListItem button key={link.title} component="a" href={link.path}>
                <ListItemText primary={link.title} />
              </ListItem>
            ))}
          </List>

        </Drawer>
      </AppBar>

      <Box sx={{
        mt: 2,
      }}>
        {children}
      </Box>

    </Box>
  )
}
