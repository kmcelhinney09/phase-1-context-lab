/*
createEmployeeRecord
Argument(s): A 4-element Array of a String, String, String, and Number corresponding to a first name, family name, title, and pay rate per hour
Returns JavaScript Object with keys: firstName, familyName, title, payPerHour, timeInEvents, timeOutEvents
Behavior
Loads Array elements into corresponding Object properties. Additionally, initialize empty Arrays on the properties timeInEvents and timeOutEvents.
*/

function createEmployeeRecord(employeeData) {
  const employeeRecord = {}
  employeeRecord["firstName"] = employeeData[0]
  employeeRecord["familyName"] = employeeData[1]
  employeeRecord["title"] = employeeData[2]
  employeeRecord["payPerHour"] = employeeData[3]
  employeeRecord["timeInEvents"] = []
  employeeRecord["timeOutEvents"] = []

  return employeeRecord
}

/*
createEmployeeRecords
Argument(s): Array of Arrays
Returns: Array of Objects
Behavior: Converts each nested Array into an employee record using createEmployeeRecord and accumulates it to a new Array
*/
const createEmployeeRecords = function (arrayOfEmployees) {
  const employeesArray = arrayOfEmployees.map(employeeData => {
    return createEmployeeRecord(employeeData)
  })
  return employeesArray
}

/*
createTimeInEvent
Argument(s): A date stamp ("YYYY-MM-DD HHMM"), where time is expressed in 24-hour standard (Links to an external site.)
Returns: The record that was just updated
Behavior: Add an Object with keys: type: Set to "TimeIn", hour: Derived from the argument, date: Derived from the argument
*/
let createTimeInEvent = function (dateStamp) {
  const newClockEvent = makeClockEvent(dateStamp)
  newClockEvent.type = "TimeIn"
  this.timeInEvents.push(newClockEvent)
  return this
}
/*
createTimeOutEvent
Argument(s): A date stamp ("YYYY-MM-DD HHMM"), where time is expressed in 24-hour standard (Links to an external site.)
Returns: The record that was just updated
Behavior: Add an Object with keys: type: Set to "TimeOut", hour: Derived from the argument, date: Derived from the argument
*/
let createTimeOutEvent = function (dateStamp) {
  const newClockEvent = makeClockEvent(dateStamp)
  newClockEvent.type = "TimeOut"
  this.timeOutEvents.push(newClockEvent)
  return this
}
/*
hoursWorkedOnDate
Argument(s): A date of the form "YYYY-MM-DD"
Returns: Hours worked, an Integer
Behavior: Given a date, find the number of hours elapsed between that date's timeInEvent and timeOutEvent
*/
let hoursWorkedOnDate = function (targetDate) {
  const timeIn = this.timeInEvents.filter(clockEvent => {
    if (clockEvent.date === targetDate) {
      return clockEvent
    }
  })
  const timeOut = this.timeOutEvents.filter(clockEvent => {
    if (clockEvent.date === targetDate) {
      return clockEvent
    }
  })
  return (timeOut[0].hour - timeIn[0].hour) / 100
}
/*
wagesEarnedOnDate
Argument(s): A date of the form "YYYY-MM-DD"
Returns: Pay owed
Behavior: Using hoursWorkedOnDate, multiply the hours by the record's payRate to determine amount owed. Amount should be returned as a number.
*/
const wagesEarnedOnDate = function (targetDate) {
  return hoursWorkedOnDate.call(this, targetDate) * this.payPerHour
}

/*
allWagesFor
Argument(s): None
Returns: Sum of pay owed to one employee for all dates, as a number
Behavior: Using wagesEarnedOnDate, accumulate the value of all dates worked by the employee in the record used as context. Amount should be returned as a number. HINT: You will need to find the available dates somehow....

 We're giving you this function. Take a look at it, you might see some usage
 that's new and different. That's because we're avoiding a well-known, but
 sneaky bug that we'll cover in the next few lessons!

 As a result, the lessons for this function will pass *and* it will be available
 for you to use if you need it!
 */
