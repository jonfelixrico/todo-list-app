export default {
  title: 'Add to-do task',
  dueDtLbl: 'For {dueDt}',
  inputs: {
    title: {
      label: 'Title',
      hint: 'Description or title of your task.',
    },

    notes: {
      label: 'Notes',
      hint: 'Optional. Place additional details of your task here.',
    },

    hasPriority: {
      label: 'Has priority?',
    },

    priority: {
      label: 'Priority',
      hint: '1 for least priority, 10 for most priority.',
    },

    carryOver: {
      label: 'Carry-over',
      options: {
        no: 'Do not carry over',
        untilDate: 'Carry over until {date}',
      },

      date: {
        ariaLabel: 'Carry over until...',
      },
    },
  },

  buttons: {
    discard: 'Discard',
    create: 'Create task',
  },
}
