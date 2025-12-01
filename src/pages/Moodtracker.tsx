import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { joinUrl } from "@/lib/api";

const moods = [
  { emoji: "😊", label: "Happy", color: "bg-yellow-300" },
  { emoji: "😔", label: "Sad", color: "bg-blue-300" },
  { emoji: "😡", label: "Angry", color: "bg-red-300" },
  { emoji: "😌", label: "Calm", color: "bg-green-300" },
  { emoji: "😴", label: "Tired", color: "bg-purple-300" },
];

const MoodTracker: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [weeklyReport, setWeeklyReport] = useState<Record<string, number>>({});
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // Save mood to backend
  const handleSubmit = async () => {
    if (!selectedMood) {
      alert("Please select a mood before continuing!");
      return;
    }

    try {
      await axios.post(joinUrl('/api/mood'), {
        userId,
        mood: selectedMood,
      });
      console.log("Mood saved:", selectedMood);
      fetchWeeklyReport(); // Refresh report after submission
      navigate("/"); // Redirect to homepage
    } catch (err) {
      console.error("Failed to save mood:", err);
      alert("Error saving mood. Try again.");
    }
  };

  // Fetch weekly mood report
  const fetchWeeklyReport = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(joinUrl(`/api/mood/weekly/${userId}`));
      setWeeklyReport(res.data.weeklyReport || {});
    } catch (err) {
      console.error("Failed to fetch weekly report:", err);
    }
  };

  useEffect(() => {
    fetchWeeklyReport();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('toDoBG.jpeg')" }}
    >
      <div className="bg-white bg-opacity-90 shadow-lg rounded-2xl p-8 w-full max-w-lg text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          How are you feeling today?
        </h1>
        <p className="text-gray-500 mb-6">
          Select your current mood to personalize your wellness journey.
        </p>

        <div className="flex justify-between items-center gap-4 mb-6">
          {moods.map((mood) => (
            <button
              key={mood.label}
              onClick={() => setSelectedMood(mood.label)}
              className={`flex flex-col items-center justify-center rounded-xl p-4 transition-all transform hover:scale-110
                ${
                  selectedMood === mood.label
                    ? `${mood.color} ring-4 ring-blue-400`
                    : "bg-gray-100"
                }
              `}
            >
              <span className="text-3xl">{mood.emoji}</span>
              <span className="mt-1 text-xs font-medium text-gray-700">
                {mood.label}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all"
        >
          Continue
        </button>
      </div>

      {/* Weekly Report
      <div className="bg-white bg-opacity-90 shadow-lg rounded-2xl p-6 w-full max-w-lg text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Mood Report</h2>
        {Object.keys(weeklyReport).length === 0 ? (
          <p className="text-gray-500">No moods recorded this week.</p>
        ) : (
          <ul className="space-y-2">
            {Object.entries(weeklyReport).map(([mood, count]) => (
              <li key={mood} className="text-gray-800 font-medium">
                {mood}: {count} {count === 1 ? "time" : "times"}
              </li>
            ))}
          </ul>
        )}
      </div> */}
    </div>
  );
};

export default MoodTracker;
