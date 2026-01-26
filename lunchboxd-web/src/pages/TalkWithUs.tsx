import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../layouts/Header";
import { Footer } from "../layouts/Footer";
import { createContactMessage } from "../services/adminService";
import { ArrowLeft, CheckCircle, Send } from "lucide-react";

export function TalkWithUs() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    subject: "",
    message: "",
  });

  const subjects = [
    "General Feedback",
    "Bug Report",
    "Feature Request",
    "Partnership Inquiry",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validation
      if (!formData.senderName.trim()) {
        throw new Error("Name is required");
      }
      if (!formData.senderEmail.trim()) {
        throw new Error("Email is required");
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.senderEmail)) {
        throw new Error("Please enter a valid email address");
      }
      if (!formData.subject.trim()) {
        throw new Error("Subject is required");
      }
      if (!formData.message.trim()) {
        throw new Error("Message is required");
      }

      const message = await createContactMessage({
        senderName: formData.senderName,
        senderEmail: formData.senderEmail,
        subject: formData.subject,
        message: formData.message,
      });

      if (message) {
        setSubmitted(true);
        // Reset form
        setFormData({
          senderName: "",
          senderEmail: "",
          subject: "",
          message: "",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-off-white py-12 px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-md w-full text-center">
            <CheckCircle className="mx-auto mb-4 text-green-600" size={64} />
            <h1 className="text-3xl font-bold text-forest-dark mb-4">
              Message Sent!
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for reaching out. We've received your message and will
              get back to you as soon as possible.
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full px-6 py-3 bg-forest-dark text-white font-bold rounded-lg hover:bg-[#5a7a1e] transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-off-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-forest-mid hover:text-forest-dark mb-8 font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
            <h1 className="text-3xl font-bold text-forest-dark mb-2">
              Talk With Us
            </h1>
            <p className="text-gray-600 mb-8">
              We'd love to hear from you! Send us your feedback, report issues,
              or inquire about partnerships.
            </p>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-6">
                <p className="text-red-800 font-semibold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-forest-dark mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Juan Dela Cruz"
                  value={formData.senderName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      senderName: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-dark focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-forest-dark mb-2">
                  Your Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g., juan@email.com"
                  value={formData.senderEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      senderEmail: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-dark focus:border-transparent"
                />
              </div>

              {/* Subject */}
              <div className="relative z-20">
                <label className="block text-sm font-semibold text-forest-dark mb-2">
                  Subject *
                </label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-dark focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Select a subject...</option>
                  {subjects.map((subj) => (
                    <option key={subj} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-forest-dark mb-2">
                  Message *
                </label>
                <textarea
                  required
                  placeholder="Tell us what's on your mind..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  rows={6}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-dark focus:border-transparent resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-forest-dark text-white font-bold rounded-lg hover:bg-[#5a7a1e] disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  {isLoading ? "Sending..." : "Send Message"}
                </button>
              </div>

              {/* Additional Info */}
              <div className="p-4 bg-sand/20 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> We typically respond to all messages
                  within 24-48 hours. Thank you for your patience!
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
