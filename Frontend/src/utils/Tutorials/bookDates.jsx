/**
 * dateHelper module to generate next n days randomly to simulate booking date for tutors
 * @param {int} num_days next n number of days 
 * @returns array of strings with "date" property in ascending sorted date order
 */
export function dateHelper(num_days) {
  // future date helper object to pick future dates
  const futureDateHelper = {
    addDays: function (aDate, numberOfDays) {
      aDate.setDate(aDate.getDate() + numberOfDays);
      return aDate;
    },
    format: function (date) {
      return [
        ("0" + (date.getMonth() + 1)).slice(-2),
        ("0" + date.getDate()).slice(-2),
        date.getFullYear(),
      ].join("/");
    },
  };

  // pick the next num_days days and sort
  let dates = [];

  for (let i = 0; i < num_days; i++) {
    // Generate a new Date instance for each iteration to avoid reference mutation
    let baseDate = new Date();
    let randomDaysAhead = Math.floor(Math.random() * 5) + 1;
    let newDate = futureDateHelper.format(
      futureDateHelper.addDays(baseDate, randomDaysAhead)
    );

    dates.push(newDate);
  }

  return dates.sort();
}