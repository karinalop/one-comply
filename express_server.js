const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8080;
}

app.set("view engine", "ejs");

//custom
const axios = require('axios');


// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World kari</b></body></html>\n");
// });

//helper functions

const match_info = function (data, fields){
  let section = {};
  for(let i in data){
    for(let j in fields){
      if (fields[j].id === data[i].field){
        if(data[i].field === "84016123" || data[i].field === "84016126" ) {//fields address or name
          section[fields[j].label] = readable_string(data[i].value)
        } else{
          section[fields[j].label] = data[i].value;
        }
      }
    }
  }
  return section;
}

//------------------------------------

const readable_string = function(str){
  const arr = str.split("\n").join(" ").split(" ");
  let result = "";
  arr.forEach((elem, index) =>{
    if(elem !== "=" && arr[index + 1] !== "="){
      result += elem + " ";
    }
  });
  return result;
}


//--- route to check the submision data-----------------------

app.get("/sub_data", (req, res) => {
  axios.get('https://www.formstack.com/api/v2/submission/551042206.json?oauth_token=720106c7a6217516f9ed110fd31a5fca')
  .then(response => {
    console.log(response.data);
    res.send(response.data);
  })
  .catch(error => {
    console.log(error);
  }); //end axios request
});

//----route to check the form data--------------------

app.get("/form_data", (req, res) => {
  axios.get('https://www.formstack.com/api/v2/form/3634968.json?oauth_token=720106c7a6217516f9ed110fd31a5fca')
  .then(response => {
    console.log(response.data);
    res.send(response.data);
  })
  .catch(error => {
    console.log(error);
  }); //end axios request
});

//route to test the form html view-----------------------

app.get("/form_data_html", (req, res) => {
  axios.get('https://www.formstack.com/api/v2/form/3634968.json?oauth_token=720106c7a6217516f9ed110fd31a5fca')
  .then(response => {
    console.log(response.data);
    res.send(response.data.html);
  })
  .catch(error => {
    console.log(error);
  }); //end axios request
});


//---------- real thing ------------
app.get("/", (req, res) => {
  axios.get('https://www.formstack.com/api/v2/submission/551042206.json?oauth_token=720106c7a6217516f9ed110fd31a5fca')
  .then(response => {
      axios.get('https://www.formstack.com/api/v2/form/3634968.json?oauth_token=720106c7a6217516f9ed110fd31a5fca')
      .then(res_form => {
        // res.send(template_vars);
        let template_vars = { section_heading: res_form.data.fields[0].section_heading , section: match_info(response.data.data, res_form.data.fields)};
        res.render("index", template_vars);
      })
      .catch(error => {
        console.log(error);
      }); //end axios form request
  })
  .catch(error => {
    console.log(error);
  }); //end axios submision information request
});


//------------------------------------------------
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});



