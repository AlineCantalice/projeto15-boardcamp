import connection from '../dbStrategies/postgres.js'

export async function getAllCustomers(req, res) {
  const { rows: customers } = await connection.query('SELECT * FROM customers')

  res.status(200).send(customers)
}

export async function getCustomerById(req, res) {
  const { id } = req.params

  const {
    rows: customer,
  } = await connection.query(`SELECT * FROM customers WHERE id=$1`, [id])

  if (customer.length > 0) {
    return res.status(200).send(customer)
  }

  return res.status(404).send('Cliente não cadastrado!')
}

export async function createCustomer(req, res) {
  const customer = req.body

  await connection.query(
    `INSERT INTO customers (name, phone, cpf, birthday) VALUES ('${customer.name}', '${customer.phone}', '${customer.cpf}', '${customer.birthday}')`,
  )

  res.sendStatus(201)
}

export async function updateCustomer(req, res) {
  const customer = req.body
  const { id } = req.params

  //ESTA COM PROBLEMA
  await connection.query(
    `UPDATE customers SET name='${customer.name}', phone='${customer.phone}', cpf='${customer.cpf}', birthday='${customer.birthday}' WHERE id=$1`,
    [id],
  )

  res.sendStatus(200)
}
