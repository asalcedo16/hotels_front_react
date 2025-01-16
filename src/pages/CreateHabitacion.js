import React, { useEffect, useState, useContext } from "react";
import { Modal, Button, Form, Table, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { HotelContext } from "../context/HotelContext";
import AlertMessage from "../components/AlertMessage";


const CreateHabitacion = () => {
  const { hotel } = useContext(HotelContext);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [habitaciones, setHabitaciones] = useState([]);
  const [tipoHabitaciones, setTipoHabitaciones] = useState([]);
  const [habitacionesAcomodaciones, setHabitacionesAcomodaciones] = useState([]);
  const [filteredAcomodaciones, setFilteredAcomodaciones] = useState([]);
  const [selectedTipoHabitacion, setSelectedTipoHabitacion] = useState("");
  const [selectedAcomodacion, setSelectedAcomodacion] = useState("");
  const [cantidad, setCantidad] = useState("");

  const [alert, setAlert] = useState({ message: "", variant: "" });
 

  useEffect(() => {
    if (Array.isArray(hotel) && hotel.length === 0) {
      navigate("/"); // Redirige a la página principal
    }
  }, [hotel, navigate]);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [habitacionesResponse, tipoHabitacionesResponse, acomodacionesResponse] =
          await Promise.all([
            api.get(`hoteles/${hotel.id}/habitaciones`),
            api.get("habitaciones"),
            api.get("habitaciones/acomodaciones"),
          ]);
        setHabitaciones(habitacionesResponse.data);
        setTipoHabitaciones(tipoHabitacionesResponse.data);
        setHabitacionesAcomodaciones(acomodacionesResponse.data);
      } catch (err) {
        setAlert({
          message: "Error al cargar los datos. Intente nuevamente.",
          variant: "danger",
        });
      } 
    };
    fetchData();
  }, [hotel.id]);

  // Filtrar acomodaciones
  useEffect(() => {
    if (selectedTipoHabitacion) {
      const filtered = habitacionesAcomodaciones.filter(
        (habitacion) => habitacion.tipo_habitacion.id === parseInt(selectedTipoHabitacion)
      );
      setFilteredAcomodaciones(filtered);
    } else {
      setFilteredAcomodaciones([]);
    }
  }, [selectedTipoHabitacion, habitacionesAcomodaciones]);

  if (!hotel) {
    return <p>No se seleccionó un hotel. Por favor, vuelve a la página anterior.</p>;
  }

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newHabitacion = {
        hotel_id: hotel.id,
        tipo_habitacion_acomodacion_id: selectedAcomodacion,
        cantidad: parseInt(cantidad),
      };
      const response = await api.post("hoteles/habitaciones", newHabitacion);
      setHabitaciones((prev) => [...prev, response.data]);
      setAlert({ message: "Habitación agregada exitosamente.", variant: "success" });
      
      setSelectedTipoHabitacion("");
      setSelectedAcomodacion("");
      setCantidad("");
      
      setShowModal(false);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Error al agregar la habitación.";
      setShowModal(false);
      setAlert({ message: errorMessage, variant: "danger" });
    }
  };

  return (
    <Container className="container mt-4">
      <h1>Gestión de Habitaciones - Hotel: {hotel.nombre}</h1>

      
      {alert.message && (
        <AlertMessage
          message={alert.message}
          variant={alert.variant}
          onClose={() => setAlert({ message: "", variant: "" })}
        />
      )}

      {/* Botón para abrir el modal */}
      <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
        Agregar
      </Button>

      {/* Tabla de habitaciones */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Tipo de Habitación</th>
            <th>Acomodación</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {habitaciones.length > 0 ? (
            habitaciones.map((habitacion) => (
              <tr key={habitacion.id}>
                <td>{habitacion.tipo_habitaciones_acomodaciones[0].tipo_habitacion.nombre}</td>
                <td>{habitacion.tipo_habitaciones_acomodaciones[0].acomodacion.nombre}</td>
                <td>{habitacion.cantidad}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No hay habitaciones registradas
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Habitación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="tipoHabitacion">
              <Form.Label>Tipo de Habitación</Form.Label>
              <Form.Select
                value={selectedTipoHabitacion}
                onChange={(e) => setSelectedTipoHabitacion(e.target.value)}
                required
              >
                <option value="">Seleccione un tipo</option>
                {tipoHabitaciones.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="acomodacion">
              <Form.Label>Acomodación</Form.Label>
              <Form.Select
                value={selectedAcomodacion}
                onChange={(e) => setSelectedAcomodacion(e.target.value)}
                required
                disabled={!filteredAcomodaciones.length}
              >
                <option value="">Seleccione una acomodación</option>
                {filteredAcomodaciones.map((acomodacion) => (
                  <option key={acomodacion.id} value={acomodacion.id}>
                    {acomodacion.acomodacion.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="cantidad">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" className="ms-2">
                Guardar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CreateHabitacion;
