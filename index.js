const getPlayer = require("./getPlayer")
const getTeam = require("./getTeam")
// Posible leagues:
// 1. superliga = League of Legends
// 2. vrlrising = Valorant

// url examples:
// https://superliga.lvp.global/jugador/whiteknight/
// https://vrlrising.lvp.global/jugador/neptuNo/

// getPlayer("whiteknight", "superliga").then((res) => console.log(res))
getTeam("bar", "superliga")
//.then((res) => console.log(res))
