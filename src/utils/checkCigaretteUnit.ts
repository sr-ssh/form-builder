export const checkCigaretteUnit = (packet: string, year: number) => {
  let cigaretteInWeek = 0.0;
  switch (packet) {
    case "0":
      cigaretteInWeek = 0.25;
      break;
    case "1":
      cigaretteInWeek = 0.5;
      break;
    case "2":
      cigaretteInWeek = 1;
      break;
    case "3":
      cigaretteInWeek = 2;
      break;

    default:
      break;
  }
  const cigaretteUnit = cigaretteInWeek * year;
  return cigaretteUnit;
};
