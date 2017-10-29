'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.env.PORT || 5000))

//Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//ROUTES

app.get('/', function(req, res) {
	res.send("Hi I am a chatbot")
})

//Facebook

app.get('/webhook/', function(req, res) {
	if (req.query['hub.verify_token'] === "blondiebytes") {
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong token")
})

let token = 
"EAAZA1IK4tH4IBAFwXHSSnWIVyljBLG7vLgz0pfXw6dDRBXt8E0pdJbg3nEmbSju6coD8ekmk5p7ckO3YInNC2sCiyKS4ZCk0NJMR30rc6lrbdM9iIoHrbY0JfxuG8cXReVqB93o4YAFSn1J4G4ayNZA9ByESnXDRmYuKIbvZAAZDZD"

app.post('/webhook/', function(req, res) {
	console.log("WORKING HERE")
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let input = event.message.text
            pathToImage = runInput(input)
			send(sender, pathToImage.toString())
		}
	}
	res.sendStatus(200)
})

function send(sender, text) {
	let messageData = {text: text}
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
            message : {
                attachments: {
                    type: "image",
                    payload: {
                        url: text,
                        is_reusable: true
                    }
                }
            }
		}
	}, function(error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	})
}

app.listen(app.get('port'), function() {
	console.log("running: port")
})

// parsing the music
const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const inPath = path.resolve(__dirname, '..', 'https://agile-retreat-43439.herokuapp.com/assets/in.ly')
const outPath = path.resolve(__dirname, '..', 'https://agile-retreat-43439.herokuapp.com/assets/out.png')
const readline = require('readline')

const cmd = readline.createInterface({
  output: process.stdout
})

runInput(input) {
    let parsed_ = parseInput(input)
        if (parsed_) {
            let lilymusic = createScore(parsed_)
                fs.writeFileSync(inPath, lilymusic)

                exec(`./lilypond -fpng -dresolution=300 -o "${outPath}" "${inPath}"`, (err, stdout, stderr) => {
                    if (err) {
                        console.log(err)
                    } else {
                        trimImage(outPath);
                        // send outPath to person
                        return outPath;
                    }
                })
        }
    return;
}

/*
cmd.on('line', (input) => {
  let parsed_ = parseInput(input)
  if (parsed_) {
    let lilymusic = createScore(parsed_)
    fs.writeFileSync(inPath, lilymusic)

    exec(`./lilypond -fpng -dresolution=300 -o "${outPath}" "${inPath}"`, (err, stdout, stderr) => {
          if (err) {
            console.log(err)
          } else {
            trimImage(outPath);
            // send outPath to person
          }
    })
  }
})
*/


function parseInput(input) {
  let first = input.split(' ')
  if (first[0] === '\\lilypond') {
    return input.substr(input.indexOf(" ") + 1);
  } else if(first[i] === '\\end') {
     throw new Error();
  } 
  else {
    return null
  }
}

function trimImage(imagePath) {
  exec(`magick mogrify -trim "${imagePath}".png`, (err, stdout, stderr) => {
    if (err) {
      console.err(err)
    } 
  })
}

function createScore(music) {
  return `
  \\header { 
    tagline = ""
  } 

  \\score {
    \\relative c' {
      ${music}
    }
  }
  `
}
