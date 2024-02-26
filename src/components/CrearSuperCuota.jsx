import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import "../App.css";

function CrearSuperCuota(props) {
    const { postSupercuota } = useContext(AuthContext);
    const [superCuota, setsuperCuota] = useState({
        nombre: "",
        equipo_id: "",
        cuota_id: "",
        partido_id: "",
        resultado: "",
    });
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        setsuperCuota({ ...superCuota, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSuccessMessage("superCuota creado con éxito");
            setTimeout(() => setSuccessMessage(""), 3000);
            const nuevaSupercuota = {
                nombre: superCuota.nombre,
                equipo_id: superCuota.equipo_id,
                cuota_id: superCuota.cuota_id,
                partido_id: superCuota.partido_id,
                resultado: superCuota.resultado,
            };
            console.log(nuevaSupercuota);
            const response = await postSupercuota(nuevaSupercuota);

            if (response && response.status === "success") {
                console.log("Apuesta creada exitosamente");
            } else {
                console.log("Error al crear la apuesta");
            }
        } catch (error) {
            console.error("Error al crear la apuesta:", error);
        }
    };

    const handleCloseModal = () => {
        props.handleClose(); // Llamar a la función handleClose pasada por props
    };

    return (
        <div className="crear-superCuota-container d-flex justify-content-center align-items-center h-100">
            {successMessage && (
                <div
                    className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded absolute top-12 right-10 mt-4 ml-4"
                    role="alert"
                >
                    <strong className="font-bold">Éxito!</strong>
                    <span className="block sm:inline"> {successMessage}</span>
                </div>
            )}
            <div className="w-100 top-0">
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Crear Nuevo superCuota</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="nombre">
                                <Form.Label>Nombre:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={superCuota.nombre}
                                    onChange={handleChange}
                                    required
                                    className="w-100"
                                />
                            </Form.Group>

                            <Form.Group controlId="equipo_id">
                                <Form.Label>Equipo id:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="equipo_id"
                                    value={superCuota.equipo_id}
                                    onChange={handleChange}
                                    required
                                    className="w-100"
                                />
                            </Form.Group>

                            <Form.Group controlId="cuota">
                                <Form.Label>Cuota:</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="cuota_id"
                                    value={superCuota.cuota_id}
                                    onChange={handleChange}
                                    required
                                    className="w-100"
                                />
                            </Form.Group>
                            <Form.Group controlId="partido_id">
                                <Form.Label>Partido:</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="partido_id"
                                    value={superCuota.partido_id}
                                    onChange={handleChange}
                                    required
                                    className="w-100"
                                />
                            </Form.Group>

                            <Form.Group controlId="resultado">
                                <Form.Label>Resultado:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="resultado"
                                    value={superCuota.resultado}
                                    onChange={handleChange}
                                    required
                                    className="w-100"
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                className="btn text-dark mt-3"
                            >
                                Guardar superCuota
                            </Button>
                        </Form>
                        {/* Botón para cerrar el modal */}
                        <Button variant="secondary" className="btn text-dark mt-3" onClick={handleCloseModal}>
                            Cerrar
                        </Button>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

export default CrearSuperCuota;
