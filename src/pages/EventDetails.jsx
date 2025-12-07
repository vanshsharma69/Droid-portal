import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMembers } from "../context/MembersContext";
import { useEvents } from "../context/EventsContext";
import { useAttendance } from "../context/AttendanceContext";
import Modal from "../components/Modal";

export default function EventDetails() {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { members } = useMembers();
  const { getEventById, fetchEvent, events, deleteEvent } = useEvents();
  const {
    eventAttendance,
    refreshEventAttendance,
    createEventAtt,
    updateEventAtt,
    deleteEventAtt,
  } = useAttendance();

  const [event, setEvent] = useState(state?.event || null);
  const [showAssign, setShowAssign] = useState(false);
  const [assignForm, setAssignForm] = useState({ memberId: "", attended: false });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const normalizeMemberId = (val) => {
    const raw = typeof val === "object" ? val?.memberId ?? val?.id : val;
    const num = Number(raw);
    return Number.isNaN(num) ? null : num;
  };

  const eventIdRaw = state?.event?.eventId ?? state?.event?._id ?? state?.event?.id ?? id;
  const parsedId = Number(eventIdRaw);
  const eventId = Number.isNaN(parsedId) ? null : parsedId;

  useEffect(() => {
    if (!eventId) return;
    const existing = getEventById(eventId) || state?.event;
    if (existing) {
      setEvent(existing);
    } else {
      fetchEvent(eventId).then(setEvent).catch((err) => setError(err?.message || "Event not found"));
    }
  }, [eventId, getEventById, fetchEvent, state]);

  useEffect(() => {
    refreshEventAttendance();
  }, [refreshEventAttendance]);

  useEffect(() => {
    const updated = getEventById(eventId);
    if (updated) setEvent(updated);
  }, [events, getEventById, eventId]);

  const assigned = useMemo(() => {
    return eventAttendance
      .filter((ea) => Number(ea.eventId) === Number(eventId))
      .map((ea) => ({
        ...ea,
        member: members.find((m) => String(m.memberId ?? m.id) === String(ea.memberId)),
      }))
      .filter((ea) => ea.member);
  }, [eventAttendance, members, eventId]);

  const availableMembers = members.filter((m) => {
    const mid = normalizeMemberId(m);
    if (mid === null) return false;
    return !assigned.some((rec) => normalizeMemberId(rec) === mid);
  });

  if (!eventId || (!event && !error)) {
    return <h1 className="text-xl font-bold mt-10 text-center">Loading event...</h1>;
  }

  if (error || !event) {
    return <h1 className="text-xl font-bold mt-10 text-center text-red-600">{error || "Event Not Found"}</h1>;
  }

  const assignMember = async () => {
    const memberIdNum = normalizeMemberId(assignForm.memberId);
    const member = members.find((m) => normalizeMemberId(m) === memberIdNum);
    if (!memberIdNum || !member) return alert("Select a valid member");
    setBusy(true);
    try {
      await createEventAtt({ memberId: memberIdNum, eventId: Number(eventId), attended: assignForm.attended });
      setAssignForm({ memberId: "", attended: false });
      setShowAssign(false);
    } catch (err) {
      alert(err?.message || "Failed to assign member");
    } finally {
      setBusy(false);
    }
  };

  const removeMember = async (rec) => {
    if (!confirm("Remove this member from event?")) return;
    if (!rec.id) return alert("Cannot delete: missing attendance id");
    setBusy(true);
    try {
      await deleteEventAtt(rec.id);
    } catch (err) {
      alert(err?.message || "Failed to remove member");
    } finally {
      setBusy(false);
    }
  };

  const toggleAttendance = async (rec) => {
    if (!rec.id) return alert("Cannot update: missing attendance id");
    setBusy(true);
    try {
      await updateEventAtt(rec.id, { attended: !rec.attended });
    } catch (err) {
      alert(err?.message || "Failed to update attendance");
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!confirm("Delete this event?")) return;
    setBusy(true);
    try {
      await deleteEvent(event.id);
      navigate("/events");
    } catch (err) {
      alert(err?.message || "Failed to delete event");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
    <div className="max-w-6xl mx-auto py-6">

      {/* PAGE HEADER */}
      <h1 className="text-3xl font-bold mb-8">{event.name}</h1>

      {/* EVENT CARD */}
      <div className="bg-white p-6 rounded-xl shadow mb-10 border border-gray-200">
        <p className="text-lg">
          <span className="font-semibold">Event Type:</span> {event.type || "General"}
        </p>

        <p className="text-lg mt-1">
          <span className="font-semibold">Total Assigned Members:</span>{" "}
          {assigned.length}
        </p>

        {(user?.role === "superadmin" || user?.role === "admin") && (
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setShowAssign(true)}
              className="px-4 py-2 bg-black text-white rounded-lg"
            >
              + Assign Member
            </button>
            <button
              onClick={handleDeleteEvent}
              disabled={busy}
              className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-60"
            >
              {busy ? "Working..." : "Delete Event"}
            </button>
          </div>
        )}
      </div>

      {/* MEMBER LIST */}
      <h2 className="text-2xl font-semibold mb-4">Assigned Members</h2>

      <div className="bg-white p-6 rounded-xl shadow border">

        {assigned.length === 0 ? (
          <p className="text-gray-600">No members assigned.</p>
        ) : (
          <ul className="space-y-4">

            {assigned.map((record) => (
              <li
                key={record.id || `${record.eventId}-${record.memberId}`}
                className="flex items-center justify-between p-4 bg-gray-50 border rounded-lg"
              >
                {/* Member Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={record.member.img}
                    className="w-14 h-14 rounded-full object-cover shadow"
                  />

                  <div>
                    <p className="text-lg font-semibold">{record.member.name}</p>
                    <p className="text-gray-500 text-sm">{record.member.role}</p>

                    <p
                      className={`mt-1 text-sm font-semibold ${
                        record.attended ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {record.attended ? "Attended" : "Not Attended"}
                    </p>
                  </div>
                </div>

                {/* Admin Actions */}
                {(user?.role === "superadmin" || user?.role === "admin") && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleAttendance(record)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                    >
                      Toggle
                    </button>

                    <button
                      onClick={() => removeMember(record)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </li>
            ))}

          </ul>
        )}

      </div>
    </div>

    <Modal
      open={showAssign}
      title="Assign Member"
      onClose={() => setShowAssign(false)}
      footer={(
        <div className="flex justify-end gap-3">
          <button onClick={() => setShowAssign(false)} className="px-4 py-2 rounded border" type="button">
            Cancel
          </button>
          <button onClick={assignMember} className="px-4 py-2 rounded bg-black text-white" type="button" disabled={busy}>
            {busy ? "Saving..." : "Save"}
          </button>
        </div>
      )}
    >
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Member</label>
          <select
            className="w-full rounded-lg border p-2"
            value={assignForm.memberId}
            onChange={(e) => setAssignForm({ ...assignForm, memberId: e.target.value })}
          >
            <option value="">Select member</option>
            {availableMembers.map((m) => (
              <option key={m.id} value={m.memberId ?? m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="assign-attended"
            checked={assignForm.attended}
            onChange={(e) => setAssignForm({ ...assignForm, attended: e.target.checked })}
          />
          <label htmlFor="assign-attended" className="text-sm text-gray-700">Mark attended</label>
        </div>
      </div>
    </Modal>
    </>
  );
}
