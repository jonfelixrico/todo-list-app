export default {
  title: {
    label: 'Title',
    hint: 'Description or title of your task',
    error: 'Title is required',
  },

  notes: {
    label: 'Notes',
    hint: 'Optional. Place additional details of your task here',
  },

  priority: {
    label: 'Priority',
    hint: '0 for no priority, 10 for top priority',
  },

  carryOver: {
    label: 'Carry-over days',
    hint: 'How many days to show the task even if the due date has lapsed',
    carriedOverUntil: 'Carried-over until {date}',
  },
}
