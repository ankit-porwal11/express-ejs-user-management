const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");


app.set("view engine" , "ejs");
app.use(express.urlencoded({extended: true}));
// home page 
app.get("/" , (req , res) => {

   let users = fs.readFileSync("data.txt" , "utf-8");
    let totalUser = users.split("\n\n").filter((item) => item.trim() !== ""); 
    console.log(totalUser)

    let total = totalUser.length;
    console.log(total)



  res.render("index" , {total});
})

// save route
app.post("/save", (req, res) => {
let {username , email} = req.body;
 // convert into lowercase
username = username.toLowerCase();
email = email.toLowerCase();
// check email exist or not if email exist send popup if email not exist then save 
var user = fs.readFileSync("data.txt" , "utf-8");

 let users = user.split("\n\n") .filter((item) => item.trim() !== "");
     let isExist = users.some((item) => {

      return item.includes(email);

   });
   // condition
   if(isExist){

      return res.send(`

         <script>

            alert("Email already Exist \\nPlease Enter Valid Email");

            window.location.href="/";

         </script>

      `);

   }
       


// email = email.toLowerCase();
// console.log(req.body);
  // console.log(username); 
  // console.log(email); 
  fs.appendFileSync("data.txt" , `Username: ${username}\nEmail: ${email}\n\n`) 
   res.redirect("/");

})
// read route
app.get("/read" , (req , res) => {
   var read = fs.readFileSync("data.txt" , "utf-8");
   // console.log(read);
  // res.redirect("/")
  res.render("read" , {read});

})

// delete route
// app.post("/delete" , (req , res) => {
//   fs.writeFileSync("data.txt" , "")
//   res.send("delete sucessfully")
// })

app.post("/delete", (req, res) => {
   // console.log(req.body);

   let selectUsers = req.body.selectUsers;

   if (!req.body.selectUsers) {
   // return res.send("No user selected");
   return res.send(`

      <script>

         alert("Data is Empty");

         window.location.href = "/";

      </script>

   `);
}

    if (!Array.isArray(selectUsers)) {
      selectUsers = [selectUsers];
   }

   // remove \r
   selectUsers = selectUsers.map((item) => {
      return item.replace(/\r/g, "").trim();
   });


   let data = fs.readFileSync("data.txt", "utf-8");

   
    let users = data
      .split("\n\n")
      .filter((item) => item !== "");

   let updatedUsers = users.filter((item) => {

      return !selectUsers.includes(item);

   });

   fs.writeFileSync("data.txt", updatedUsers.join("\n\n") + "\n\n");

    res.render("delete", {
      users: updatedUsers
   });

});

// new route for delete 
app.get("/delete-page", (req, res) => {

   let data = fs.readFileSync("data.txt", "utf-8");

   // let users = data.split("\n\n");
      let users = data
      .split("\n\n")
      .filter((item) => item.trim() !== "");
      
   res.render("delete", { users });

});
 
//  update-page router   
app.get("/update-page" , (req  , res) => {
   let data = fs.readFileSync("data.txt" , "utf-8");
   let user = data.split("\n\n").filter((item) => item.trim() !== "");
   res.render("update" , {user});
});

app.post("/edit-page" , (req , res) => {
   let selected = req.body.selected

    if (!req.body.selected) {
   // return res.send("No user selected");
   return res.send(`

      <script>

         alert("Data is Empty");

         window.location.href = "/";

      </script>

   `);
}

    if (!Array.isArray(selected)) { // check array hai ya nhi 
      selected = [selected];
   }

   selected = selected.map((item) => {
      return item.replace(/\r/g, "").trim();  // extra spaces remove   hidden \r characters hatao
   });

  let oneUser = selected[0]; // array ka first item lo
  // split se phle   let oneUser =
// `Username: ankit
// Email: abc@gmail.com`;
 
   let lines = oneUser.split("\n");   //jaha \n mile  vaha string tod do
   // After Split    out put [
//  "Username: ankit",
//  "Email: abc@gmail.com"
// ]

   let username = lines[0].replace("Username: ", "");
   // array ka first item  lines[0]  output "Username: ankit"
   // .replace("Username: ", "")   Before:  "Username: ankit" 
   // After Replace  "ankit"  Final  let username = "ankit" 

   // same email me bhi use kiya hai 

   // ye hmne kyo kiya - kyo ki  pura data ek hi string   "Username: ankit\nEmail: abc@gmail.com"
   // Problem  Tumhe: username alag  email alag  chahiye tha  Kyuki:  <input value="">me:  sirf usernameya sirf email hi ja sakta 
  


   let email = lines[1].replace("Email: ", "");

   res.render("edit", {
      username,
      email,
      oldData: oneUser  // oldData kyu bheja? Kyuki  update-user route me: old user ko replace
      //replace() Kaise Pata Karega Kaunsa user update karna hai? Isi: oldData se
   });

})
// final update 
app.post("/update-user", (req, res) => {

   let { username, email, oldData } = req.body;
   oldData = oldData.replace(/\r/g, "");

   let data = fs.readFileSync("data.txt", "utf-8");

   let newData =
`Username: ${username}
Email: ${email}`;

   let updatedData = data.replace(oldData, newData);

   fs.writeFileSync("data.txt", updatedData);

   res.send(`

      <script>

         alert("Updated Successfully");

         window.location.href="/";

      </script>

   `);

});


// Search
app.get("/search" , (req,res) => {
   let searchUser = req.query.searchUser
      // console.log(searchUser);
      searchUser = searchUser.toLowerCase();
   var user = fs.readFileSync("data.txt" , "utf-8");
   // console.log(user);
   let users = user.split("\n\n") .filter((item) => item.trim() !== "");
 // user ko array create kiya 
   // console.log(users)
   let matchUser = users.filter((item) => {
      return item.includes(searchUser);
      // agr filter krne ke bad data milta hai to jo user ne data send
      //  kiya tha for search ke aliye and jo mere file me save hai data un se 
      // compaire kre ga or agr us se milta koi data mil gya to jine bhi data mila us
      //  ko array me return kr dega or agr nhi mila to empty array return kr dega  
      
   });
   // console.log(matchUser); // 
   // if file me data na mile to  
   if(matchUser.length === 0){

      return res.send(`

         <script>

            alert("User Not Found \\n Please Enter Valid Data ");

            window.location.href="/";

         </script>

      `);

   }

   res.render("search" , {matchUser});

});

// app.get("/count" , (req , res) => {
//    let users = fs.readFileSync("data.txt" , "utf-8");
//    let totalUser = users.split("\n\n").filter((item) => item.trim() !== ""); 
//    console.log(totalUser)

// })


app.listen(8000 , () => {
    console.log("Server Start At 8000");
})