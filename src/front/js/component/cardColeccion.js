import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/elementos.css";
import "../../styles/cardColeccion.css";
import Hoja from "../../img/hoja.png";
import { Link } from "react-router-dom";

export const CardColeccion = (props) => {
  const { store, actions } = useContext(Context);

  const handleDelete = (event) => {
    event.preventDefault();
    actions.deletePlantById(props.plant_id);
    props.callback();
  };

  return (
    <Link
      to={"/ficha/" + props.id}
      className="card media-page-tarjetas-interior card-elemento"
      style={{ width: `17rem` }}
    >
      <img
        src={props.img}
        className="p-0 imagen-card media-page-planta-tarjetas-interior-foto"
      />
      <div className="card-body d-flex flex-column justify-content-between">
        <h2 className="text-center texto-card mt-4">{props.name} </h2>
        <h3 className="text-center texto-card mt-4">
          "{props.alias !== "" ? props.alias : "Sin alias"}"
        </h3>
        <p className="text-center texto-card mt-4" id="card-coleccion">
          Faltan{" "}
          {props.dias_por_regar > 1
            ? `${props.dias_por_regar} días`
            : `${props.dias_por_regar} día`}{" "}
          para regar
        </p>
        <Link onClick={handleDelete}>
          <div class="d-grid gap-2 m-3 pt-3">
            <button class="btn btn-secondary boton" type="button">
              <h5 className="p-1 pb-0">Eliminar</h5>
            </button>
          </div>
        </Link>
        <Link onClick={() => actions.apiTelegram()}>
          <div class="d-grid gap-2 m-3 pt-3">
            <button class="btn btn-secondary boton" type="button">
              <h5 className="p-1 pb-0">Notificar Riego Por Telegram</h5>
            </button>
          </div>
        </Link>
      </div>
    </Link>
  );
};
