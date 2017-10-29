const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const inPath = path.resolve(__dirname, '..', 'asset/in.ly')
const outPath = path.resolve(__dirname, '..', 'out/out')
const readline = require('readline')

const cmd = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

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
          }
    })
  }
})


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
