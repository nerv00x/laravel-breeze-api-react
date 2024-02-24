/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CrearPartido from "../components/CrearPartido";
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
     const [showCrearPartido, setShowCrearPartido] = useState(false);
     const history = useHistory();

     useEffect(() => {
          const fetchData = async () => {
               try {
                    const data = await getApiData(
                         "http://lapachanga-back.v2.test/api/partidos/this-week"
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
                              `http://lapachanga-back.v2.test/api/equipos/${partido.equipo_id}`
                         );
                         const response2 = await getApiData(
                              `http://lapachanga-back.v2.test/api/equipos/${partido.equipo2_id}`
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
               setTimeout(() => {
                    setSuccessMessage("");
                    setShowModal(false);
                    window.location.reload();
               }, 3000);
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

     const handleClickSupercuota = () => {
          history.push("/supercuota");
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
          setShowCrearPartido(true);
     };

     const handleCloseCrearPartido = () => {
          setShowCrearPartido(false);
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
               <div
                    className="pagination flex"
                    style={{ justifyContent: "space-between", width: "100%" }}
               >
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
                    <div>
                         <Button variant="primary" onClick={handleCrearPartido}>
                              Crear Partido
                         </Button>
                         <Button variant="primary" onClick={handleClickSupercuota}>
                              SuperCuota
                         </Button>
                    </div>
               </div>
               {showCrearPartido && (
                    <CrearPartido
                         show={showCrearPartido}
                         handleClose={handleCloseCrearPartido}
                    />
               )}
          </div>
     );
};

export default PartidosActivos;
