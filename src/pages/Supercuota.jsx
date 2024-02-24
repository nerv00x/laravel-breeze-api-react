import React, { useState, useEffect } from "react";
import { Card, Spinner, Button, Modal, Form } from "react-bootstrap";

const Supercuota = () => {
    const [superCuotas, setSuperCuotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedSuperCuota, setSelectedSuperCuota] = useState(null);

    useEffect(() => {
        const fetchSuperCuotas = async () => {
            try {
                const response = await fetch("http://lapachanga-back.v2.test/api/super-cuota");
                if (!response.ok) {
                    throw new Error("No se pudo obtener la información de las supercuotas");
                }
                const data = await response.json();
                setSuperCuotas(data);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener las supercuotas:", error);
                setLoading(false);
            }
        };

        fetchSuperCuotas();
    }, []);

    const handleShowModal = (supercuota) => {
        setSelectedSuperCuota(supercuota);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedSuperCuota(null);
    };

    const handleEditarSupercuota = () => {
        // Lógica para editar la supercuota seleccionada
        handleCloseModal();
    };

    const handleEliminarSupercuota = () => {
        // Lógica para eliminar la supercuota seleccionada
        handleCloseModal();
    };

    return (
        <div className="container mt-5">
            <h2>SuperCuotas</h2>
            {loading ? (
                <Spinner animation="border" role="status">
                    <span className="sr-only">Cargando...</span>
                </Spinner>
            ) : (
                <div className="row">
                    {superCuotas.map((supercuota) => (
                        <div key={supercuota.id} className="col-lg-4 mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>{supercuota.nombre}</Card.Title>
                                    <Card.Text>
                                        <strong>Equipo ID:</strong> {supercuota.equipo_id}<br />
                                        <strong>Cuota ID:</strong> {supercuota.cuota_id}
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => handleShowModal(supercuota)}>Editar</Button>{' '}
                                    <Button variant="danger" onClick={() => handleEliminarSupercuota(supercuota)}>Eliminar</Button>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
            <div className="text-center mt-4">
                <Button variant="success" onClick={() => setShowModal(true)}>Crear Supercuota</Button>
            </div>

            {/* Modal para editar supercuota */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Supercuota</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedSuperCuota && (
                        <Form>
                            <Form.Group controlId="formNombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control type="text" defaultValue={selectedSuperCuota.nombre} />
                            </Form.Group>
                            <Form.Group controlId="formEquipoID">
                                <Form.Label>Equipo ID</Form.Label>
                                <Form.Control type="text" defaultValue={selectedSuperCuota.equipo_id} />
                            </Form.Group>
                            <Form.Group controlId="formCuotaID">
                                <Form.Label>Cuota ID</Form.Label>
                                <Form.Control type="text" defaultValue={selectedSuperCuota.cuota_id} />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                    <Button variant="primary" onClick={handleEditarSupercuota}>Guardar Cambios</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Supercuota;
