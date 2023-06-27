import { ClientLayout } from "@/layouts/ClientLayout"
import { api } from "@/lib/api"
import { IDisplacement } from "@/types/displacement"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import LinearProgress, { LinearProgressProps } from "@mui/material/LinearProgress"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import Alert from '@mui/material/Alert'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch } from "react-redux"
import { clearDisplacementId } from "@/store/slices/delivery"
import { LoadButton } from "@/components/global/LoadButton"

function LinearProgressWithLabel(props: { value: number }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          variant="determinate"
          sx={{
            height: 20,
            borderRadius: 10,
          }}
          {...props}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function Success() {

  const [displacement, setDisplacement] = useState<IDisplacement>({} as IDisplacement)
  const [progress, setProgress] = useState(0)
  const [isDeliveryFinished, setIsDeliveryFinished] = useState(false)
  const [error, setError] = useState('')
  const [isSending, setIsSending] = useState(false)

  const router = useRouter()
  const { id } = router.query

  const dispatch = useDispatch()

  async function getDisplacementData() {

    try {

      const response = await api.get(`/Deslocamento/${id}`)

      const { data } = response

      const displacement: IDisplacement = {
        id: data.id,
        checkList: data.checkList,
        customerId: data.idCliente,
        driverId: data.idCondutor,
        vehicleId: data.idVeiculo,
        initialKm: data.kmInicial,
        endOfDisplacement: data.fimDeslocamento,
        finalKm: data.kmFinal,
        reason: data.motivo,
        observation: data.observacao,
        startOfDisplacement: data.inicioDeslocamento
      }
      setDisplacement(displacement)

    } catch (error) {
      setDisplacement({} as IDisplacement)
    }

  }

  async function finishDisplacement() {

    setIsSending(true)

    try {

      console.log({
        id,
        kmFinal: displacement.finalKm,
        fimDeslocamento: displacement.endOfDisplacement,
        observacao: displacement.observation
      })

      const response = await api.put(`Deslocamento/${id}/EncerrarDeslocamento`, {
        id,
        kmFinal: displacement.finalKm,
        fimDeslocamento: displacement.endOfDisplacement,
        observacao: displacement.observation
      })


      if (response.status === 200) {
        setIsSending(false)
        dispatch(clearDisplacementId())
        router.push("/client/home")
      }
    } catch (error) {
      console.log(error)
      setIsSending(false)
      setError('Erro ao finalizar o deslocamento. Tente novamente')
    }

  }

  useEffect(() => {

    let timer: NodeJS.Timeout

    const startDelivery = () => {
      timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            setIsDeliveryFinished(true)
            setDisplacement(prev => {
              return {
                ...prev,
                endOfDisplacement: new Date().toISOString(),
                finalKm: prev.initialKm + 100 || 100,
                checkList: "Entregue",
              }
            })
            clearInterval(timer)
            return 100
          }
          return prevProgress + 10
        })
      }, 1000)
    }

    startDelivery()

    return () => {
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    if (!router.isReady) return;

    getDisplacementData()


  }, [router.isReady]);

  return (
    <ClientLayout>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="90vh"
        width="100%"
        paddingLeft={10}
        paddingRight={10}
      >
        <Typography variant="h5" align="center" color={
          isDeliveryFinished ? "green" : "text.primary"
        } gutterBottom>
          {isDeliveryFinished
            ? "Deslocamento finalizado"
            : "O Deslocamento está em andamento"}
        </Typography>


        <Collapse in={
          error !== ''
        }>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setError('')
                  router.push("/client/home")
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {
              `${error}. Feche esta mensagem para voltar a tela inicial.`
            }
          </Alert>
        </Collapse>
        {
          isDeliveryFinished && (
            <Grid container spacing={2} sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 5,
            }}>
              <Grid item xs={12}>
                <Typography variant="h6" align="center" gutterBottom>
                  Informações do Deslocamento
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="body1">
                  <strong>ID:</strong> {id}
                </Typography>
                <Typography variant="body1">
                  <strong>Checklist:</strong> {displacement.checkList}
                </Typography>
                <Typography variant="body1">
                  <strong>ID do Cliente:</strong> {displacement.customerId}
                </Typography>
                <Typography variant="body1">
                  <strong>ID do Condutor:</strong> {displacement.driverId}
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="body1">
                  <strong>ID do Veículo:</strong> {displacement.vehicleId}
                </Typography>
                <Typography variant="body1">
                  <strong>Km Inicial:</strong> {displacement.initialKm}
                </Typography>
                <Typography variant="body1">
                  <strong>Km Final:</strong> {displacement.finalKm}
                </Typography>
                <Typography variant="body1">
                  <strong>Motivo:</strong> {displacement.reason}
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="body1">
                  <strong>Observação:</strong> {displacement.observation}
                </Typography>
                <Typography variant="body1">
                  <strong>Início do Deslocamento:</strong> {displacement.startOfDisplacement}
                </Typography>
                <Typography variant="body1">
                  <strong>Fim do Deslocamento:</strong> {
                    new Date().toISOString()
                  }
                </Typography>
              </Grid>

              <Grid item xs={12} md={12} sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
                <LoadButton
                  isSending={isSending}
                  text="Concluir"
                  variant="contained"
                  onClick={finishDisplacement}
                />
              </Grid>
            </Grid>
          )
        }

        {!isDeliveryFinished && (
          <>

            <Grid spacing={1} container sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",

            }}>
              <Grid item xs={8}>
                <LinearProgressWithLabel value={progress} />
              </Grid>
            </Grid>


            <Typography variant="body1" align="center">
              {`Deslocamento finaliza em ${Math.floor((100 - progress) / 10)} segundos`}
            </Typography>
          </>
        )}
      </Box>
    </ClientLayout>
  )
}