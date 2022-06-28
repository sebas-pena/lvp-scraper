const fetch = require("node-fetch")
const cheerio = require("cheerio")

// Posible leagues:
// 1. superliga = League of Legends
// 2. vrlrising = Valorant

// url examples:
// https://superliga.lvp.global/jugador/whiteknight/
// https://vrlrising.lvp.global/jugador/neptuNo/

const getPlayer = async (playerName, league) => {
	const url = `https://${league}.lvp.global/jugador/${playerName}`
	const response = await fetch(url)
	const res = await response.text()

	const $ = cheerio.load(res)
	const nickname = $(".player-nickname").text()
	const photoUrl = $(".player-photo > img").attr("src")

	let playerStatsEl = $(".ranking-stats > div")
	let playerStats = []
	playerStatsEl.each((i, el) => {
		let title = $(".ranking-stat-lbl", el).text()
		let value = $("> span", el).text()
		playerStats.push({ title, value })
	})

	let mostUsedEl = $(".most-used-container > div")
	let mostUsed = []
	mostUsedEl.each((i, el) => {
		let name = $(".most-used-name", el).text()
		let timesPlayed = $("span:nth-child(3)", el).text().split(" ")[0]
		let winRate = $("span:nth-child(4)", el).text()

		let champ = {
			name,
			timesPlayed,
			winRate,
		}

		if (league === "superliga") {
			champ.kda = $("span:nth-child(5)", el).text()
		}
		mostUsed.push(champ)
	})

	return {
		nickname,
		photoUrl,
		playerStats,
		mostUsed,
	}
}

const getTeam = async (teamName, league) => {
	const url = `https://${league}.lvp.global/equipo/${teamName}`
	const response = await fetch(url)
	const data = await response.text()
	return data
}

getPlayer("whiteknight", "superliga").then((res) => console.log(res))
