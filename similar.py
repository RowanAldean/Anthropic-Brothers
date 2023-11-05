import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import requests

hf_token = os.environ.get('HUGGINGFACE_API_KEY')
embedding_url = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"

uri = f"mongodb+srv://{os.environ.get('MONGODB_USERNAME')}:{os.environ.get('MONGODB_PASSROWD')}@cluster0.ikd1tlo.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri, server_api=ServerApi('1'))

db = client[os.environ.get('MONGODB_DATABASE')]


def generate_embedding(text: str) -> list[float]:
    response = requests.post(
        embedding_url,
        headers={"Authorization": f"Bearer {hf_token}"},
        json={"inputs": text})
    
    if response.status_code != 200:
        raise ValueError(f"Request failed with status code {response.status_code}: {response.text}")

    return response.json()


for doc in db.applications.find({'text_embedding_hf':{"$exists": False}}):
    db.applications.update_one({"_id": doc["_id"]}, {"$set": {"text_embedding_hf": generate_embedding(doc['text'])}})
    print(f'Updated {doc["_id"]}')



# query = "imaginary characters from outer space at war"

# results = db.applications.aggregate([
#   {"$vectorSearch": {
#     "queryVector": doc['text_embedding_hftext_embedding_hf'],
#     "path": "text_embedding_hf",
#     "numCandidates": 100,
#     "limit": 4,
#     "index": "TextSemanticSearch",
#       }}
# ]);

# for document in results:
#     print(f'Movie Name: {document["title"]},\nMovie Plot: {document["plot"]}\n')
