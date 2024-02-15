import React, { useState, useEffect, useContext } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const PartidosActivos = () => {
  const { getApiData, postApuestas } = useContext(AuthContext);
  const [partidos, setPartidos] = useState([]);
  const [nombresEquipos, setNombresEquipos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPartidoIndex, setSelectedPartidoIndex] = useState(null);
  const [apuestaData, setApuestaData] = useState({
    montoApostado: 10,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getApiData(
          "http://localhost:8000/api/partidos/this-week"
        );
        setPartidos(data);
        obtenerNombresEquipos(data);
      } catch (error) {
        console.error("Error fetching partidos:", error);
      }
    };
    fetchData();
  }, []);

  const obtenerNombresEquipos = async (partidosData) => {
    const nombresEquiposData = await Promise.all(
      partidosData.map(async (partido) => {
        if (!partido) {
          return {
            nombreEquipo1: "Nombre no disponible",
            nombreEquipo2: "Nombre no disponible",
            equipo1Cuota: "Cuota no disponible",
            equipo2Cuota: "Cuota no disponible",
            hora: "Hora no disponible",
          };
        }
        try {
          const response1 = await getApiData(
            `http://lapachanga-back.v2.test/api/equipos/${partido.equipo_id}`
          );
          const response2 = await getApiData(
            `http://lapachanga-back.v2.test/api/equipos/${partido.equipo2_id}`
          );
          const cuotaresponse = await getApiData(
            `http://lapachanga-back.v2.test/api/partidos/${partido.id}/cuotas`
          );
          return {
            nombreEquipo1: response1.nombre,
            nombreEquipo2: response2.nombre,
            equipo1Cuota: cuotaresponse.equipo1_cuota,
            equipo2Cuota: cuotaresponse.equipo2_cuota,
            hora: partido.hora,
          };
        } catch (error) {
          console.error("Error obteniendo nombres de equipos:", error);
          return {
            nombreEquipo1: "Nombre no disponible",
            nombreEquipo2: "Nombre no disponible",
            equipo1Cuota: "Cuota no disponible",
            equipo2Cuota: "Cuota no disponible",
            hora: "Hora no disponible",
          };
        }
      })
    );
    setNombresEquipos(nombresEquiposData);
  };

  const handleShowModal = (index) => {
    setShowModal(true);
    setSelectedPartidoIndex(index);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApuestaData({ ...apuestaData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const partidoSeleccionado = partidos[selectedPartidoIndex];
      const cuotaEquipoSeleccionado =
        apuestaData.resultadoEquipoGanador ===
        nombresEquipos[selectedPartidoIndex]?.nombreEquipo1
          ? nombresEquipos[selectedPartidoIndex]?.equipo1Cuota
          : nombresEquipos[selectedPartidoIndex]?.equipo2Cuota;
 
      const user_id = sessionStorage.getItem("userId")
      const equipo_id = apuestaData.resultadoEquipoGanador ===
      nombresEquipos[selectedPartidoIndex]?.nombreEquipo1
        ? partidos[selectedPartidoIndex].equipo_id
        : partidos[selectedPartidoIndex].equipo2_id;

      const ganancias = apuestaData.montoApostado * cuotaEquipoSeleccionado;

      const nuevaApuesta = {
        gasto: apuestaData.montoApostado.toString(),
        ganancias: ganancias.toString() ,
        fecha: new Date().toISOString().split("T")[0],
        user_id:user_id,
        equipo_id:equipo_id,
        sala_id: 1, 
        partido_id: partidoSeleccionado.id,
      };
      console.log(nuevaApuesta)
      const response = await postApuestas(nuevaApuesta);

      if (response && response.status === "success") {
        console.log("Apuesta creada exitosamente");
        handleCloseModal();
      } else {
        console.log("Error al crear la apuesta");
      }
    } catch (error) {
      console.error("Error al crear la apuesta:", error);
      handleCloseModal();
    }
  };

  const isHoraMayorQueActual = (horaPartido) => {
    const horaPartidoDate = new Date(`${horaPartido}`);
    const horaActual = new Date();
    return horaPartidoDate < horaActual;
  };
  console.log
  return (
    <div>
      <h1 className="bg-dark text-white">Partidos Activos</h1>
      {partidos &&
        partidos.map((partido, index) => (
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
