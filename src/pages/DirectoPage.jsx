import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

const PartidosActivos = () => {
  const [partidos, setPartidos] = useState([]);
  const [nombresEquipos, setNombresEquipos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPartidoIndex, setSelectedPartidoIndex] = useState(null); // Estado para almacenar el índice del partido seleccionado
  const [apuestaData, setApuestaData] = useState({
    equipo1Cuota: "",
    equipo2Cuota: "",
    montoApostado: "",
  });
  const [activeCuotaIndex, setActiveCuotaIndex] = useState(null); // Estado para almacenar el índice de la cuota activa

  useEffect(() => {
    // Llamada a la API de Laravel para obtener los partidos activos
    fetch("http://lapachanga-back.v2.test/api/partidos/today")
      .then((response) => response.json())
      .then((data) => {
        setPartidos(data);
        obtenerNombresEquipos(data);
      })
      .catch((error) => console.error("Error fetching partidos:", error));
  }, []);

  const obtenerNombresEquipos = async (partidosData) => {
    const nombresEquiposData = await Promise.all(
      partidosData.map(async (partido) => {
        try {
          const response1 = await axios.get(
            `http://lapachanga-back.v2.test/api/equipos/${partido.equipo_id}`
          );
          const response2 = await axios.get(
            `http://lapachanga-back.v2.test/api/equipos/${partido.equipo2_id}`
          );
          const cuotaresponse = await axios.get(
            `http://lapachanga-back.v2.test/api/partidos/${partido.id}/cuotas`
          );
          return {
            nombreEquipo1: response1.data.nombre,
            nombreEquipo2: response2.data.nombre,
            equipo1Cuota: cuotaresponse.data.equipo1_cuota,
            equipo2Cuota: cuotaresponse.data.equipo2_cuota,
            hora: partido.hora // Añadir la hora del partido a los datos del equipo
          };
        } catch (error) {
          console.error("Error obteniendo nombres de equipos:", error);
          return {
            nombreEquipo1: "Nombre no disponible",
            nombreEquipo2: "Nombre no disponible",
            equipo1Cuota: "Cuota no disponible",
            equipo2Cuota: "Cuota no disponible",
            hora: "Hora no disponible" // Manejar el error de obtener la hora del partido
          };
        }
      })
    );
    setNombresEquipos(nombresEquiposData);
  };

  const handleShowModal = (index) => {
    setShowModal(true);
    setSelectedPartidoIndex(index); // Almacenar el índice del partido seleccionado
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApuestaData({ ...apuestaData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Obtener el partido seleccionado
      const partidoSeleccionado = partidos[selectedPartidoIndex];

      // Calcular ganancias
      const ganancias =
        parseFloat(apuestaData.montoApostado) *
        parseFloat(apuestaData.equipoCuota);

      // Obtener el userId del sessionStorage
      const userId = sessionStorage.getItem("userId");

      // Crear objeto de apuesta
      const nuevaApuesta = {
        gasto: 10,
        ganancias:30,
        fecha: "2024-02-07", // Hora actual del servidor
        user_id: 1, // Obtener userId del sessionStorage
        equipo_id: 1, // ID del equipo seleccionado
        sala_id: 1,// ID de las equipo seleccionado
        partido_id: 1, // ID del partido
      };

      // Enviar solicitud POST para crear la apuesta
      const response = await axios.post(
        "http://lapachanga-back.v2.test/api/apuestas",
        nuevaApuesta
      );

      // Verificar si la apuesta se creó exitosamente
      if (response.status === 201) {
        console.log("Apuesta creada exitosamente:", response.data);
        // Aquí puedes realizar cualquier otra acción necesaria, como mostrar un mensaje de éxito, actualizar la interfaz, etc.
      } else {
        console.error("Error al crear la apuesta");
        // Manejo de errores si la creación de la apuesta falla
      }
    } catch (error) {
      console.error("Error al crear la apuesta:", error);
      // Manejo de errores si ocurre algún problema durante la creación de la apuesta
    }

    // Después de crear la apuesta, puedes cerrar el modal
    handleCloseModal();
  };
  
  // Función para verificar si la hora del partido es mayor que la hora actual del servidor
  const isHoraMayorQueActual = (horaPartido) => {
    const horaPartidoDate = new Date(`2024-02-07 ${horaPartido}`); // Crear un objeto Date con la fecha del partido
    console.log(horaPartidoDate)
    const horaActual = new Date(); // Obtener la hora actual del servidor
    console.log(horaActual)
    return horaPartidoDate < horaActual; // Devolver true si la hora del partido es mayor que la hora actual
  };

  return (
    <div>
      <h1>Partidos Activos</h1>
      {partidos.map((partido, index) => (
        <Card key={partido.id} className="mb-3">
          <Card.Body>
            <Card.Title>
              {nombresEquipos[index]
                ? nombresEquipos[index].nombreEquipo1
                : "Loading..."}{" "}
              vs{" "}
              {nombresEquipos[index]
                ? nombresEquipos[index].nombreEquipo2
                : "Loading..."}
            </Card.Title>
            <Card.Text>
              Fecha: {partido.fecha}
              <br />
              Hora: {partido.hora}
            </Card.Text>
            {/* Deshabilitar el botón si la hora del partido es mayor que la hora actual */}
            <Button
              className="btn text-dark"
              onClick={() => handleShowModal(index)}
              disabled={isHoraMayorQueActual(partido.hora)}
            >
              Apostar
            </Button>
          </Card.Body>
        </Card>
      ))}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {nombresEquipos[selectedPartidoIndex]
              ? nombresEquipos[selectedPartidoIndex].nombreEquipo1
              : ""}{" "}
            vs{" "}
            {nombresEquipos[selectedPartidoIndex]
              ? nombresEquipos[selectedPartidoIndex].nombreEquipo2
              : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Cuota de{" "}
            {nombresEquipos[selectedPartidoIndex]
              ? nombresEquipos[selectedPartidoIndex].nombreEquipo1
              : ""}
            :{" "}
            {nombresEquipos[selectedPartidoIndex]
              ? nombresEquipos[selectedPartidoIndex].equipo1Cuota
              : ""}
          </p>
          <p>
            Cuota de{" "}
            {nombresEquipos[selectedPartidoIndex]
              ? nombresEquipos[selectedPartidoIndex].nombreEquipo2
              : ""}
            :{" "}
            {nombresEquipos[selectedPartidoIndex]
              ? nombresEquipos[selectedPartidoIndex].equipo2Cuota
              : ""}
          </p>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="resultadoEquipoGanador">
              <Form.Label>Selecciona el equipo ganador</Form.Label>
              <Form.Control
                as="select"
                name="resultadoEquipoGanador"
                onChange={handleChange}
              >
                <option
                  value={nombresEquipos[selectedPartidoIndex]?.nombreEquipo1}
                >
                  {nombresEquipos[selectedPartidoIndex]?.nombreEquipo1}
                </option>
                <option
                  value={nombresEquipos[selectedPartidoIndex]?.nombreEquipo2}
                >
                  {nombresEquipos[selectedPartidoIndex]?.nombreEquipo2}
                </option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="resultado">
              <Form.Label>Selecciona el resultado</Form.Label>
              <Form.Control
                as="select"
                name="resultado"
                onChange={handleChange}
              >
                <option value="3-0">3-0</option>
                <option value="3-1">3-1</option>
                <option value="3-2">3-2</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="montoApostado">
              <Form.Label>Monto a Apostar</Form.Label>
              <Form.Control
                type="number"
                name="montoApostado"
                value={apuestaData.montoApostado}
                onChange={handleChange}
                placeholder="Introduce el monto"
              />
            </Form.Group>
            <Button variant="primary btn text-dark" type="submit">
              Crear Apuesta
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PartidosActivos;
