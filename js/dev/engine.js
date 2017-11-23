var allHeroes = [];
var allItems = [];
var refinedItems = [];
var rareItems = [];

var isRunning = false;
var openSound = new Audio('open-box.ogg');
var volume = 0.25;
var filterType;

var weights = [];
var rareWeights = [];

var randomizedItem = [];
var crate = [];

$.fn.extend({
  animateCss: function (animationName) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    $(this).addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);
    });
  }
});

$(document).ready(function(){
  pullJSON('standard');
});

$('.js-volume').click(function(){
  if($(this).hasClass('is-on')) {
    $(this).text('volume_off').removeClass('is-on').addClass('is-off');
    openSound.muted = true;
  } else {
    $(this).text('volume_up').removeClass('is-off').addClass('is-on');
    openSound.muted = false;
  }
});




/* ---- PULL FROM JSON ----- */

function pullJSON(token) {
  allItems = [];
  weights = [];
  refinedItems = [];
  rareItems = [];
  rareWeights = [];
  $.ajax({
      url: "https://raw.githubusercontent.com/Js41637/Overwatch-Item-Tracker/master/data/master.json",
      dataType: 'json',
      success: function(results){
        allHeroes = results.heroes;
        getItems(token);
        createWeights(refinedItems, weights);
        createWeights(rareItems, rareWeights);
      }
  });
}

/* ---- DISPLAY ----- */

$('.generate').click(function(){
  if(isRunning == false) {
    pauseCrate();
    isRunning = true;
    crate = [];
    openSound.volume = volume;
    openSound.play();
    $('#box, .crate-0, .crate-1, .crate-2, .crate-3').animateCss('bounceOutUp');
    setTimeout(deleteCards, 950);
    for(i = 0; i < 3; i++) {
      randomizedItem = chance.weighted(refinedItems, weights);
      crate.push(randomizedItem);
    }
    randomizedItem = chance.weighted(rareItems, rareWeights);
    crate.push(randomizedItem);
    setTimeout(displayCrate, 2350);
    setTimeout(restoreCrate, 5000);
  }
});

function pauseCrate() {
  $('.generate').attr('disabled','disabled');
}

function restoreCrate() {
  $('.generate').removeAttr('disabled');
}

function deleteCards() {
  $('#crate li').remove();
  $('#box').remove();
}

function displayCrate() {
  $.each(crate, function(i){
    var heroString= crate[i].id;
    var heroName = heroString.substr(0, heroString.indexOf('-'));
    $('<li/>').addClass(heroName + ' ' + crate[i].quality + ' shadow animated bounceInDown crate-' + i ).appendTo('#crate');
    $('<span/>').addClass(crate[i].event).appendTo('.crate-'+i);
    $('<p/>').text(crate[i].name + ' - ' + heroName + ' ' + crate[i].type).appendTo('.crate-'+i+ ' span');
  });
  isRunning = false;
}

$('.box-type ul li a').click(function(){
  $('.box-type ul li a').removeClass('active');
  $(this).addClass('active');
  var boxType = $(this).attr('id');
  pullJSON(boxType);
})

/* ---- NITTY GRITTY BELOW ----- */

function createWeights(list, weight) {
  for(var i = 0; i < list.length; i++) {
    if(list[i].quality == 'common') {
      if(list[i].event == filterType) {
        weight.push(354);
      } else {
        weight.push(59);
      }
    } else if(list[i].quality == 'rare') {
      if(list[i].event == filterType) {
        weight.push(192);
      } else {
        weight.push(32);
      }
    } else if(list[i].quality == 'epic') {
      if(list[i].event == filterType) {
        weight.push(42);
      } else {
        weight.push(7);
      }
    } else if(list[i].quality == 'legendary') {
      if(list[i].event == filterType) {
        weight.push(12);
      } else {
        weight.push(2);
      }
    }
  }
}

