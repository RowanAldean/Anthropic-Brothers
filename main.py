import os


from anthropic import Anthropic, HUMAN_PROMPT, AI_PROMPT

anthropic = Anthropic(api_key=os.environ.get('ANTHROPIC_API_KEY'))

completion = anthropic.completions.create(
    model="claude-2",
    max_tokens_to_sample=300,
    prompt=f"{HUMAN_PROMPT} Do I need a planning permission if I want to make a terrace? Ask me questions to decide if I need to prepare a planning permision. Use the regulation document below:\n\n{txt} {AI_PROMPT}",
)
print(completion.completion)

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = f"mongodb+srv://{os.environ.get('MONGODB_USERNAME')}:{os.environ.get('MONGODB_PASSROWD')}@cluster0.ikd1tlo.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri, server_api=ServerApi('1'))

db = client[os.environ.get('MONGODB_DATABASE')]


from pypdf import PdfReader


db.rules.drop()

rules = {
    'permitted_development_rights': '../Permitted development rights for householders technical guidance - GOV.UK.pdf',
    'residential_design_guide': '../Residential Design Guide SPD.pdf',
}

for key, doc_path in rules.items():
    reader = PdfReader(doc_path)
    number_of_pages = len(reader.pages)
    text = '\n'.join([page.extract_text() for page in reader.pages])

    rules_doc = {
        'name': key,
        'text': text,
    }
    
    db.rules.insert_one(rules_doc).inserted_id

