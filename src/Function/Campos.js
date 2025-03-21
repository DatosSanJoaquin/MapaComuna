import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Col, Form, Row, Button, InputGroup } from "react-bootstrap";

function Campos() {
  return <div>Campos</div>;
}

export const CampoDropDownSearchSimple = (props) => {
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const customStyles = {
    control: (base, state) => ({
      ...base,
      height: 32,
      minHeight: 32,
      //overflow: "auto",
      fontSize: "13px",
      borderColor: "rgb(96, 94, 92)",
      "&:hover": {
        borderColor: "rgb(50, 49, 48)",
      },
      alignContent: "center",
      paddingBotton: 1,
      borderRadius: 2,
      border: "1px solid #a6a6a6 !important",
    }),
    menu: (base) => ({
      ...base,
      fontSize: "13px",
    }),
    option: (style, { data, isDisabled, isFocused, isSelected }) => ({
      ...style,
      fontSize: "13px",
      //borderBottom: "1px solid #A6A6A6",
      // paddingBottom: 50,
    }),
    multiValueLabel: (style) => ({
      ...style,
      //fontWeight: "bold",
      color: "white",

      //paddingRight: 6,
      fontSize: "12px",
      backgroundColor: "#0b5f81",
    }),
    multiValueRemove: (style) => ({
      ...style,
      //fontWeight: "bold",
      color: "white",

      //paddingRight: 6,
      fontSize: "12px",
      backgroundColor: "#0b5f81",
    }),
  };

  return (
    <Col
      md={props.PropiedadesCampo.Ancho}
      style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}
    >
      <div style={{ display: "flex" }}>
        <span
          style={{
            fontSize: "13px",
            fontWeight: "600",
            boxSizing: "border-box",
            boxShadow: "none",
            margin: "0px",
            display: "block",
            padding: "5px 0px",
            overflowWrap: "break-word",
            color: "rgb(105 101 101)",
          }}
        >
          {props.PropiedadesCampo.NombreCampo}
        </span>
        {props.PropiedadesCampo.Required && (
          <span
            style={{
              paddingLeft: "4px",
              paddingTop: "5px",
              color: "rgb(164, 38, 44)",
            }}
          >
            *
          </span>
        )}
      </div>
      <div>
        <Select
          isSearchable={props.PropiedadesCampo.IsSearchable}
          id={props.PropiedadesCampo.IdCampo}
          name={props.PropiedadesCampo.IdCampo}
          isClearable={props.PropiedadesCampo.Clearable}
          isMulti={props.PropiedadesCampo.MultiSelect}
          styles={{
            ...customStyles,
            menuPortal: (base) => ({ ...base, zIndex: 9999 }), // 🔥 Asegura que el dropdown esté visible
          }}
          placeholder={"Seleccionar"}
          options={props.PropiedadesCampo.Opciones}
          value={props.Valor}
          isDisabled={props.PropiedadesCampo.Disabled}
          menuPortalTarget={document.body} // 🔥 Permite que el menú flote sobre el panel
          onChange={(e, i) => {
            //Verificar que es un array
            //console.log("i", i.id);
            console.log("e", e);
            console.log("i", i);
            props.OnChange(e, i.name);
          }}
        />
      </div>
    </Col>
  );
};
