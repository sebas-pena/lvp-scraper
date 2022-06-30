const fetch = require("node-fetch")
const cheerio = require("cheerio")

const getTeam = async (teamName, league) => {
  const url = `https://${league}.lvp.global/equipo/${teamName}`
  const response = await fetch(url)
  const res = await response.text()
  const $ = cheerio.load(res)

  // MATCHES
  $("#owl-round > div").each((i, el) => {
    let teams = $(".team", el)
    teams = {
      local: $(teams[0]).text().trim(),
      visitor: $(teams[1]).text().trim(),
    }
  })

  const squad = []
}

module.exports = getTeam
