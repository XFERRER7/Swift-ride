import { AdminLayout } from "@/layouts/AdminLayout";
import { Menu } from "@mui/icons-material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";


function Dashboard() {

  return (
    <div>
      <AdminLayout>
        <Grid container spacing={2} sx={{
          padding: '1rem',
        }}>
          <Grid item xs={12}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #ccc',
            }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Dashboard
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </AdminLayout>
    </div>
  );
}

export default Dashboard;
