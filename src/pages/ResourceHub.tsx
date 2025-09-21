import { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { Card, CardTitle } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { BookOpen, Book, Play, Volume2, Heart } from "lucide-react";
import axios from "axios";
import "../index.css";

interface Task {
  text: string;
  completed: boolean;
}

const ResourceHub = () => {
  const [journalEntry, setJournalEntry] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [entries, setEntries] = useState<{ _id: string; entry: string; date: string }[]>([]);

  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const [breatherTime, setBreatherTime] = useState(60);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breatherPhase, setBreatherPhase] = useState<"In" | "Out">("In");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const userId = localStorage.getItem("userId");

  // Fetch journal entries
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:5000/api/journal/${userId}`)
      .then((res) => setEntries(res.data))
      .catch((err) => console.error("Failed to fetch entries", err));
  }, [userId]);

  const handleSaveJournal = async () => {
    if (!journalEntry.trim()) {
      setSaveStatus("Journal entry cannot be empty.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/journal", { userId, entry: journalEntry });
      setSaveStatus("Journal entry saved successfully!");
      setJournalEntry("");
      setTimeout(() => setSaveStatus(""), 3000);

      const res = await axios.get(`http://localhost:5000/api/journal/${userId}`);
      setEntries(res.data);
    } catch (err) {
      setSaveStatus("Failed to save entry.");
    }
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { text: newTask, completed: false }]);
    setNewTask("");
  };

  const toggleTask = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const getEmbedUrl = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const startBreathing = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setBreatherTime(60);
    setIsBreathing(true);
    setBreatherPhase("In");
    let phase: "In" | "Out" = "In";

    intervalRef.current = setInterval(() => {
      setBreatherTime((prev) => {
        // Alternate phase every 4 seconds
        if ((60 - prev) % 4 === 0 && prev !== 60) {
          phase = phase === "In" ? "Out" : "In";
          setBreatherPhase(phase);
        }

        if (prev <= 1) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsBreathing(false);
          setBreatherPhase("In");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const meditations = [
    { id: "m1", title: "5-Minute Morning Mindfulness", duration: 5, difficulty: "Beginner", link: "https://www.youtube.com/watch?v=YD5W5eZy90c" },
    { id: "m2", title: "Study Break Relaxation", duration: 10, difficulty: "Beginner", link: "https://www.youtube.com/watch?v=G3VhKlbIt6E" },
    { id: "m3", title: "Pre-Exam Calm", duration: 15, difficulty: "Intermediate", link: "https://www.youtube.com/watch?v=AtF0T2fPvbI" },
    { id: "m4", title: "Deep Sleep Meditation", duration: 30, difficulty: "All Levels", link: "https://www.youtube.com/watch?v=8mM5Oks8yZc" },
  ];

  const resources = {
    videos: [
      { id: "v1", title: "Understanding Anxiety", duration: "12:45", views: "1.2K", link: "https://www.youtube.com/watch?v=ah4Hnrz3CDg" },
      { id: "v2", title: "तनाव प्रबंधन तकनीकें", duration: "15:30", views: "856", link: "https://www.youtube.com/watch?v=nlD9HiRiLZ4" },
      { id: "v3", title: "Building Healthy Study Habits", duration: "18:20", views: "2.1K", link: "https://www.youtube.com/watch?v=1bszFX_XcbU" },
      { id: "v4", title: "ମାନସିକ ସ୍ୱାସ୍ଥ୍ୟ", duration: "10:15", views: "432", link: "https://www.youtube.com/watch?v=9wwQ_abYDiA" },
    ],
    audios: [
      { id: "a1", title: "Progressive Muscle Relaxation", duration: "20:00", downloads: "3.4K", link: "https://www.youtube.com/watch?v=86HUcX8ZtAk" },
      { id: "a2", title: "Deep Breathing Technique", duration: "8:30", downloads: "2.1K", link: "https://www.youtube.com/watch?v=qxLfqhHj-94" },
      { id: "a3", title: "Sleep Stories for Students", duration: "45:00", downloads: "1.8K", link: "https://www.youtube.com/watch?v=UYLm25FCmBg" },
    ],
    guides: [
      { id: "g1", title: "Managing Exam Anxiety", pages: 24, downloads: "5.2K", link: "https://www.monash.edu/change-of-preference/managing-exam-anxiety-a-step-by-step-guide" },
      { id: "g2", title: "Mental Balance in Student Life", pages: 18, downloads: "3.7K", link: "https://www.drishtiias.com/hindi/blog/at-present-the-need-for-mental-strength-for-the-youth" },
      { id: "g3", title: "Building Resilience", pages: 32, downloads: "4.1K", link: "https://theglobalcollege.com/blog/building-resilience-students/" },
    ],
  };

  return (
    <div className="min-h-screen gradient-hero">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <Tabs defaultValue="meditation" className="w-full">
            <TabsList className="grid w-full grid-cols-5 gradient-card">
              <TabsTrigger value="meditation"><Heart className="h-4 w-4" /> Meditation</TabsTrigger>
              <TabsTrigger value="videos"><Play className="h-4 w-4" /> Videos</TabsTrigger>
              <TabsTrigger value="audios"><Volume2 className="h-4 w-4" /> Audio</TabsTrigger>
              <TabsTrigger value="guides"><BookOpen className="h-4 w-4" /> Guides</TabsTrigger>
              <TabsTrigger value="journal"><Book className="h-4 w-4" /> Journal</TabsTrigger>
            </TabsList>

            {/* Meditation */}
            <TabsContent value="meditation" className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {meditations.map((m) => (
                <Card key={m.id} className="p-4">
                  <CardTitle>{m.title}</CardTitle>
                  <p>{m.duration} min • {m.difficulty}</p>
                  <div className="relative pt-[56.25%] mt-2">
                    <iframe src={getEmbedUrl(m.link)} title={m.title} allowFullScreen className="absolute top-0 left-0 w-full h-full rounded-md" />
                  </div>
                </Card>
              ))}
            </TabsContent>

            {/* Videos */}
            <TabsContent value="videos" className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.videos.map((v) => (
                <Card key={v.id} className="p-4">
                  <CardTitle>{v.title}</CardTitle>
                  <p>{v.duration} • {v.views} views</p>
                  <div className="relative pt-[56.25%] mt-2">
                    <iframe src={getEmbedUrl(v.link)} title={v.title} allowFullScreen className="absolute top-0 left-0 w-full h-full rounded-md" />
                  </div>
                </Card>
              ))}
            </TabsContent>

            {/* Audios */}
            <TabsContent value="audios" className="mt-6 space-y-4">
              {resources.audios.map((a) => (
                <Card key={a.id} className="p-4">
                  <CardTitle>{a.title}</CardTitle>
                  <p>{a.duration} • {a.downloads} downloads</p>
                  <div className="relative pt-[20%] mt-2">
                    <iframe src={getEmbedUrl(a.link)} title={a.title} allowFullScreen className="absolute top-0 left-0 w-full h-full rounded-md" />
                  </div>
                </Card>
              ))}
            </TabsContent>

            {/* Guides */}
            <TabsContent value="guides" className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.guides.map((g) => (
                <Card key={g.id} className="p-4">
                  <CardTitle>{g.title}</CardTitle>
                  <p>{g.pages} pages • {g.downloads} downloads</p>
                  <Button asChild>
                    <a href={g.link} target="_blank">Open Guide</a>
                  </Button>
                </Card>
              ))}
            </TabsContent>

            {/* Journal */}
            <TabsContent value="journal" className="mt-6">
              <Card className="p-4">
                <CardTitle>Daily Journal</CardTitle>
                <Textarea
                  placeholder="What's on your mind?"
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  className="mt-2 min-h-[150px]"
                />
                {saveStatus && <p className="text-green-500 mt-2">{saveStatus}</p>}
                <Button className="w-full mt-2" onClick={handleSaveJournal}>Save Entry</Button>
              </Card>
              <div className="mt-4 space-y-2">
                {entries.map((e) => (
                  <Card key={e._id} className="p-3">
                    <p className="text-sm text-gray-500">{new Date(e.date).toLocaleString()}</p>
                    <p>{e.entry}</p>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: Breather + To-Do */}
        <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-4">
          {/* Breather Box */}
        <Card
          className="p-4 text-center rounded-2xl relative overflow-hidden"
          style={{
            backgroundImage: 'url("timerBG.jpeg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative z-10">
            <CardTitle className="text-white text-lg font-bold">1-Minute Breather</CardTitle>
            <p className="text-white mt-2">Follow the animation to relax</p>
            <div className="flex justify-center items-center mt-4">
              <div
                className={`w-24 h-24 rounded-full bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-400 ${
                  isBreathing
                    ? breatherPhase === "In"
                      ? "animate-breathe-in"
                      : "animate-breathe-out"
                    : ""
                } border-4 border-white/30`}
              ></div>
            </div>
            <p className="text-white text-xl mt-2">{breatherTime}s</p>
            <Button className="mt-2" onClick={startBreathing} disabled={isBreathing}>
              {isBreathing ? "Breathing..." : "Start Breather"}
            </Button>
          </div>
        </Card>



          {/* To-Do List */}
          <Card
              className="p-4 rounded-2xl relative overflow-hidden"
              style={{
                backgroundImage: 'url("toDoBG.jpeg")', // Your To-Do background image
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="relative z-10">
                <CardTitle className="text-black text-lg font-bold">To-Do List</CardTitle>
                <div className="mt-3 flex gap-2">
                  <Input
                    placeholder="Add a task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="flex-1 bg-white/80 border-none focus:ring-2 focus:ring-purple-400 rounded-lg text-black"
                  />
                  <Button className="bg-purple-500 hover:bg-purple-600 text-white" onClick={handleAddTask}>
                    Add
                  </Button>
                </div>
                <ul className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                  {tasks.map((task, index) => (
                    <li
                      key={index}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                        task.completed
                          ? "bg-green-100 text-black line-through"
                          : "bg-white/80 text-black"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(index)}
                        className="w-5 h-5"
                      />
                      <span>{task.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

        </div>
      </div>
    </div>
  );
};

export default ResourceHub;