function getItems(token) {


  if(token == 'summer2016') {
   filterType = 'SUMMER_GAMES';
  } else if(token == 'halloween') {
    filterType = 'HALLOWEEN';
  } else if(token == 'winter') {
    filterType = 'WINTER_WONDERLAND_2016';
  } else if(token == 'rooster') {
    filterType = 'YEAR_OF_THE_ROOSTER_2017';
  } else if(token == 'anniversary') {
    filterType = 'ANNIVERSARY_2017';
  } else if(token == 'uprising') {
    filterType = 'UPRISING_2017';
  } else if(token == 'standard') {
    filterType = '';
  }

  //Get all items
  for(var key in allHeroes) {
    if (allHeroes.hasOwnProperty(key)) {
      var val = allHeroes[key].items;
      allHeroes[key].items.hero = key;
      allItems.push(val);
    }
  }

  //Filter items
  for(var i = 0; i < allItems.length; i++) {
    if (allItems[i].sprays) {
      for(var c = 0; c < allItems[i].sprays.length; c++) {
        if( allItems[i].sprays[c].achievement || allItems[i].sprays[c].standardItem) {
        } else {
          allItems[i].sprays[c].type = 'Spray';
          if(allItems[i].sprays[c].event == filterType || !allItems[i].sprays[c].event ) {
            refinedItems.push(allItems[i].sprays[c]);
            if (allItems[i].sprays[c].quality != 'common') {
              rareItems.push(allItems[i].sprays[c]);
            }
          }
        }
      }
    }

    if (allItems[i].emotes) {
      for(var c = 0; c < allItems[i].emotes.length; c++) {
        if( allItems[i].emotes[c].standardItem) {
        } else {
          allItems[i].emotes[c].type = 'Emote';
          if(allItems[i].emotes[c].event == filterType || !allItems[i].emotes[c].event ) {
            refinedItems.push(allItems[i].emotes[c]);
            if (allItems[i].emotes[c].quality != 'common') {
              rareItems.push(allItems[i].emotes[c]);
            }
          }
        }
      }
    }

    if (allItems[i].intros) {
    for(var c = 0; c < allItems[i].intros.length; c++) {
        if( allItems[i].intros[c].standardItem) {
        } else {
          allItems[i].intros[c].type = 'Intro';
          if(allItems[i].intros[c].event == filterType || !allItems[i].intros[c].event ) {
            refinedItems.push(allItems[i].intros[c]);
            if (allItems[i].intros[c].quality != 'common') {
              rareItems.push(allItems[i].intros[c]);
            }
          }
        }
      }
    }

    if (allItems[i].poses) {
      for(var c = 0; c < allItems[i].poses.length; c++) {
        if( allItems[i].poses[c].standardItem) {
        } else {
          allItems[i].poses[c].type = 'Victory Pose';
          if(allItems[i].poses[c].event == filterType || !allItems[i].poses[c].event ) {
            refinedItems.push(allItems[i].poses[c]);
            if (allItems[i].poses[c].quality != 'common') {
              rareItems.push(allItems[i].poses[c]);
            }
          }
        }
      }
    }

    if (allItems[i].skins) {
      for(var c = 0; c < allItems[i].skins.length; c++) {
        if( allItems[i].skins[c].standardItem) {
        } else {
          allItems[i].skins[c].type = 'Skin';
          if(allItems[i].skins[c].event == filterType || !allItems[i].skins[c].event ) {
            refinedItems.push(allItems[i].skins[c]);
            if (allItems[i].skins[c].quality != 'common') {
              rareItems.push(allItems[i].skins[c]);
            }
          }
        }
      }
    }

    if (allItems[i].voicelines) {
      for(var c = 0; c < allItems[i].voicelines.length; c++) {
        if( allItems[i].voicelines[c].standardItem) {
        } else {
          allItems[i].voicelines[c].type = 'Voiceline';
          if(allItems[i].voicelines[c].event == filterType || !allItems[i].voicelines[c].event ) {
            refinedItems.push(allItems[i].voicelines[c]);
            if (allItems[i].voicelines[c].quality != 'common') {
              rareItems.push(allItems[i].voicelines[c]);
            }
          }
        }
      }
    }
  }
}

//Twitter stuff

