const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));

// Example route: GET vehicle data
app.get("/data", async (req, res) => {
  try {
    const docRef = db.collection("vehicles").doc("myVehicle");
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).send("Vehicle document not found");
    }
    return res.send(docSnap.data());
  } catch (err) {
    return res.status(500).send(err);
  }
});

// Another route: update motor speed
app.post("/motor/speed", async (req, res) => {
  try {
    const { motorSpeed } = req.body;
    await db.collection("vehicles").doc("myVehicle").update({
      motorSpeedSetting: motorSpeed
    });
    return res.status(200).send("Motor speed updated");
  } catch (err) {
    return res.status(500).send(err);
  }
});

// Export the Express app as a Cloud Function
exports.api = functions.https.onRequest(app);
