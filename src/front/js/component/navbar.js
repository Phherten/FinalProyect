import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../styles/navbar.css";
import logo from "../../img/Logo_amarillo.png";

export const Navbar = () => {
  function handleClick(e) {
    e.preventDefault();
  }

  return (
    <div className="navbar-font">
      <nav className="navbar navbar-expand-lg home-navbar">
        <div className="container-fluid">
          <div className="order-0">
            <a className="navbar-brand " href="">
              <button
                className="navbar-toggler navbar-menu-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target=".dual-collapse2"
                onClick={handleClick.bind(this)}
              >
                <i className="fa fa-bars"></i>

                <span className="navbar-toggler-icon navbar-menu-button-icon"></span>
              </button>
              <img src={logo} className="navbar-logo" />
            </a>
          </div>
          <div className="navbar-collapse collapse w-100 order-1 order-lg-1 dual-collapse2">
            <ul className="navbar-nav me-auto">
              <li>
                <Link to={"/interior"}>
                  <a className="nav-link navbar-button" href="#">
                    Interior
                  </a>
                </Link>
              </li>
              <li>
                <Link to={"/exterior"}>
                  <a className="nav-link navbar-button" href="#">
                    Exterior
                  </a>
                </Link>
              </li>
              <li>
                <Link to={"/suculentas"}>
                  <a className="nav-link navbar-button" href="#">
                    Suculentas
                  </a>
                </Link>
              </li>
              <li>
                <Link to={"/cuidados"}>
                  <a className="nav-link navbar-button" href="#">
                    Cuidados
                  </a>
                </Link>
              </li>
              <li>
                <a className="nav-link navbar-button" href="#">
                  Nosotros
                </a>
              </li>
            </ul>
          </div>
          <div className="navbar-collapse collapse w-100 order-3">
            <ul className="navbar-nav ms-auto">
              <li>
                <div className="navbar-search-button">
                  <input
                    type="text"
                    placeholder="Buscar"
                    className="form-control navbar-form-control"
                  />
                  <i className="fa fa-search"></i>
                </div>
              </li>
              <li>

                <div className="btn-group ">
                  <button
                    type="button"
                    className="btn btn-secondary navbar-user-button dropdown-toggle"

                    data-bs-toggle="dropdown"
                    data-bs-display="static"
                    aria-expanded="false"
                  >
                    <i className="fa fa-user"></i>
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end navbar-user-twobuttons">
                    <li>
                      <Link to={"/login"}>
                        <button
                          className="dropdown-item navbar-button-user-login"
                          type="button"
                        >
                          Iniciar Sesión
                        </button>
                      </Link>
                    </li>
                    <li>
                      <Link to={"/registro"}>
                        <button
                          className="dropdown-item navbar-button-user-login"
                          type="button"
                        >
                          Registrarse
                        </button>
                      </Link>
                    </li>

                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};
