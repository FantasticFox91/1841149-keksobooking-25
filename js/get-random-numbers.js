function getRandomNumber(min, max) {
  min = Math.abs(min);
  max = Math.abs(max);
  if (min === max) {
    return min;
  } else if (min > max) {
    throw new Error('Incorrect range. Your minimun number is greater than maximum');
  }
  return (Math.random() * (max - min + 1) + min);
}

const getRoundedRandomNumber = (min, max) => Math.floor(getRandomNumber(min, max));

const getRandomNumberWithFloat = (min,max,floatNumber = 1) => Number(getRandomNumber(min, max).toFixed(floatNumber));

export {getRoundedRandomNumber, getRandomNumberWithFloat};
