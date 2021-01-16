export default (req, res) => {
  switch (req.method) {
    case 'POST': {
      res.json({ message: 'verified. return the data' })
      break
    }
  }
}