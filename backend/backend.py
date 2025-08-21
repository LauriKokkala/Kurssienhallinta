import mysql.connector
import flask
from flask import Flask, jsonify, abort
import json 
from flask_cors import CORS


app = flask.Flask(__name__)
CORS(app)

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="ohjelmistoprojekti"
    )

        
ALLOWED_TABLES = {
    'kurssit',
    'opettajat',
    'opiskelijat',
    'tilat',
    'kurssikirjautumiset'
}

@app.route('/list/<table_name>')
def list_table(table_name):
    if table_name not in ALLOWED_TABLES:
        abort(404, description="Table not found")

    conn = get_db_connection()
    cursor = conn.cursor(buffered=True, dictionary=True)
    match table_name:

        case "kurssit":
            query = f"""SELECT kurssit.*, opettajat.Etunimi, opettajat.Sukunimi, tilat.TilanNimi, tilat.Kapasiteetti FROM kurssit
            INNER JOIN opettajat ON kurssit.Opettaja=opettajat.Tunnus
            INNER JOIN tilat ON kurssit.Tila=tilat.Tunnus
            """ 
        case "kurssikirjautumiset":
            query = f"""SELECT kurssikirjautumiset.*, opiskelijat.Etunimi, opiskelijat.Sukunimi, opiskelijat.Vuosikurssi, kurssit.KurssiNimi FROM kurssikirjautumiset
            INNER JOIN opiskelijat ON kurssikirjautumiset.Opiskelija=opiskelijat.Tunnus
            INNER JOIN kurssit ON kurssikirjautumiset.Kurssi=kurssit.Tunnus
            """
        case _:
            query = f"""SELECT * FROM `{table_name}`"""
    cursor.execute(query)
    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(data)

@app.post("/add/<table_name>")
def add(table_name):
    if table_name not in ALLOWED_TABLES:
        abort(404, description="Table not found")
    content = flask.request.json
    if any(not v for v in content.values()):
        abort(400, description="Please fill out all the forms")
    conn = get_db_connection()
    cursor = conn.cursor(buffered=True, dictionary=True)

    match table_name:

        case "kurssit":
            values = (
                    content["nimi"],
                    content["kuvaus"],
                    content["alku"],
                    content["loppu"],
                    content["opettaja"],
                    content["tila"]
            )   
            query = f"""INSERT INTO {table_name} (KurssiNimi, Kuvaus, Alkupaiva, Loppupaiva, Opettaja, Tila)
            VALUES (%s, %s, %s, %s, %s, %s)
            """ 
        case "kurssikirjautumiset":
            values = (
                    content["opiskelija"],
                    content["kurssi"]
            ) 
            query = f"""INSERT INTO {table_name} (Opiskelija, Kurssi)
            VALUES (%s, %s)
            """
        case "opettajat":
            values = (
                    content["etunimi"],
                    content["sukunimi"],
                    content["aine"]
            )   
            query = f"""INSERT INTO {table_name} (Etunimi, Sukunimi, Aine)
            VALUES (%s, %s, %s)
            """
        case "opiskelijat":
            values = (
                    content["etunimi"],
                    content["sukunimi"],
                    content["syntymapaiva"],
                    content["vuosikurssi"]
            )   
            query = f"""INSERT INTO {table_name} (Etunimi, Sukunimi, Syntymapaiva, Vuosikurssi)
            VALUES (%s, %s, %s, %s)
            """
        case "tilat":
            values = (
                    content["nimi"],
                    content["kapasiteetti"]
            )   
            query = f"""INSERT INTO {table_name} (TilanNimi, Kapasiteetti)
            VALUES (%s, %s)
            """

    cursor.execute(query, values)
    conn.commit()
    cursor.close()
    conn.close()

    list()
    return "kayttaja added"


@app.route("/update/<table_name>/<int:id>", methods=["PUT"])
def update(table_name, id):
    if table_name not in ALLOWED_TABLES:
        abort(404, description="Table not found")
    content = flask.request.json
    print(content)
    if not content:
        abort(400, description="Please fill out all the forms")
    if any(not v for v in content.values()):
        abort(400, description="Please fill out all the forms")
    conn = get_db_connection()
    cursor = conn.cursor(buffered=True, dictionary=True)

    match table_name:
        case "kurssit":
            values = (
                    content["nimi"],
                    content["kuvaus"],
                    content["alku"],
                    content["loppu"],
                    content["opettaja"],
                    content["tila"]
            )   
            query = f"""UPDATE {table_name} 
            SET KurssiNimi = %s, Kuvaus = %s, Alkupaiva = %s, Loppupaiva = %s, Opettaja = %s, Tila = %s
            WHERE Tunnus = {id}
            """ 
        case "kurssikirjautumiset":
            values = (
                    content["opiskelija"],
                    content["kurssi"]
            )   
            query = f"""UPDATE {table_name} 
            SET Opiskelija = %s, Kurssi = %s
            WHERE Tunnus = {id}
            """
        case "opettajat":
            values = (
                    content["etunimi"],
                    content["sukunimi"],
                    content["aine"]
            )   
            query = f"""UPDATE {table_name} 
            SET Etunimi = %s, Sukunimi = %s, Aine = %s
            WHERE Tunnus = {id}
            """
        case "opiskelijat":
            values = (
                    content["etunimi"],
                    content["sukunimi"],
                    content["syntymapaiva"],
                    content["vuosikurssi"]
            )   
            query = f"""UPDATE {table_name} 
            SET Etunimi = %s, Sukunimi = %s, Syntymapaiva = %s, Vuosikurssi = %s
            WHERE Tunnus = {id}
            """
        case "tilat":
            values = (
                    content["nimi"],
                    content["kapasiteetti"]
            )   
            query = f"""UPDATE {table_name} 
            SET TilanNimi = %s, Kapasiteetti = %s
            WHERE Tunnus = {id}
            """

            #Pyydän anteeksi tällä tavalla nimeämisestä

    cursor.execute(query, values)
    conn.commit()
    cursor.close()
    conn.close()
    
    list()
    return "Kayttaja updated :)"

@app.delete("/delete/<table_name>")
def delete(table_name):
    content = flask.request.json
    id = content["id"]
    conn = get_db_connection()
    cursor = conn.cursor(buffered=True, dictionary=True)
    query = f"""DELETE FROM {table_name} 
            WHERE Tunnus = {id}
            """

    cursor.execute(query)
    conn.commit()
    cursor.close()
    conn.close()
    list()

    return "kayttaja removed"
