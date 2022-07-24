import connection from '../dbStrategies/postgres.js'

export async function getAllCustomers(req, res) {
  const { cpf } = req.query

  if (cpf) {
    const {
      rows: customers,
    } = await connection.query(`SELECT * FROM customers WHERE cpf LIKE $1`, [
      `${cpf}%`,
    ])

    return res.status(200).send(customers)
  }

  const { rows: customers } = await connection.query('SELECT * FROM customers')

  res.status(200).send(customers)
}

export async function getCustomerById(req, res) {
  const { id } = req.params

  const {
    rows: customer,
  } = await connection.query(`SELECT * FROM customers WHERE id=$1`, [id])

  if (customer[0]) {
    return res.status(200).send(customer)
  }

  return res.status(404).send('Cliente não cadastrado!')
}

export async function createCustomer(req, res) {
  const customer = req.body

  const cpfRegex = new RegExp(/[0-9]{11}/)
  const phoneRegex = new RegExp(/^(?=(?:.{10}|.{11})$)[0-9]*$/)
  const dateRegex = new RegExp(
    /^(19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/,
  )

  if (
    !customer.name ||
    !cpfRegex.test(customer.cpf) ||
    !phoneRegex.test(customer.phone) ||
    !dateRegex.test(customer.birthday)
  ) {
    return res.status(400).send('Os campos não estão preenchidos corretamente!')
  }

  const {
    rows: customers,
  } = await connection.query(`SELECT * FROM customers WHERE cpf='$1'`, [
    customer[0].cpf,
  ])

  if (customers[0]) {
    return res.status(409).send('Cliente já cadastrado!')
  }

  await connection.query(
    `INSERT INTO customers (name, phone, cpf, birthday) VALUES ('$1', '$2', '$3', '$4')`,
    [customer.name, customer.phone, customer.cpf, customer.birthday]
  )

  res.sendStatus(201)
}

export async function updateCustomer(req, res) {
  const customer = req.body
  const { id } = req.params

  const cpfRegex = new RegExp(/[0-9]{11}/)
  const phoneRegex = new RegExp(/^(?=(?:.{10}|.{11})$)[0-9]*$/)
  const dateRegex = new RegExp(
    /^(19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/,
  )

  if (
    !customer.name ||
    !cpfRegex.test(customer.cpf) ||
    !phoneRegex.test(customer.phone) ||
    !dateRegex.test(customer.birthday)
  ) {
    return res.status(400).send('Os campos não estão preenchidos corretamente!')
  }

  const {
    rows: customers,
  } = await connection.query(`SELECT * FROM customers WHERE cpf=$1`, [
    customer.cpf,
  ])

  if (customers[0]) {
    return res.status(409).send('Cliente já cadastrado!')
  }

  await connection.query(
    `UPDATE customers SET name='$1', phone='$2', cpf='$3', birthday='$4' WHERE id=$5`,
    [customer.name, customer.phone, customer.cpf, customer.birthday, id],
  )

  res.sendStatus(200)
}
