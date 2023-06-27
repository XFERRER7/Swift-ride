import { ClientLayout } from "@/layouts/ClientLayout"
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { useState } from "react"
import { Step1 } from "@/components/client/steps/Step1"
import { api } from "@/lib/api"
import { IDriver } from "@/types/driver"
import { IVehicle } from "@/types/vehicle"
import { Step2 } from "@/components/client/steps/Step2"
import TextField from '@mui/material/TextField'
import { Step4 } from "@/components/client/steps/Step4"
import { useDispatch } from "react-redux"
import { useAppSelector } from "@/store"

interface IDeliveryProps {
  drivers: IDriver[]
  vehicles: IVehicle[]
}

const steps = ['Selecione um motorista', 'Selecione um veículo', 'Últimos detalhes', 'Em deslocamento']

export default function delivery({ drivers, vehicles }: IDeliveryProps) {

  const [activeStep, setActiveStep] = useState(0)
  const [completed, setCompleted] = useState<{
    [k: number]: boolean
  }>({})

  const client = useAppSelector(state => state.data)

  const [selectedDriver, setSelectedDriver] = useState<number | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null)
  const [observation, setObservation] = useState<string>('')

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

  const handleStep = (step: number) => () => {
    setActiveStep(step)
  }

  const handleComplete = async () => {

    try {

      const response = await api.post('/Deslocamento/IniciarDeslocamento', {
        kmInicial: 0,
        inicioDeslocamento: new Date(),
        checkList: 'Não entregue',
        motivo: 'Delivery',
        observacao: observation,
        idCondutor: selectedDriver,
        idVeiculo: selectedVehicle,
        idCliente: client.id
      })

      if(response.status === 200) {
        console.log('Deslocamento iniciado')
      }

    }
    catch (error) {
      console.log(error)
    }

    // const newCompleted = completed
    // newCompleted[activeStep] = true
    // setCompleted(newCompleted)
    // handleNext()
  }

  const handleReset = () => {
    setActiveStep(0)
    setCompleted({})
  }


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
              <StepButton color="inherit" onClick={handleStep(index)} sx={{
                fontWeight: 'bold',
                mb: 2,
                display: 'flex',
                //estilizar o primeiro filho span do StepButton
                '& span:first-child': {
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }
              }}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>


        <div>
          {/* Detalhes do deslocamento finalizados */}
          {allStepsCompleted() ? (
            <>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&aposre finished
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </>
          ) : (

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
                      selectedDriver={selectedDriver}
                      setSelectedDriver={setSelectedDriver} />
                  )
                    : activeStep === 1 ?
                      (
                        <Step2
                          vehicles={vehicles}
                          selectedVehicle={selectedVehicle}
                          setSelectedVehicle={setSelectedVehicle}
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
                              Adicione uma observação para o motorista
                            </Typography>

                            <Grid container spacing={2} sx={{ mt: 2 }}>

                              <Grid item xs={12} sm={12} sx={{}}>
                                <TextField
                                  label="Observações (opcional)"
                                  fullWidth
                                  onChange={(e) => setObservation(e.target.value)}
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
                    <Button
                      color="success"
                      variant="contained"
                      disabled={
                        activeStep !== 3 || selectedDriver === null || selectedVehicle === null
                      }
                      onClick={handleComplete}
                    >
                      {completedSteps() === totalSteps() - 1
                        ? 'Finish'
                        : 'Finalizar'}
                    </Button>
                  ))}
              </Box>
            </>
          )}
        </div>

      </Box>
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