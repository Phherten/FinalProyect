"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, send_from_directory

from api.models import db, Plagas, InfoPlant, User, Misplantas


from api.utils import generate_sitemap, APIException
import datetime #ayuda a trabajar con fecha y hora
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/plagas', methods=['GET'])
def get_plagas():
    alluser = Plagas.query.all()
    alluser = list(map(lambda elemento: elemento.serialize(), alluser))

    return jsonify(alluser), 200

@api.route('/plants', methods=['GET'])
def obtain_plants():
    info_plants = InfoPlant.get_all()

    response = []
    for info in info_plants:
        response.append(info.serialize())

    return jsonify(response), 200


@api.route('/plants/<int:id>', methods=['GET'])
def plant_id(id):
    plant = InfoPlant.get_by_id(id)
    if plant is None:
        return 'not found', 404

    
    return jsonify(plant.serialize()), 200

    

@api.route('/search', methods=['GET'])
def search_plants():
    
    resultado = InfoPlant.get_by_name(request.args.get("nombre_parcial"))
    response = []
    for info in resultado:
        response.append(info.serialize())

    return jsonify(response) ,200

@api.route('/registro', methods = ['POST'])
def guardar_registro():
    request_body = request.get_json()
    print(request_body)
    user = User.query.filter_by(email = request_body['email']).first()

    if user is None:
        user = User(
            username = request_body['username'],
            second_name = request_body['second_name'],
            email = request_body['email'],
            password = request_body['password'],
            is_active = True
            )
        user.save()
        return "Usuario registrado"
    else:
        return "Este usuario ya existe"
    
@api.route('/login', methods = ['POST'])
def iniciar_sesion():
    request_body = request.get_json()
    print(request_body)
    user = User.query.filter_by(email = request_body['email']).first()
    if user:
        if user.password == request_body['password']:
            tiempo = datetime.timedelta(minutes = 1)
            acceso = create_access_token(identity = request_body['email'], expires_delta = tiempo)
            return jsonify ({
                "duracion": tiempo.total_seconds(),
                "mensaje": "Inicio de sesion correcto",
                "token": acceso
            })
        else:
            return jsonify({"error": "La contraseña no es correcta"})
    else:
        return jsonify({"error": "El usuario no existe"}), 400

#Bearer token
@api.route ('/privada', methods = ['GET'])
@jwt_required()
def privada():
    identidad = get_jwt_identity()
    return jsonify({"mensaje": "Tienes permiso para entrar", "permiso": True, "email": identidad})

@api.route ('/mis_plantas', methods = ['POST'])
def mis_plantas():
    request_body = request.get_json()
    print(request_body)
    misplantas = Misplantas(
            user_id = request_body['user_id'],
            plant_id = request_body['plant_id'],
            fecha_registro = request_body['fecha_registro'],
        
            )
    misplantas.save()
    return "Planta registrada"
    
    