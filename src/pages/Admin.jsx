import React, { useState, useEffect, useContext } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import CrearPartido from "../components/CrearPartido"; // Importa el componente CrearPartido
import "../App.css";

const PartidosActivos = () => {
    const { getApiData, deleteApiData, postApiData } = useContext(AuthContext);
    const [partidos, setPartidos] = useState([]);
    const [nombresEquipos, setNombresEquipos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPartidoIndex, setSelectedPartidoIndex] = useState(null);
    const [editingPartido, setEditingPartido] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [partidosPerPage] = useState(4);
    const [showCrearPartido, setShowCrearPartido] = useState(false); // Estado para controlar la visibilidad del modal CrearPartido

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getApiData(
                    "http://lapachanga-back.test/api/partidos/this-week"
                );
                // Filtrar solo los partidos del día actual o futuros
                const currentDate = new Date().toISOString().split("T")[0];
                const filteredPartidos = data.filter(
                    (partido) => partido.fecha >= currentDate
                );
                setPartidos(filteredPartidos);
                obtenerNombresEquipos(filteredPartidos);
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
                        `http://lapachanga-back.test/api/equipos/${partido.equipo_id}`
                    );
                    const response2 = await getApiData(
                        `http://lapachanga-back.test/api/equipos/${partido.equipo2_id}`
                    );
                    const fechaHora = `${partido.fecha}T${partido.hora}`;
                    return {
                        nombreEquipo1: response1.nombre,
                        nombreEquipo2: response2.nombre,
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
        setEditingPartido(partidos[index]);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPartidoIndex(null);
        setEditingPartido(null);
    };

    const handleEditarSubmit = async (e, index) => {
        if (index < 0 || index >= partidos.length) {
            console.error("Índice de partido no válido:", index);
            return;
        }

        const partidoId = partidos[index].id.toString();
        e.preventDefault();
        try {
            await postApiData(
                `http://localhost:8000/api/partidos/update/${partidoId}`,
                editingPartido
            );
            setSuccessMessage("Partido editado con éxito");
            setTimeout(() => setSuccessMessage(""), 3000);
            setShowModal(false);
        } catch (error) {
            console.error("Error al editar el partido:", error);
        }
    };

    const handleEliminarPartido = async (index) => {
        const partidoId = partidos[index].id;
        try {
            await deleteApiData(`http://localhost:8000/api/partidos/${partidoId}`);
            setSuccessMessage("Partido eliminado con éxito");
            setTimeout(() => setSuccessMessage(""), 3000);
            setPartidos(partidos.filter((partido) => partido.id !== partidoId));
        } catch (error) {
            console.error("Error al eliminar el partido:", error);
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

    const handleCrearPartido = () => {
        setShowCrearPartido(true); // Abre el modal CrearPartido al hacer clic en "Crear Partido"
    };

    const handleCloseCrearPartido = () => {
        setShowCrearPartido(false); // Cierra el modal CrearPartido
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-white text-center mb-3">Partidos Activos</h1>
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
                <Card key={partido.id} className="mb-3 w-75" id="card">
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
                            className="btn text-dark mr-2"
                            onClick={() => handleShowModal(index)}
                        >
                            Editar
                        </Button>
                        <Button
                            className="btn text-dark"
                            onClick={() => handleEliminarPartido(index)}
                        >
                            Eliminar
                        </Button>
                    </Card.Body>
                </Card>
            ))}
            <div className="pagination flex" style={{ justifyContent: "space-between", width: "100%" }}>
                <div>
                    <Button
                        variant="secondary"
                        onClick={paginatePrev}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </Button>
                    {pageNumbers.map((pageNumber) => (
                        <button
                            key={pageNumber}
                            className={`${
                                currentPage === pageNumber
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
                <Button variant="primary" onClick={handleCrearPartido}>
                    Crear Partido
                </Button>
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Partido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => handleEditarSubmit(e, selectedPartidoIndex)}>
                        <Form.Group controlId="formFecha">
                            <Form.Label>Fecha</Form.Label>
                            <Form.Control
                                type="date"
                                name="fecha"
                                value={editingPartido ? editingPartido.fecha : ""}
                                onChange={(e) =>
                                    setEditingPartido({
                                        ...editingPartido,
                                        fecha: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="formHora">
                            <Form.Label>Hora</Form.Label>
                            <Form.Control
                                type="time"
                                name="hora"
                                value={editingPartido ? editingPartido.hora : ""}
                                onChange={(e) =>
                                    setEditingPartido({
                                        ...editingPartido,
                                        hora: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="formEquipo1">
                            <Form.Label>Equipo 1</Form.Label>
                            <Form.Control
                                type="text"
                                name="equipo1"
                                value={editingPartido ? editingPartido.equipo1 : ""}
                                onChange={(e) =>
                                    setEditingPartido({
                                        ...editingPartido,
                                        equipo1: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="formEquipo2">
                            <Form.Label>Equipo 2</Form.Label>
                            <Form.Control
                                type="text"
                                name="equipo2"
                                value={editingPartido ? editingPartido.equipo2 : ""}
                                onChange={(e) =>
                                    setEditingPartido({
                                        ...editingPartido,
                                        equipo2: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Guardar Cambios
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <CrearPartido show={showCrearPartido} handleClose={handleCloseCrearPartido} />
        </div>
    );
};

export default PartidosActivos;
