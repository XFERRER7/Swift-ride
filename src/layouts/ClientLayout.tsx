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
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { useDispatch } from 'react-redux'

import { MouseEvent, ReactNode, useState } from 'react'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { useRouter } from 'next/router'
import { logout } from '@/store/slices/client'
import { useAppSelector } from '@/store'

interface IClientLayoutProps {
  children: ReactNode
}

const navLinks = [
  { title: 'Home', path: '/client/home' },
  { title: 'Credenciais', path: '/client/credentials' },
  { title: 'Viagem', path: '/client/ride' },
  { title: 'Delivery', path: '/client/delivery' },
]

export const ClientLayout = ({ children }: IClientLayoutProps) => {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  const client = useAppSelector(state => state.client.data)

  const dispatch = useDispatch()
  const { pathname, push } = useRouter()

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    dispatch(logout())
    push('/client/credentials')
  }


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



          <Typography variant="h6">
            Swift Rider
          </Typography>

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
          }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>

            <Typography variant="body1" fontWeight='bold' sx={{}}>
              {client?.name}
            </Typography>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => {
                push('/client/profile')
              }}>Meu perfil</MenuItem>
              <MenuItem onClick={handleLogout}>Sair</MenuItem>
            </Menu>
          </Box>

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
              {
                pathname === '/client/credentials' ? 'Credenciais' :
                  pathname === '/client/home' ? 'Menu' :
                    pathname === '/client/ride' ? 'Viagem' :
                      pathname === '/client/delivery' ? 'Delivery' : 'Swift Rider'
              }
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
