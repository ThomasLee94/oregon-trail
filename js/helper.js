
function randomInt(n) {
  const {floor, random} = Math
  return floor(random() * n)
}

module.exports = {
  randomInt
}