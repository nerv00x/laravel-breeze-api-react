/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { Card, Button, Modal, Form, Col, Row } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import SuperCuota from "../components/SuperCuota";
import Sidebar from "../components/sidebar"; // Corrección en la importación del componente Sidebar
import "../App.css";

const PartidosActivos = () => {
  const { getApiData, postApuestas } = useContext(AuthContext);
  const [partidos, setPartidos] = useState([]);
  const [nombresEquipos, setNombresEquipos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPartidoIndex, setSelectedPartidoIndex] = useState(null);
  const [apuestaData, setApuestaData] = useState({
    montoApostado: 10,
    resultadoEquipoGanador: "",
    resultado: "3-0",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [partidosPerPage] = useState(4);
  const [successMessage, setSuccessMessage] = useState("");
  const [superCuota, setSuperCuota] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getApiData(
          "https://harkaitz.informaticamajada.es/api/partidos/today"
        );
        setPartidos(data); // Corrección en la asignación de datos a partidos
        obtenerNombresEquipos(data); // Pasamos data directamente a la función obtenerNombresEquipos
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
            fechaHora: "Fecha y hora no disponibles",
          };
        }
        try {
          const response1 = await getApiData(
            `http://localhost:8000/api/equipos/${partido.equipo_id}`
          );
          const response2 = await getApiData(
            `http://localhost:8000/api/equipos/${partido.equipo2_id}`
          );
          const cuotaresponse = await getApiData(
            `http://localhost:8000/api/partidos/${partido.id}/cuotas`
          );
          const fechaHora = `${partido.fecha}T${partido.hora}`;
          return {
            nombreEquipo1: response1.nombre,
            nombreEquipo2: response2.nombre,
            equipo1Cuota: cuotaresponse.equipo1_cuota,
            equipo2Cuota: cuotaresponse.equipo2_cuota,
            fechaHora: fechaHora,
          };
        } catch (error) {
          console.error("Error obteniendo nombres de equipos:", error);
          return {
            nombreEquipo1: "Nombre no disponible",
            nombreEquipo2: "Nombre no disponible",
            equipo1Cuota: "Cuota no disponible",
            equipo2Cuota: "Cuota no disponible",
            fechaHora: "Fecha y hora no disponibles",
          };
        }
      })
    );
    setNombresEquipos(nombresEquiposData);
  };

  const handleShowModal = (index) => {
    setSelectedPartidoIndex(index);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPartidoIndex(null);
  };

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

      const user_id = sessionStorage.getItem("userId");
      const equipo_id =
        apuestaData.resultadoEquipoGanador ===
        nombresEquipos[selectedPartidoIndex]?.nombreEquipo1
          ? partidos[selectedPartidoIndex].equipo_id
          : partidos[selectedPartidoIndex].equipo2_id;

      const ganancias = apuestaData.montoApostado * cuotaEquipoSeleccionado;

      const nuevaApuesta = {
        gasto: apuestaData.montoApostado.toString(),
        ganancias: ganancias.toString(),
        fecha: new Date().toISOString().split("T")[0],
        user_id: user_id,
        equipo_id: equipo_id,
        sala_id: 1,
        partido_id: partidoSeleccionado.id,
        resultado: apuestaData.resultado,
      };
      const response = await postApuestas(nuevaApuesta);
      setSuccessMessage("Apuesta creada con éxito");
      setTimeout(() => setSuccessMessage(""), 3000);

      if (response && response.status === "success") {
        console.log("Apuesta creada exitosamente");
        handleCloseModal();
      } else {
        console.log("Error al crear la apuesta");
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error al crear la apuesta:", error);
      handleCloseModal();
    }
  };

  const isHoraMayorQueActual = (fechaHoraPartido) => {
    const [fecha, hora] = fechaHoraPartido.split("T");
    const [año, mes, dia] = fecha.split("-");
    const [horaPartido] = hora.split(":");
    const fechaHoraPartidoDate = new Date(año, mes - 1, dia, horaPartido);
    const horaActual = new Date();
    return horaActual > fechaHoraPartidoDate;
  };

  const comparePartidos = (partidoA, partidoB) => {
    const esHoraMayorPartidoA = isHoraMayorQueActual(
      `${partidoA.fecha}T${partidoA.hora}`
    );
    const esHoraMayorPartidoB = isHoraMayorQueActual(
      `${partidoB.fecha}T${partidoB.hora}`
    );

    if (esHoraMayorPartidoA && !esHoraMayorPartidoB) {
      return 1; // Mover partidoA después de partidoB
    } else if (!esHoraMayorPartidoA && esHoraMayorPartidoB) {
      return -1; // Mover partidoA antes de partidoB
    } else {
      return 0; // No cambiar el orden entre partidoA y partidoB
    }
  };

  const indexOfLastPartido = currentPage * partidosPerPage;
  const indexOfFirstPartido = indexOfLastPartido - partidosPerPage;
  const currentPartidos = partidos.slice(
    indexOfFirstPartido,
    indexOfLastPartido
  );

  const totalPages = Math.ceil(partidos.length / partidosPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleClickPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginateNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const paginatePrev = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        <div className="col-md-7">
          <h1 className="text-center mb-4">Partidos Activos</h1>
          {successMessage && (
            <div
              className="alert alert-success alert-dismissible fade show"
              role="alert"
            >
              <strong>Éxito!</strong> {successMessage}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
              ></button>
            </div>
          )}
          {currentPartidos.sort(comparePartidos).map((partido, index) => (
            <Card key={partido.id} className="mb-6">
              <Card.Body>
                <Card.Title className="text-center mb-4">
                  {nombresEquipos[index]
                    ? `${nombresEquipos[index].nombreEquipo1} vs ${nombresEquipos[index].nombreEquipo2}`
                    : "Loading..."}
                </Card.Title>
                <Card.Text>
                  <strong>Fecha:</strong> {partido.fecha}
                  <br />
                  <strong>Hora:</strong> {partido.hora}
                  <br />
                  {index === currentPartidos.length - 1 && superCuota && (
                    <>
                      <strong>Supercuota del día:</strong>
                      <br />
                      Nombre: {superCuota.nombre}
                      <br />
                      Equipo ID: {superCuota.equipo_id}
                      <br />
                      Cuota ID: {superCuota.cuota_id}
                      <br />
                      Partido ID: {superCuota.partido_id}
                    </>
                  )}
                </Card.Text>
                <Button
                  className="btn text-dark bg-success w-100"
                  onClick={() => handleShowModal(index)}
                  disabled={isHoraMayorQueActual(
                    `${partido.fecha}T${partido.hora}`
                  )}
                >
                  Apostar
                </Button>
              </Card.Body>
            </Card>
          ))}
          <div className="mt-4">
            <div className="d-flex justify-content-center">
              <Button
                variant="secondary"
                onClick={paginatePrev}
                disabled={currentPage === 1}
                className="me-2"
              >
                Anterior
              </Button>
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  className={`btn ${
                    currentPage === pageNumber
                      ? "btn-primary"
                      : "btn-secondary"
                  } me-2`}
                  onClick={() => handleClickPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
              <Button
                variant="secondary"
                onClick={paginateNext}
                disabled={indexOfLastPartido >= partidos.length}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <SuperCuota />
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal} className="mt-5">
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Realizar Apuesta</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Equipo</Form.Label>
              <Form.Control
                as="select"
                name="resultadoEquipoGanador"
                onChange={handleChange}
                value={apuestaData.resultadoEquipoGanador}
              >
                {nombresEquipos[selectedPartidoIndex] && (
                  <>
                    <option>
                      {nombresEquipos[selectedPartidoIndex].nombreEquipo1} -{" "}
                      Cuota: {nombresEquipos[selectedPartidoIndex].equipo1Cuota}
                    </option>
                    <option>
                      {nombresEquipos[selectedPartidoIndex].nombreEquipo2} -{" "}
                      Cuota: {nombresEquipos[selectedPartidoIndex].equipo2Cuota}
                    </option>
                  </>
                )}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cuota</Form.Label>
              <Form.Control
                type="text"
                value={
                  apuestaData.resultadoEquipoGanador ===
                  nombresEquipos[selectedPartidoIndex]?.nombreEquipo1
                    ? nombresEquipos[selectedPartidoIndex]?.equipo1Cuota
                    : nombresEquipos[selectedPartidoIndex]?.equipo2Cuota
                }
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Resultado</Form.Label>
              <Form.Control
                as="select"
                name="resultado"
                onChange={handleChange}
                value={apuestaData.resultado}
              >
                <option value="3-0">3-0</option>
                <option value="3-1">3-1</option>
                <option value="3-2">3-2</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Monto Apostado</Form.Label>
              <Form.Control
                type="number"
                name="montoApostado"
                value={apuestaData.montoApostado}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Apostar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PartidosActivos;
