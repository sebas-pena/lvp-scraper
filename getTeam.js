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

  // PLAYERS
  const squads = []
  $(".squad-player-container").map((i, el) => {
    const nickname = $(".player-nickname", el).text()
    const name = $(".player-name", el).text()
    const rol = $(".player-position", el).text()
    const playerImg = $(".player-image", el).attr("src")
    let bestChampionsEl = $(".bottom-player-card .stats-container > img", el)
    let bestChampions = []

    let nationalityAcronym = $(".flag-image", el)
      .attr("src")
      .split("/")
      .pop()
      .split(".")
      .shift()
    const player = {
      nickname,
      name,
      rol,
      playerImg,
      nationalityAcronym,
    }

    if (bestChampionsEl.length > 0) {
      bestChampionsEl.each((i, el) => {
        bestChampions.push({
          name: $(el).attr("alt"),
          imageUrl: $(el).attr("src"),
        })
      })
      player.bestChampions = bestChampions
    }

    let seasonKda = $(".kda-container .stats-player", el).text()
    seasonKda ? (player.seasonKda = seasonKda) : null
    squads.push(player)
  })

  console.log(squads)
  return {
    matches,
  }
}

module.exports = getTeam
