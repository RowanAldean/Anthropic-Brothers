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
            try:
                key, value = line.split(': ', 1)
                meta[key.strip()] = value.strip()
            except:
                pass
    for doc in os.listdir(case_path):
        if doc.endswith('.pdf'):
            doc_path = f'{case_path}/{doc}'
            print(f'Processing {doc_path}')
            try:
                reader = PdfReader(doc_path)
            except EmptyFileError:
                print('empty file')
                continue
            except ValueError:
                continue
            number_of_pages = len(reader.pages)
            text = '\n'.join([page.extract_text() for page in reader.pages])
            case_status, case_id, filename = doc.split('--', 2)
            case_id = case_id.replace('-', '/')
            doc = meta.copy()
            doc['text'] = text
            doc_id = db.applications.insert_one(doc).inserted_id
            print(f'Inserted into MongoDB {doc_id}')
