import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import "../CSS/ModalInformativo.css"; // Se asume un archivo CSS externo para estilos adicionales

function ModalInformativo(props) {
  return (
    <Modal show={props.show} onHide={props.handleClose} size="lg" centered>
      <Modal.Header
        closeButton
        className="encabezadoModal"
        closeVariant="white"
      >
        <Modal.Title className="modal-title">
          {props.informacion ? props.informacion.name : ""}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {props.informacion.foto.toLowerCase().includes("no disponible") ? (
            ""
          ) : (
            <Col md={5} className="foto-container">
              <p className="titulo-seccion">Fotografía</p>
              <hr className="divider-Imagen" />
              <div className="foto-wrapper">
                <img
                  src={props.informacion.foto || "placeholder.jpg"}
                  alt="Fotografía"
                  className="foto"
                />
              </div>
            </Col>
          )}
          {/* Columna izquierda - Fotografía */}

          {/* Columna derecha - Información */}
          <Col
            md={
              props.informacion.foto.toLowerCase().includes("no disponible")
                ? 12
                : 7
            }
            className="info-container"
          >
            <div className="info-item">
              <p className="titulo-seccion">Dirección</p>
              <hr className="divider" />
              <p className="contenido-seccion">
                {props.informacion?.direccion || "No disponible"}
              </p>
            </div>
            <div className="info-item">
              <p className="titulo-seccion">Descripción</p>
              <hr className="divider" />
              <p className="contenido-seccion">
                {props.informacion?.descripcion || "No disponible"}
              </p>
            </div>
            <div className="info-item">
              <p className="titulo-seccion">Link Informativo</p>
              <hr className="divider" />
              <p className="contenido-seccion">
                {props.informacion?.link ? (
                  <a
                    href={props.informacion.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="info-link"
                  >
                    {props.informacion.link}
                  </a>
                ) : (
                  "No disponible"
                )}
              </p>
            </div>
            <div className="info-item">
              <p className="titulo-seccion">Territorio</p>
              <hr className="divider" />
              <p className="contenido-seccion">
                {props.informacion?.territorio || "No disponible"}
              </p>
            </div>
            <div className="info-item">
              <p className="titulo-seccion">Categoría</p>
              <hr className="divider" />
              <p className="contenido-seccion">
                {props.informacion?.categoria || "No disponible"}
              </p>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default ModalInformativo;
