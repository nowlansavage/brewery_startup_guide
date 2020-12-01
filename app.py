import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect
import sqlite3
import pandas as pd
from flask import Flask, jsonify
from flask_cors import CORS

engine = create_engine("sqlite:///beer_project.sqlite")
conn = engine.connect()

Base = automap_base()
Base.prepare(engine, reflect=True)
Base.classes.keys()

# Save references to each table
# beer_advocate = Base.classes.Beer_Advocate
brewers_association = Base.classes.Brewers_Association
city_pop_brew_count = Base.classes.City_Pop_Brew_Count
rate_beer = Base.classes.Rate_Beer
model_train = Base.classes.model_train
model_test = Base.classes.model_test
words = Base.classes.words

app = Flask(__name__)
CORS(app)


@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        # f"/Beer_Advocate<br/>"
        f"/Brewers_Association<br/>"
        f"/City_Pop_Brew_Count<br/>"
        f"/Rate_Beer<br/>"
        f"/Model_Train<br/>"
        f"/Model_Test<br/>"
        f"Model_Words"
    )

# @app.route("/Beer_Advocate")
# def Beer_Advocate():

#     # Create our session (link) from Python to the DB
#     session = Session(engine)


#     results = session.query(beer_advocate).all()

#     returned=[result.__dict__ for result in results]
#     new_list=[]
#     for each_dict in returned: 
#         new_dict={}
#         for each_key in each_dict:
#             if not each_key=='_sa_instance_state': 
#                 new_dict[each_key]=each_dict[each_key]
#         new_list.append(new_dict)

#     session.close()


#     return jsonify(new_list)

@app.route("/Brewers_Association")
def Brewers_Association():

    # Create our session (link) from Python to the DB
    session = Session(engine)


    results = session.query(brewers_association).all()

    returned=[result.__dict__ for result in results]
    new_list=[]
    for each_dict in returned: 
        new_dict={}
        for each_key in each_dict:
            if not each_key=='_sa_instance_state': 
                new_dict[each_key]=each_dict[each_key]
        new_list.append(new_dict)

    session.close()


    return jsonify(new_list)

@app.route("/City_Pop_Brew_Count")
def City_Pop_Brew_Count():

    # Create our session (link) from Python to the DB
    session = Session(engine)


    results = session.query(city_pop_brew_count).all()

    returned=[result.__dict__ for result in results]
    new_list=[]
    for each_dict in returned: 
        new_dict={}
        for each_key in each_dict:
            if not each_key=='_sa_instance_state': 
                new_dict[each_key]=each_dict[each_key]
        new_list.append(new_dict)

    session.close()


    return jsonify(new_list)

@app.route("/Rate_Beer")
def Rate_Beer():

    # Create our session (link) from Python to the DB
    session = Session(engine)

    results = session.query(rate_beer).all()

    returned=[result.__dict__ for result in results]
    new_list=[]
    for each_dict in returned: 
        new_dict={}
        for each_key in each_dict:
            if not each_key=='_sa_instance_state': 
                new_dict[each_key]=each_dict[each_key]
        new_list.append(new_dict)

    session.close()


    return jsonify(new_list)

@app.route("/Model_Train")
def Model_Train():

    # Create our session (link) from Python to the DB
    session = Session(engine)

    results = session.query(model_train).all()

    returned=[result.__dict__ for result in results]
    new_list=[]
    for each_dict in returned: 
        new_dict={}
        for each_key in each_dict:
            if not each_key=='_sa_instance_state': 
                new_dict[each_key]=each_dict[each_key]
        new_list.append(new_dict)

    session.close()


    return jsonify(new_list)

@app.route("/Model_Test")
def Model_Test():

    # Create our session (link) from Python to the DB
    session = Session(engine)

    results = session.query(model_test).all()

    returned=[result.__dict__ for result in results]
    new_list=[]
    for each_dict in returned: 
        new_dict={}
        for each_key in each_dict:
            if not each_key=='_sa_instance_state': 
                new_dict[each_key]=each_dict[each_key]
        new_list.append(new_dict)

    session.close()


    return jsonify(new_list)

@app.route("/Model_Words")
def Model_Words():

    # Create our session (link) from Python to the DB
    session = Session(engine)

    results = session.query(words).all()

    returned=[result.__dict__ for result in results]
    new_list=[]
    for each_dict in returned: 
        new_dict={}
        for each_key in each_dict:
            if not each_key=='_sa_instance_state': 
                new_dict[each_key]=each_dict[each_key]
        new_list.append(new_dict)

    session.close()


    return jsonify(new_list)

if __name__ == '__main__':
    app.debug = True
    app.run()