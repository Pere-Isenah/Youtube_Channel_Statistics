
function updateChannelData() {
    var sheet = SpreadsheetApp.getActiveSheet();
    var profileUrl = sheet.getRange("A2").getValue()
    sheet.getRange("A2").setBackground("black").setFontSize("10").setFontColor("white").setFontWeight("bold");
    var apiKey = "YOUR_API_KEY"
    var channelId = extractChannelIdFromUrl(profileUrl);
    var playlistId = getPlaylistId(channelId,apiKey)
    var videos = getVideosFromChannel(playlistId,apiKey);
    var channelProfileAnalytic = getChannelProfileAnalytic(channelId,apiKey);
    var data = [];
    var channelData = [];
    var t_data = []
  
      for(var i = 0; i < channelProfileAnalytic.length; i++ ){
        var profile = channelProfileAnalytic[i]
        var subscriber = parseInt(profile.statistics.subscriberCount).toLocaleString();
        var totalVidoes = profile.statistics.videoCount;
        channelData.push([subscriber, totalVidoes]);
      
      }
    sheet.getRange(7,2, channelData.length, channelData[0].length).setValues(channelData);
  
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
          sheet.getRange("C2").setValue(channelName);
         
          data.push([title, date,time,views, comments, likes,]);
          t_data.push([thumbnail])
          
        }
      }
    for (var i = 0; i < t_data.length; i++) {
      var thumbnailUrl = t_data[i][0];
      var range = sheet.getRange(11 + i, 2);
      range.setFormula('=IMAGE("' + thumbnailUrl + '",4,73,130)');
      var row = sheet.getRange(11 + i, 2);
      sheet.setRowHeight(row.getRow(), 80);
    }
  
  
    sheet.getRange(11,3, data.length, data[0].length).setValues(data);
  
    
    design(sheet)
  }
  function design(sheet) {
    sheet.getRange("A1").setValue("Youtube Channel Url").setBackground("red").setFontSize("14").setFontColor("white").setFontWeight("bold").setHorizontalAlignment("center");
      sheet.getRange("C1").setValue("Channel Name").setBackground("red").setFontSize("14").setFontColor("white").setFontWeight("bold").setHorizontalAlignment("center");
    sheet.getRange("B6:C6").setValues([["Subscriber", "Total Video"]]).setBackground("red").setFontSize("12").setFontColor("white").setFontWeight("bold").setHorizontalAlignment("center");
    sheet.getRange("B10:H10").setValues([["Video Thumbnail", "Video Title",	"Date",	"Time",	"Views",	"Comments",	"Likes"]]).setBackground("red").setFontSize("12").setFontColor("white").setFontWeight("bold").setHorizontalAlignment("center");
    
  }
  function extractChannelIdFromUrl(url) {
    var channelId = url.split("/channel/")[1];
    return channelId;
  }
  function getVideosFromChannel(playlistId,apiKey) {
    var maxResults = 50;
    var videos = [];
  
    var url = "https://www.googleapis.com/youtube/v3/playlistItems?key=" + apiKey + "&playlistId=" + playlistId + "&part=snippet,contentDetails,status&maxResults=" + maxResults;
    var response = UrlFetchApp.fetch(url);
    var json = response.getContentText();
    var data = JSON.parse(json);
  
    for (var i = 0; i < data.items.length; i++) {
      var video = data.items[i];
      var videoId = video.contentDetails.videoId;
      var videoDetails = getVideoDetails(videoId,apiKey);
      videos.push(videoDetails);
    }
  
    return videos;
  }
  
  function getVideoDetails(videoId,apiKey) {
    var url = "https://www.googleapis.com/youtube/v3/videos?key=" + apiKey + "&id=" + videoId + "&part=snippet,statistics";
    var response = UrlFetchApp.fetch(url);
    var json = response.getContentText();
    var data = JSON.parse(json);
    return data.items[0];
   
  }
  function getChannelProfileAnalytic(channelId,apiKey){
    var url = "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=" + channelId + "&key=" + apiKey ;
    var response = UrlFetchApp.fetch(url);
    var json = response.getContentText();
    var data = JSON.parse(json);
    return data.items;
  }
  function getPlaylistId(channelId,apiKey){
    var channelUrl = "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=" + channelId + "&key=" + apiKey;
    var channelData = UrlFetchApp.fetch(channelUrl).getContentText();
    var channelDataJson = JSON.parse(channelData);
    var playlistId;
    channelDataJson.items.forEach(function(element) {
      playlistId = element.contentDetails.relatedPlaylists.uploads;
    });
    return playlistId;
  }
  
  