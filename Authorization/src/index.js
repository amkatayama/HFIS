const express = require("express");
const path = require("path");
const User = require("./config");
const bcrypt = require('bcrypt');

const app = express();
// convert data into json format
app.use(express.json());
// Static file
app.use(express.static("CSS"));

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("login", { error : null });
});

app.get("/signup", (req, res) => {
    res.render("signup", { error : null });
});

// Register User
app.post("/signup", async (req, res) => {
  const { name, password1, password2 } = req.body;

  if (!name || !password1 || !password2) {
    res.render("signup", { error: "Please fill in all fields" });
  } else {
    // Check if username already exists
    try {
      const existingUser = await User.findOne({ name: name });

      if (existingUser) {
        res.render("signup", { error: "Username already exists." });
      } else if (password1 !== password2) {
          res.render("signup", { error: "Password do not match." });
      } else {
          // Hash password on successful validation
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password1, saltRounds);

          // Create and save new user (assuming collection has a save method)
          const newUser = new User({ name, password1: hashedPassword, password2: hashedPassword});  // Use "password" instead of "password1" here
          await newUser.save();

          // Redirect to success page or render a success message
          res.render('home')
          // return res.render("signupSuccess"); // Or redirect to a confirmation page
      }
    } catch (error) {
      console.error("Error during user signup:", error);
      // Handle any errors during database operations here (e.g., display an error message to the user)
    }
  }
});

// Login user 
app.post("/login", async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await User.findOne({ name : name });
        console.log('User found:', user);
        if (!user) {
            return res.render("login", { error: "Username not found" });
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(password, user.password1);
        if (!isPasswordMatch) {
            return res.render("login", { error: "Incorrect password" });
        }
        else {
            return res.render("home");
        }
    }
    catch (error) {
        console.error('Error during login', error);        
        return res.render('login', { error : 'An error occured during login. Please try again.'});
    }
});


// Define Port for Application
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