/*********************************************************************
*  #### Twitter Post Fetcher v17.0.0 ####
*  Coded by Jason Mayes 2015. A present to all the developers out there.
*  www.jasonmayes.com
*  Please keep this disclaimer with my code if you use it. Thanks. :-)
*  Got feedback or questions, ask here:
*  http://www.jasonmayes.com/projects/twitterApi/
*  Github: https://github.com/jasonmayes/Twitter-Post-Fetcher
*  Updates will be posted to this site.
*********************************************************************/
(function(root,factory){if(typeof define==='function'&&define.amd){define([],factory);}else if(typeof exports==='object'){module.exports=factory();}else{factory();}}(this,function(){var domNode='';var maxTweets=20;var parseLinks=true;var queue=[];var inProgress=false;var printTime=true;var printUser=true;var formatterFunction=null;var supportsClassName=true;var showRts=true;var customCallbackFunction=null;var showInteractionLinks=true;var showImages=false;var targetBlank=true;var lang='en';var permalinks=true;var dataOnly=false;var script=null;var scriptAdded=false;function handleTweets(tweets){if(customCallbackFunction===null){var x=tweets.length;var n=0;var element=document.getElementById(domNode);var html='<ul>';while(n<x){html+='<li>'+tweets[n]+'</li>';n++;}
html+='</ul>';element.innerHTML=html;}else{customCallbackFunction(tweets);}}
function strip(data){return data.replace(/<b[^>]*>(.*?)<\/b>/gi,function(a,s){return s;}).replace(/class="(?!(tco-hidden|tco-display|tco-ellipsis))+.*?"|data-query-source=".*?"|dir=".*?"|rel=".*?"/gi,'');}
function targetLinksToNewWindow(el){var links=el.getElementsByTagName('a');for(var i=links.length-1;i>=0;i--){links[i].setAttribute('target','_blank');}}
function getElementsByClassName(node,classname){var a=[];var regex=new RegExp('(^| )'+classname+'( |$)');var elems=node.getElementsByTagName('*');for(var i=0,j=elems.length;i<j;i++){if(regex.test(elems[i].className)){a.push(elems[i]);}}
return a;}
function extractImageUrl(image_data){if(image_data!==undefined&&image_data.innerHTML.indexOf('data-srcset')>=0){var data_src=image_data.innerHTML.match(/data-srcset="([A-z0-9%_\.-]+)/i)[0];return decodeURIComponent(data_src).split('"')[1];}}
var twitterFetcher={fetch:function(config){if(config.maxTweets===undefined){config.maxTweets=20;}
if(config.enableLinks===undefined){config.enableLinks=true;}
if(config.showUser===undefined){config.showUser=true;}
if(config.showTime===undefined){config.showTime=true;}
if(config.dateFunction===undefined){config.dateFunction='default';}
if(config.showRetweet===undefined){config.showRetweet=true;}
if(config.customCallback===undefined){config.customCallback=null;}
if(config.showInteraction===undefined){config.showInteraction=true;}
if(config.showImages===undefined){config.showImages=false;}
if(config.linksInNewWindow===undefined){config.linksInNewWindow=true;}
if(config.showPermalinks===undefined){config.showPermalinks=true;}
if(config.dataOnly===undefined){config.dataOnly=false;}
if(inProgress){queue.push(config);}else{inProgress=true;domNode=config.domId;maxTweets=config.maxTweets;parseLinks=config.enableLinks;printUser=config.showUser;printTime=config.showTime;showRts=config.showRetweet;formatterFunction=config.dateFunction;customCallbackFunction=config.customCallback;showInteractionLinks=config.showInteraction;showImages=config.showImages;targetBlank=config.linksInNewWindow;permalinks=config.showPermalinks;dataOnly=config.dataOnly;var head=document.getElementsByTagName('head')[0];if(script!==null){head.removeChild(script);}
script=document.createElement('script');script.type='text/javascript';if(config.list!==undefined){script.src='https://syndication.twitter.com/timeline/list?'+'callback=__twttrf.callback&dnt=false&list_slug='+
config.list.listSlug+'&screen_name='+config.list.screenName+'&suppress_response_codes=true&lang='+(config.lang||lang)+'&rnd='+Math.random();}else if(config.profile!==undefined){script.src='https://syndication.twitter.com/timeline/profile?'+'callback=__twttrf.callback&dnt=false'+'&screen_name='+config.profile.screenName+'&suppress_response_codes=true&lang='+(config.lang||lang)+'&rnd='+Math.random();}else if(config.likes!==undefined){script.src='https://syndication.twitter.com/timeline/likes?'+'callback=__twttrf.callback&dnt=false'+'&screen_name='+config.likes.screenName+'&suppress_response_codes=true&lang='+(config.lang||lang)+'&rnd='+Math.random();}else{script.src='https://cdn.syndication.twimg.com/widgets/timelines/'+
config.id+'?&lang='+(config.lang||lang)+'&callback=__twttrf.callback&'+'suppress_response_codes=true&rnd='+Math.random();}
head.appendChild(script);}},callback:function(data){if(data===undefined||data.body===undefined){inProgress=false;if(queue.length>0){twitterFetcher.fetch(queue[0]);queue.splice(0,1);}
return;}
data.body=data.body.replace(/(<img[^c]*class="Emoji[^>]*>)|(<img[^c]*class="u-block[^>]*>)/g,'');if(!showImages){data.body=data.body.replace(/(<img[^c]*class="NaturalImage-image[^>]*>|(<img[^c]*class="CroppedImage-image[^>]*>))/g,'');}
if(!printUser){data.body=data.body.replace(/(<img[^c]*class="Avatar"[^>]*>)/g,'');}
var div=document.createElement('div');div.innerHTML=data.body;if(typeof(div.getElementsByClassName)==='undefined'){supportsClassName=false;}
function swapDataSrc(element){var avatarImg=element.getElementsByTagName('img')[0];avatarImg.src=avatarImg.getAttribute('data-src-2x');return element;}
var tweets=[];var authors=[];var times=[];var images=[];var rts=[];var tids=[];var permalinksURL=[];var x=0;if(supportsClassName){var tmp=div.getElementsByClassName('timeline-Tweet');while(x<tmp.length){if(tmp[x].getElementsByClassName('timeline-Tweet-retweetCredit').length>0){rts.push(true);}else{rts.push(false);}
if(!rts[x]||rts[x]&&showRts){tweets.push(tmp[x].getElementsByClassName('timeline-Tweet-text')[0]);tids.push(tmp[x].getAttribute('data-tweet-id'));if(printUser){authors.push(swapDataSrc(tmp[x].getElementsByClassName('timeline-Tweet-author')[0]));}
times.push(tmp[x].getElementsByClassName('dt-updated')[0]);permalinksURL.push(tmp[x].getElementsByClassName('timeline-Tweet-timestamp')[0]);if(tmp[x].getElementsByClassName('timeline-Tweet-media')[0]!==undefined){images.push(tmp[x].getElementsByClassName('timeline-Tweet-media')[0]);}else{images.push(undefined);}}
x++;}}else{var tmp=getElementsByClassName(div,'timeline-Tweet');while(x<tmp.length){if(getElementsByClassName(tmp[x],'timeline-Tweet-retweetCredit').length>0){rts.push(true);}else{rts.push(false);}
if(!rts[x]||rts[x]&&showRts){tweets.push(getElementsByClassName(tmp[x],'timeline-Tweet-text')[0]);tids.push(tmp[x].getAttribute('data-tweet-id'));if(printUser){authors.push(swapDataSrc(getElementsByClassName(tmp[x],'timeline-Tweet-author')[0]));}
times.push(getElementsByClassName(tmp[x],'dt-updated')[0]);permalinksURL.push(getElementsByClassName(tmp[x],'timeline-Tweet-timestamp')[0]);if(getElementsByClassName(tmp[x],'timeline-Tweet-media')[0]!==undefined){images.push(getElementsByClassName(tmp[x],'timeline-Tweet-media')[0]);}else{images.push(undefined);}}
x++;}}
if(tweets.length>maxTweets){tweets.splice(maxTweets,(tweets.length-maxTweets));authors.splice(maxTweets,(authors.length-maxTweets));times.splice(maxTweets,(times.length-maxTweets));rts.splice(maxTweets,(rts.length-maxTweets));images.splice(maxTweets,(images.length-maxTweets));permalinksURL.splice(maxTweets,(permalinksURL.length-maxTweets));}
var arrayTweets=[];var x=tweets.length;var n=0;if(dataOnly){while(n<x){arrayTweets.push({tweet:tweets[n].innerHTML,author:authors[n]?authors[n].innerHTML:'Unknown Author',time:times[n].textContent,timestamp:times[n].getAttribute('datetime').replace('+0000','Z').replace(/([\+\-])(\d\d)(\d\d)/,'$1$2:$3'),image:extractImageUrl(images[n]),rt:rts[n],tid:tids[n],permalinkURL:(permalinksURL[n]===undefined)?'':permalinksURL[n].href});n++;}}else{while(n<x){if(typeof(formatterFunction)!=='string'){var datetimeText=times[n].getAttribute('datetime');var newDate=new Date(times[n].getAttribute('datetime').replace(/-/g,'/').replace('T',' ').split('+')[0]);var dateString=formatterFunction(newDate,datetimeText);times[n].setAttribute('aria-label',dateString);if(tweets[n].textContent){if(supportsClassName){times[n].textContent=dateString;}else{var h=document.createElement('p');var t=document.createTextNode(dateString);h.appendChild(t);h.setAttribute('aria-label',dateString);times[n]=h;}}else{times[n].textContent=dateString;}}
var op='';if(parseLinks){if(targetBlank){targetLinksToNewWindow(tweets[n]);if(printUser){targetLinksToNewWindow(authors[n]);}}
if(printUser){op+='<div class="user">'+strip(authors[n].innerHTML)+'</div>';}
op+='<p class="tweet">'+strip(tweets[n].innerHTML)+'</p>';if(printTime){if(permalinks){op+='<p class="timePosted"><a href="'+permalinksURL[n]+'">'+times[n].getAttribute('aria-label')+'</a></p>';}else{op+='<p class="timePosted">'+
times[n].getAttribute('aria-label')+'</p>';}}}else{if(tweets[n].textContent){if(printUser){op+='<p class="user">'+authors[n].textContent+'</p>';}
op+='<p class="tweet">'+tweets[n].textContent+'</p>';if(printTime){op+='<p class="timePosted">'+times[n].textContent+'</p>';}}else{if(printUser){op+='<p class="user">'+authors[n].textContent+'</p>';}
op+='<p class="tweet">'+tweets[n].textContent+'</p>';if(printTime){op+='<p class="timePosted">'+times[n].textContent+'</p>';}}}
if(showInteractionLinks){op+='<p class="interact"><a href="https://twitter.com/intent/'+'tweet?in_reply_to='+tids[n]+'" class="twitter_reply_icon"'+
(targetBlank?' target="_blank">':'>')+'Reply</a><a href="https://twitter.com/intent/retweet?'+'tweet_id='+tids[n]+'" class="twitter_retweet_icon"'+
(targetBlank?' target="_blank">':'>')+'Retweet</a>'+'<a href="https://twitter.com/intent/favorite?tweet_id='+
tids[n]+'" class="twitter_fav_icon"'+
(targetBlank?' target="_blank">':'>')+'Favorite</a></p>';}
if(showImages&&images[n]!==undefined&&extractImageUrl(images[n])!==undefined){op+='<div class="media">'+'<img src="'+extractImageUrl(images[n])+'" alt="Image from tweet" />'+'</div>';}
if(showImages){arrayTweets.push(op);}else if(!showImages&&tweets[n].textContent.length){arrayTweets.push(op);}
n++;}}
handleTweets(arrayTweets);inProgress=false;if(queue.length>0){twitterFetcher.fetch(queue[0]);queue.splice(0,1);}}};window.__twttrf=twitterFetcher;window.twitterFetcher=twitterFetcher;return twitterFetcher;}));


var configProfile = {
  "profile": {"screenName": 'lootjunkiexyz'},
  "domId": 'alert',
  "maxTweets": 1,
  "enableLinks": true,
  "showUser": false,
  "showTime": false,
  "showImages": false,
  "showRetweet": false,
  "showInteraction": false,
  "lang": 'en'
};

twitterFetcher.fetch(configProfile);

var configProfileMobile = {
  "profile": {"screenName": 'lootjunkiexyz'},
  "domId": 'mobilealert',
  "maxTweets": 1,
  "enableLinks": true,
  "showUser": true,
  "showTime": false,
  "showImages": false,
  "showRetweet": false,
  "showInteraction": false,
  "lang": 'en'
};

twitterFetcher.fetch(configProfileMobile);



