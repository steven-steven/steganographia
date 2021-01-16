export default (req, res) => {
  switch (req.method) {
    case 'POST': {
      console.log(req);
      res.json({ message: 'post the data and return the encoded image' })
      break
    }
  }
}