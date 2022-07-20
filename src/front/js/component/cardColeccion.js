import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/elementos.css";
import "../../styles/cardColeccion.css";
import { Link } from "react-router-dom";
import { CalendarModal } from "./CalendarModal.js";
import { ModalEditarAlias } from "../component/modalEditarAlias";
import swal from "sweetalert";

export const CardColeccion = (props) => {
  const { store, actions } = useContext(Context);

  const handleDelete = (event) => {
    event.preventDefault();
    actions.deletePlantById(props.plant_id);
    props.callback();
  };

  return (
    <div className="flex-container">
      <div className="card-privada">
        <Link to={"/ficha/" + props.id}>
          <img src={props.img} className="imagen-card-privada " />
          <div className="body-card-privada">
            <h2 className="texto-card-privada ">{props.name} </h2>
            <h3 className="texto-card-privada ">
              "{props.alias !== "" ? props.alias : "Sin alias"}"
              <Link
                onClick={() =>
                  actions.setModal(true, props.name, props.plant_id)
                }
              >
                <button class="boton-editar" type="button">
                  <i class="fas fa-pen"></i>
                </button>
              </Link>
            </h3>
            <p className="texto-card-privada " id="card-coleccion1">
              Faltan{" "}
              {props.dias_por_regar > 1
                ? `${props.dias_por_regar} días`
                : `${props.dias_por_regar} día`}{" "}
              para regar
            </p>
          </div>
        </Link>

        <div className="boton-telegram-privada">
          <CalendarModal
            mostrar={false}
            id={props.id}
            diasRiego={props.dias_por_regar}
            alias={props.alias !== "" ? props.alias : props.name}
          />
          <button
            class=" btn btn-secondary boton"
            variant="primary"
            onClick={() =>
              swal({
                title: "¿Deseas añadir una alerta de riego para esta planta?",
                buttons: ["No", "Si"],
              }).then((respuesta) => {
                if (respuesta == true) {
                  actions.sendTelegram();
                  swal({
                    text: "La notificacion se ha añadido",
                    icon: "success",
                  });
                }
              })
            }
          >
            Notificar con Telegram
          </button>
        </div>

        <Link onClick={handleDelete}>
          <div class="boton-eliminar-privada">
            <button class="btn btn-secondary boton" type="button">
              Eliminar
            </button>
          </div>
        </Link>
      </div>
      <ModalEditarAlias
        estado={store.modal.estado}
        callback={props.callback}
      ></ModalEditarAlias>
    </div>
  );
};
