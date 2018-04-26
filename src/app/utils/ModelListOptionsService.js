import staffPicksDate from './DateService';

/* modelListOptions(lists, listType)
 * The function that models and returns the list options and the latest option.
 * The model might be different based on different list types.
 * @param {array} lists
 * @param {string} listType
 */
function modelListOptions(lists, listType) {
  let options = [];
  let latestOption = '';

  if (Array.isArray(lists) && lists.length) {
    lists.forEach((list) => {
      // Maps the option's name with the correct year and month
      // Now we only handle staff-picks, we will handle teens and kids later
      const optionDate = listType === 'staff-picks' ?
        staffPicksDate(list.date) : { month: '', year: '' };
      const optionName = (optionDate.month && optionDate.year) ?
        `${optionDate.month} ${optionDate.year}` : '';
      const option = { name: `${optionName}`, value: list.date };

      options.push(option);
    });

    // Reverses the order of the options as the data now is from oldest to newest
    // However, a more thorough check to compare the values might be needed
    options = options.reverse();
    // Sets the latest season list
    latestOption = options[0].value;
  }

  return { options, latestOption };
}

export default modelListOptions;
