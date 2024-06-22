## Unit Assignment: Kudos Board

Submitted by: **Theo**

Deployed Application (optional): [Kudos Board Deployed Site](https://kudos-board-1-513p.onrender.com/)

### Application Features

#### CORE FEATURES

- [x] **Home Page**
  - [x] Displays header, banner, search, board grid, and footer.
  - [x] Displays preview of all boards on initial page load.
    - [x] Boards previews should show an image/gif and board title.
  - [x] Users can click on a category (recent, celebration, thank you, inspiration) to filter the boards.
    - [x] Recent displays most recently created boards.
    - [x] Other categories display boards of that type.
  - [x] Users can search for a board by name.
  - [x] Users can click on a board to navigate to a new page containing that board.
  - [x] Users can create a new board.
    - [x] Boards should have a title, category, and author (optional).
  - [x] User can delete boards.

- [x] **Board Page**
  - [x] Displays a list of all cards for a board.
    -  [x] Each card features a text message.
    -  [x] Each card features a gif found using the [GIPHY API](https://developers.giphy.com/docs/api/).
    -  [x] Users can optionally sign the card as the author.
-   [x] Cards can be upvoted.
-   [x] Cards can be deleted.

#### STRETCH FEATURES


- [x] **User Accounts**
  - [x] Users should be able to log in with a username and password.
  - [x] Users should be able to sign up for a new account.
  - [x]  Boards and cards should be associated with a user.
    - [x]  Anonymous cards or cards by guest users should still be allowed.
  - [x] Add a new filter option on the home page to display only the current user's boards.
  - [x] Allow boards to be deleted only if they are owned by the user.
- [x] **Deployment**
  - [x] Website is deployed via Render.
- [x] **Comments**
  - [x] Users should be able to comment on cards.


### Walkthrough Video

`TODO://` Add the embedded URL code to your animated app walkthrough below, `ADD_EMBEDDED_CODE_HERE`. Make sure the video or gif actually renders and animates when viewing this README. (🚫 Remove this paragraph after adding walkthrough video)

`ADD_EMBEDDED_CODE_HERE`

### Reflection

* Did the topics discussed in your labs prepare you to complete the assignment? Be specific, which features in your weekly assignment did you feel unprepared to complete?

We did not discuss auth in our labs but I was able to figure it out. Other wise the labs/lectures where interesting if short.

* If you had more time, what would you have done differently? Would you have added additional features? Changed the way your project responded to a particular event, etc.

I would have strived for greater test coverage and cleaner code

* Reflect on your project demo, what went well? Were there things that maybe didn't go as planned? Did you notice something that your peer did that you would like to try next time?

Demo is next monday


### Open-source libraries used

- Add any links to open-source libraries used in your project.
- https://mantine.dev/
- https://blog.logrocket.com/crafting-authentication-schemes-with-prisma-in-express/

### Shout out

Give a shout out to somebody from your cohort that especially helped you during your project. This can be a fellow peer, instructor, TA, mentor, etc.

## Tasks
| task name| time estimation | start time| endtime|
|------|------|------|------|
|Boards previews should show an image/gif and board title.|||done 6/20|
|Users can click on a board to navigate to a new page containing that board.|||done 6/20|
|Users can create a new board.|||done 6/20|
||Each card features a gif found using the [GIPHY API](https://developers.giphy.com/docs/api/)|||done 6/20|
|**Style**||||
| to header, banner, search, board grid, and footer |||done 6/21|
|preview of all boards on initial page load.|||done 6/21|
|Displays a list of all cards for a board.|||done 6/21|
|Change the title and favicon|||||
|**funtionality**|||||
|Users can click on a category (recent, celebration, thank you, inspiration) to filter the boards.|1 hour||done 6/20 time: 30min|
|Recent displays most recently created boards.|1 hour||done 6/20 time:30min|
|Users can search for a board by name.|45 min||done 6/20 time:45min|
|User can delete boards.|45 min|8:11 6/21|done 9:10|
|Users can optionally sign the card as the author.|||||
|Cards can be upvoted.|25 min||3:37|
|Cards can be deleted.|30 min|336||
|**User Accounts**||||
|Users should be able to log in with a username and password.|||done 6/20|
|Users should be able to sign up for a new account.|||done 6/20|
|Boards and cards should be associated with a user.|||done 6/20|
|Add a new filter option on the home page to display only the current user's boards.|20 min|2:10|2:22 done|
|**Deployment**|||done 6/20|
|added cold start warning||||
|**Comments**||||
|sers should be able to comment on cards.|||done 6:13 6/21|
|**Dev Ops**|||||
|add comprehensive backend test for auth||||
|add comprehensive frontend tests||||
|get rid of all "!"s||||
|figure out why prettier doesn't work on code-fb||||
