const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
app.use(express.json())
const dbPath = path.join(__dirname, 'cricketTeam.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

//get

initializeDBAndServer()
app.get('/players/:player_id/', async (require, response) => {
  const {player_id} = require.params
  const getBookQuery = `
        SELECT
            *
            FROM
        cricket_team
        where player_id = ${player_id}
    `
  const cricket = await db.get(getBookQuery)
  response.send(cricket)
})

//post

app.post('/players/', async (require, response) => {
  const playerDetails = require.body
  const {playerName, jerseyNumber, role} = playerDetails
  const addplayerDetails = `
      INSERT INTO 
      cricket_team(player_name, jersey_number, role)
      VALUES('${playerName}',
            ${jerseyNumber},
            '${role}')
    `
  const dbresponse = await db.run(addplayerDetails)
  response.send('Player Added to Team')
})

app.put('/players/:playerId/', async (require, response) => {
  const {playerId} = require.params
  const playerDetails = require.body
  const {playerName, jerseyNumber, role} = playerDetails
  const upadateDetails = `
      UPDATE cricket_team
      SET
      player_name='${playerName}',
      Jersey_number=${jerseyNumber},
      role='${role}'
    WHERE player_id=${playerId}
    `
  await db.run(upadateDetails)
  response.send('Book Update Successfully')
})

app.delete('/players/:playerId', async (require, response) => {
  const {playerId} = require.params
  const deletePlayer = `
    DELETE FROM
      cricket_team
    WHERE
      player_id=${playerId}
  `
  await db.run(deletePlayer)
  response.send('Player Removed')
})
module.exports = app
