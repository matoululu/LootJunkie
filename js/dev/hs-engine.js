/* Variables
======================== */

allCards = [];
filteredCards = [];
rareFilteredCards = [];
odds = [];
rareOdds = [];
pack= [];
packValue = 0;



/* DOM
======================== */

$('.btn').click(function(){
  $('.score').hide();
  $('.value--rare').removeClass('value--rare');
  $('.value--epic').removeClass('value--epic');
  $('.value--legendary').removeClass('value--legendary');
  pack = [];
  packValue = 0;

  $('.flip').remove();
  token = $(this).data('pack');
  pullJSON(token);

  setTimeout(setPacks, 800);

});


$(document.body).on('click', '.flip', function(){
  $(this).find('.card').addClass('flipped');
  if($(this).find('.img-front').data('is-gold')) {
    packValue += $(this).find('.card').data('card-value')*2;
  } else {
    packValue += $(this).find('.card').data('card-value');
  }

  $('.score').show();
  $('.value').text(packValue);
  if(packValue >= 350) {
    $('.value').addClass('value--legendary');
  } else if(packValue >= 2500) {
    $('.value').addClass('value--epic');
  } else if(packValue >= 150) {
    $('.value').addClass('value--rare');
  }
});

/* On Ready
======================== */

function pullJSON(set) {
  allCards = [];
  filteredCards = [];
  rareFilteredCards = [];
  odds = [];
  rareOdds = [];
  $.getJSON("https://api.hearthstonejson.com/v1/22611/enUS/cards.collectible.json?", function(result){
    allCards = result;
    //Sort by set
    sortSet(set);
 });
}

$(document).ready(function(){

  $('.btn-wrap').slick({
    infinite: true,
    lazyLoad: 'ondemand',
    slidesToShow: 6,
    slidesToScroll: 1,
    dots: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      }
    ]
  });
});



/* Sorting
======================== */

function setPacks() {
  for(var i = 0; i < 4; i++) {
    randomCard();
  }
  randomRareCard();
  displayPack();
}

function displayPack() {
  var shuffledPack = chance.shuffle(pack);
  for(var c = 0; c < shuffledPack.length; c++) {
    $('.list').append(shuffledPack[c]);
  }
}

function randomCard() {
  card = chance.weighted(filteredCards, odds);
  imgURL = [
    'https://media.services.zam.com/v1/media/byName/hs/cards/enus/' + card.id +'.png',
    'https://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/' + card.id +'_premium.gif"' + 'data-is-gold="true'
  ];
  goldChance = [98,2];
  isGold = chance.weighted(imgURL, goldChance);
  var cardRarity = card.rarity;
  if( cardRarity == 'COMMON') {
    value = 10;
  } else if(cardRarity == 'RARE') {
    value = 60;
  } else if(cardRarity == 'EPIC') {
    value = 120;
  } else if(cardRarity == 'LEGENDARY') {
    value = 240;
  } else {
    value = 0;
  }
  var cardURL = isGold;
  var cardElement = '<div class="flip"><div class="card" data-card-value="' + value + '"><div class="face front ' + cardRarity + '"><img class="img-back" src="../images/back.png"></div><div class="face back"><img class="img-front ' + cardRarity +'" src="' + cardURL + '"></div></div></div>';
  pack.push(cardElement);
}


function randomRareCard() {
  card = chance.weighted(rareFilteredCards, rareOdds);
  imgURL = [
    'https://media.services.zam.com/v1/media/byName/hs/cards/enus/' + card.id +'.png',
    'https://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/' + card.id +'_premium.gif"' + 'data-is-gold="true'
  ];
  goldChance = [98,2];
  isGold = chance.weighted(imgURL, goldChance);
  var cardRarity = card.rarity;
  if( cardRarity == 'COMMON') {
    value = 10;
  } else if(cardRarity == 'RARE') {
    value = 60;
  } else if(cardRarity == 'EPIC') {
    value = 120;
  } else if(cardRarity == 'LEGENDARY') {
    value = 240;
  } else {
    value = 0;
  }
  var cardURL = isGold;
  var cardElement = '<div class="flip"><div class="card" data-card-value="' + value + '"><div class="face front ' + cardRarity + '"><img class="img-back" src="../images/back.png"></div><div class="face back"><img class="img-front ' + cardRarity +'" src="' + cardURL + '"></div></div></div>';
  pack.push(cardElement);
}

function sortSet(set) {
  for(var c = 0; c < allCards.length; c++) {
    if(allCards[c].set == set) {
      if(allCards[c].rarity != 'COMMON') {
        rareFilteredCards.push(allCards[c]);
      }
      filteredCards.push(allCards[c]);
    }
  }
  //Set odds

  setRarity();
}

function setRarity() {
  for(var c = 0; c < filteredCards.length; c++) {
    if(filteredCards[c].rarity == 'COMMON') {
      odds.push(71);
    }
    if(filteredCards[c].rarity == 'RARE') {
      odds.push(23);
      rareOdds.push(23);
    }
    if(filteredCards[c].rarity == 'EPIC') {
      odds.push(4);
      rareOdds.push(4);
    }
    if(filteredCards[c].rarity == 'LEGENDARY') {
      odds.push(1);
      rareOdds.push(1);
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
