const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const in_path = path.resolve(__dirname, '..', 'asset/in.ly')
const out_path = path.resolve(__dirname, '..', 'out/out')
const readline = require('readline')

const cmd = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

cmd.on('line', (input) => {
  let parsed_input = parse_input(input)
  if (parsed_input) {
    let lilymusic = createScore(parsed_input)
    fs.writeFileSync(in_path, lilymusic)

    exec(`lilypond -fpng -dresolution=300 -o "${out_path}" "${in_path}"`, (err, stdout, stderr) => {
      if (err) {
        console.log(err)
      } else {
        trim_image(out_path);
      }
    })
  }
})


function parse_input(input) {
  let first = input.split(' ')
  if (first[0] === '\\lilypond') {
    return input.substr(input.indexOf(" ") + 1);
  } else {
    return null
  }
}

function trim_image(image_path) {
  exec(`magick mogrify -trim "${image_path}".png`, (err, stdout, stderr) => {
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