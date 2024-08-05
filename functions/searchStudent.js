const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = 'mongodb+srv://owner_admin:34899%40admin@thanawiaspotdb.wh8huwr.mongodb.net/nategaDB';

let client;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    await client.connect();
  }
  return client.db('nategaDB');
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const { seating_no } = JSON.parse(event.body);
  const db = await connectToDatabase();
  const collection = db.collection('students');

  try {
    const student = await collection.findOne({ seating_no: Number(seating_no) });
    if (student) {
      return {
        statusCode: 200,
        body: JSON.stringify(student),
      };
    } else {
      return {
        statusCode: 404,
        body: 'Student not found',
      };
    }
  } catch (err) {
    console.error('Error searching for student:', err);
    return {
      statusCode: 500,
      body: 'Error searching for student',
    };
  }
};
