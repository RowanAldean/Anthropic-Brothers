import { MongoClient } from "mongodb";
let MONGO_DB_CONNECTION = process.env.MONGO_DB_CONNECTION;

export async function queryDatabaseForPDFs() {
// WARNING: This will fail without network settings updated on the DB to allow connections via IPv4 address
  const uri = `${MONGO_DB_CONNECTION}`
  console.log(`URI is: ${uri}`);
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("anthropic-langchain");
    const collection = database.collection("rules");
    const documents = await collection.find().toArray();
    // console.log(documents);
    return documents;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

export async function queryDatabaseForApplications() {
  // WARNING: This will fail without network settings updated on the DB to allow connections via IPv4 address
    const uri = `${MONGO_DB_CONNECTION}`;
    const client = new MongoClient(uri);
  
    try {
      await client.connect();
      const database = client.db("anthropic-langchain");
      const collection = database.collection("applications");
      const documents = await collection.find().toArray();
      // console.log(documents);
      return documents;
    } catch (error) {
      console.error("Error:", error);
    } finally {
      await client.close();
    }
  }