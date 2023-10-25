const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const methodover = require("method-override");
const {v4 :uuidv4}=require("uuid");
const app = express();
const path = require("path");
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(methodover("_method"));
app.use(express.urlencoded({extended:true}));
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'Passward',
    password:"Gana!k1234"
  });

  let createRandomUser =  function(){
    return [
     faker.datatype.uuid(),
    ];
  }

function reaadhg(pass){
  let str = "";
  for(let i = 0;i<pass.length;i++){
    str = str + '*';
  }
  return str;
}
// WELCOME PAGE
app.get("/",(req,res)=>{
         res.render("home.ejs"); 
  })
  // CREATE PASSWORD
  app.get("/create_password",(req,res)=>{
    res.render("creatpassword.ejs")
  })
  app.post("/create_password",(req,res)=>{
    let {email,password} = req.body;
    let q = `INSERT INTO info5 (email,password) VALUES ('${email}','${password}')`;
    try{
      connection.query(q,  (err, user) =>{
        if (err) throw err;
       
       res.redirect("/");
      });
    }catch(err){
      console.log(err);
      res.send("SOME ERROR OCUUR");
    }
    })
  // FORGET PASSWARD
  app.get("/forget_password",(req,res)=>{
    res.render("fogetpassward.ejs");
  })
  app.patch("/forget_password",(req,res)=>{
     let {email,password}=req.body;
     let q = `SELECT * FROM info5 WHERE email='${email}'`;
     try{
       connection.query(q,  (err, user) =>{
         if (err) throw err;
        let result = user[0];
       
        if(result==null){
          res.render("wroung.ejs");
        }
    else{
      let q2 = `UPDATE info5 SET password='${password}' WHERE email='${email}'`;
      connection.query(q2,(err,result)=>{
        if(err) throw err;
        res.redirect("/");
      })
      // res.render("edit.ejs",{result});
     }
    })
  }
  catch(err){
    console.log(err);
    res.send("SOME ERROR OCUUR");
  }

  })
  // PASSWORD CHECK
  app.post("/manager",(req,res)=>{
    
    let {password} = req.body;
    let q = `SELECT * FROM info5 WHERE password='${password}'`;
    try{
      connection.query(q,  (err, user) =>{
        if (err) throw err;
      let result = user[0];
     if(result==null){
      res.render("wroung.ejs");
     }else{
      res.redirect("/manager");
     } 
      });
    }catch(err){
      console.log(err);
      res.send("SOME ERROR OCUUR");
    }
  })
  // MANAGER PAGE
  app.get("/manager",(req,res)=>{
    let q = `select * from info2`;
    try{
      connection.query(q,  (err, user) =>{
        if (err) throw err;
       res.render("manager.ejs",{user});
      });
    }catch(err){
      console.log(err);
      res.send("SOME ERROR OCUUR");
    }
  })
  // ADD PAGE
  app.get("/manager/add",(req,res)=>{
    res.render("new.ejs");
  })
  app.post("/manager/add",(req,res)=>{
   
    let {username,email,password} = req.body;
    let id = uuidv4();
    let q = `INSERT INTO info2 (id,username,email,password) VALUES ('${id}','${username}','${email}','${password}')`;
    try{
      connection.query(q,  (err, user) =>{
        if (err) throw err;
       
       res.redirect("/manager");
      });
    }catch(err){
      console.log(err);
      res.send("SOME ERROR OCUUR");
    }
    })
    // DELETE PAGE
    app.get("/manager/:id/delete",(req,res)=>{
      let {id}=req.params;
      let q = `SELECT * FROM info2 WHERE id='${id}'`
      try{
        connection.query(q,  (err, result) =>{
          if (err) throw err;
         let user = result[0];
         res.render("delete.ejs",{user});
        });
      }catch(err){
        console.log(err);
        res.send("SOME ERROR OCUUR");
      }
    })
    app.delete("/manager/:id/",(req,res)=>{
      let {id}=req.params;
      let {password}=req.body;
      let q = `SELECT * FROM info2 WHERE id='${id}'`;
      try{
        connection.query(q,  (err, user) =>{
          if (err) throw err;
         let result = user[0];
         if(password!=result.password){
          res.render("wroung.ejs");
         }else{
          let q2 = `DELETE FROM info2 WHERE id ='${id}'`;
          connection.query(q2,(err,result)=>{
            if(err) throw err;
            res.redirect("/manager");
          })
          // res.render("edit.ejs",{result});
         }
         
        });
      }catch(err){
        console.log(err);
        res.send("SOME ERROR OCUUR");
      }
    })
    // Edit rout
app.get("/manager/:id/edit",(req,res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM info2 WHERE id='${id}'`;
  try{
    connection.query(q,  (err,result ) =>{
      if (err) throw err;
     let user = result[0];
     res.render("edit.ejs",{user});
    });
  }catch(err){
    console.log(err);
    res.send("SOME ERROR OCUUR");
  }
 
})
app.patch("/manager/:id",(req,res)=>{
  let {id} = req.params;
  let {username:formname,email:formemail,password:formpassward,newpassword:formpassward1}=req.body;
  let q = `SELECT * FROM info2 WHERE id='${id}'`;
  try{
    connection.query(q,  (err, user) =>{
      if (err) throw err;
     let result = user[0];
     console.log(result)
     if(formpassward!=result.password){
      res.render("wroung.ejs");
     }else{
      let q2 = `UPDATE info2 SET username='${formname}',email='${formemail}',password='${formpassward1}' WHERE id='${id}'`;
      connection.query(q2,(err,result)=>{
        if(err) throw err;
        res.redirect("/manager");
      })
      // res.render("edit.ejs",{result});
     }
     
    });
  }catch(err){
    console.log(err);
    res.send("SOME ERROR OCUUR");
  }
})
  app.listen(8080,()=>{
    console.log(`The server started at 8080`);
  })