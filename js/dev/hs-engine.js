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

  var clickedCard = $(this).find('.card');

  if(!clickedCard.hasClass('flipped')) {
    if($(this).find('.img-front').data('is-gold')) {
      packValue += $(this).find('.card').data('card-value')*2;
    } else {
      packValue += $(this).find('.card').data('card-value');
    }
  }

  clickedCard.addClass('flipped');

  $('.score').show();
  $('.value').text(packValue);
  if(packValue >= 350) {
    $('.value').addClass('value--legendary');
  } else if(packValue >= 250) {
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
  $.getJSON("../js/hs-master.json", function(result){
    allCards = result;
    //Sort by set
    sortSet(set);
 });
}

$(document).ready(function(){

  $('.btn-wrap').slick({
    infinite: true,
    slidesToShow: 8,
    slidesToScroll: 1,
    dots: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          arrows: false,
          dots: true
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