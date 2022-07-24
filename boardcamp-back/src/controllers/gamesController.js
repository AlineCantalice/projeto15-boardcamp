import connection from '../dbStrategies/postgres.js'

export async function getAllGames(req, res) {
  let { name } = req.query
  if (name) {
    name = name.toLowerCase()
    const { rows: games } = await connection.query(
      `SELECT games.*, categories.name as "categoryName"
       FROM games
       JOIN categories
       ON games."categoryId" = categories.id        
       WHERE LOWER(games.name) LIKE $1`,
      [`${name}%`],
    )

    res.status(200).send(games)
  }
  const { rows: games } = await connection.query(
    `SELECT games.*, categories.name as "categoryName"
       FROM games
       JOIN categories
       ON games."categoryId" = categories.id`,
  )

  res.status(200).send(games)
}

export async function createGame(req, res) {
  const game = req.body

  const {
    rows: category,
  } = await connection.query(`SELECT * FROM  categories WHERE id=$1`, [
    game.categoryId,
  ])

  if (
    !game.name ||
    !category[0] ||
    game.stockTotal === 0 ||
    game.pricePerDay === 0
  ) {
    return res.status(400).send('Os campos não estão preenchidos corretamente!')
  }

  const {
    rows: existGame,
  } = await connection.query(`SELECT * FROM games WHERE name=('$1')`, [
    game.name,
  ])

  if (existGame.length > 0) {
    return res.status(409).send('Jogo já existe!')
  }

  await connection.query(
    `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ('$1', '$2', '$3', '$4', '$5')`,
    [game.name, game.image, game.stockTotal, game.categoryId, game.pricePerDay],
  )

  res.sendStatus(201)
}
