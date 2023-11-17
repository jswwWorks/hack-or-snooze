"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */

class Story {

  /** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   */

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** Parses hostname out of URL and returns it.
  */
  getHostName() {

    // Create url object that can be used to access hostname
    console.log(this.url);
    const urlObject = new URL(this.url);

    // locate and return hostname
    return urlObject.hostname;
  }

  /** TODO: write this later!
   *
   */
//   static retrieveID() {

//   }
}


/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /** Generate a new StoryList. It:
   *
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   */

  static async getStories() {
    // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method?

    // We don't want multiple StoryLists, we just want one! (and it gets queued
    // at the beginning)

    // query the /stories endpoint (no auth required)
    const response = await fetch(`${BASE_URL}/stories`, {
      method: "GET",
    });
    const storiesData = await response.json();

    // turn plain old story objects from API into instances of Story class
    const stories = storiesData.stories.map(story => new Story(story));

    // build an instance of our own class using the new array of stories
    return new StoryList(stories);
  }

  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   * Returns the new Story instance
   */

  async addStory(user, {title, author, url}) {
    console.log("user", user);
    console.log("title", title,"author", author, "url", url);

    // Grab current user token
    const token = user.loginToken;

    // console.log("token", token);
    // Make json for post request
    const bodyContent = JSON.stringify({
                        token: token,
                        story: {
                          title,
                          author,
                          url
                        }});
    // console.log("JSON string ", bodyContent);

    // Add story data to API
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: bodyContent
    };

    console.log("options", options);
    // Post request
    const response = await fetch(`${BASE_URL}/stories`, options);

    // Grab data for new story from the post request
    const dataForNewStory = await response.json();

    console.log("dataForNewStory from API",dataForNewStory);
    // make story instance
    const newStory = new Story(dataForNewStory.story);

    // add story to storyList
    this.stories.push(newStory);
    console.log("is this also undefined",newStory);
    // Return newStory
    return newStory;

}
}


/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor({
    username,
    name,
    createdAt,
    favorites = [],
    ownStories = []
  },
    token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }

  /** Takes story instance, sends API request to show when user favorites story,
   *  adds story instance to list of 'favorite' stories.
   */
  async favoriteAStory(storyInstance) {
    console.log("storyInstance=", storyInstance);

    const storyId = storyInstance.storyId;
    console.log("storyID=", storyId);

    const username = this.username;
    console.log("username=", username)

    // Grab current user token
    const token = this.loginToken;

    console.log("token=", token);

    // Make json for post request
    const bodyContent = JSON.stringify({
                        token: token,
                        });
    console.log("JSON string ", bodyContent);

    // Add story data to API
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: bodyContent
    };

    console.log("options", options);
    // Post request

    const postRequestURL = `${BASE_URL}/users/${username}/favorites/${storyId}`;

    const response = await fetch(postRequestURL, options);
    console.log('responseFavorites=', response);

    // Grab data for new story from the post request
    const dataForFavorites = await response.json();

    console.log('dataForFavorites=', dataForFavorites);

  }


  /** Takes a story instance, sends API request to show when a user unfavorites
   *  a story, removes story instance from list of 'favorite stories' (need only
   *  officially update 'favorite stories' list upon refresh).
   */
  // async unfavoriteAStory(storyInstance) {
  //   /** we will have an array (as a response from the server): a JSON string
  //    * containing the array (so we'll convert a JSON string to an object and
  //    * inside will be that array)
  //    *
  //    * this array will include a user's current favorites
  //    *
  //    * The user should be able to unfavorite a story from
  //    */
  // }

  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  static async signup(username, password, name) {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      body: JSON.stringify({ user: { username, password, name } }),
      headers: {
        "content-type": "application/json",
      }
    });
    const userData = await response.json();
    const { user } = userData;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      userData.token
    );
  }

  /** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      body: JSON.stringify({ user: { username, password } }),
      headers: {
        "content-type": "application/json",
      }
    });
    const userData = await response.json();
    const { user } = userData;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      userData.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const tokenParams = new URLSearchParams({ token });

      const response = await fetch(
        `${BASE_URL}/users/${username}?${tokenParams}`,
        {
          method: "GET"
        }
      );
      const userData = await response.json();
      const { user } = userData;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }
}



/** Takes event object, finds story that was clicked. Determines whether that
 *  story is currently on favorites list. If not, adds story to favorites list
 *  via favoriteAStory method. Otherwise, unfavorites a story via
 *  unfavoriteAStory method. Returns nothing.
 */
async function handleFavoriteEvent(evt){
  // find story that was clicked on
  console.log('buttonWasClicked');

  console.log("story favorited! evt=", evt, "evt.target=", evt.target);

  $evtTarget = $(evt.target);

  const currentStory = $evtTarget.data('story-instance');

  console.log('currentStory=', currentStory);

  const favoriteStory = await currentUser.favoriteAStory(currentStory);


}


$favoriteButton.on('submit', handleFavoriteEvent(evt));



