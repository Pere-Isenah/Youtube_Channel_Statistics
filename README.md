# Youtube Channel Statistics
This Google Apps Script pulls data from a Youtube channel's public video data to Google Sheets.

### Table of Contents
- Introduction
- Instructions
- Authorization
- Script Explanation


#### Introduction
This script is used to retrieve and display public video data of a Youtube channel. The script gets the channel URL In column A2 as input and fetches all the video details from that channel, such as video title, publish date, views, comments, likes and the thumbnail of the video. In addition, the subscriber count and total number of videos for the channel are also fetched. The script outputs all the data to the Google Sheet.

#### Instructions
Open a Google Sheet.
Click on the "Tools" menu, then select "Script editor."
Copy and paste the code from this repository to the script editor.
Save the project with a name of your choice.
Update the apiKey variable in the getVideosFromChannel and getVideoDetails functions with your own API key. You can get an API key from the Google Cloud Console. [Click here](https://developers.google.com/youtube/v3/getting-started)
Run the updateChannelData function to execute the script.

**_How to find a Channel's Id ?_**
> **_Search any video of that channel and click on the that_** 

![screenshot](https://user-images.githubusercontent.com/98146902/176920862-02ceb50a-fb02-4e41-8a7d-c2819ae93c12.png)

>**_Click on the channel name_**

![screenshot](https://user-images.githubusercontent.com/98146902/176922081-32f8da52-8061-45d8-9a93-ceefbad7e383.png)

>**_Copy the highlighted part, which is channel's Id_**

![screenshot](https://user-images.githubusercontent.com/98146902/176925935-f4891b56-7c7c-48f7-b834-92fb453e9064.png)



#### Authorization
When running the script for the first time, you will need to grant permissions to the script to access your Google account and Youtube data. The script will ask for permission to:

- View and manage your spreadsheets in Google Drive
- View and manage your YouTube account


### Script Explanation
The script starts with defining a **function updateChannelData**. The updateChannelData function uses several other functions to extract the data from the channel's public video data, format it, and then output it to the Google Sheet.

The **getVideosFromChannel** function gets the playlist ID for the channel and then fetches the video details of the videos in the playlist using the Youtube Data API. The getVideoDetails function takes a video ID and returns the details of the video, including title, views, likes, dislikes, etc.

The **extractChannelIdFromUrl** function extracts the channel ID from the URL provided. The **getChannelProfileAnalytic** function gets the channel's public profile data, including the subscriber count and total number of videos.

The **design** function is used to design the output sheet.

The **updateChannelData** function then populates the sheet with the required data.

Finally, the **updateChannelDat** function calls the design function to format the output.