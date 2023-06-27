import { ClientLayout } from "@/layouts/ClientLayout"
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Snackbar from '@mui/material/Snackbar'
import SnackbarContent from '@mui/material/SnackbarContent'
import { useEffect, useState } from "react"
import { Step1 } from "@/components/client/steps/Step1"
import { api } from "@/lib/api"
import { IDriver } from "@/types/driver"
import { IVehicle } from "@/types/vehicle"
import { Step2 } from "@/components/client/steps/Step2"
import TextField from '@mui/material/TextField'
import { Step4 } from "@/components/client/steps/Step4"
import { useDispatch } from "react-redux"
import { useAppSelector } from "@/store"
import { clearDelivery, setCurrentKm, setObservations, setReason } from "@/store/slices/delivery"
import { useRouter } from "next/router"
import { LoadButton } from "@/components/global/LoadButton"

interface IDeliveryProps {
  drivers: IDriver[]
  vehicles: IVehicle[]
}

const steps = ['Selecione um motorista', 'Selecione um veículo', 'Últimos detalhes', 'Em deslocamento']

export default function delivery({ drivers, vehicles }: IDeliveryProps) {

  const [isSending, setIsSending] = useState(false)
  const [messageErrorOnRequest, setMessageErrorOnRequest] = useState<'success' | 'error' | ''>('')
  const [activeStep, setActiveStep] = useState(0)
  const [completed, setCompleted] = useState<{
    [k: number]: boolean
  }>({})


  const { push } = useRouter()
  const client = useAppSelector(state => state.client.data)
  const deliveryInfo = useAppSelector(state => state.delivery)
  const dispatch = useDispatch()

  const totalSteps = () => {
    return steps.length
  }
  const completedSteps = () => {
    return Object.keys(completed).length
  }
  const isLastStep = () => {
    return activeStep === totalSteps() - 1
  }
  const allStepsCompleted = () => {
    return completedSteps() === totalSteps()
  }
  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ?
        steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1
    setActiveStep(newActiveStep)
  }
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleComplete = async () => {

    setIsSending(true)

    try {

      const response = await api.post('/Deslocamento/IniciarDeslocamento', {
        kmInicial: deliveryInfo.currentKm || 0,
        inicioDeslocamento: new Date(),
        checkList: 'Não entregue',
        motivo: deliveryInfo.reason,
        observacao: deliveryInfo.observations || '',
        idCondutor: deliveryInfo.driverId || 0,
        idVeiculo: deliveryInfo.vehicleId || 0,
        idCliente: client.id || 0,
      })

      if (response.status === 200) {

        setIsSending(false)
        dispatch(clearDelivery())
        push('/client/success')

      }

    }
    catch (error) {
      dispatch(clearDelivery())
      setMessageErrorOnRequest('error')
      setIsSending(false)
      setActiveStep(0)
    }

  }


  useEffect(() => {

    dispatch(setReason('Delivery'))

  }, [])

  return (
    <ClientLayout>
      <Box sx={{
        p: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>

        <Stepper nonLinear activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton color="inherit" sx={{
                fontWeight: 'bold',
                mb: 2,
                display: 'flex',
                //estilizar o primeiro filho span do StepButton
                '& span:first-child': {
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '50px',
                  gap: 1,
                  fontSize: {
                    xs: '0.7rem',
                    sm: '0.8rem',
                  }
                }
              }}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>


        <div>

          {
            (

              // Conteúdo do passo atual
              <>
                <Box sx={{
                  mb: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: {
                    sx: '100%',
                  },
                }}>

                  {/* Conteúdo do passo 1 */}
                  {
                    activeStep === 0 ? (
                      <Step1
                        drivers={drivers}
                      />
                    )
                      : activeStep === 1 ?
                        (
                          <Step2
                            vehicles={vehicles}
                          />
                        )
                        : activeStep === 2 ?
                          (
                            <Box sx={{
                              width: {
                                sm: '90%',
                                md: '500px',
                              },
                              overflowY: 'scroll',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              scrollbarWidth: 'thin',
                              '&::-webkit-scrollbar': {
                                height: '8px',
                                width: '8px',
                              },
                              '&::-webkit-scrollbar-thumb': {
                                background: '#374151',
                                borderRadius: '5px',
                              }
                            }}>

                              <Typography variant="body1" component="h6" fontWeight='semibold' color='GrayText'>
                                - Adicione uma observação para o motorista e informe em que KM você está, que ele irá até seu endereço.
                              </Typography>
                              <Typography variant="body1" component="h6" fontWeight='semibold' color='GrayText'>
                                - O conteúdo da encomenda só precisa ser informado ao motorista quando ele chegar no endereço de entrega.
                              </Typography>

                              <Grid container spacing={2} sx={{ mt: 2 }}>

                                <Grid item xs={12} sm={12} sx={{}}>
                                  <TextField
                                    label="Observações (opcional)"
                                    fullWidth
                                    onChange={(e) => dispatch(setObservations(e.target.value))}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={12} sx={{}}>
                                  <TextField
                                    label="Km correspondente a seu endereço"
                                    fullWidth
                                    type="number"
                                    onChange={(e) => dispatch(setCurrentKm(Number(e.target.value)))}
                                    error={
                                      deliveryInfo.currentKm &&
                                      deliveryInfo.currentKm < 0 ||
                                      deliveryInfo.currentKm === undefined
                                    }
                                    helperText={
                                      deliveryInfo.currentKm &&
                                        deliveryInfo.currentKm < 0 ?
                                        'O valor não pode ser negativo' : ''
                                    }
                                  />
                                </Grid>
                              </Grid>

                            </Box>
                          )
                          : (
                            <Step4 />
                          )
                  }

                </Box>



                <Box sx={{
                  display: 'flex', flexDirection: 'row', pt: 2, gap: {
                    sx: 2,
                    md: 5,
                  }
                }}>




                  {/* Botão de voltar */}
                  <Button
                    color="error"
                    variant="contained"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Voltar
                  </Button>


                  <Box sx={{ flex: '1 1 auto' }} />




                  {/* Botão de avançar */}
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={activeStep === 3}
                    onClick={handleNext}
                    sx={{ mr: 1 }}>
                    Próximo
                  </Button>
                  {activeStep !== steps.length &&
                    (completed[activeStep] ? (
                      <Typography variant="caption" sx={{ display: 'inline-block' }}>
                        Step {activeStep + 1} already completed
                      </Typography>
                    ) : (


                      // Botão de finalizar
                      <LoadButton
                        isSending={isSending}
                        text="Finalizar"
                        color="success"
                        variant="contained"
                        disabled={
                          activeStep !== 3 ||
                          deliveryInfo.driverId === null ||
                          deliveryInfo.vehicleId === null ||
                          deliveryInfo.currentKm === undefined
                        }
                        onClick={handleComplete}
                      />
                    ))}
                </Box>
              </>
            )}
        </div>

      </Box>


      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={
         messageErrorOnRequest !== ''
        }
        autoHideDuration={2000}
        onClose={() => {
          setMessageErrorOnRequest('')
        }}
      >
        <SnackbarContent
          style={{
            backgroundColor: messageErrorOnRequest === 'success' ? '#4caf50' :
              messageErrorOnRequest === 'error' ? '#f44336' : '',
          }}
          message={
            messageErrorOnRequest === 'success' ? 
            'Entrega cadastrada com sucesso!' :
            messageErrorOnRequest === 'error' ?
            'Erro ao cadastrar entrega!' : ''
          }
        />
      </Snackbar>
      
    </ClientLayout>
  )
}


export const getServerSideProps = async () => {

  const drivers: IDriver[] = []
  const vehicles: IVehicle[] = []

  const responseDrivers = await api.get('/Condutor')
  responseDrivers.data.map((driver: any) => {

    const newDriver: IDriver = {
      id: driver.id,
      name: driver.nome,
      driverLicenseCategory: driver.catergoriaHabilitacao,
      driverLicenseExpiration: driver.vencimentoHabilitacao,
      driverLicenseNumber: driver.numeroHabilitacao,
    }

    drivers.push(newDriver)

  })



  const responseVehicles = await api.get('/Veiculo')

  responseVehicles.data.map((vehicle: any) => {

    const newVehicle: IVehicle = {
      id: vehicle.id,
      brandModel: vehicle.marcaModelo,
      currentKm: vehicle.kmAtual,
      licensePlate: vehicle.placa,
      manufacturingYear: vehicle.anoFabricacao
    }

    vehicles.push(newVehicle)

  })

  return {
    props: {
      drivers,
      vehicles
    },
  }
}