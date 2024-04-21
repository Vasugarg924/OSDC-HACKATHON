const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const signup = require("./models/signup.js");
const publish = require("./models/publish.js");
const methodOverride = require("method-override");

// Set up view engine and static files
app.set('scripts', path.join(__dirname, 'scripts'));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// MongoDB connection
async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/hackthone');
        console.log("Connection Successful");
    } catch (error) {
        console.error("Connection error:", error);
    }
}
main();

// Routes
app.get("/", (req, res) => {
    res.send("hackthone project in making");
});

app.get("/universe", (req, res) => {
    res.render("index.ejs");
});
app.get("/login",(req,res)=>{
    res.render("main.ejs");
})
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find user by username
        const user = await signup.findOne({ username });
        if (!user) {
            return res.status(404).send("Username not found");
        }
        // Check password
        if (user.password !== password) {
            return res.status(400).send("Incorrect password");
        }
        // Redirect to another page after successful login
        res.render("main.ejs");
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("Error logging in");
    }
});

app.get("/signupnew", (req, res) => {
    res.render("signup2.ejs");
});

// signup route
app.post("/signupnew", async (req, res) => {
    const { fullname, college, newusername, newpassword } = req.body;
    try {
        // Check if username already exists
        const existingUser = await signup.findOne({ username: newusername });
        if (existingUser) {
            return res.status(400).send("Username already taken");
        }

        // If username is not taken, proceed with signup
        const newsignup = new signup({
            name: fullname,
            collegename: college,
            username: newusername,
            password: newpassword
        });
        const savedSignup = await newsignup.save();
        console.log("Signup saved:", savedSignup);
        // Redirect to another page after saving
        res.redirect("/universe");
    } catch (error) {
        console.error("Error saving signup:", error);
        // Handle the error appropriately, such as rendering an error page
        res.status(500).send("Error saving signup: " + error.message);
    }
});


// elearning path
app.get("/elearning",(req,res)=>{
    res.render("elearning.ejs");
});

// publish path
app.get("/publish",(req,res)=>{
    res.render("publish.ejs")
})

// Youtube path
app.get("/youtube",(req,res)=>{
    res.render("youtube.ejs");
})
app.get("/profile",(req,res)=>{
    res.render("profile.ejs");
})

// appeal path
app.get("/appeal",(req,res)=>{
    res.render("appeal.ejs");
})



// publish post path
app.post("/publish", async (req, res) => {
    const { college,course ,semester, subject,youtubelink,bookslink} = req.body;
    try {
        // If username is not taken, proceed with signup
        const newpublish = new publish({
            college: college,
            course: course,
            semester: semester,
            subject: subject,
            youtubelink: youtubelink,
            bookslink: bookslink
        });
        const savedpublish = await newpublish.save();
        console.log("publish saved:", savedpublish);
        // Redirect to another page after saving
        res.redirect("/login");
    } catch (error) {
        console.error("Error saving signup:", error);
        // Handle the error appropriately, such as rendering an error page
        res.status(500).send("Error saving signup: " + error.message);
    }
});


// elearning retrival path
// app.post("/elearning", async (req, res) => {
//     try {
//       const { college, course, semester, subject, topic } = req.body;
  
//       // Constructing the $or query to search for documents where any of the fields match the provided data
//       const query = {
//         $or: [
//           { college: college },
//           { course: course },
//           { semester: semester },
//           { subject: subject },
//           { topic: topic },
//         ],
//       };
  
//       // Search for documents matching the $or query
//       const foundDocuments = await publish.find(query);
  
//       // Send the found documents as a response
//     //   res.status(200).json({ matchingData: foundDocuments });
//     res.render("elearningshow.ejs",{foundDocuments});
//     } catch (error) {
//       console.error("Error searching in database:", error);
//       // Handle the error appropriately, such as rendering an error page
//       res.status(500).send("Error searching in database: " + error.message);
//     }
//   });
app.post("/elearning", async (req, res) => {
    try {
        const { college, course, semester, subject, topic } = req.body;

        // Constructing the query to search for documents where any of the fields match the provided data
        const query = {
            $or: [
                { college: college },
                { course: course },
                { semester: semester },
                { subject: subject },
                { topic: topic },
            ],
        };

        // Search for documents matching the query
        const foundDocuments = await publish.find(query).exec();

        // Send the found documents as a response
        res.render("elearningshow.ejs", { foundDocuments });
    } catch (error) {
        console.error("Error searching in database:", error);
        // Handle the error appropriately, such as rendering an error page
        res.status(500).send("Error searching in database: " + error.message);
    }
});






// Events path
app.get("/events",(req,res)=>{
    res.render("events.ejs");
})

// Start server
app.listen("8080", () => {
    console.log("Server is listening to port 8080");
});

