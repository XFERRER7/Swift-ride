import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import DriveEta from "@mui/icons-material/DriveEta";
import Person from "@mui/icons-material/Person";
import LocationOn from "@mui/icons-material/LocationOn";
import { useTheme } from "@mui/material/styles";


interface AdminLayoutProps {
  children: React.ReactNode
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {

  const theme = useTheme()

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.primary?.main,
            color: theme.palette.primary?.contrastText,
          },
        }}
      >
        <Toolbar sx={{ px: 2, backgroundColor: theme.palette.primary?.main, }}>
          {/* Nome do seu site */}
          <Typography variant="h6">
            Swift Ride | Admin
          </Typography>
        </Toolbar>
        <Divider color={theme.palette.primary?.contrastText} />

        <List sx={{
          marginTop: '2rem',
        }}>
          {/* Item "Veículos" */}
          <ListItem button>
            <ListItemIcon>
              <DriveEta sx={{
                color: theme.palette.primary?.contrastText,
              }} />
            </ListItemIcon>
            <ListItemText primary="Veículos" />
          </ListItem>
          {/* Item "Motoristas" */}
          <ListItem button>
            <ListItemIcon>
              <Person sx={{
                color: theme.palette.primary?.contrastText,
              }} />
            </ListItemIcon>
            <ListItemText primary="Motoristas" />
          </ListItem>
          {/* Item "Deslocamentos" */}
          <ListItem button>
            <ListItemIcon>
              <LocationOn sx={{
                color: theme.palette.primary?.contrastText,
              }} />
            </ListItemIcon>
            <ListItemText primary="Deslocamentos" />
          </ListItem>
        </List>
        <Box sx={{ flexGrow: 1 }} />
        {/* Botão "Voltar ao Menu" */}
        <Button
          variant="contained"
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
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  )
}
