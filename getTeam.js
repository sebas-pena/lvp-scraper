const fetch = require("node-fetch")
const cheerio = require("cheerio")

const getTeam = async (team, league) => {
	const url = `https://${league}.lvp.global/equipo/${team}`
	const response = await fetch(url)
	const res = await response.text()
	const $ = cheerio.load(res)

	// TEAM LOGO & NAME
	const teamLogo = $(".team-container > .image-container > img").attr("src")

	const teamName = $(".team-container > .image-container > img").attr("alt")

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

	// STATS
	const stats = []
	$(
		".ladder-global-stats-container > .graph-container > .ladder-stats-graph > .map-graph-item > .map-graph-rigth-container > .map-graph-info-container"
	).map((i, el) => {
		const stat = {
			value: $(".map-graph-info-container-value", el).text(),
			name: $(".map-graph-info-container-label", el).text(),
		}
		stats.push(stat)
	})

	// SCORE
	const score = {
		wins: $(".victories-container > .value").text(),
		loses: $(".defeats-container > .value").text(),
	}

	// MOST PLAYED CHAMPIONS
	const mostPlayedChampions = []

	$(
		".team-info-out > div:nth-child(3) > div > .graph-container > div > div"
	).map((i, el) => {
		const champion = {
			name: $(".map-graph-item-left > span:last-child", el).text(),
			imageUrl: $(".map-graph-item-left > img", el).attr("src"),
			timesPlayed: $(".map-graph-item-right > span", el)
				.text()
				.split("/")[0]
				.trim(),
		}
		mostPlayedChampions.push(champion)
	})

	// MOST BANNED CHAMPIONS

	const mostBannedChampions = []

	$(
		".team-info-out > div:nth-child(3) > .weapons-graph > .graph-container > .maps-graph-container > .map-graph-item"
	).map((i, el) => {
		const champion = {
			name: $(".map-graph-item-left > span:last-child", el).text(),
			imageUrl: $(".map-graph-item-left > img", el).attr("src"),
			timesBanned: $(".map-graph-item-right > span", el)
				.text()
				.split("/")[0]
				.trim(),
		}
		mostBannedChampions.push(champion)
	})

	console.log(mostBannedChampions)

	return {
		matches,
		squads,
		logo: teamLogo,
		name: teamName,
		score,
		stats,
		mostPlayedChampions,
	}
}

module.exports = getTeam
