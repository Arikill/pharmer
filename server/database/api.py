from flask_pymongo import PyMongo
import bcrypt
from utilities.reader import reader

class database:
    def __init__(self, app):
        self.mongo = PyMongo(app)
        pass

    def isUser(self, email):
        return_value = {}
        try:
            if self.mongo.db.users.find_one({"email": email}) is None:
                return_value["status"] = False
                return_value["msg"] = "No such user"
            else:
                return_value["status"] = True
                return_value["msg"] = "User already exists"
        except Exception as e:
            raise RuntimeError(e)
            return_value["msg"] = str(e)
        finally:
            return return_value

    def createUser(self, firstname, lastname, email, password):
        return_value = {}
        if self.isUser(email)["status"] == False:
            self.mongo.db.users.insert_one({
            "firstname": firstname,
            "lastname": lastname,
            "email": email,
            "password": bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()),
            "online": False,
            "role": "user"
            })
            return_value["status"] = True
            return_value["msg"] = "User writter to database."
        else:
            print("User already exists.")
        return return_value

    def isUserOnline(self, email):
        return_value = {}
        if self.isUser(email)["status"] == True:
            try:
                status = self.mongo.db.users.find_one({"email": email}, {"online": 1})
                return_value["status"] = status["online"]
            except Exception as e:
                raise RuntimeError(e)
                return_value["msg"] = str(e)
            finally:
                return return_value
        else:
            return_value["status"] = False
            return_value["msg"] = "User not found"
            print(return_value["msg"])
        return return_value
    
    def updateUserOnlineStatus(self, email, status):
        return_value = {}
        if self.isUser(email)["status"] == True:
            try:
                self.mongo.db.users.update_one({"email": email}, {"$set": {"online": status}})
                return_value["status"] = status
                return_value["msg"] = "User status updated"
            except Exception as e:
                raise RuntimeError(e)
                return_value["msg"] = str(e)
            finally:
                return return_value
        else:
            return_value["status"] = False
            return_value["msg"] = "User not found"
        return return_value
    
    def isAuthorized(self, email, password):
        return_value = {}
        if self.isUser(email)["status"] == True:
            try:
                result = self.mongo.db.users.find_one({"email": email}, {"password": 1})
                if bcrypt.hashpw(password.encode("utf-8"), result["password"]):
                    return_value["status"] = True
                    return_value["msg"] = "User authorized"
                else:
                    return_value["status"] = False
                    return_value["msg"] = "User Denied"
            except Exception as e:
                raise RuntimeError(e)
                return_value["msg"] = str(e)
            finally:
                return return_value
        else:
            return_value["status"] = False
            return_value["msg"] = "User not found"
        return return_value

    def writeGenes(self, user, file):
        return_value = {}
        if self.isUser(user)["status"] == True:
            try:
                rdr = reader(user)
                self.mongo.db.drop_collection(user+"/genes")
                self.mongo.db[user+"/genes"].insert_many(rdr.genes_csv(file))
                return_value["status"] = True
                return_value["msg"] = "Written to database"
            except Exception as e:
                raise RuntimeError(e)
                return_value["msg"] = str(e)
            finally:
                return return_value
        else:
            return_value["status"] = False
            return_value["msg"] = "User not found"
        return return_value
    
    def writeCellValues(self, user, file):
        rdr = reader(user)
        data = rdr.cell_values_csv(file)
        index = len(data)
        for datum in data:
            print("setting: {}, datum: {}".format(index, datum["gene"]))
            id = datum["gene"]
            datum.pop("gene", None)
            datum.pop("transcript", None)
            # print(self.mongo.db[user+"/genes"].find_one(filter={"_id": id}))
            self.mongo.db[user+"/genes"].update_one({"_id": id}, {"$set": datum})
            index = index-1
        # return_value = {}
        # if self.isUser(user)["status"] == True:
        #     try:
        #         rdr = reader(user)
        #         df = rdr.cell_values_csv(file)
        #         # for row in df.iterrows():
        #         #     current_row = {}
        #         #     for item in row:
        #         #         if item is not "name" and item is not "dtype" and item is not "gene":
        #         #             print(item)
        #         return_value["status"] = True
        #         return_value["msg"] = "Written to database"
        #     except Exception as e:
        #         raise RuntimeError(e)
        #         return_value["msg"] = str(e)
        #     finally:
        #         print(return_value)
        #         return return_value
        # else:
        #     return_value["status"] = False
        #     return_value["msg"] = "User not found"
        # return return_value
        pass
        