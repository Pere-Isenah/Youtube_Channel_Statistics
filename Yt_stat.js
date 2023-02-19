// This function updates data on the active sheet of a Google Spreadsheet
function updateChannelData() {
    // Get the active sheet
    var sheet = SpreadsheetApp.getActiveSheet();
    // Get the value of cell A2
    var profileUrl = sheet.getRange("A2").getValue();
    // Set some formatting for the cell A2
    sheet.getRange("A2").setFontSize("10").setFontColor("white").setFontWeight("bold");
    // Replace with your own YouTube API key
    var apiKey = "AIzaSyB-YDvlmT7onqCQpX0--sTVnXPCyG2f2Ys"
    // Extract the channel ID from the URL
    var channelId = extractChannelIdFromUrl(profileUrl);
    // Get the playlist ID for the channel
    var playlistId = getPlaylistId(channelId,apiKey);
    // Get video data for the channel
    var videos = getVideosFromChannel(playlistId,apiKey);
    // Get channel analytics data
    var channelProfileAnalytic = getChannelProfileAnalytic(channelId,apiKey);
    // Get channel profile picture URL
    var channelProfilePic = getProfilePic(channelId,apiKey);
    // Initialize an empty array for the video data
    var data = [];
    // Initialize an empty array for the channel analytics data
    var channelData = []; 
    // Initialize an empty array for the video thumbnails
    var t_data = [];
  
    // Loop through the channel analytics data and extract subscriber and video counts
    for(var i = 0; i < channelProfileAnalytic.length; i++ ){
      var profile = channelProfileAnalytic[i]
      var subscriber = parseInt(profile.statistics.subscriberCount).toLocaleString();
      var totalVidoes = profile.statistics.videoCount;
      channelData.push([subscriber, totalVidoes]);
    }
  
    // Set the channel analytics data on the sheet
    sheet.getRange(7,2, channelData.length, channelData[0].length).setValues(channelData).setHorizontalAlignment("center");
    
    // Set the channel profile picture on the sheet
    sheet.getRange("D2").setFormula('=IMAGE("' + channelProfilePic + '",1)').setHorizontalAlignment("center")
    
    // Set the row height for row 2
    sheet.setRowHeight(2,80);
  
    // Loop through the video data and extract information
    for (var i = 0; i < videos.length; i++) {
      var video = videos[i];
      if (video) {
        var title = video.snippet.title;
        var publishDate = video.snippet.publishedAt;
        var [date, time] = publishDate.replace("Z","").split("T");
        var comments = parseInt(video.statistics.commentCount).toLocaleString();
        var likes = parseInt(video.statistics.likeCount).toLocaleString();
        var views = parseInt(video.statistics.viewCount).toLocaleString();
        var thumbnail = video.snippet.thumbnails.medium.url;
        var channelName = video.snippet.channelTitle;
        
        // Set the channel name in cell C2
        sheet.getRange("C2").setValue(channelName).setHorizontalAlignment("center");
       
        // Add the video data and thumbnail to the arrays
        data.push([title, date,time,views, comments, likes,]);
        t_data.push([thumbnail])
      }
    }
    
    // Set the video data and thumbnails on the sheet
    sheet.getRange(12,2, data.length, data[0].length).setValues(data).setHorizontalAlignment("center");
  
  
    // This loop iterates through the t_data array to get the URL of each thumbnail.
    for (var i = 0; i < t_data.length; i++) {
      var thumbnailUrl = t_data[i][0];
      var range = sheet.getRange(11 + i, 2);
      // For each thumbnail, it sets a formula in a range to display the thumbnail image in the sheet.
      range.setFormula('=IMAGE("' + thumbnailUrl + '",4,73,130)');
      var row = sheet.getRange(11 + i, 2);
      // It also sets the height of the row to 80 pixels.
      sheet.setRowHeight(row.getRow(), 80);
    }
  
    // This sets the values of the data array to a range in the sheet starting at row 11, column 3.
    sheet.getRange(11,3, data.length, data[0].length).setValues(data);
  
    // This applies the design formatting to the sheet.
    design(sheet)
  }
  
  
  // This function extracts the channel ID from a YouTube channel URL
  function extractChannelIdFromUrl(url) {
    var channelId = url.split("/channel/")[1];
    return channelId;
  }
  
  
  function getVideosFromChannel(playlistId, apiKey) {
    // Set the maximum number of results to retrieve in a single API request
    var maxResults = 50;
  
    // Initialize the nextPageToken variable
    var nextPageToken = "";
  
    // Create an empty array to store the video details
    var videos = [];
  
    // Loop through the playlist items until all videos have been retrieved
    do {
      // Build the API request URL
      var url = "https://www.googleapis.com/youtube/v3/playlistItems?key=" + apiKey + "&playlistId=" + playlistId + "&part=snippet,contentDetails,status&maxResults=" + maxResults;
  
      // Add the nextPageToken to the API request URL if it exists
      if (nextPageToken != "") {
        url += "&pageToken=" + nextPageToken;
      }
  
      // Fetch the API data using UrlFetchApp
      var response = UrlFetchApp.fetch(url);
      var json = response.getContentText();
      var data = JSON.parse(json);
  
      // Loop through the returned videos and extract their details
      for (var i = 0; i < data.items.length; i++) {
        var video = data.items[i];
        var videoId = video.contentDetails.videoId;
        var videoDetails = getVideoDetails(videoId, apiKey);
        videos.push(videoDetails);
      }
  
      // Update the nextPageToken variable to retrieve the next page of results
      nextPageToken = data.nextPageToken;
    } while (nextPageToken != null);
  
    // Return the array of video details
    return videos;
  }
  
  
  //Function to get details for a specific video
  function getVideoDetails(videoId, apiKey) {
    // Build the API request URL
    var url = "https://www.googleapis.com/youtube/v3/videos?key=" + apiKey + "&id=" + videoId + "&part=snippet,statistics";
  
    // Fetch the API data using UrlFetchApp
    var response = UrlFetchApp.fetch(url);
    var json = response.getContentText();
    var data = JSON.parse(json);
  
    // Return the details for the first video item in the response
    return data.items[0];
  }
  
  
  
  // Function to get channel statistics
  function getChannelProfileAnalytic(channelId, apiKey){
    // Build the API request URL
    var url = "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=" + channelId + "&key=" + apiKey ;
  
    // Fetch the API data using UrlFetchApp
    var response = UrlFetchApp.fetch(url);
    var json = response.getContentText();
    var data = JSON.parse(json);
  
    // Return the statistics for the channel
    return data.items;
  }
  
  // Function to get the uploads playlist ID 
  function getPlaylistId(channelId, apiKey){
    // Build the API request URL
    var url = "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=" + channelId + "&key=" + apiKey;
  
    // Fetch the API data using UrlFetchApp
    var response = UrlFetchApp.fetch(url).getContentText();
    var data = JSON.parse(response);
  
    // Extract the uploads playlist ID from the API response
    var playlistId;
    data.items.forEach(function(element) {
      playlistId = element.contentDetails.relatedPlaylists.uploads;
    });
  
    // Return the uploads playlist ID
    return playlistId;
  }
  
  //Function to get channel profile picture
  function getProfilePic(channelId, apiKey) {
    // Build the API request URL
    var url = "https://www.googleapis.com/youtube/v3/channels?part=snippet&fields=items%2Fsnippet%2Fthumbnails%2Fdefault&id=" + channelId + "&key=" + apiKey;
    
    // Fetch the API response
    var response = UrlFetchApp.fetch(url);
    
    // Parse the response JSON
    var json = response.getContentText();
    var data = JSON.parse(json);
    
    // Extract the default profile picture URL from the response
    for (var i = 0; i < data.items.length; i++) {
      var profile = data.items[i];
      var profilePic = profile.snippet.thumbnails.default.url;
    }
    
    // Return the profile picture URL
    return profilePic;
  }
  
  //Function to design the sheet 
  function design(sheet) {
    // Set header values and formatting for the sheet
    sheet.getRange("A1").setValue("Youtube Channel Url").setBackground("#ff2c2c").setFontSize("12").setFontColor("white").setFontWeight("bold").setHorizontalAlignment("center");
    sheet.getRange("C1:D1").setValues([["Channel Name", "Channel Picture"]]).setBackground("#ff2c2c").setFontSize("12").setFontColor("white").setFontWeight("bold").setHorizontalAlignment("center");
    sheet.getRange("B6:C6").setValues([["Subscriber", "Total Video"]]).setBackground("#ff2c2c").setFontSize("12").setFontColor("white").setFontWeight("bold").setHorizontalAlignment("center");
    sheet.getRange("B10:H10").setValues([["Video Thumbnail", "Video Title", "Date", "Time", "Views", "Comments", "Likes"]]).setBackground("#ff2c2c").setFontSize("12").setFontColor("white").setFontWeight("bold").setHorizontalAlignment("center");
    
    // Auto-resize columns 2-8 to fit their contents
    for (var i = 2; i <= 8; i++) {
      sheet.autoResizeColumn(i);
    }
    
    // Set the width of column 1 to 200 pixels
    sheet.setColumnWidth(1, 200);
  }
  
  