import React, { useState } from 'react';
import axios from 'axios';

function CrearPartido() {
  const [partido, setPartido] = useState({
    mapa: '',
    arbitro: '',
    equipo_id: '',
    equipo2_id: '',
    fecha: '',
    hora: '',
    puntuacion: 0,
    ganador: '',
    liga_id: ''
  });

  const handleChange = (e) => {
    setPartido({ ...partido, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://lapachanga-back.test/api/partidos', partido);
      alert('Partido creado con éxito');
      setPartido({
        mapa: '',
        arbitro: '',
        equipo_id: '',
        equipo2_id: '',
        fecha: '',
        hora: '',
        puntuacion: 0,
        ganador: '',
        liga_id: ''
      });
    } catch (error) {
      console.error('Hubo un error al crear el partido', error);
    }
  };

  return (
     <form onSubmit={handleSubmit}>
     <label>Mapa:
       <input type="text" name="mapa" value={partido.mapa} onChange={handleChange} required />
     </label>
     <label>Árbitro:
       <input type="text" name="arbitro" value={partido.arbitro} onChange={handleChange} required />
     </label>
     <label>Equipo Local (ID):
       <input type="number" name="equipo_id" value={partido.equipo_id} onChange={handleChange} required />
     </label>
     <label>Equipo Visitante (ID):
       <input type="number" name="equipo2_id" value={partido.equipo2_id} onChange={handleChange} required />
     </label>
     <label>Fecha:
       <input type="date" name="fecha" value={partido.fecha} onChange={handleChange} required />
     </label>
     <label>Hora:
       <input type="time" name="hora" value={partido.hora} onChange={handleChange} required />
     </label>
     <label>Puntuación:
       <input type="number" name="puntuacion" value={partido.puntuacion} onChange={handleChange} required />
     </label>
     
     <label>Liga (ID):
       <input type="number" name="liga_id" value={partido.liga_id} onChange={handleChange} required />
     </label>
     <button type="submit">Guardar Partido</button>
   </form>
   
  );
}

export default CrearPartido;
