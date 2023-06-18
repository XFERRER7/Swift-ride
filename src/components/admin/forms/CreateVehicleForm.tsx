import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { years } from '@/utils/years'


export const CreateVehicleForm = () => {

  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [placa, setPlaca] = useState('')
  const [ano, setAno] = useState('')
  const [kmAtual, setKmAtual] = useState('')

  const handleLimpar = () => {
    setMarca('')
    setModelo('')
    setPlaca('')
    setAno('')
    setKmAtual('')
  }

  const handleCadastrar = () => {
    
    console.log('Dados cadastrados:', {
      marca,
      modelo,
      placa,
      ano,
      kmAtual,
    })
  }


  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Marca"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Modelo"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Placa"
            value={placa}
            onChange={(e) => setPlaca(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Km Atual"
            value={kmAtual}
            onChange={(e) => setKmAtual(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="year-label">Ano</InputLabel>
            <Select
              labelId="year-label"
              id="year"
              value={ano}
              label="Ano"
              onChange={(e) => setAno(e.target.value)}
            >
              {
                years.map(year => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} display='flex' justifyContent='center' gap={10} marginTop={5}>
          <Button variant="contained" color="secondary" onClick={handleLimpar} sx={{
            minWidth: '100px'
          }}>
            Limpar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCadastrar}
          >
            Cadastrar
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}
