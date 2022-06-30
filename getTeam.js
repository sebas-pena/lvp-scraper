const fetch = require("node-fetch")
const cheerio = require("cheerio")

const getTeam = async (teamName, league) => {
  console.log(`Getting team ${teamName} from ${league}`)
  const url = `https://${league}.lvp.global/equipo/${teamName}`
  const response = await fetch(url)
  const data = await response.text()
  const $ = cheerio.load(res)
}

module.exports = getTeam
