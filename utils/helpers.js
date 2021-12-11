const getDateQuery = (fromInput, toInput) => {
  const from = fromInput && new Date(new Date(fromInput));
  const to = toInput && new Date(new Date(toInput));
  if (from && to) {
    return {
      $exists: true,
      $gte: from,
      $lt: to,
    };
  }
  if (from && !to) {
    return {
      $exists: true,
      $gte: from,
    };
  }
  if (!from && to) {
    return {
      $exists: true,
      $lt: to,
    };
  }
  return {
    $exists: true,
  };
};

module.exports = getDateQuery;
