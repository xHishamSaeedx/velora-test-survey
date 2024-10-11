class VeloraSurvey extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  get ratingQuestion() {
    return (
      this.getAttribute("rating_question") ||
      "How likely are you to recommend us?"
    );
  }

  get commentHeading() {
    return (
      this.getAttribute("comment_heading") ||
      "Can you tell us a bit more about your score?"
    );
  }

  get open_survey_button_bg_color() {
    return this.getAttribute("open_survey_button_bg_color") || "#007BFF";
  }

  get open_survey_button_bg_hover_color() {
    return this.getAttribute("open_survey_button_bg_hover_color") || "#0056b3";
  }

  get open_survey_button_text_color() {
    return this.getAttribute("open_survey_button_text_color") || "white";
  }

  get submit_button_bg_color() {
    return this.getAttribute("submit_button_bg_color") || "#007BFF";
  }

  get submit_button_bg_hover_color() {
    return this.getAttribute("submit_button_bg_hover_color") || "#0056b3";
  }

  get submit_button_text_color() {
    return this.getAttribute("submit_button_text_color") || "white";
  }

  get comment_box_placeholder() {
    return this.getAttribute("comment_box_placeholder") || "Your comment...";
  }

  render() {
    this.shadowRoot.innerHTML = `
        <style>
            * {
                box-sizing: border-box;
            }
            .popup {
                display: none;
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border: 1px solid #ccc;
                padding: 20px;
                z-index: 1000;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                width: 400px;
                max-width: 90vw;
                overflow: hidden;
            }
            .overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 500;
            }
            .button {
                padding: 10px 15px;
                background: ${this.submit_button_bg_color};
                color: ${this.submit_button_text_color};
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                width: 100%;
                margin-top: 10px;
            }
            .button:hover {
                background: ${this.submit_button_bg_hover_color};
            }
            .close {
              cursor: pointer;
              color: white;
              font-weight: bold;
              font-size: 20px;
              background: #ff4d4d;
              border-radius: 50%;
              width: 30px;
              height: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
              position: absolute;
              top: 10px;
              right: 15px;
              transition: background 0.3s;
              z-index: 1001;
          }

          @media (max-width: 600px) {
                .close {
                    top: 5px;
                    right: 10px;
                    width: 25px;
                    height: 25px;
                    font-size: 18px;
                }

                label {
                    margin-top: 40px;
                }
            }

            .close:hover {
                background: #ff1a1a;
            }
            h2 {
                display: none;
            }
            label {
                font-family: Arial, sans-serif;
                font-weight: bold;
                color: #333;
                font-size: 24px;
                text-align: center;
                display: block;
                margin-bottom: 20px;
            }
            form {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .rating-container {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 5px;
                margin: 20px 0;
            }
            .rating-circle {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: #ddd;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                color: white;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            .rating-circle.selected {
                background-color: #28a745;
            }
            .rating-circle.red {
                background-color: #dc3545;
            }
            .rating-circle.orange {
                background-color: #fd7e14;
            }
            .rating-circle.green {
                background-color: #28a745;
            }
            .submit-spacing {
                margin-top: 25px;
            }
            
            .sticky-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 2000;
                background: ${this.open_survey_button_bg_color};
                color: ${this.open_survey_button_text_color};
                border: none;
                border-radius: 4px;
                padding: 15px 20px;
                font-size: 16px;
                cursor: pointer;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            }
  
            .sticky-button:hover {
                background: ${this.open_survey_button_bg_hover_color};
            }
  
            .comment-container {
                margin-top: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
  
            .comment-input {
                width: 90%;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 4px;
                resize: none;
                height: 80px;
            }
  
            @media (max-width: 600px) {
                .popup {
                    width: 90%;
                    padding: 15px;
                }
                .rating-circle {
                    width: 25px;
                    height: 25px;
                }
                label {
                    font-size: 20px;
                }
                .button {
                    font-size: 14px;
                }
            }
        </style>
       <button class="sticky-button">Open Survey</button>
        <div class="overlay"></div>
        <div class="popup">
            <span class="close">×</span>
            <form id="survey-form">
                <label for="rating">${this.ratingQuestion}</label>
                <div class="rating-container" id="rating-container">
                    ${[...Array(10).keys()]
                      .map(
                        (i) => ` 
                        <div class="rating-circle" data-value="${i + 1}">${
                          i + 1
                        }</div>
                    `
                      )
                      .join("")}
                </div>
                <div class="comment-container" id="comment-container">
                    <label for="comment">${this.commentHeading}</label>
                    <textarea id="comment" class="comment-input" placeholder="Enter Text"></textarea>
                </div>
                <button type="submit" class="button submit-spacing">Submit</button>
            </form>
        </div>
      `;

    // Add interactivity for rating circles
    const circles = this.shadowRoot.querySelectorAll(".rating-circle");
    let selectedRating = null;

    const updateColors = (hoveredIndex) => {
      circles.forEach((circle, index) => {
        if (index <= hoveredIndex) {
          if (hoveredIndex <= 3) {
            circle.classList.add("red");
            circle.classList.remove("orange", "green");
          } else if (hoveredIndex <= 6) {
            circle.classList.add("orange");
            circle.classList.remove("red", "green");
          } else {
            circle.classList.add("green");
            circle.classList.remove("red", "orange");
          }
        } else {
          circle.classList.remove("red", "orange", "green");
        }
      });
    };

    circles.forEach((circle, index) => {
      circle.addEventListener("mouseover", () => {
        updateColors(index);
      });

      circle.addEventListener("click", () => {
        selectedRating = circle.getAttribute("data-value");
        updateColors(index);
        circles.forEach((c) => c.classList.remove("selected"));
        circle.classList.add("selected");
      });

      circle.addEventListener("mouseleave", () => {
        if (!selectedRating) {
          circles.forEach((c) => {
            c.classList.remove("red", "orange", "green");
          });
        } else {
          updateColors(selectedRating - 1);
        }
      });
    });

    this.shadowRoot
      .querySelector(".sticky-button")
      .addEventListener("click", () => {
        this.showPopup();
      });

    this.shadowRoot.querySelector(".close").addEventListener("click", () => {
      this.hidePopup();
    });

    this.shadowRoot
      .querySelector("#survey-form")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        const comment = this.shadowRoot.querySelector("#comment").value.trim();

        if (!selectedRating || !comment) {
          alert(
            "Please select a rating and enter a comment before submitting."
          );
        } else {
          this.sendData(selectedRating, comment);
          this.hidePopup();
        }
      });
  }

  showPopup() {
    this.shadowRoot.querySelector(".popup").style.display = "block";
    this.shadowRoot.querySelector(".overlay").style.display = "block";
    this.shadowRoot.querySelector(".sticky-button").style.display = "none"; // Hide the button
  }

  hidePopup() {
    this.shadowRoot.querySelector(".popup").style.display = "none";
    this.shadowRoot.querySelector(".overlay").style.display = "none";
    this.shadowRoot.querySelector(".sticky-button").style.display = "block"; // Show the button again
  }

  sendData(rating, comment) {
    const apiKey = this.getAttribute("api_key"); // Use the API key from the velora-survey

    if (!apiKey) {
      console.error("API URL is not provided.");
      return;
    }

    const url = "http://127.0.0.1:8000/api/submit-survey";

    const data = {
      rating: rating,
      comment: comment,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`, // Include the API key as a Bearer token
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

customElements.define("velora-survey", VeloraSurvey);
