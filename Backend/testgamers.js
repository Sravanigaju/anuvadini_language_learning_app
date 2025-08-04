


// ✅ Correct
const Gamer = require('./models/Gamer');


mongoose.connect("mongodb://127.0.0.1:27017/anuvadini_language").then(async () => {
  try {
    const gamer = await Gamer.create({
      userId: "685299b2566a85ef70a052d3",
      Game_Name: "Test Game",
      categorycount: 1,
      type: "quiz",
      language: "English",
      points: 90
    });
    console.log("Saved:", gamer);
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    mongoose.disconnect();
  }
});
