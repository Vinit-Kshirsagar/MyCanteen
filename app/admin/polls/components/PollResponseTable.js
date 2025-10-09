// components/polls/PollResponseTable.js
'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  User, 
  ToggleLeft, 
  ToggleRight, 
  Check, 
  Clock, 
  CheckCircle, 
  UserX,
  Users,
  Phone
} from 'lucide-react';

export default function PollResponseTable({ data, onPollUpdate, loading, selectedDate }) {
  const [updatingPoll, setUpdatingPoll] = useState({});
  const supabase = createClientComponentClient();

  const handleAttendanceToggle = async (userId, currentAttendance, hasResponse) => {
    const updateKey = `${userId}_attendance`;
    setUpdatingPoll(prev => ({ ...prev, [updateKey]: true }));

    const newAttendance = !currentAttendance;

    try {
      if (hasResponse) {
        const { error } = await supabase
          .from('poll_responses')
          .update({ present: newAttendance })
          .eq('user_id', userId)
          .eq('date', selectedDate)
          .select();

        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from('poll_responses')
          .insert({
            user_id: userId,
            date: selectedDate,
            present: newAttendance,
            portion_size: 'full',
            confirmation_status: 'pending'
          })
          .select();

        if (error) throw new Error(error.message);
      }

      onPollUpdate();
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert(`Failed to update attendance: ${error.message}`);
    } finally {
      setUpdatingPoll(prev => ({ ...prev, [updateKey]: false }));
    }
  };

  const handlePortionToggle = async (userId, currentPortion, hasResponse) => {
    const updateKey = `${userId}_portion`;
    setUpdatingPoll(prev => ({ ...prev, [updateKey]: true }));

    const newPortion = currentPortion === 'full' ? 'half' : 'full';

    try {
      if (hasResponse) {
        const { error } = await supabase
          .from('poll_responses')
          .update({ portion_size: newPortion })
          .eq('user_id', userId)
          .eq('date', selectedDate)
          .select();

        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from('poll_responses')
          .insert({
            user_id: userId,
            date: selectedDate,
            present: true,
            portion_size: newPortion,
            confirmation_status: 'pending'
          })
          .select();

        if (error) throw new Error(error.message);
      }

      onPollUpdate();
    } catch (error) {
      console.error('Error updating portion:', error);
      alert(`Failed to update portion: ${error.message}`);
    } finally {
      setUpdatingPoll(prev => ({ ...prev, [updateKey]: false }));
    }
  };

  const handleConfirmResponse = async (userId) => {
    const updateKey = `${userId}_confirm`;
    setUpdatingPoll(prev => ({ ...prev, [updateKey]: true }));

    try {
      const { error } = await supabase
        .from('poll_responses')
        .update({ confirmation_status: 'confirmed' })
        .eq('user_id', userId)
        .eq('date', selectedDate)
        .select();

      if (error) throw new Error(error.message);

      onPollUpdate();
    } catch (error) {
      console.error('Error confirming response:', error);
      alert(`Failed to confirm response: ${error.message}`);
    } finally {
      setUpdatingPoll(prev => ({ ...prev, [updateKey]: false }));
    }
  };

  const getStatusBadge = (hasResponse, confirmationStatus) => {
    if (!hasResponse) {
      return (
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span className="text-sm font-medium text-gray-600">No Response</span>
        </div>
      );
    }

    const isPending = confirmationStatus === 'pending';
    return (
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${
          isPending ? 'bg-amber-400' : 'bg-emerald-400'
        }`}></div>
        <span className={`text-sm font-medium ${
          isPending ? 'text-amber-700' : 'text-emerald-700'
        }`}>
          {isPending ? 'Pending' : 'Confirmed'}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">No data matches the current filter criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide bg-gray-50/50">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide bg-gray-50/50">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide bg-gray-50/50">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide bg-gray-50/50">
                  Attendance
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide bg-gray-50/50">
                  Portion
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide bg-gray-50/50">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((item, index) => {
                const userId = item.user_id;
                const hasResponse = item.hasResponse;
                const isPresent = item.present || false;
                const portionSize = item.portion_size || 'full';
                const confirmationStatus = item.confirmation_status;
                const isPending = confirmationStatus === 'pending';
                const userData = item.user_data;

                return (
                  <tr
                    key={userId}
                    className={`group hover:bg-gray-50/80 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center border-2 ${
                          hasResponse 
                            ? isPending 
                              ? 'bg-amber-50 border-amber-200' 
                              : 'bg-emerald-50 border-emerald-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                          {hasResponse ? (
                            <User className={`w-5 h-5 ${
                              isPending ? 'text-amber-600' : 'text-emerald-600'
                            }`} />
                          ) : (
                            <UserX className="w-5 h-5 text-gray-400" />
                          )}
                          {hasResponse && (
                            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                              isPending ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}></div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {userData?.full_name || 'Unknown User'}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {userData?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {userData?.contact_number || 'No phone'}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      {getStatusBadge(hasResponse, confirmationStatus)}
                    </td>

                    <td className="px-6 py-5">
                      <button
                        onClick={() => handleAttendanceToggle(userId, isPresent, hasResponse)}
                        disabled={updatingPoll[`${userId}_attendance`]}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                          isPresent 
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' 
                            : 'text-red-700 bg-red-50 border-red-200 hover:bg-red-100'
                        } ${updatingPoll[`${userId}_attendance`] ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {isPresent ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        {updatingPoll[`${userId}_attendance`] 
                          ? 'Updating...' 
                          : isPresent ? 'Present' : 'Absent'
                        }
                      </button>
                    </td>

                    <td className="px-6 py-5">
                      <button
                        onClick={() => handlePortionToggle(userId, portionSize, hasResponse)}
                        disabled={updatingPoll[`${userId}_portion`]}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                          portionSize === 'full' 
                            ? 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100' 
                            : 'text-orange-700 bg-orange-50 border-orange-200 hover:bg-orange-100'
                        } ${updatingPoll[`${userId}_portion`] ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {updatingPoll[`${userId}_portion`] 
                          ? 'Updating...' 
                          : portionSize === 'full' ? 'Full' : 'Half'
                        }
                      </button>
                    </td>

                    <td className="px-6 py-5">
                      {hasResponse && isPending ? (
                        <button
                          onClick={() => handleConfirmResponse(userId)}
                          disabled={updatingPoll[`${userId}_confirm`]}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                        >
                          {updatingPoll[`${userId}_confirm`] ? (
                            <>
                              <Clock size={16} className="animate-spin" />
                              Confirming...
                            </>
                          ) : (
                            <>
                              <Check size={16} />
                              Confirm
                            </>
                          )}
                        </button>
                      ) : hasResponse && !isPending ? (
                        <div className="inline-flex items-center gap-2 px-3 py-2 text-emerald-700 bg-emerald-50 text-sm font-medium rounded-xl border border-emerald-200">
                          <CheckCircle size={16} />
                          Confirmed
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}