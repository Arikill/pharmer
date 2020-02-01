import pandas as pd
import numpy as np

class reader:
    def __init__(self, user):
        self.user = user
        pass

    def genes_csv(self, file):
        df = pd.read_csv(file)
        data = []
        for row in df.itertuples():
            item = {}
            item["_id"] = row.gene
            item["transcript"] = row.transcript
            item["name"] = row.name
            item["description"] = row.description
            item["user"] = self.user
            data.append(item)
        return data

    def cell_values_csv(self, file):
        df = pd.read_csv(file)
        data = [None]*len(df)
        for i in range(len(df)):
            temp = {}
            for item in df.columns.values:
                if not item == "Name" and not item == "dtype":
                    if isinstance(df.loc[i, item], np.int64):
                        temp[item] = int(df.loc[i, item])
                    else:
                        temp[item] = df.loc[i, item]
            data[i] = temp 
        return data