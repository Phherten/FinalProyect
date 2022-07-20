import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import styled from "styled-components";
import swal from "sweetalert";

export const ModalEditarAlias = (props) => {
  const { store, actions } = useContext(Context);
  const mostrar = props.estado;
  const [alias, setAlias] = useState("");
  return (
    <>
      {mostrar && (
        <Overlay>
          <ContenedorModal>
            <BotonCerrar onClick={() => actions.setModal(false)}>
              <i className="fas fa-times"></i>
            </BotonCerrar>
            <h3 className="me-5">¿Quieres editar el alias?</h3>
            <input
              type="text"
              placeholder="Introduce un alias"
              className="form-control mt-4 mb-4 p-3"
              onChange={(e) => setAlias(e.target.value)}
            ></input>

            <div className="d-grid gap-2">
              <button
                className="btn btn-secondary boton m-3"
                type="button"
                onClick={() => (
                  actions.updatePlantAlias(alias, store.modal.id),
                  swal({
                    title: "Alias guardado",
                    icon: "success",
                    button: "Aceptar",
                    timer: "1600",
                  }),
                  props.callback(),
                  actions.setModal(false, "", 0)
                )}
              >
                Editar
              </button>
            </div>
          </ContenedorModal>
        </Overlay>
      )}
    </>
  );
};

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  padding: 40px;
  align-items: center;
  justify-content: center;
  z-index: auto;
`;
const ContenedorModal = styled.div`
  width: 550px;
  min-height: 100px;
  background: #fff;
  position: relative;
  border-radius: 5px;
  box-shadow: rgba (100, 100, 111, 0.3) 0px 7px 29px 0px;
  padding: 20px;
`;

const BotonCerrar = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: #fff;
  border: none;
  width: 30px;
  height: 30px;
  transition: 0.3s ease all;
  border-radius: 5px;
  color: rgb(0, 0, 0);
`;