const allWagesFor = function () {
  const eligibleDates = this.timeInEvents.map(function (e) {
    return e.date
  })

  const payable = eligibleDates.reduce(function (memo, d) {
    return memo + wagesEarnedOnDate.call(this, d)
  }.bind(this), 0) // <== Hm, why did we need to add bind() there? We'll discuss soon!

  return payable
}

/*
findEmployeeByFirstName
Argument(s): srcArray: Array of employee records, firstName: String representing a first name held in an employee record
Returns: Matching record or undefined
Behavior: Test the firstName field for a match with the firstName argument
*/
function findEmployeeByFirstName(employeesArray, targetName){
  return employeesArray.find(employee => employee.firstName === targetName)
}
/*
calculatePayroll
Argument(s): Array of employee records
Returns: Sum of pay owed for all employees for all dates, as a number
Behavior: Using allWagesFor for each of the employees, accumulate the value of all dates worked by the employee in the record used as context. Amount should be returned as a number.
*/
function calculatePayroll(allEmployees){
  const wagesForAllEmployees = allEmployees.map(employee => {
    return allWagesFor.call(employee)
})
return wagesForAllEmployees.reduce((payroll, wages) => payroll + wages)
}




//Helper Funcitons
function makeClockEvent(dateStamp) {
  const eventDateTime = {}
  const arrayOfDateAndTime = dateStamp.split(" ")
  eventDateTime["type"] = ""
  eventDateTime["hour"] = parseInt(arrayOfDateAndTime[1])
  eventDateTime["date"] = arrayOfDateAndTime[0]

  return eventDateTime

}


/* const testingEmployeeArray = [
  ['Kevin', 'McElhinney', 'CEO', 150],
  ['Shelby', 'Smith', 'CTO', 100],
  ['Dan', 'Anderson', 'VP Development', 75],
  ['Kevin', 'Baker', 'Engineer', 70]
]

function testingTimeIn() {
  let bpRecord = createEmployeeRecord(["Byron", "Poodle", "Mascot", 3])
  console.log(`Orginal Employee Record :`)
  console.log(bpRecord)
  let updatedBpRecord = createTimeInEvent.call(bpRecord, "2014-02-28 1200")
  console.log(updatedBpRecord)
  let newEvent = updatedBpRecord.timeInEvents[0]
  console.log(newEvent)
  console.log(newEvent.type)
}

function testingTimeOut() {
  let bpRecord = createEmployeeRecord(["Byron", "Poodle", "Mascot", 3])
  console.log(`Orginal Employee Record :`)
  console.log(bpRecord)
  let updatedBpRecord = createTimeOutEvent.call(bpRecord, "2014-02-28 1600")
  console.log(updatedBpRecord)
  let newEvent = updatedBpRecord.timeInEvents[0]
  console.log(newEvent)
  console.log(newEvent.type)
}

function testingHoursWorked() {
  cRecord = createEmployeeRecord(["Julius", "Caesar", "General", 1000])
  createTimeInEvent.call(cRecord, "2044-03-15 0900")
  createTimeOutEvent.call(cRecord, "2044-03-15 1100")
  console.log(hoursWorkedOnDate.call(cRecord, "2044-03-15"))
}

function testingWagesEarned() {
  cRecord = createEmployeeRecord(["Julius", "Caesar", "General", 27])
  createTimeInEvent.call(cRecord, "2044-03-15 0900")
  createTimeOutEvent.call(cRecord, "2044-03-15 1100")
  console.log(wagesEarnedOnDate.call(cRecord, "2044-03-15"))
}
function testingFunctions() {
  // console.log(createEmployeeRecord(testingEmployeeArray[0]))
  // console.log(createEmployeeRecords(testingEmployeeArray))
  // testingTimeIn()
  // testingTimeOut()
  // testingHoursWorked()
  testingWagesEarned()

}

testingFunctions() */