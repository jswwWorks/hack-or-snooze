"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


/** Takes an event, is called when user submits the form.
 *  Gathers story submission data and calls addStory(), then puts newStory
 *  onto page. Returns nothing.
 */
async function submitStory(evt) {
  // TODO:Grab current user
  evt.preventDefault();
  // Grab inputs
  const titleInput = $("#titleInput").val();
  const authorInput = $("#authorInput").val();
  const urlInput = $("#urlInput").val();

  console.log("titleInput= ", titleInput,
              "authorInput=", authorInput,
              "urlInput= ", urlInput);
  console.log("currentUser",currentUser);
  // call addStory method
  const newStory = await storyList.addStory(currentUser, {"title":titleInput, "author": authorInput, "url": urlInput});
  // console.log("returned from addStory method",newStory);
  // put new story onto page
  location.reload();
  putStoriesOnPage();
}


// Click event that calls newStorySubmission
$("#submitStoryButton").on("click", submitStory);