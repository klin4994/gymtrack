/* eslint-disable cambookMsgcase */
$(document).ready(() => {
  const bookWithdrawBtn = $(".book-withdraw");
  const notificationEl = $("#notification");
  $(bookWithdrawBtn).each(function() {
    // Grab class Id
    const classIdVal = this.getAttribute("data-id");
    // Check log in status
    $.getJSON("api/user_data").then(data => {
      // If not logged in, clicking the booking button will redirect to the log in page
      if (data.isLoggedIn === false) {
        $(this).click(e => {
          e.preventDefault();
          window.location.replace("/login");
        });
        // If logged in
      } else {
        // Assign button text and functions for each class
        InitialClass(classIdVal);
        $(this).click(e => {
          e.preventDefault();
          // Send request, and switch button attributes and display after being clicked
          const action = $(this).text();
          if (action === "Book Now") {
            withdrawBtn(classIdVal);
            $.post("/api/booking", {
              classId: classIdVal
            }).done(() => {
              bookingNotification("Booking confirmed! :D", "lightgreen", 4000);
            });
          } else {
            bookBtn(classIdVal);
            $.post("/api/withdraw", {
              classId: classIdVal
            }).done(() => {
              bookingNotification("Booking withdrawn!", "lightgreen", 4000);
            });
          }
        });
      }
    });
  });

  // Function to check booking status and alter buttons' text display and attributes accordingly
  function InitialClass(thisClassId) {
    $.getJSON("api/user_data").then(data => {
      // Get current userId-classId combination
      const thisUserClass = data.user.id + "-" + thisClassId;
      // Get all userId-classId combinations and compare to the current combination
      $.get("/userclasses").then(res => {
        for (i = 0; i < res.results.length; i++) {
          const existingUserClass =
            res.results[i].userId + "-" + res.results[i].classId;
          // If the combination already exists, create option to withdraw from the class
          if (existingUserClass === thisUserClass) {
            withdrawBtn(thisClassId);
            return;
          }
        }
        // Create option to make a booking to the class
        bookBtn(thisClassId);
      });
    });
  }

  // Clear withdraw class and append 'book' class
  function bookBtn(id) {
    $("[data-id =" + id + "]")
      .text("Book Now")
      .removeClass("withdraw")
      .addClass("book");
  }
  // Clear book class and append 'withdraw' class
  function withdrawBtn(id) {
    $("[data-id =" + id + "]")
      .text("Withdraw Booking")
      .removeClass("book")
      .addClass("withdraw");
  }
  // Function for feedback notification for booking and withdrawing confirmations
  function bookingNotification(text, colour, duration) {
    const message = $(
      `<div id="bookSuccess" style="position: fixed; background: ${colour};">${text}</div>`
    );
    $(notificationEl).append(message);
    setTimeout(() => {
      $(message).remove();
    }, duration);
  }
});
