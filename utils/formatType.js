const formatType = (eventType) => {
  switch (eventType) {
    case "HANDBALL":
      return "Handball";
    case "FOOTBALL":
      return "Football";
    case "BASKETBALL":
      return "Basketball";
    case "GOLF":
      return "Golf";

    default:
      return eventType;
  }
};

module.exports = { formatType };
