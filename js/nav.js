"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  evt.preventDefault();
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  //displays the submit btn we created upon login completion
  $("#sub").show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/*

function createStoryForm(){
  const $formHTML = "<form class='createStoryForm'> <div><label>author</label><input type='text'></div> <div><label>title</label><input type='text'></div>  <div><label>url</label><input type='text'></div> </form>";

  // const $formHTML = " <div><label>author</label><input type='text'></div> <div><label>title</label><input type='text'></div>  <div><label>url</label><input type='text'></div> ";

  // const $formHTML = $("<form>").addClass("createStoryForm");
  // $formHTMLDiv = $("<div>");
  // $authorLabel = $("<label>").text("author");
  // $authorInput = $("<input>").attr("type", "text");

  // $authorLabel.append($authorInput);
  // $formHTMLDiv.append($authorLabel);

  // $authorLabel = $("<label>").text("author");
  // $authorInput = $("<input>").attr("type", "text");

  // $authorLabel.append($authorInput);
  // $formHTMLDiv.append($authorLabel);


  $(".stories-container").before($formHTML);
  $(".createStoryForm div").css("display", "inline");
  // $(".createStoryForm label").attr("class", "col-6");
  // $(".createStoryForm input").attr("class", "col-6");
  $(".createStoryForm").hide();
}

*/
/** Takes nothing, creates submit button with a link in the navbar. When
 *  clicked, shows the form that users to input new submission.
 *  Returns nothing.
 */


/*
function createSubmitLink(){
  // Add "Submit" link to navbar

  // Create new div to store button and a link within that div
  const $submitDiv = $("<div>").addClass("submitButton");
  const $submitLink = $("<a>").addClass("nav-link").text("Submit This");
  $submitLink.attr("href", "#").attr("id", "sub");

  // append link to div
  $submitDiv.append($submitLink);

  // append div to nav element
  $(".navbar-brand").after($submitDiv);

  // Add event listener to submit button to open link
  $submitLink.on("click", function(){
    $(".createStoryForm").show()
  });
}
*/




/** When "Submit" in navbar is clicked, it causes the form element to display
 *
 */

//TODO: add jQuery objects to constants in main; change name of id sub to something more readable
$("#sub").on("click", function(){
  $(".createStoryForm").show()
});

//TODO: add functionality so submit in nav hides unless the user is logged in!
//TODO: add click event in line 101 to appropriate function when you do this