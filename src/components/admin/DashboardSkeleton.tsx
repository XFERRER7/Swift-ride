import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'

export const DashboardSkeleton = () => {
  return (
    <Card variant='elevation' sx={{ marginBottom: 2, backgroundColor: '#f5f5f5' }}>
      <CardContent>
        <Skeleton variant='text' width='70%' height={40} sx={{ marginBottom: 1 }} />
        <Skeleton variant='text' width='30%' height={20} sx={{ marginBottom: 1 }} />
        <Skeleton variant='text' width='50%' height={20} sx={{ marginBottom: 1 }} />
        <Skeleton variant='text' width='40%' height={20} />
      </CardContent>
    </Card>
  )
}
