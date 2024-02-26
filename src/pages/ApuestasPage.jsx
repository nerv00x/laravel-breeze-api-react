/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import { Card, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const ApuestasPage = () => {
  const user_id = sessionStorage.getItem("userId");
  const { getApiData } = useContext(AuthContext);
  const [partidos, setPartidos] = useState([]);
  const [nombresEquipos, setNombresEquipos] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [partidosPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getApiData(
          `http://locahost:8000/api/apuestas/usuario/${user_id}`
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
    const nombresEquiposData = {};
    await Promise.all(
      partidosData.map(async (partido) => {
        if (!partido) {
          return;
        }
        try {
          const response1 = await getApiData(
            `http://locahost:8000/api/equipos/${partido.equipo_id}`
          );
          nombresEquiposData[partido.equipo_id] = response.nombre;
        } catch (error) {
          console.error("Error obteniendo nombres de equipos:", error);
          nombresEquiposData[partido.equipo_id] = "Nombre no disponible";
        }
      })
    );
    setNombresEquipos(nombresEquiposData);
  };

  const filtrarPartidosPorDia = () => {
    const fechaActual = new Date().toISOString().split("T")[0]; // Obtener la fecha actual en formato YYYY-MM-DD
    const partidosDelDia = partidos.filter(partido => partido.fecha === fechaActual);
    const otrosPartidos = partidos.filter(partido => partido.fecha !== fechaActual);
    return [...partidosDelDia, ...otrosPartidos];
  };

  const indexOfLastPartido = currentPage * partidosPerPage;
  const indexOfFirstPartido = indexOfLastPartido - partidosPerPage;
  const currentPartidos = filtrarPartidosPorDia().slice(indexOfFirstPartido, indexOfLastPartido);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container-fluid" style={{ backgroundColor: '#898989' }}> 
      {currentPartidos.map((partido) => {
        const nombreEquipo = nombresEquipos[partido.equipo_id] || "Nombre no disponible";

        return (
          <Card key={partido.id} className="mb-2 mr-5 ml-5" id="card" style={{ backgroundColor: "#198754" }}>
            <Card.Body>
              <Card.Title>
                {nombreEquipo}
              </Card.Title>
              <Card.Text>Fecha: {partido.fecha}</Card.Text>
              <Card.Text>Gasto: {partido.gasto}</Card.Text>
              <Card.Text>Ganancias: {partido.ganancias}</Card.Text>
            </Card.Body>
          </Card>
        );
      })}
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
              className="mr-2"
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
