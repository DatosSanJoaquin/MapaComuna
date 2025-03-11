import React from "react";
import { Row, Col } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

function ModalInformativo(props) {
  return (
    <Modal show={props.show} onHide={props.handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title
          style={{
            fontFamily: "Mona Sans",
            fontSize: "20px",
            fontWeight: "400",
            lineHeight: "28px",
            color: "rgb(61, 61, 78)",
          }}
        >
          {props.informacion ? props.informacion.name : ""}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row style={{ paddingLeft: "10px", paddingRight: "10px" }}>
          <Col md={12} style={{ padding: "0px" }}>
            <p className="tituloSeccion">Fotografia</p>
            <hr />
            <p className="contenidoSeccion">
              <img src={props.informacion.foto} />
            </p>
          </Col>
          <Col md={12} style={{ padding: "0px" }}>
            <p className="tituloSeccion">Dirección</p>
            <hr />
            <p className="contenidoSeccion">
              {props.informacion ? props.informacion.direccion : ""}
            </p>
          </Col>
          <Col md={12} style={{ padding: "0px" }}>
            <p className="tituloSeccion">Link Informativo</p>
            <hr />
            <p className="contenidoSeccion">
              {props.informacion.link ? (
                <a
                  href={props ? props.informacion.link : ""}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {props.informacion ? props.informacion.link : ""}
                </a>
              ) : (
                "No disponible"
              )}
            </p>
          </Col>
          <Col md={12} style={{ padding: "0px" }}>
            <p className="tituloSeccion">Territorio</p>
            <hr />
            <p className="contenidoSeccion">
              {props.informacion ? props.informacion.territorio : ""}
            </p>
          </Col>
          <Col md={12} style={{ padding: "0px" }}>
            <p className="tituloSeccion">Categoria</p>
            <hr />
            <p className="contenidoSeccion">
              {props.informacion ? props.informacion.categoria : ""}
            </p>
          </Col>
        </Row>
        <Row></Row>
      </Modal.Body>
      {/* <Modal.Footer></Modal.Footer> */}
    </Modal>
  );
}

export default ModalInformativo;
