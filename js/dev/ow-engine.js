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

var value;

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
      url: "https://raw.githubusercontent.com/Js41637/Overwatch-Item-Tracker/development/data/master.json",
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
    $('#value').text('0').removeClass();
    pauseCrate();
    isRunning = true;
    crate = [];
    value = 0;
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
    setTimeout(restoreCrate, 4000);
  }
});

function pauseCrate() {
  $('.generate').attr('disabled','disabled');
  $('.generate').css('cursor', 'not-allowed');
}

function restoreCrate() {
  $('.generate').removeAttr('disabled');
  $('.generate').css('cursor', 'pointer');
}

function deleteCards() {
  $('#crate li').remove();
  $('#box').remove();
}

function displayCrate() {
  var shuffledCrate = chance.shuffle(crate);
  $.each(shuffledCrate, function(i){
    if( shuffledCrate[i].quality == 'common') {
      value += 20;
    } else if(shuffledCrate[i].quality == 'rare') {
      value += 40;
    } else if(shuffledCrate[i].quality == 'epic') {
      value += 80;
    } else if(shuffledCrate[i].quality == 'legendary') {
      value += 160;
    } else {
      value += 20;
    }
    var heroString= shuffledCrate[i].id;
    var heroName = heroString.substr(0, heroString.indexOf('-'));
    $('<li/>').addClass(heroName + ' ' + shuffledCrate[i].quality + ' shadow animated bounceInDown crate-' + i ).appendTo('#crate');
    $('<span/>').addClass(shuffledCrate[i].event).appendTo('.crate-'+i);
    $('<p/>').text(shuffledCrate[i].name + ' - ' + heroName + ' ' + shuffledCrate[i].type).appendTo('.crate-'+i+ ' span');
  });
  if(value >= 280) {
    $('#value').addClass('value--legendary');
  } else if(value >= 200) {
    $('#value').addClass('value--epic');
  } else if(value >= 120) {
    $('#value').addClass('value--rare');
  }
  $('#value').text(value);
  isRunning = false;
}

$('.box-type ul li a').click(function(){
  $('.box-type ul li a').removeClass('active');
  $(this).addClass('active');
  var boxType = $(this).attr('id');
  pullJSON(boxType);
});

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
    filterType = 'WINTER_WONDERLAND';
  } else if(token == 'rooster') {
    filterType = 'LUNAR_NEW_YEAR';
  } else if(token == 'anniversary') {
    filterType = 'ANNIVERSARY';
  } else if(token == 'uprising') {
    filterType = 'UPRISING';
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