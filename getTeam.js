const fetch = require("node-fetch")
const cheerio = require("cheerio")

const getTeam = async (teamName, league) => {
  const url = `https://${league}.lvp.global/equipo/${teamName}`
  const response = await fetch(url)
  const res = await response.text()
  const $ = cheerio.load(res)

  // MATCHES
  let matches = []

  $("#owl-round > div").each((i, el) => {
    let teams = $(".team", el)
    teams = {
      local: $(teams[0]).text().trim(),
      visitor: $(teams[1]).text().trim(),
    }
    let date = $(".match-info > span:nth-child(2)", el).text()
    let played = date * 1000 < +new Date()
    let result = $(".match-info > span:first-child", el).text()

    matches.push({
      teams,
      date,
      played,
      result: played ? result : null,
    })
  })
  const squad = []
}

module.exports = getTeam
