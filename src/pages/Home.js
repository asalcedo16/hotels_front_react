import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Card, Row, Col, Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { HotelContext } from '../context/HotelContext';
import AlertMessage from "../components/AlertMessage";
import ciudadesData from '../data/ciudades.json';

const Home = () => {
  const [hoteles, setHoteles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [nit, setNit] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [ciudades, setCiudades] = useState([]);
  const [alert, setAlert] = useState({ message: "", variant: "" });

  const navigate = useNavigate();
  const { setHotel } = useContext(HotelContext);

  useEffect(() => {
    const fetchHoteles = async () => {
      try {
        const response = await api.get('hoteles');
        setHoteles(response.data);
      } catch (err) {
        setAlert({ message: 'Error al obtener los hoteles', variant: "danger" });
      } finally {
        setLoading(false);
      }
    };

    setCiudades(ciudadesData);
    
    fetchHoteles();

    
  }, []);



   const handleNavigate = (hotel, path) => {
    setHotel(hotel); // Guarda el hotel en el contexto
    setTimeout(() => navigate(path), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevoHotel = {
      nombre,
      direccion,
      nit,
      telefono,
      email,
      cantidad: parseInt(cantidad),
      ciudad,
    };

    try {
      const response = await api.post('hoteles', nuevoHotel);
      setHoteles([...hoteles, response.data]); // Agregar el nuevo hotel a la lista local
      setShowModal(false); // Cerrar el modal después de agregar el hotel
      setAlert({ message: "Hotel agregada exitosamente.", variant: "success" });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error al agregar el hotel.";
      setShowModal(false);
      setAlert({ message: errorMessage, variant: "danger" });
    }
  }

  return (
    <Container className="my-4">
      {loading && <p>Cargando...</p>}

      {alert.message && (
        <AlertMessage
          message={alert.message}
          variant={alert.variant}
          onClose={() => setAlert({ message: "", variant: "" })}
        />
      )}
      <Row className='my-4'>
        <h2>Gestion de Hoteles</h2>

      </Row>

      <Row>
        <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
          <Button
            variant="info"
            size="sm"
            onClick={() => setShowModal(true)}
          >
            Hotel
          </Button>

        </Col>
      </Row>

      <Row>
        {hoteles.map((hotel) => (
          <Col xs={12} sm={6} md={4} lg={3} key={hotel.id} className="mb-4">
            <Card className="overflow-hidden" style={{ height: 'auto', minHeight: '100%' }}>
              <Card.Body>
                <Card.Title>Hotel: {hotel.nombre}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Ciudad: {hotel.ciudad}</Card.Subtitle>
                <Card.Text>
                  <p>Capacidad de Habitaciones: {hotel.cantidad}</p>

                  <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Tipo Habitación</th>
                          <th>Acomodación</th>
                          <th>Cantidad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hotel.hotel_tipo_habitacion_acomodacion.length > 0 ?
                          hotel.hotel_tipo_habitacion_acomodacion.map((habitacion, index) => (
                            <tr key={index}>
                              <td>{habitacion.tipo_habitaciones_acomodaciones[0].tipo_habitacion.nombre}</td>
                              <td>{habitacion.tipo_habitaciones_acomodaciones[0].acomodacion.nombre}</td>
                              <td>{habitacion.cantidad}</td>
                            </tr>
                          )) :
                          <tr>
                            <td colSpan="3" className="text-center">
                              No hay habitaciones registradas
                            </td>
                          </tr>
                        }
                      </tbody>
                    </Table>
                  </div>
                </Card.Text>

                <div className="d-flex justify-content-between">

                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleNavigate(hotel, '/create-habitacion')}
                  >
                    Habitaciones
                  </Button>
                 
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>


      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Hotel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="direccion">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="nit">
              <Form.Label>NIT</Form.Label>
              <Form.Control
                type="number"  // Cambiado a 'number'
                value={nit}
                onChange={(e) => setNit(e.target.value)}
                required
                min="1"  // Asegura que el número sea mayor o igual a 1
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="telefono">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
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

            <Form.Group className="mb-3" controlId="ciudad">
              <Form.Label>Ciudad</Form.Label>
              <Form.Select
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                required
              >
                <option value="">Seleccione una ciudad</option>
                {ciudades.map((ciudadOption) => (
                  <option key={ciudadOption.id} value={ciudadOption.nombre}>
                    {ciudadOption.nombre}
                  </option>
                ))}
              </Form.Select>
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

export default Home;
