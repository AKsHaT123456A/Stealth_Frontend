import React, { useState } from "react";
import "./feedback.css"; // Import your CSS file
import axios from "axios";
import { useParams } from "react-router-dom";

function FeedbackForm() {
  const { roomName, phone } = useParams();
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [feedbackText, setFeedbackText] = useState("");

  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji);
  };

  const handleSubmit = () => {
    // Handle the submission of selectedEmoji and feedbackText here
    console.log("Selected Emoji:", selectedEmoji);
    console.log("Feedback Text:", feedbackText);
    let dataPayload = {
      emoji: selectedEmoji,
      feedback: feedbackText,
    };
    axios.post(
      `https://stealth-zys3.onrender.com/api/v1/auth/feedback/?${roomName}&phone=${phone}`,
      {
        dataPayload,
      }
    );
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
    </div>
  );
}

export default FeedbackForm;
