import React, { useState } from "react";
import axios from "axios";

const ModifyRegNoModal = ({ open, onClose }) => {
  const [oldRegNumber, setOldRegNumber] = useState("");
  const [newRegNumber, setNewRegNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.patch(`${process.env.REACT_APP_BASE_URL}/students/regno`, {
        oldRegNumber,
        newRegNumber,
      }, { withCredentials: true });

      setOldRegNumber("");
      setNewRegNumber("");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white shadow-lg rounded-lg max-w-sm w-full p-6 relative">
        <button className="absolute right-3 top-3 text-xl" onClick={onClose}>✕</button>
        <h2 className="text-xl font-semibold mb-4">🖉 Modify Registration Number</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            Old Reg. Number
            <input
              type="text"
              value={oldRegNumber}
              onChange={(e) => setOldRegNumber(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </label>
          <label className="block mb-2">
            New Reg. Number
            <input
              type="text"
              value={newRegNumber}
              onChange={(e) => setNewRegNumber(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </label>
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <button
            className="btn btn-primary mt-4 w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModifyRegNoModal;
