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
	const data = await response.text()
	return data
}

const getTeam = async (teamName, league) => {
	const url = `https://${league}.lvp.global/equipo/${teamName}`
	const response = await fetch(url)
	const data = await response.text()
	return data
}
