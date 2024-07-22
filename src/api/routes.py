from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
import hashlib

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def signup_user():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email is None or password is None:
        return jsonify({"msg": "Email and Password are required!"}), 400
    check_user = User.query.filter_by(email=email).first()
    if check_user:
        return jsonify({"msg": "User already exists!"}), 409
    hashed_password = hash_password(password)
    user = User(email=email, password=hashed_password, is_active=True)
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "User was successfully created!"}), 201

@api.route('/login', methods=['POST'])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email is None or password is None:
        return jsonify({"msg": "Email and Password are required!"}), 400
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"msg": "User doesn't exist!"}), 404
    if user.password != hash_password(password):
        return jsonify({"msg": "Invalid password"}), 401
   
    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token), 200
    
@api.route('/private')
@jwt_required()
def private():
    return jsonify({'message': 'This is a private route!'}), 200

if __name__ == '__main__':
    app.run(debug=True)

    







   
