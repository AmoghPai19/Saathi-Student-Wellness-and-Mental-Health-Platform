import { useState, useEffect } from "react";
import apiClient from "../api"; // Ensure this path is correct

// UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

// Icons
import {
  Calendar as CalendarIcon,
  Clock,
  Star,
  MapPin,
  Phone,
  Video,
  MessageSquare,
  Filter,
} from "lucide-react";

// The interface for a counselor's data
interface Counselor {
  _id?: string; // present if from backend
  id: string;
  name: string;
  title: string;
  specialties: string[];
  rating: number;
  reviews: number;
  experience: string;
  languages: string[];
  sessionTypes: ("in-person" | "video" | "phone")[];
  availability: { day: string; slots: string[] }[];
  avatar?: string;
}

const CounselorBooking = () => {
  // Data & loading states
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & selection states
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);

  // Modal visibility states
  const [openBooking, setOpenBooking] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);

  // Form states for booking
  const [userName, setUserName] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  // Form state for messaging
  const [message, setMessage] = useState<string>("");

  // Feedback status states
  const [bookingStatus, setBookingStatus] = useState<string>("");
  const [messageStatus, setMessageStatus] = useState<string>("");

  // Fetch counselors when the component mounts
  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        // This is a static list for demonstration. In a real app, you would fetch this from your API.
        const staticCounselors: Counselor[] = [
          {
             _id: "66e69315354960588629124a",
             id: "1",
             name: "Dr. Priya Sharma",
             title: "Clinical Psychologist",
             specialties: ["Anxiety", "Depression", "Academic Stress"],
             rating: 4.9,
             reviews: 127,
             experience: "8+ years",
             languages: ["English", "Hindi", "Marathi"],
             sessionTypes: ["in-person", "video", "phone"],
             availability: [
               { day: "Mon", slots: ["9:00 AM", "10:00 AM", "2:00 PM"] },
               { day: "Tue", slots: ["10:00 AM", "11:00 AM", "3:00 PM"] },
               { day: "Wed", slots: ["9:00 AM", "1:00 PM", "4:00 PM"] },
             ],
           },
           {
             _id: "66e69315354960588629124b",
             id: "2",
             name: "Dr. Rajesh Kumar",
             title: "Counseling Psychologist",
             specialties: ["Relationship Issues", "Social Anxiety", "Career Guidance"],
             rating: 4.8,
             reviews: 93,
             experience: "6+ years",
             languages: ["English", "Hindi", "Tamil"],
             sessionTypes: ["video", "phone"],
             availability: [
               { day: "Tue", slots: ["2:00 PM", "4:00 PM", "6:00 PM"] },
               { day: "Wed", slots: ["10:00 AM", "1:00 PM", "4:00 PM"] },
               { day: "Thu", slots: ["2:00 PM", "4:00 PM", "6:00 PM"] },
               { day: "Fri", slots: ["10:00 AM", "1:00 PM", "5:00 PM"] },
               { day: "Sat", slots: ["9:00 AM", "11:00 AM", "1:00 PM"] },
             ],
           },
           {
             _id: "66e69315354960588629124c",
             id: "3",
             name: "Dr. Anita Mehta",
             title: "Psychiatrist",
             specialties: ["Bipolar Disorder", "ADHD", "Sleep Disorders"],
             rating: 4.9,
             reviews: 156,
             experience: "12+ years",
             languages: ["English", "Hindi", "Gujarati"],
             sessionTypes: ["in-person", "video"],
             availability: [
               { day: "Mon", slots: ["1:00 PM", "3:00 PM", "5:00 PM"] },
               { day: "Tue", slots: ["10:00 AM", "12:00 PM", "2:00 PM"] },
               { day: "Wed", slots: ["1:00 PM", "4:00 PM", "7:00 PM"] },
               { day: "Thu", slots: ["10:00 AM", "1:00 PM", "4:00 PM"] },
               { day: "Fri", slots: ["9:00 AM", "11:00 AM", "1:00 PM"] },
             ],
           },
           {
             _id: "66e69315354960588629124d",
             id: "4",
             name: "Dr. Ravi Patel",
             title: "Behavioral Therapist",
             specialties: ["Addiction Recovery", "Trauma", "PTSD"],
             rating: 4.7,
             reviews: 84,
             experience: "10+ years",
             languages: ["English", "Hindi", "Bengali"],
             sessionTypes: ["in-person", "video", "phone"],
             availability: [
               { day: "Tue", slots: ["1:00 PM", "3:00 PM", "5:00 PM"] },
               { day: "Wed", slots: ["11:00 AM", "2:00 PM", "6:00 PM"] },
               { day: "Thu", slots: ["2:00 PM", "4:00 PM", "6:00 PM"] },
               { day: "Fri", slots: ["10:00 AM", "1:00 PM", "5:00 PM"] },
               { day: "Sat", slots: ["9:00 AM", "12:00 PM", "3:00 PM"] },
             ],
           },
           {
             _id: "66e69315354960588629124e",
             id: "5",
             name: "Dr. Sameer Verma",
             title: "College Admissions Counselor",
             specialties: ["Career Guidance", "Academic Stress", "College Applications"],
             rating: 4.9,
             reviews: 112,
             experience: "10+ years",
             languages: ["English", "Hindi"],
             sessionTypes: ["video", "phone"],
             availability: [
               { day: "Mon", slots: ["3:00 PM", "5:00 PM"] },
               { day: "Wed", slots: ["4:00 PM", "6:00 PM"] },
               { day: "Fri", slots: ["2:00 PM", "4:00 PM"] },
             ],
           },
           {
             _id: "66e69315354960588629124f",
             id: "6",
             name: "Dr. Aishwarya Singh",
             title: "Educational Psychologist",
             specialties: ["Learning Disabilities", "ADHD", "Academic Stress"],
             rating: 4.8,
             reviews: 78,
             experience: "7+ years",
             languages: ["English", "Kannada"],
             sessionTypes: ["in-person", "video"],
             availability: [
               { day: "Tue", slots: ["10:00 AM", "12:00 PM"] },
               { day: "Thu", slots: ["11:00 AM", "1:00 PM"] },
               { day: "Sat", slots: ["10:00 AM", "12:00 PM"] },
             ],
           },
        ];
        setCounselors(staticCounselors);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch counselors.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounselors();
  }, []);

  // Helper to get the correct icon for each session type
  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  // Helper to get available time slots for the selected date
  const getAvailableSlots = () => {
    if (!selectedCounselor || !selectedDate) return [];
    const dayOfWeek = format(selectedDate, "E"); // "Mon", "Tue", etc.
    const dayAvailability = selectedCounselor.availability.find((item) => item.day === dayOfWeek);
    return dayAvailability ? dayAvailability.slots : [];
  };

  // Helper to get a readable string for the available days (e.g., "Mon-Fri")
  const getAvailableDaysRange = (availability: { day: string; slots: string[] }[]) => {
    if (!availability || availability.length === 0) return "No availability";
    const days = availability.map((a) => a.day);
    const orderedDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const validDays = days.filter((day) => orderedDays.includes(day));
    if (validDays.length === 0) return "No availability";
    const indices = validDays.map((day) => orderedDays.indexOf(day));
    const firstDay = orderedDays[Math.min(...indices)];
    const lastDay = orderedDays[Math.max(...indices)];
    return firstDay === lastDay ? firstDay : `${firstDay}-${lastDay}`;
  };

  // Derived lists based on state
  const allSpecialties = Array.from(new Set(counselors.flatMap((c) => c.specialties)));
  const filteredCounselors =
    selectedSpecialty === "all"
      ? counselors
      : counselors.filter((c) => c.specialties.some((s) => s.toLowerCase().includes(selectedSpecialty.toLowerCase())));

  // Modal openers (reset form state on open)
  const openBookingModal = (counselor: Counselor) => {
    setSelectedCounselor(counselor);
    setUserName("");
    setSelectedDate(new Date());
    setSelectedSlot("");
    setBookingStatus("");
    setOpenBooking(true);
  };

  const openMessageModal = (counselor: Counselor) => {
    setSelectedCounselor(counselor);
    setMessage("");
    setMessageStatus("");
    setOpenMessage(true);
  };

  // Form submission handlers
  const handleBookAppointment = async () => {
    if (!userName || !selectedDate || !selectedSlot || !selectedCounselor) {
      setBookingStatus("Please fill in all fields.");
      return;
    }
    try {
      const appointmentData = {
        userName,
        counsellorId: selectedCounselor._id ?? selectedCounselor.id,
        userId: "66e693153549605886291244", // Placeholder - replace with actual auth user id
        date: selectedDate,
        timeSlot: selectedSlot,
      };
      await apiClient.post("/appointments", appointmentData);
      
      setBookingStatus("Appointment Booked!");
      setTimeout(() => setOpenBooking(false), 1500);
    } catch (err) {
      console.error(err);
      setBookingStatus("Failed to book appointment. Please try again.");
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedCounselor) {
      setMessageStatus("Please type a message.");
      return;
    }
    try {
      const messageData = {
        receiverId: selectedCounselor._id ?? selectedCounselor.id,
        senderId: "66e693153549605886291244", // Placeholder
        content: message.trim(),
      };
      // FIX: The API call is now active and the placeholder console.log is removed.
      await apiClient.post("/messages", messageData);

      setMessageStatus("Message Sent!");
      setTimeout(() => {
        setOpenMessage(false);
        setMessage("");
      }, 1200);
    } catch (err) {
      console.error(err);
      setMessageStatus("Failed to send message. Please try again.");
    }
  };

  // Loading and error states
  if (isLoading) return <div className="text-center p-8">Loading counselors...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen gradient-hero">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* MERGED: Header from first version */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/40 rounded-full blur-lg scale-200 animate-soft-pulse"></div>
              <CalendarIcon className="relative h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Book a Counselor</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with qualified mental health professionals for confidential, personalized support
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filter by specialty:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant={selectedSpecialty === "all" ? "default" : "outline"} size="sm" onClick={() => setSelectedSpecialty("all")}>
              All Specialties
            </Button>
            {allSpecialties.map((s) => (
              <Button key={s} variant={selectedSpecialty === s ? "default" : "outline"} size="sm" onClick={() => setSelectedSpecialty(s)}>
                {s}
              </Button>
            ))}
          </div>
        </div>

        {/* Counselors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCounselors.map((c) => (
            // MERGED: Counselor card UI from first version
            <Card key={c.id + (c._id ?? "")} className="gradient-card border-border shadow-soft hover:shadow-glow transition-gentle">
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={c.avatar} />
                    <AvatarFallback className="bg-primary/20 text-primary text-lg font-semibold">{c.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{c.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{c.title}</p>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="text-sm font-medium">{c.rating}</span>
                        <span className="text-sm text-muted-foreground">({c.reviews})</span>
                      </div>
                      <Badge variant="secondary" className="ml-2 text-xs">{c.experience}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-1">
                    {c.specialties.map((s) => (
                      <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Languages</h4>
                  <p className="text-sm text-muted-foreground">{c.languages.join(", ")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Session Types</h4>
                  <div className="flex space-x-2">
                    {c.sessionTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-1 text-xs text-muted-foreground">
                        {getSessionTypeIcon(type)}
                        <span className="capitalize">{type.replace("-", " ")}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Available Days</h4>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {getAvailableDaysRange(c.availability)}
                  </div>
                </div>
                <div className="pt-4 border-t border-border space-y-2">
                  <Button className="w-full gradient-primary" onClick={() => openBookingModal(c)}>
                    <CalendarIcon className="h-4 w-4 mr-2" /> Book Appointment
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => openMessageModal(c)}>
                    <MessageSquare className="h-4 w-4 mr-2" /> Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* MERGED: Booking Modal UI from first version */}
        <Dialog open={openBooking} onOpenChange={setOpenBooking}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Book Appointment with {selectedCounselor?.name}</DialogTitle>
              <DialogDescription>Please fill in your details and select a date and time slot.</DialogDescription>
            </DialogHeader>
            {bookingStatus ? (
              <div className="p-8 text-center"><p className="text-lg font-semibold">{bookingStatus}</p></div>
            ) : (
              <div className="flex flex-col md:flex-row gap-6 p-4">
                <div className="flex-1">
                  <h3 className="text-base font-semibold mb-2">Your Name</h3>
                  <Input id="name" placeholder="Enter your full name" value={userName} onChange={(e) => setUserName(e.target.value)} className="mb-4" />
                  <h3 className="text-base font-semibold mb-2">Select a Date</h3>
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus className="rounded-md border shadow" disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))} />
                </div>
                <div className="flex-1 space-y-4">
                  <h3 className="text-base font-semibold">Select a Time Slot</h3>
                  {selectedDate ? (
                    <div className="grid grid-cols-2 gap-2">
                      {getAvailableSlots().length ? (
                        getAvailableSlots().map((slot) => (
                          <Button key={slot} variant={selectedSlot === slot ? "default" : "outline"} onClick={() => setSelectedSlot(slot)} size="sm">{slot}</Button>
                        ))
                      ) : (
                        <p className="col-span-2 text-sm text-muted-foreground">No slots available for this day.</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Please select a date first.</p>
                  )}
                  <div>
                    <h3 className="text-base font-semibold">Selected</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedDate ? format(selectedDate, "PPP") : "No date"} {selectedSlot ? ` • ${selectedSlot}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {!bookingStatus && (
              <DialogFooter>
                <Button disabled={!userName || !selectedDate || !selectedSlot} onClick={handleBookAppointment}>Confirm Appointment</Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>

        {/* Message Modal */}
        <Dialog open={openMessage} onOpenChange={setOpenMessage}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Message to {selectedCounselor?.name}</DialogTitle>
              <DialogDescription>Your message will be sent securely to the counselor.</DialogDescription>
            </DialogHeader>
            {messageStatus ? (
              <div className="p-8 text-center"><p className="text-lg font-semibold">{messageStatus}</p></div>
            ) : (
              <div className="p-4">
                <Textarea placeholder="Type your message..." value={message} onChange={(e) => setMessage(e.target.value)} rows={6} />
              </div>
            )}
            {!messageStatus && (
              <DialogFooter>
                <Button disabled={!message.trim()} onClick={handleSendMessage}>Send</Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CounselorBooking;

