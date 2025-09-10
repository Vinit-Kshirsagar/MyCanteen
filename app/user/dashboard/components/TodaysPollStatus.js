const getConfirmationBadge = (status) => {
  if (!status) return null
  
  const badges = {
    pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending Confirmation' },
    confirmed: { color: 'bg-green-100 text-green-800', text: 'Confirmed' }
  }
  
  const badge = badges[status]
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
      {badge.text}
    </span>
  )
}

export default function TodaysPollStatus({ userStats, onUpdateResponse }) {
  if (!userStats.todaysPollResponse) {
    return null
  }

  return (
    <div className="mb-8 bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Today&apos;s Poll Response</h3>
          <p className="text-sm text-gray-600 mt-1">
            {userStats.todaysPollResponse.present ? 'Attending' : 'Not Attending'} • 
            {userStats.todaysPollResponse.present && ` ${userStats.todaysPollResponse.portion_size} portion`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {getConfirmationBadge(userStats.confirmationStatus)}
          <button
            onClick={onUpdateResponse}
            className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Update Response
          </button>
        </div>
      </div>
    </div>
  )
}