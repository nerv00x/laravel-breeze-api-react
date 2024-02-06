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
    fetch("http://lapachanga-back.v2.test/api/partidos")
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
          return {
            nombreEquipo1: response1.data.nombre,
            nombreEquipo2: response2.data.nombre,
            equipo1Cuota: response1.data.cuota,
            equipo2Cuota: response2.data.cuota,
          };
        } catch (error) {
          console.error("Error obteniendo nombres de equipos:", error);
          return {
            nombreEquipo1: "Nombre no disponible",
            nombreEquipo2: "Nombre no disponible",
            equipo1Cuota: "Cuota no disponible",
            equipo2Cuota: "Cuota no disponible",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí implementa la lógica para crear la apuesta con los datos de apuestaData
    // Puedes enviar estos datos a tu API para crear la apuesta
    console.log(apuestaData);
    // Después de crear la apuesta, puedes cerrar el modal
    handleCloseModal();
  };

  const handleToggleCuota = (index) => {
    setActiveCuotaIndex(index === activeCuotaIndex ? null : index); // Si la cuota ya está activa, la desactiva; de lo contrario, la activa
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
            <Button
              className="btn text-dark"
              onClick={() => handleShowModal(index)}
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
        : ""}:{" "}
      {nombresEquipos[selectedPartidoIndex]
        ? nombresEquipos[selectedPartidoIndex].equipo1Cuota
        : ""}
    </p>
    <p>
      Cuota de{" "}
      {nombresEquipos[selectedPartidoIndex]
        ? nombresEquipos[selectedPartidoIndex].nombreEquipo2
        : ""}:{" "}
      {nombresEquipos[selectedPartidoIndex]
        ? nombresEquipos[selectedPartidoIndex].equipo2Cuota
        : ""}
    </p>
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="resultadoEquipoGanador">
        <Form.Label>Selecciona el equipo ganador</Form.Label>
        <Form.Control as="select" name="resultadoEquipoGanador" onChange={handleChange}>
          <option value={nombresEquipos[selectedPartidoIndex].nombreEquipo1}>
            {nombresEquipos[selectedPartidoIndex].nombreEquipo1}
          </option>
          <option value={nombresEquipos[selectedPartidoIndex].nombreEquipo2}>
            {nombresEquipos[selectedPartidoIndex].nombreEquipo2}
          </option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="resultado">
        <Form.Label>Selecciona el resultado</Form.Label>
        <Form.Control as="select" name="resultado" onChange={handleChange}>
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
      <Button variant="primary" type="submit">
        Crear Apuesta
      </Button>
    </Form>
  </Modal.Body>
</Modal>

    </div>
  );
};

export default PartidosActivos;
