import React, { useState } from "react";
import "./feedback.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast

import "react-toastify/dist/ReactToastify.css"; // Import the CSS for Toastify

function FeedbackForm() {
  const { roomName, phone } = useParams();
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [feedbackText, setFeedbackText] = useState("");

  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let dataPayload = {
      emoji: selectedEmoji,
      feedback: feedbackText,
    };

    axios
      .post(
        `https://stealth-zys3.onrender.com/api/v1/auth/feedback?roomName=${roomName}&phone=${phone}`,
        dataPayload
      )
      .then((res) => {
        console.log(res.data);
        // Show a success toast notification
        toast.success("Feedback submitted successfully!", {
          position: "top-right",
          autoClose: 3000, // Close the notification after 3 seconds
        });
      })
      .catch((error) => {
        console.error("Error submitting feedback:", error);
      });

    // Handle the submission of selectedEmoji and feedbackText here
    console.log("Selected Emoji:", selectedEmoji);
    console.log("Feedback Text:", feedbackText);

    // Clear the form after submission
    setSelectedEmoji("");
    setFeedbackText("");
  };

  return (
    <div className="feedback-form">
      <h1>Feedback Form</h1>
      <p>Please select an emoji that represents your feedback:</p>
      <div className="emoji-container">
        <div
          className={`emoji-option ${selectedEmoji === "😃" ? "selected" : ""}`}
          onClick={() => handleEmojiClick("😃")}
        >
          😃
        </div>
        <div
          className={`emoji-option ${selectedEmoji === "😐" ? "selected" : ""}`}
          onClick={() => handleEmojiClick("😐")}
        >
          😐
        </div>
        <div
          className={`emoji-option ${selectedEmoji === "😞" ? "selected" : ""}`}
          onClick={() => handleEmojiClick("😞")}
        >
          😞
        </div>
      </div>
      <textarea
        className="submission-field"
        placeholder="Share your comments or suggestions here"
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
      ></textarea>
      <button className="submit-button" onClick={handleSubmit}>
        Submit
      </button>

      {/* Include the ToastContainer component */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default FeedbackForm;
