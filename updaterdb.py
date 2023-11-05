import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

from pypdf import PdfReader
from pypdf.errors import EmptyFileError

uri = f"mongodb+srv://{os.environ.get('MONGODB_USERNAME')}:{os.environ.get('MONGODB_PASSROWD')}@cluster0.ikd1tlo.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri, server_api=ServerApi('1'))

db = client[os.environ.get('MONGODB_DATABASE')]

for case_folder in [i for i in os.listdir('./docs') if os.path.isdir('./docs/' + i) and os.path.exists('./docs/' + i + '/meta.txt')]:
    case_path = f'./docs/{case_folder}'
    meta = {}
    with open(f'{case_path}/meta.txt', 'r') as f:
        for line in f.readlines():
            key, value = line.split(': ', 1)
            meta[key.strip()] = value.strip()

    case_id = case_folder.replace('-', '/')
    db.applications.update_many({'case_id': case_id}, {'$set': meta})