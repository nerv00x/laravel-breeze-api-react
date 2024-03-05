import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import axios from "axios"
import "../App.css";

function CrearPartido() {
  const { postApiData, postPartido } = useContext(AuthContext);
  const [partido, setPartido] = useState({
    mapa: "",
    arbitro: "",
    equipo_id: ``,
    equipo2_id: ``,
    fecha: "",
    hora: "",
    puntuacion: 0,
    ganador: "",
    liga_id: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [cardVisible, setCardVisible] = useState(true);

  const handleChange = (e) => {
    setPartido({ ...partido, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSuccessMessage("Partido creado con éxito");
      setTimeout(() => setSuccessMessage(""), 3000);
      const nuevoPartido = {
        mapa: partido.mapa,
        arbitro: partido.arbitro,
        equipo_id: partido.equipo_id.toString(),
        equipo2_id: partido.equipo2_id.toString(),
        fecha: partido.fecha,
        hora: partido.hora,
        Puntuacion: partido.puntuacion,
        ganador: partido.ganador,

        liga_id: partido.liga_id
      };
  
      console.log("Datos del partido:", nuevoPartido); // Agrega este console.log


      console.log(nuevoPartido);

      const response = await postPartido(nuevoPartido);
     
      if (response && response.status === "success") {
        console.log("Partido creada exitosamente");
      } else {
        console.log("Error al crea el partido");
      }
    } catch (error) {
      console.error("Error al crear el partido:", error);
    }
  };

  const handleCardClose = () => {
    setCardVisible(false);
  };

  return (
    <div className="crear-partido-container position-absolute start-50 top-50 translate-middle">
      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded absolute top-12 right-10 mt-4 ml-4"
          role="alert"
        >
          <strong className="font-bold">Éxito!</strong>
          <span className="block sm:inline"> {successMessage}</span>
        </div>
      )}
      <div className="w-50">
        {" "}
        {/* Contenedor con el mismo ancho que los campos del formulario */}
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Crear Nuevo Partido</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="mapa">
                <Form.Label>Mapa:</Form.Label>
                <Form.Control
                  type="text"
                  name="mapa"
                  value={partido.mapa}
                  onChange={handleChange}
                  required
                  className="w-100" // Ajusta el ancho del campo al 100% del contenedor
                />
              </Form.Group>

              {/* Repite el mismo proceso para los demás campos del formulario */}

              <Form.Group controlId="arbitro">
                <Form.Label>Árbitro:</Form.Label>
                <Form.Control
                  type="text"
                  name="arbitro"
                  value={partido.arbitro}
                  onChange={handleChange}
                  required
                  className="w-100" // Ajusta el ancho del campo al 100% del contenedor
                />
              </Form.Group>

              <Form.Group controlId="equipo_id">
                <Form.Label>Equipo Local (ID):</Form.Label>
                <Form.Control
                  type="number"
                  name="equipo_id"
                  value={partido.equipo_id}
                  onChange={handleChange}
                  required
                  className="w-100" // Ajusta el ancho del campo al 100% del contenedor
                />
              </Form.Group>

              <Form.Group controlId="equipo2_id">
                <Form.Label>Equipo Visitante (ID):</Form.Label>
                <Form.Control
                  type="number"
                  name="equipo2_id"
                  value={partido.equipo2_id}
                  onChange={handleChange}
                  required
                  className="w-100" // Ajusta el ancho del campo al 100% del contenedor
                />
              </Form.Group>

              <Form.Group controlId="fecha">
                <Form.Label>Fecha:</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha"
                  value={partido.fecha}
                  onChange={handleChange}
                  required
                  className="w-100" // Ajusta el ancho del campo al 100% del contenedor
                />
              </Form.Group>

              <Form.Group controlId="hora">
                <Form.Label>Hora:</Form.Label>
                <Form.Control
                  type="time"
                  name="hora"
                  value={partido.hora}
                  onChange={handleChange}
                  required
                  className="w-100" // Ajusta el ancho del campo al 100% del contenedor
                />
              </Form.Group>

              <Form.Group controlId="puntuacion">
                <Form.Label>Puntuación:</Form.Label>
                <Form.Control
                  type="number"
                  name="puntuacion"
                  value={partido.puntuacion}
                  onChange={handleChange}
                  required
                  className="w-100" // Ajusta el ancho del campo al 100% del contenedor
                />
              </Form.Group>

              <Form.Group controlId="ganador">
                <Form.Label>Ganador:</Form.Label>
                <Form.Control
                  type="text"
                  name="ganador"
                  value={partido.ganador}
                  onChange={handleChange}
                  className="w-100" // Ajusta el ancho del campo al 100% del contenedor
                />
              </Form.Group>

              <Form.Group controlId="liga_id">
                <Form.Label>Liga (ID):</Form.Label>
                <Form.Control
                  type="number"
                  name="liga_id"
                  value={partido.liga_id}
                  onChange={handleChange}
                  required
                  className="w-100" // Ajusta el ancho del campo al 100% del contenedor
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="btn text-dark mt-3"
              >
                Guardar Partido
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default CrearPartido;
