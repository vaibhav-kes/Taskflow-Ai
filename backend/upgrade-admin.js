const dns = require('dns');
dns.setServers(['8.8.8.8']);
const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb+srv://taskflow_admin:TaskFlow2024Secure@cluster0.9d5s5s3.mongodb.net/taskflow-ai?retryWrites=true&w=majority&appName=Cluster0');
  const result = await mongoose.connection.db.collection('users').updateOne(
    { email: 'admin@taskflow.ai' },
    { $set: { role: 'admin' } }
  );
  console.log('Updated:', result.modifiedCount);
  await mongoose.disconnect();
}
run().catch(e => console.log('Error:', e.message));
