import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import "../CSS/ModalInformativo.css"; // Se asume un archivo CSS externo para estilos adicionales

export const ModalInformativo = (props) => {
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
      <Modal.Body className="modern-modal-body">
        <div className="content-container">
          {/* Imagen principal con overlay moderno */}
          {!props.informacion.foto.toLowerCase().includes("no disponible") && (
            <div className="hero-image-section">
              <div className="image-container">
                <img
                  src={props.informacion.foto || "placeholder.jpg"}
                  alt="Fotografía"
                  className="hero-image"
                />
                <div className="image-overlay">
                  <span className="image-label">Fotografía</span>
                </div>
              </div>
            </div>
          )}

          {/* Grid de información moderna */}
          <div className="info-grid">
            <div className="info-card">
              <div className="card-header">
                <div className="icon-wrapper location-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h4 className="card-title">Dirección</h4>
              </div>
              <p className="card-content">
                {props.informacion?.direccion || "No disponible"}
              </p>
            </div>

            <div className="info-card">
              <div className="card-header">
                <div className="icon-wrapper description-icon">
                  <i className="fas fa-info-circle"></i>
                </div>
                <h4 className="card-title">Descripción</h4>
              </div>
              <p className="card-content">
                {props.informacion?.descripcion || "No disponible"}
              </p>
            </div>

            {props.informacion?.link && (
              <div className="info-card link-card">
                <div className="card-header">
                  <div className="icon-wrapper link-icon">
                    <i className="fas fa-external-link-alt"></i>
                  </div>
                  <h4 className="card-title">Información adicional</h4>
                </div>
                <a
                  href={props.informacion.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modern-link"
                >
                  Ver más información
                  <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            )}

            <div className="info-badges">
              <div className="badge-item">
                <span className="badge-label">Territorio</span>
                <span className="badge territorio-badge">
                  {props.informacion?.territorio || "No disponible"}
                </span>
              </div>
              <div className="badge-item">
                <span className="badge-label">Categoría</span>
                <span className="badge categoria-badge">
                  {props.informacion?.categoria || "No disponible"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export const ModalInformativoCalle = (props) => {
  return (
    <Modal show={props.show} onHide={props.handleClose} size="lg" centered>
      <Modal.Header
        closeButton
        className="encabezadoModal"
        closeVariant="white"
      >
        <Modal.Title className="modal-title">
          {props.informacion?.name || ""}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modern-modal-body-calle">
        <div className="content-container-calle">
          {/* Header con ícono de calle */}
          <div className="calle-header">
            <div className="calle-icon-wrapper">
              <i className="fas fa-road"></i>
            </div>
            <div className="calle-title-section">
              <h3 className="calle-subtitle">Proyecto de Infraestructura</h3>
              <p className="calle-description-brief">
                Información del proyecto y estado actual
              </p>
            </div>
          </div>

          {/* Grid de información moderna */}
          <div className="info-grid-calle">
            <div className="info-card-calle">
              <div className="card-header-calle">
                <div className="icon-wrapper-calle location-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h4 className="card-title-calle">Dirección</h4>
              </div>
              <p className="card-content-calle">
                {props.informacion?.direccion || "No disponible"}
              </p>
            </div>

            <div className="info-card-calle">
              <div className="card-header-calle">
                <div className="icon-wrapper-calle description-icon">
                  <i className="fas fa-info-circle"></i>
                </div>
                <h4 className="card-title-calle">Descripción del Proyecto</h4>
              </div>
              <p className="card-content-calle description-text">
                {props.informacion?.descripcion || "No disponible"}
              </p>
            </div>

            {/* Badges para territorio y categoría */}
            <div className="info-badges-calle">
              <div className="badge-row">
                <div className="badge-item-calle">
                  <div className="badge-header">
                    <i className="fas fa-map"></i>
                    <span className="badge-label-calle">Territorio</span>
                  </div>
                  <span className="badge-calle territorio-badge-calle">
                    {props.informacion?.territorio || "No disponible"}
                  </span>
                </div>

                <div className="badge-item-calle">
                  <div className="badge-header">
                    <i className="fas fa-tools"></i>
                    <span className="badge-label-calle">Categoría</span>
                  </div>
                  <span className="badge-calle categoria-badge-calle">
                    {props.informacion?.categoria || "No disponible"}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer con estado del proyecto */}
            <div className="proyecto-status">
              <div className="status-indicator">
                <div className="status-dot"></div>
                <span className="status-text">Proyecto en desarrollo</span>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
