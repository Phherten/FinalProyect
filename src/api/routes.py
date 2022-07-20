"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, send_from_directory

from api.models import db, Plagas, InfoPlant, User, Plant

import json 
from api.utils import generate_sitemap, APIException
import datetime #ayuda a trabajar con fecha y hora
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import requests;




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

@api.route('/user_plants', methods = ['GET'])
@jwt_required()
def get_user_plants():
    
    email = get_jwt_identity()
    user = User.get_by_email(email)
    
    user_plants = Plant.get_by_user(user.id)

    response = []
    for plant in user_plants:
        response.append(plant.serialize())   

    return jsonify(response), 200

@api.route('/plant/save', methods = ['POST'])
@jwt_required()
def add_new_plant():
    data = request.get_json()

    email = get_jwt_identity()
    user = User.get_by_email(email)

    plant = Plant(
        user_id = user.id,
        info_plant_id = data["info_plant_id"],
        alias = data["alias"],
        fecha_registro = datetime.datetime.now()
    )

    plant.save()

    return "Planta agregada a la colección", 200

@api.route('/plant/delete', methods = ['DELETE'])
@jwt_required()
def delete_plant():
    data = request.get_json()
    email = get_jwt_identity()
    user = User.get_by_email(email)
    plant = Plant.get_by_id(id=data["plant_id"])

    plant.delete()

    return "Planta eliminada de la colección", 200

@api.route('/login', methods = ['POST'])
def iniciar_sesion():
    request_body = request.get_json()
    print(request_body)
    user = User.query.filter_by(email = request_body['email']).first()
    if user:
        if user.password == request_body['password']:
            tiempo = datetime.timedelta(minutes = 60)
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

@api.route ('/recuperar/<mail>', methods = ['GET'])
def recuperar(mail):
    expira = datetime.timedelta(minutes = 10)
    access = create_access_token(identity = mail, expires_delta = expira)
    data = {
        "mail": mail,
        "mensaje": "Si el email existe, te llegará un link para resetear tu contraseña",
        "token": access
    }
    return jsonify(data)

@api.route ('/changePassword', methods = ['POST'])
@jwt_required()
def cambiar():
    identidad = get_jwt_identity()
    body = request.get_json()
    change = User.query.filter_by(email = identidad).first()
    change.password = body['password']
    db.session.commit()
    return "Contraseña cambiada"

@api.route('/notificacion_telegram', methods=['POST'])
def sendNotification():
    request_body = request.get_json()

    bot_token = "5565830618:AAHcS6I-12nfibE1Dz7-fHiFupWG2BVJfxk"
    bot_chatID = "120625919"
    msg = request_body['msg']
    send_text = 'https://api.telegram.org/bot' + bot_token + '/sendMessage?chat_id=' + bot_chatID + '&parse_mode=Markdown&text=' + msg
    response = requests.get(send_text)
    return response.json()

    sendNotification('Mensaje mandado correctamente', '✅')

@api.route('/plant/edit', methods=['POST'])
@jwt_required()
def update_plant_alias():
    request_body = request.get_json()
    user_email = get_jwt_identity()

    user = User.get_by_email(user_email)

    user_plants = user.plant
    plant_id = request_body["plant_id"]

    for user_plant in user_plants:
        if user_plant.id == plant_id:
            user_plant.alias = request_body["alias"]
            user_plant.save()
            break
    
    return "ok"
    