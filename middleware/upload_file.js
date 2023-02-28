export default function (req, res, next) {
  console.log(req.body);
  res.status(200).send("successful");
}

