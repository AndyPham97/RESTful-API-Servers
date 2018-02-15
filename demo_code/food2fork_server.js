let http = require('http')
let url = require('url')
let qstring = require('querystring')

const PORT = process.env.PORT || 3000
//Please register for your own key replace this with your own.
const API_KEY = 'db0091743dbde3e37df1fca5d3ab3ae'

function sendResponse(recipeData, res){
  var page = '<html><head><title>API Example</title></head>' +
    '<body>' +
    '<form method="post">' +
    'Ingredient: <input name="ingredient"><br>' +
    '<input type="submit" value="Get Recipes">' +
    '</form>'
  if(recipeData){
    page += '<h1>Recipes</h1><p>' + recipeData +'</p>'
}
  page += '</body></html>'
  res.end(page);
}

function parseData(recipeResponse, res) {
  let recipeData = ''
  recipeResponse.on('data', function (chunk) {
    recipeData += chunk
  })
  recipeResponse.on('end', function () {
    sendResponse(recipeData, res)
  })
}

function getRecipes(ingredient, res){

  let options = {
    host: 'www.food2fork.com',
    path: '/api/search?q=${' + ingredient + '}&key=${' + API_KEY + '}'
  }
  http.request(options, function(apiResponse){
    parseData(apiResponse, res)
  }).end()
}

http.createServer(function (req, res) {
  let requestURL = req.url
  let query = url.parse(requestURL).query //GET method query parameters if any
  let method = req.method
  console.log(`${method}: ${requestURL}`)
  console.log(`query: ${query}`) //GET method query parameters if any

  if (req.method == "POST"){
    let reqData = ''
    req.on('data', function (chunk) {
      reqData += chunk
    })
    req.on('end', function() {
	  console.log(reqData);
      var queryParams = qstring.parse(reqData)
	  console.log(queryParams);
      getRecipes(queryParams.ingredient, res)
    })
  } else if (req.method == "GET" && requestURL === "/?ingredient=Basil") {
    var index = requestURL.indexOf("?ingredient=");
    if (index > 0) {
      var name = requestURL.substring(index + "?ingredient=".length, requestURL.length);
      getRecipes(name, res);
    }
  }
  else{
    sendResponse(null, res)
  }
}).listen(PORT, (error) => {
  if (error)
    return console.log(error)
  console.log(`Server is listening on PORT ${PORT} CNTL-C to quit`)
})
