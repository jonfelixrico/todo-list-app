import form from './task-form'

export default {
  dialogs: {
    deleteTaskConfirm: {
      confirm: 'Yes, delete',
      cancel: 'Cancel',
      title: 'Delete Task',
      message: 'Are you sure you want to delete this task?',
    },

    deleteTaskSuccess: {
      title: 'Task Deleted',
      message: 'Task "{title}" has been deleted.',
    },

    deleteTaskError: {
      title: 'Task Delete Error',
      message:
        'Something wrong happened while deleting task "{title}": {errorMessage}',
    },
  },

  form,

  daysLapsed: '1 day lapsed | {count} days lapsed',
  completedOn: 'Completed on {date}',
  carriedOverFrom: 'Carried over from {date}',
  priority: 'Priority {priorityRating}',
  showDetails: 'Show Details',
}
