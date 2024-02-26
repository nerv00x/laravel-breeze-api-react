import React, { useState, useEffect, useContext } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

function SuperCuota() {
    const { getApiData, postApuestas } = useContext(AuthContext);
    const [superCuotaData, setSuperCuotaData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [gasto, setGasto] = useState("");
    const [equipoNombre, setEquipoNombre] = useState("");
    const [cuotaValor, setCuotaValor] = useState("");
    const [equipoId, setEquipoId] = useState("");
    const [partidoId, setPartidoId] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const superCuotaResponse = await getApiData(
                    "http://localhost:8000/api/supercuota"
                );
                const superCuota = superCuotaResponse[0];
                setSuperCuotaData(superCuota);

                // Obtener nombre del equipo
                const equipoResponse = await getApiData(
                    `http://localhost:8000/api/equipos/${superCuota.equipo_id}`
                );
                setEquipoNombre(equipoResponse.nombre);
                setEquipoId(superCuota.equipo_id);

                // Obtener valor de la cuota
                const cuotaResponse = await getApiData(
                    `http://localhost:8000/api/cuotas/${superCuota.cuota_id}`
                );
                setCuotaValor(cuotaResponse.valor);

                setPartidoId(superCuota.partido_id);
            } catch (error) {
                console.error("Error fetching supercuota:", error);
            }
        };

        fetchData();
    }, [getApiData]);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleRealizarApuesta = () => {
        handleShowModal();
    };

    const handleSubmitApuesta = async (e) => {
        e.preventDefault();
        const user_id = sessionStorage.getItem("userId");
        const ganancias = parseFloat(gasto) * parseFloat(cuotaValor);

        const nuevaApuesta = {
            gasto: gasto.toString(),
            ganancias: ganancias.toString(),
            fecha: new Date().toISOString().split("T")[0],
            user_id: user_id,
            equipo_id: equipoId,
            sala_id: 1,
            partido_id: partidoId,
        };
        try {
            const response = await postApuestas(nuevaApuesta);
            console.log("Apuesta creada:", response);
            console.log(nuevaApuesta)
            handleCloseModal();
        } catch (error) {
            console.error("Error al crear la apuesta:", error);
        }
    };

    return (
        <>
            <Card className="bg-amber-400 text-center mt-5 ml-10">
                <Card.Body>
                    <Card.Title>Supercuota del día</Card.Title>
                    <Card.Text>
                        {superCuotaData ? (
                            <>
                                {superCuotaData.nombre}
                                <br />
                                <strong>Equipo:</strong> {equipoNombre}
                                <br />
                                <strong>Cuota:</strong> {cuotaValor}
                                <br />
                            </>
                        ) : (
                            "Cargando supercuota..."
                        )}
                    </Card.Text>
                    <Button variant="primary" onClick={handleRealizarApuesta}>Realizar Apuesta</Button>
                </Card.Body>
            </Card>
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton className="bg-red-500">
                    <Modal.Title>Realizar Apuesta</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-gray-500">
                    <div>
                        <p>
                            Nombre: {superCuotaData?.nombre}
                            <br />
                            Equipo: {equipoNombre}
                            <br />
                            Cuota: {cuotaValor}
                        </p>
                        <Form onSubmit={handleSubmitApuesta}>
                            <Form.Group controlId="gasto">
                                <Form.Label>Gasto:</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={gasto}
                                    onChange={(e) => setGasto(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">Realizar Apuesta</Button>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default SuperCuota;
