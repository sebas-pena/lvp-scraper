const fetch = require("node-fetch");
const cheerio = require("cheerio");
// Posible leagues:
// 1. superliga = League of Legends
// 2. vrlrising = Valorant

// url examples:
// https://superliga.lvp.global/jugador/whiteknight/
// https://vrlrising.lvp.global/jugador/neptuNo/

const getPlayer = async (playerName, league) => {
  const url = `https://${league}.lvp.global/jugador/${playerName}`;
  const response = await fetch(url);
  const res = await response.text();
  const $ = cheerio.load(res);
  const nickname = $(".player-nickname").text();
  const photoUrl = $(".player-photo > img").attr("src");

  let playerStatsEl = $(".ranking-stats > div");
  let playerStats = [];
  let playerInfo = $(".name-old-countryname");

  playerInfo = playerInfo
    .text()
    .split("-")
    .map((el) => el.trim());
  playerInfo = {
    name: playerInfo[0],
    age: playerInfo[1].split(" ").shift(),
    country: playerInfo[2],
    nickname,
    photoUrl,
    teamName: $(".info-header h3 .team-name").text(),
  };

  playerStatsEl.each((i, el) => {
    let title = $(".ranking-stat-lbl", el).text();
    let value = $("> span", el).text();
    playerStats.push({ title, value });
  });

  let mostUsedEl = $(".most-used-container > div");
  let mostUsed = [];
  mostUsedEl.each((i, el) => {
    let name = $(".most-used-name", el).text();
    let timesPlayed = $("span:nth-child(3)", el).text().split(" ")[0];
    let winRate = $("span:nth-child(4)", el).text();

    let champ = {
      name,
      timesPlayed,
      winRate,
    };

    if (league === "superliga") {
      champ.kda = $("span:nth-child(5)", el).text();
    }
    mostUsed.push(champ);
  });

  let matches = $("#dynamic-result-template > div:last-child a");
  let matchesData = [];
  matches.each((i, el) => {
    const champion = $("div div div.table-champs-resp img.champ", el).attr(
      "alt"
    );
    if (!champion) return;

    let matchUrl = $(el).attr("href");
    const rival = $("div div span.player-history-item-teamname", el).text();
    const date = $("div div span.player-history-item-data", el).text();
    let resultEl = $("div div div span.player-match-result", el);
    let result = resultEl.attr("class").includes("lose") ? "lose" : "win";
    let matchScore = resultEl.text().split("/").pop().split("-");

    if (result === "win") {
      matchScore[0] > matchScore[1]
        ? (result = {
            team: matchScore[0],
            rival: matchScore[1],
          })
        : (result = {
            team: matchScore[1],
            rival: matchScore[0],
          });
    } else {
      matchScore[0] > matchScore[1]
        ? (result = {
            team: matchScore[1],
            rival: matchScore[0],
          })
        : (result = {
            team: matchScore[0],
            rival: matchScore[1],
          });
    }
    let playerStats = {};
    let status = $(
      "div > div.second-section-responsive > div.table-result ",
      el
    );

    // son muchos span unidos

    status.each((i, el) => {
      let stat = $(el).text().trim().split(" ");
      playerStats[stat[0]] = stat[1];
    });

    matchesData.push({
      champion,
      rival,
      date,
      result,
      matchUrl,
      playerStats,
    });
  });
  return {
    playerInfo,
    playerStats,
    mostUsed,
    matches: matchesData,
  };
};

const getTeam = async (teamName, league) => {
  const url = `https://${league}.lvp.global/equipo/${teamName}`;
  const response = await fetch(url);
  const data = await response.text();
  return data;
};

getPlayer("whiteknight", "superliga").then((res) => console.log(res));
