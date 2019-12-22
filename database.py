import sqlalchemy as db

class Database:
    def __init__(self, username, password, hostname, db_name):
        self.engine = db.create_engine('postgresql://'+username+':'+password+'@'+hostname+'/'+db_name)
        pass

    def create(self):
        self.connection = self.engine.connect()
        print("DB instance connected")
