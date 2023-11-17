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
  $navUserProfile.text(`${currentUser.username}`).show();
}

function createStoryForm(){
  const formHTML = "<form class='createStoryForm'> <div><label>author</label><input type='text'></div> <div><label>title</label><input type='text'></div>  <div><label>url</label><input type='text'></div> </form>";
  $(".stories-container").before(formHTML);
  $(".createStoryForm div").css("display", "inline");
  // $(".createStoryForm label").attr("class", "col-6");
  // $(".createStoryForm input").attr("class", "col-6");
  $(".createStoryForm").hide();
  $(".createStoryForm").show();
}


createStoryForm();