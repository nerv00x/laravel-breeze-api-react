/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import { Card, Button, } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const ApuestasPage = () => {
  const user_id = sessionStorage.getItem("userId");
  const { getApiData } = useContext(AuthContext);
  const [partidos, setPartidos] = useState([]);
  const [nombresEquipos, setNombresEquipos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [partidosPerPage] = useState(5);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getApiData(
          `http://harkaitz.informaticamajada.es/api/apuestas/usuario/${user_id}`
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
            fecha: "Fecha no disponible",
            gasto: "Gasto no disponible",
            ganancias: "Ganancias no disponible",
          };
        }
        try {
          const response1 = await getApiData(
            `http://harkaitz.informaticamajada.es/api/equipos/${partido.equipo_id}`
          );

          return {
            nombreEquipo1: response1.nombre,
            fecha: partido.fecha,
            gasto: partido.gasto,
            ganancias: partido.gasto,
          };
        } catch (error) {
          console.error("Error obteniendo nombres de equipos:", error);
          return {
            nombreEquipo1: "Nombre no disponible",
            fecha: "Fecha no disponible",
            gasto: "Gasto no disponible",
            ganancias: "Ganancias no disponible",
          };
        }
      })
    );
    setNombresEquipos(nombresEquiposData);
  };

  const indexOfLastPartido = currentPage * partidosPerPage;
  const indexOfFirstPartido = indexOfLastPartido - partidosPerPage;
  const currentPartidos = partidos.slice(indexOfFirstPartido, indexOfLastPartido);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h1 className="text-white text-center mb-3">Apuestas</h1>
      {currentPartidos.map((partido, index) => (
        <Card key={partido.id} className="mb-3" id="card">
          <Card.Body>
            <Card.Title>
              {nombresEquipos[index]
                ? nombresEquipos[index].nombreEquipo1
                : "Loading..."}{" "}
            </Card.Title>
            <Card.Text>Fecha: {partido.fecha}</Card.Text>
            <Card.Text>Gasto: {partido.gasto}</Card.Text>
            <Card.Text>Ganancias: {partido.ganancias}</Card.Text>
          </Card.Body>
        </Card>
      ))}
      <div className="pagination">
        {partidos.length > partidosPerPage && (
          <React.Fragment>
            <Button
              variant="secondary"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>{" "}
            {/* Espacio extra */}
            <Button
              variant="secondary"
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastPartido >= partidos.length}
            >
              Siguiente
            </Button>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default ApuestasPage;
