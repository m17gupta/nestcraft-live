require('dotenv').config();

const mongoose = require("mongoose");
const MONGODB_URI = "mongodb+srv://vijendrajat693_db_user:6Zdxvnim3i5DnJQq@vj-cluster.mg6hzxx.mongodb.net/";

async function main() {
  const conn = await mongoose.createConnection(MONGODB_URI, {}).asPromise();
  console.log("Connected to MongoDB cluster");
  
  const admin = conn.db.admin();
  const listDbs = await admin.listDatabases();
  console.log("Databases: ", listDbs.databases.map(d => d.name));

  // Check 'test' db
  const testDb = conn.useDb('test');
  const testUsers = await testDb.collection('users').find({}).toArray();
  if (testUsers.length > 0) {
    console.log("Found users in 'test' db:");
    console.dir(testUsers);
  }

  // Check 'kalp_master' db
  const masterDb = conn.useDb('kalp_master');
  const masterUsers = await masterDb.collection('users').find({}).toArray();
  if (masterUsers.length > 0) {
    console.log("Found users in 'kalp_master' db:");
    console.dir(masterUsers);
  } else {
    console.log("NO USERS IN KALP_MASTER. Seeding hello@gmail.com...");
    const bcrypt = require('bcryptjs');
    const pass = await bcrypt.hash("123456", 10);
    await masterDb.collection('users').insertOne({
        email: 'hello@gmail.com',
        password: pass,
        name: 'Admin',
        role: 'admin'
    });
    console.log("Seeded hello@gmail.com");
  }

  process.exit(0);
}

main().catch(console.error);
