function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(str => parseInt(str))
  return hours * 60 + minutes
}
function updateCalendar(calendar, dailyBounds) {
  const updatedCalendar = [['0:00', dailyBounds[0]], ...calendar, [dailyBounds[1], '23:59']]

  return updatedCalendar.map(meeting => meeting.map(timeToMinutes))
}

function mergeCalendars(calendar1, calendar2) {
  let mergedCalendars = []
  let i = 0
  let j = 0

  while (i < calendar1.length && j < calendar2.length) {
    if (calendar1[i][0] < calendar2[j][0]) {
      mergedCalendars.push(calendar1[i])
      i += 1
    } else {
      mergedCalendars.push(calendar2[j])
      j += 1
    }
  }

  while (i < calendar1.length) {
    mergedCalendars.push(calendar1[i])
    i += 1
  }

  while (j < calendar2.length) {
    mergedCalendars.push(calendar2[j])
    j += 1
  }

  return mergedCalendars
}

function flattenCalendar(calendar) {
  let flattened = [calendar[0]]

  for (let i = 1; i < calendar.length; i += 1) {
    let currMeeting = calendar[i]
    let prevMeeting = flattened[flattened.length - 1]

    let [currStart, currEnd] = currMeeting
    let [prevStart, prevEnd] = prevMeeting

    if (prevEnd >= currStart) {
      let newCurrMeeting = [prevStart, Math.max(prevEnd, currEnd)]
      flattened[flattened.length - 1] = newCurrMeeting
    } else {
      flattened.push(currMeeting)
    }
  }

  return flattened
}

function minutesToTime(match) {
  let hour = Math.floor(match / 60)
  let minutes = match % 60
  if (minutes < 10) {
    minutes = '0' + minutes
  }

  return `${hour}:${minutes}`
}

function getMatchingAvailabilities(calendar, meetingDuration) {
  let matchingAvailabilities = []

  for (let i = 1; i < calendar.length; i += 1) {
    let start = calendar[i - 1][1]
    let end = calendar[i][0]
    let availabilityDuration = end - start

    if (availabilityDuration >= meetingDuration) {
      matchingAvailabilities.push([start, end])
    }
  }

  return matchingAvailabilities.map(match => match.map(minutesToTime))
}

function calendarMatching(calendar1, dailyBounds1, calendar2, dailyBounds2, meetingDuration) {
  const updatedCalendar1 = updateCalendar(calendar1, dailyBounds1)
  const updatedCalendar2 = updateCalendar(calendar2, dailyBounds2)
  const mergedCalendars = mergeCalendars(updatedCalendar1, updatedCalendar2)
  const flattedCalendar = flattenCalendar(mergedCalendars)

  return getMatchingAvailabilities(flattedCalendar, meetingDuration)
}

let calendar1 = [['9:00', '10:30'], ['12:00', '13:00'], ['16:00', '18:00']]
let dailyBounds1 = ['9:00', '20:00']
let calendar2 = [['10:00', '11:30'], ['12:30', '14:30'], ['14:30', '15:00'], ['16:00', '17:00']]
let dailyBounds2 = ['10:00', '18:30']
let meetingDuration = 30

console.log(calendarMatching(calendar1, dailyBounds1, calendar2, dailyBounds2, meetingDuration));
