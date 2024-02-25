/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
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
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [partidosPerPage] = useState(4);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getApiData(
          "http://localhost:8000/api/partidos/today"
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
            `http://localhost:8000/api/equipos/${partido.equipo_id}`
          );
          const response2 = await getApiData(
            `http://localhost:8000/api/equipos/${partido.equipo2_id}`
          );
          const cuotaresponse = await getApiData(
            `http://localhost:8000/api/partidos/${partido.id}/cuotas`
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
          ? parseFloat(nombresEquipos[selectedPartidoIndex]?.equipo1Cuota) // Convertir a número
          : parseFloat(nombresEquipos[selectedPartidoIndex]?.equipo2Cuota); // Convertir a número

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
      };
      console.log(nuevaApuesta);
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






  const isHoraMayorQueActual = (horaPartido) => {
    const horaPartidoDate = new Date(`${horaPartido}`);
    const horaActual = new Date();
    return horaPartidoDate < horaActual;
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
    <div>
      <h1 className="text-black w-full text-center mb-3">Partidos Activos</h1>
      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded absolute top-12 right-10 mt-4 ml-4"
          role="alert"
        >
          <strong className="font-bold">Éxito!</strong>
          <span className="block sm:inline"> {successMessage}</span>
        </div>
      )}
      {currentPartidos.map((partido, index) => (
        <Card key={partido.id} className="bg-amber-400 text-center row col-6" id="card">
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
      <div className="pagination">
        <Button
          variant="secondary"
          onClick={paginatePrev}
          disabled={currentPage === 1}
          className="mr-3"
        >
          Anterior
        </Button>
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            className={`${currentPage === pageNumber
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
              } py-2 px-4 mx-1 rounded`}
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
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton className="bg-red-500">
          <Modal.Title>Realizar Apuesta</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-gray-500">
          <div>
            <p className="">
              {nombresEquipos[selectedPartidoIndex]?.nombreEquipo1} - Cuota:{" "}
              {nombresEquipos[selectedPartidoIndex]?.equipo1Cuota}
            </p>
            <p>
              {nombresEquipos[selectedPartidoIndex]?.nombreEquipo2} - Cuota:{" "}
              {nombresEquipos[selectedPartidoIndex]?.equipo2Cuota}
            </p>
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEquipo">
              <Form.Label className="">Seleccion equipo</Form.Label>
              <Form.Control
                as="select"
                name="resultadoEquipoGanador"
                onChange={handleChange}
                value={apuestaData.resultadoEquipoGanador}
                className="bg-blue-500"
              >
                <option value="" className="bg-blue-500">Seleccione un equipo</option>
                {selectedPartidoIndex !== null && (
                  <>
                    <option className="bg-blue-500"
                      value={nombresEquipos[selectedPartidoIndex]?.nombreEquipo1}
                    >
                      {nombresEquipos[selectedPartidoIndex]?.nombreEquipo1}
                    </option>
                    <option className="bg-blue-500"
                      value={nombresEquipos[selectedPartidoIndex]?.nombreEquipo2}
                    >
                      {nombresEquipos[selectedPartidoIndex]?.nombreEquipo2}
                    </option>
                  </>
                )}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formMonto">
              <Form.Label>Monto Apostado</Form.Label>
              <Form.Control
                type="number"
                name="montoApostado"
                onChange={handleChange}
                value={apuestaData.montoApostado}
                className="bg-blue-500"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="bg-emerald-500">
              Realizar Apuesta
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PartidosActivos;
