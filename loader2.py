import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

from haystack.nodes import PDFToTextConverter, DocxToTextConverter, PreProcessor


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
        doc_path = f'{case_path}/{doc}'
        if doc.endswith('.pdf'):
            print(f'Processing {doc_path}')
            converter_pdf = PDFToTextConverter(remove_numeric_tables=True, valid_languages=["en"])
            doc_pdf = converter_pdf.convert(file_path=doc_path, meta=None)[0]
            text = doc_pdf.content
        elif doc.endswith('.docx'):
            print(f'Processing {doc_path}')
            converter_docx = DocxToTextConverter(remove_numeric_tables=False, valid_languages=["en"])
            doc_docx = converter_docx.convert(file_path=doc_path, meta=None)[0]
            text = doc_docx.content
        else:
            continue
        case_status, case_id, filename = doc.split('--', 2)
        case_id = case_id.replace('-', '/')
        doc = meta.copy()
        doc['text'] = text
        doc_id = db.applications.insert_one(doc).inserted_id
        print(f'Inserted into MongoDB {doc_id}')


# ----------------------------

similar_docs = db.applications.find({ '$text': {'$search': "", '$moreLikeThis': { 'document': doc, 'minTermFrequency': 5}}})


db.application.aggregate([
  {
    "$search": {
    "moreLikeThis": {
     "like":
      {
        "text": doc['text']
      }
    }
   }
  },
  { "$limit": 5},
  {
    '$project': {
      "_id": 1
    }
  }
])




